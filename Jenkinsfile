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
                    apt-get update && apt-get install -y 
                    if ! command -v tflocal &> /dev/null; then
                        pip install terraform-local
                    fi
                    if ! command -v aws &> /dev/null; then
                        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
                        unzip -o awscliv2.zip
                        ./aws/install -i /var/lib/jenkins/.local/aws-cli -b /var/lib/jenkins/.local/bin --update
                    fi

                    aws --version
                '''
            }
        }

        stage('Build') {
            steps {
                script {
                    dir("${BACKEND_DIR}") {
                        sh 'npm install'
                    }
                    dir("${FRONTEND_DIR}") {
                        sh 'npm install --ignore-scripts'
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Start LocalStack') {
            steps {
                script {
                    sh '''
                        docker-compose up -d
                        docker-compose ps
                    '''
                }
            }
        }

                stage('Deploy Backend') {
            steps {
                script {
                    dir("${TERRAFORM_DIR}") {
                        sh 'tflocal init'
                        sh 'tflocal apply -auto-approve'
                        sh 'curl http://localhost:4566/_localstack/health'
                        sh 'docker-compose logs localstack'
                    }
                }
            }
        }

        stage('Verify EC2 Instance') {
            steps {
                script {
                    def instanceId = sh(
                        script: """
                            aws --endpoint-url=${LOCALSTACK_URL} ec2 describe-instances \
                            --filters "Name=tag:Name,Values=webkidshop-backend" \
                            --query 'Reservations[*].Instances[*].[InstanceId]' \
                            --output text
                        """,
                        returnStdout: true
                    ).trim()

                    if (instanceId) {
                        echo "EC2 instance created with ID: ${instanceId}"
                        env.INSTANCE_ID = instanceId
                    } else {
                        error "Failed to create EC2 instance"
                    }
                }
            }
        }

        stage('Get EC2 Instance IP') {
            steps {
                script {
                    def ec2Ip = sh(
                        script: """
                            aws --endpoint-url=${LOCALSTACK_URL} ec2 describe-instances \
                            --instance-ids ${env.INSTANCE_ID} \
                            --query 'Reservations[*].Instances[*].[PrivateIpAddress]' \
                            --output text
                        """,
                        returnStdout: true
                    ).trim()

                    if (ec2Ip) {
                        echo "EC2 instance IP: ${ec2Ip}"
                        env.EC2_IP = ec2Ip
                    } else {
                        error "Failed to get EC2 instance IP"
                    }
                }
            }
        }

        stage('Check Backend Deployment') {
            steps {
                script {
                    def backendUrl = "http://${env.EC2_IP}:3000"
                    def maxRetries = 5
                    def retryInterval = 10

                    for (int i = 0; i < maxRetries; i++) {
                        def status = sh(script: "curl -s -o /dev/null -w '%{http_code}' ${backendUrl}", returnStdout: true).trim()
                        
                        if (status == "200") {
                            echo "Backend is running on EC2 instance"
                            break
                        } else {
                            echo "Backend not responding, retrying in ${retryInterval} seconds..."
                            sleep retryInterval
                        }

                        if (i == maxRetries - 1) {
                            error "Backend deployment failed or not accessible"
                        }
                    }
                }
            }
        }
        stage('Deploy Frontend') {
            steps {
                script {
                    dir("${FRONTEND_DIR}") {
                        sh """
                        aws --endpoint-url=${LOCALSTACK_URL} s3 mb s3://webkidshop-frontend || true
                        aws --endpoint-url=${LOCALSTACK_URL} s3 sync build/ s3://webkidshop-frontend
                        """
                    }
                    echo "Frontend deployed successfully"
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Build Success!'
            echo 'Web-UI is running on http://webkidshop-frontend.s3.localhost.localstack.cloud:4566/index.html'
        }
        failure {
            echo 'Build Failed.'
        }
    }
}
