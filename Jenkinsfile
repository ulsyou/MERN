pipeline {
    agent any

    environment {
        LOCALSTACK_URL = 'http://localhost:4566'
        TERRAFORM_DIR = 'terraform'
        FRONTEND_DIR = 'WebKidShop_FE'
        BACKEND_DIR = 'WebKidShop_BE'
        PATH = "$HOME/.local/bin:$PATH"
        AWS_ACCESS_KEY_ID = 'test'
        AWS_SECRET_ACCESS_KEY = 'test'
        AWS_DEFAULT_REGION = 'us-east-1'
        KEY_NAME = 'my-key'
        KEY_FILE = 'key.pem'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    if ! command -v pip &> /dev/null
                    then
                        apt-get update && apt-get install -y python3-pip > /dev/null 2>&1
                    fi

                    if ! command -v tflocal &> /dev/null
                    then
                        pip install terraform-local > /dev/null 2>&1
                    fi

                    if ! command -v aws &> /dev/null
                    then
                        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" > /dev/null 2>&1
                        unzip -o awscliv2.zip > /dev/null 2>&1
                        ./aws/install -i /var/lib/jenkins/.local/aws-cli -b /var/lib/jenkins/.local/bin --update > /dev/null 2>&1
                    fi

                    aws --version
                '''
            }
        }

        stage('Start LocalStack') {
            steps {
                script {
                    sh '''
                        docker-compose down
                        docker-compose up -d
                        docker-compose ps
                    '''
                }
            }
        }

        stage('Debug Terraform') {
            steps {
                script {
                    dir("${TERRAFORM_DIR}") {
                        sh 'cat main.tf'
                        sh 'tflocal init'
                        sh 'tflocal refresh'
                        sh 'tflocal plan -out=tfplan'
                        sh 'tflocal show tfplan'
                        def tfOutput = sh(script: 'tflocal apply -auto-approve', returnStdout: true)
                        echo "Terraform Apply Output: ${tfOutput}"
                        
                        sh 'tflocal show'
                        sh 'tflocal state list'
                        
                        def subnetId = sh(script: 'tflocal output subnet_id || echo "No Subnet ID"', returnStdout: true).trim()
                        def instanceId = sh(script: 'tflocal output backend_instance_id || echo "No Instance ID"', returnStdout: true).trim()
                        def backendPrivateIp = sh(script: 'tflocal output backend_instance_private_ip || echo "No Private IP"', returnStdout: true).trim()
                        def frontendPrivateIp = sh(script: 'tflocal output frontend_instance_private_ip || echo "No Private IP"', returnStdout: true).trim()
                        
                        echo "Subnet ID: ${subnetId}"
                        echo "Backend EC2 Instance ID: ${instanceId}"
                        echo "Backend EC2 Private IP: ${backendPrivateIp}"
                        echo "Frontend EC2 Private IP: ${frontendPrivateIp}"
                        
                        sh 'aws --endpoint-url=http://localhost:4566 ec2 describe-instances'
                        sh 'aws --endpoint-url=http://localhost:4566 s3api list-buckets'
                    }
                }
            }
        }

        stage('Create or Use Key Pair') {
            steps {
                script {
                    def keyFileExists = fileExists(KEY_FILE)

                    if (!keyFileExists) {
                        echo "Creating new key pair..."
                        sh """
                        awslocal ec2 create-key-pair --key-name ${KEY_NAME} --query 'KeyMaterial' --output text | tee ${KEY_FILE}
                        chmod 400 ${KEY_FILE}
                        """
                    } else {
                        echo "Key pair already exists."
                    }
                }
            }
        }

        stage('Build and Deploy Backend') {
            steps {
                script {
                    dir("${BACKEND_DIR}") {
                        sh 'pwd'
                        sh 'npm install > /dev/null 2>&1'
                        sh 'npm run build > /dev/null 2>&1'
                        def backendPrivateIp = sh(script: 'tflocal output -raw backend_instance_private_ip', returnStdout: true).trim()
                        echo "Backend is running on http://${backendPrivateIp}:3000"
                    }
                }
            }
        }

        stage('Build and Deploy Frontend') {
            steps {
                script {
                    dir("${FRONTEND_DIR}") {
                        sh 'pwd'
                        sh 'npm install --ignore-scripts > /dev/null 2>&1'
                        sh 'npm run build > /dev/null 2>&1'
                        def frontendPrivateIp = sh(script: 'tflocal output -raw frontend_instance_private_ip', returnStdout: true).trim()
                        echo "Frontend deployed successfully on IP ${frontendPrivateIp}, is running on http://${frontendPrivateIp}:80"
                    }
                }
            }
        }

        stage('Check Health service') {
            steps {
                script {
                    sh '''curl http://localhost:4566/_localstack/health'''
                }
            }
        }
    }

    post {
        success {
            script {
                echo 'Build Success!'
            }
        }
        failure {
            echo 'Build Failed.'
        }
    }
}
