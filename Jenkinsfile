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

        stage('Get EC2 Instance IP') {
            steps {
                script {
                    def ec2InstanceIp = sh(
                        script: "aws --endpoint-url=${LOCALSTACK_URL} ec2 describe-instances --query 'Reservations[*].Instances[*].PublicIpAddress' --output text",
                        returnStdout: true
                    ).trim()
                    
                    if (ec2InstanceIp) {
                        echo "EC2 Instance IP: ${ec2InstanceIp}"
                    } else {
                        error("No EC2 Instance IP found.")
                    }
                }
            }
        }

        stage('Check Backend Status') {
            steps {
                script {
                    def ec2InstanceIp = sh(
                        script: "aws --endpoint-url=${LOCALSTACK_URL} ec2 describe-instances --query 'Reservations[*].Instances[*].PublicIpAddress' --output text",
                        returnStdout: true
                    ).trim()

                    if (ec2InstanceIp) {
                        def backendUrl = "http://${ec2InstanceIp}:3000"
                        sh "curl --retry 5 --retry-delay 10 --retry-connrefused --fail ${backendUrl} || exit 1"
                        
                        echo 'Backend is running'
                    } else {
                        error("Cannot check backend status. EC2 Instance IP is missing.")
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
