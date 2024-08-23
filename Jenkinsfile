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
                    docker.image("node:${NODE_VERSION}").inside {
                        sh '''
                        # Cài đặt MongoDB
                        wget -qO - https://www.mongodb.org/static/pgp/server-${MONGO_VERSION}.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-archive-keyring.gpg
                        echo "deb [ arch=amd64 signed-by=/usr/share/keyrings/mongodb-archive-keyring.gpg ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/${MONGO_VERSION} multiverse" | tee /etc/apt/sources.list.d/mongodb-org-${MONGO_VERSION}.list
                        apt-get update
                        apt-get install -y mongodb-org

                        # Khởi chạy MongoDB foreground
                        mongod --fork --logpath /var/log/mongod.log --dbpath /data/db

                        # Kiểm tra phiên bản Node.js và npm
                        node -v
                        npm -v

                        # Cài đặt các package NPM toàn cục nếu cần
                        npm install -g express@${EXPRESS_VERSION}
                        npm install -g create-react-app@${REACT_VERSION}
                        npm install -g paypal-rest-sdk@${PAYPAL_API_VERSION}
                        '''
                    }
                }
            }
        }

        stage('Checkout') {
            steps {
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
                sh 'docker-compose build'
            }
        }

        stage('Deploy Backend to EC2 Local') {
            steps {
                dir("${TERRAFORM_DIR}") {
                    sh 'tflocal init'
                    sh 'tflocal apply -auto-approve'
                }
            }
        }

        stage('Deploy Frontend to S3 via LocalStack') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh 'npm run build'
                    sh '''
                    aws --endpoint-url=${LOCALSTACK_URL} s3 sync ./build s3://your-bucket-name
                    '''
                }
            }
        }

        stage('Deploy Backend and Frontend to Kubernetes') {
            steps {
                dir("${KUBERNETES_CONFIG}") {
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
            cleanWs()
        }
        success {
            echo 'Build and Deploy success!'
        }
        failure {
            echo 'Build and Deploy failed!'
        }
    }
}
