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

        stage('Terraform') {
            steps {
                script {
                    dir("${TERRAFORM_DIR}") {
                        sh 'tflocal init'
                        sh 'tflocal plan -out=tfplan'
                        sh 'tflocal show tfplan'
                        sh 'tflocal apply -auto-approve'
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

        // stage('Create or Use Key Pair') {
        //     steps {
        //         script {
        //             def keyFileExists = fileExists(KEY_FILE)

        //             if (!keyFileExists) {
        //                 echo "Creating new key pair..."
        //                 sh """
        //                 awslocal ec2 create-key-pair --key-name ${KEY_NAME} --query 'KeyMaterial' --output text | tee ${KEY_FILE}
        //                 chmod 400 ${KEY_FILE}
        //                 """
        //             } else {
        //                 echo "Key pair already exists."
        //             }
        //         }
        //     }
        // }

        stage('Check Health service') {
            steps {
                script {
                    sh '''curl http://localhost:4566/_localstack/health'''
                    sh '''  aws --endpoint-url=http://localhost:4566 ec2 describe-instances --query 'Reservations[*].Instances[*].[InstanceId,PrivateIpAddress]' --output table '''
                }
            }
        }
        
        stage('Get Frontend URL') {
            steps {
                script {
                    def frontendPrivateIp = sh(script: 'tflocal output -raw frontend_instance_private_ip', returnStdout: true).trim()
                    echo "Frontend is deployed on http://${frontendPrivateIp}:80"
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
