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

        stage('Build') {
            steps {
                script {
                    dir("${BACKEND_DIR}") {
                        sh 'npm install > /dev/null 2>&1'
                    }
                    dir("${FRONTEND_DIR}") {
                        sh 'npm install --ignore-scripts > /dev/null 2>&1'
                        sh 'npm run build > /dev/null 2>&1'
                    }
                }
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
                        def privateIp = sh(script: 'tflocal output backend_instance_private_ip || echo "No Private IP"', returnStdout: true).trim()
                        
                        echo "Subnet ID: ${subnetId}"
                        echo "EC2 Instance ID: ${instanceId}"
                        echo "EC2 Private IP: ${privateIp}"
                        
                        sh 'aws --endpoint-url=http://localhost:4566 ec2 describe-instances'
                        sh 'aws --endpoint-url=http://localhost:4566 s3api list-buckets'
                    }
                }
            }
        }

        stage('Create or Use Key Pair') {
            steps {
                script {
                    if (!fileExists(KEY_FILE)) {
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
        
        stage('Deploy Backend') {
            steps {
                script {
                    dir("${BACKEND_DIR}") {
                        sh """
                        awslocal s3 mb s3://temp-backend-bucket
                        awslocal s3 sync . s3://temp-backend-bucket
                    
                        awslocal ssm start-session \
                            --target ${env.INSTANCE_ID} \
                            --document-name AWS-StartInteractiveCommand \
                            --parameters command="aws --endpoint-url=${LOCALSTACK_URL} s3 sync s3://temp-backend-bucket /home/ec2-user/backend && cd /home/ec2-user/backend && npm install && npm start &"
                        """
                    }
                }
            }
        }
        
        stage('Deploy Frontend') {
            steps {
                script {
                    dir("${FRONTEND_DIR}") {
                        sh 'npm run build'
        
                        def frontendInstanceId = sh(script: 'tflocal output -raw frontend_instance_id || echo "No ID"', returnStdout: true).trim()
                        def frontendPrivateIp = sh(script: 'tflocal output -raw frontend_instance_private_ip || echo "No IP"', returnStdout: true).trim()
        
                        sh """
                        aws --endpoint-url=${LOCALSTACK_URL} s3 sync build s3://temp-frontend-bucket

                        aws --endpoint-url=${LOCALSTACK_URL} ssm start-session \
                            --target ${frontendInstanceId} \
                            --document-name AWS-StartInteractiveCommand \
                            --parameters command="aws --endpoint-url=${LOCALSTACK_URL} s3 sync s3://temp-frontend-bucket /home/ec2-user/frontend && cd /home/ec2-user/frontend && python3 -m http.server 80 &"
                        """
                    }
                    echo "Frontend deployed successfully to EC2 local"
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            script {
                def frontendIp = sh(script: 'tflocal output -raw frontend_instance_private_ip || echo "No IP"', returnStdout: true).trim()
                echo 'Build Success!'
                echo "Frontend is running on http://${frontendIp}:80"
                echo "Backend is running on http://${env.PRIVATE_IP}:3000"
            }
        }
        failure {
            echo 'Build Failed.'
        }
    }
}
