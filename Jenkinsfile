pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
        LOCALSTACK_URL = 'http://localhost:4566'
        TERRAFORM_DIR = 'terraform'
        FRONTEND_DIR = 'WebKidShop_FE'
        BACKEND_DIR = 'WebKidShop_BE'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Test') {
            steps {
                script {
                    // Build và test backend
                    dir("${BACKEND_DIR}") {
                        sh 'npm install'
                        sh 'npm test'
                    }

                    // Build và test frontend
                    dir("${FRONTEND_DIR}") {
                        sh 'npm install'
                        sh 'npm test'
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    sh 'docker-compose build'
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Khởi động các services
                    sh 'docker-compose up -d'

                    // Triển khai backend lên EC2 local sử dụng tflocal
                    dir("${TERRAFORM_DIR}") {
                        sh 'tflocal init'
                        sh 'tflocal apply -auto-approve'
                    }

                    // Triển khai frontend lên S3 (LocalStack)
                    dir("${FRONTEND_DIR}") {
                        sh """
                        aws --endpoint-url=${LOCALSTACK_URL} s3 mb s3://webkidshop-frontend
                        aws --endpoint-url=${LOCALSTACK_URL} s3 sync build/ s3://webkidshop-frontend
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                // Dừng và xóa containers
                sh 'docker-compose down'
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
