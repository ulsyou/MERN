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
                    # Cập nhật danh sách gói và cài đặt các phụ thuộc
                    apt-get update && apt-get install -y python3-pip unzip curl

                    # Cài đặt terraform-local
                    if ! command -v tflocal &> /dev/null; then
                        pip install terraform-local
                    fi

                    # Cài đặt AWS CLI
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
                    // Build backend
                    dir("${BACKEND_DIR}") {
                        sh 'npm install'
                    }
        
                    // Build frontend
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
                    // Khởi động LocalStack bằng Docker Compose
                    sh '''
                        docker-compose up -d
                        docker-compose ps
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Triển khai backend lên EC2 local sử dụng tflocal
                    dir("${TERRAFORM_DIR}") {
                        sh 'tflocal init'
                        sh 'tflocal apply -auto-approve'
                    }
        
                    // Triển khai frontend lên S3 (LocalStack)
                    dir("${FRONTEND_DIR}") {
                        sh """
                        aws --endpoint-url=${LOCALSTACK_URL} s3 mb s3://webkidshop-frontend || true
                        aws --endpoint-url=${LOCALSTACK_URL} s3 sync build/ s3://webkidshop-frontend
                        """
                    }
        
                    // In ra URL truy cập trang web (thay thế bằng IP công cộng của EC2)
                    echo "Frontend URL: http://localhost:4566/webkidshop-frontend/index.html"
                }
            }
        }
    }
    post {
        always {
            script {
                // Dừng LocalStack
                sh '''
                    docker-compose down || { echo "docker-compose down failed"; exit 1; }
                '''
            }
            cleanWs()
        }
        success {
            echo 'Build và Deploy thành công!'
        }
        failure {
            echo 'Build hoặc Deploy thất bại.'
        }
    }
}
