pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
        LOCALSTACK_URL = 'https://localhost.localstack.cloud:4566'
        TERRAFORM_DIR = 'terraform'
        KUBERNETES_CONFIG = 'k8s'
        FRONTEND_DIR = 'WebKidShop_FE'
        BACKEND_DIR = 'WebKidShop_BE'
        MONGO_VERSION = '6.0'
        NODE_VERSION = '18.15.0'
        EXPRESS_VERSION = '4.18.2'
        REACT_VERSION = '18.2.0'
        PAYPAL_API_VERSION = '1.8.1'
    }

    stages {
        stage('Install Prerequisites') {
            steps {
                script {
                    // Cài đặt MongoDB
                    sh '''
                    sudo apt-get update
                    wget -qO - https://www.mongodb.org/static/pgp/server-${MONGO_VERSION}.asc | sudo apt-key add -
                    echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/${MONGO_VERSION} multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-${MONGO_VERSION}.list
                    sudo apt-get update
                    sudo apt-get install -y mongodb-org
                    sudo systemctl start mongod
                    sudo systemctl enable mongod
                    '''

                    // Cài đặt NodeJS và NPM
                    sh '''
                    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                    sudo apt-get install -y nodejs
                    '''

                    // Kiểm tra phiên bản NodeJS và NPM
                    sh 'node -v'
                    sh 'npm -v'

                    // Cài đặt ExpressJS, ReactJS, và Paypal API toàn cầu nếu cần thiết
                    sh '''
                    npm install -g express@${EXPRESS_VERSION}
                    npm install -g create-react-app@${REACT_VERSION}
                    npm install -g paypal-rest-sdk@${PAYPAL_API_VERSION}
                    '''
                }
            }
        }

        stage('Checkout') {
            steps {
                // Lấy mã nguồn từ repository
                checkout scm
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Install Frontend Dependencies') {
                    steps {
                        dir("${FRONTEND_DIR}") {
                            sh 'npm install'
                        }
                    }
                }
                stage('Install Backend Dependencies') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            sh 'npm install'
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                // Build Docker images cho Frontend và Backend
                sh 'docker-compose build'
            }
        }

        stage('Deploy Backend to EC2 Local') {
            steps {
                dir("${TERRAFORM_DIR}") {
                    // Init Terraform và áp dụng cấu hình để triển khai trên EC2 Local bằng tflocal
                    sh 'tflocal init'
                    sh 'tflocal apply -auto-approve'
                }
            }
        }

        stage('Deploy Frontend to S3 via LocalStack') {
            steps {
                dir("${FRONTEND_DIR}") {
                    // Build Frontend
                    sh 'npm run build'

                    // Deploy Frontend lên S3 sử dụng LocalStack
                    sh '''
                    aws --endpoint-url=${LOCALSTACK_URL} s3 sync ./build s3://your-bucket-name
                    '''
                }
            }
        }

        stage('Deploy Backend and Frontend to Kubernetes') {
            steps {
                dir("${KUBERNETES_CONFIG}") {
                    // Triển khai Backend và Frontend lên Kubernetes
                    sh 'kubectl apply -f backend-deployment.yaml'
                    sh 'kubectl apply -f frontend-deployment.yaml'
                    sh 'kubectl apply -f backend-service.yaml'
                    sh 'kubectl apply -f frontend-service.yaml'
                }
            }
        }
    }

    post {
        always {
            cleanWs() // Làm sạch workspace sau khi hoàn thành
        }
        success {
            echo 'Build và Deploy thành công!'
        }
        failure {
            echo 'Build hoặc Deploy bị lỗi.'
        }
    }
}
