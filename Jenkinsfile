pipeline {
    agent any

    environment {
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
                    // Start LocalStack using Docker Compose
                    sh 'docker-compose up -d'
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
                // Dừng LocalStack
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
