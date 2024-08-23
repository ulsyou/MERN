pipeline {
    agent {
        docker {
            image 'your-custom-docker-image:tag'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    parameters {
        string(name: 'MONGO_VERSION', defaultValue: '6.0', description: 'MongoDB version')
        string(name: 'NODE_VERSION', defaultValue: '18.15.0', description: 'Node.js version')
        string(name: 'S3_BUCKET', defaultValue: 'webkidshop-frontend-bucket', description: 'S3 bucket for frontend deployment')
    }

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
        LOCALSTACK_URL = 'https://localhost.localstack.cloud:4566'
        TERRAFORM_DIR = 'terraform'
        KUBERNETES_CONFIG = 'k8s'
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
            parallel {
                stage('Build Frontend') {
                    steps {
                        dir("${FRONTEND_DIR}") {
                            sh 'npm install'
                            sh 'npm run build'
                        }
                    }
                }
                stage('Build Backend') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            sh 'npm install'
                        }
                    }
                }
            }
        }

        stage('Test') {
            parallel {
                stage('Test Frontend') {
                    steps {
                        dir("${FRONTEND_DIR}") {
                            sh 'npm test'
                        }
                    }
                }
                stage('Test Backend') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            sh 'npm test'
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

        stage('Deploy') {
            parallel {
                stage('Deploy Backend to EC2') {
                    steps {
                        dir("${TERRAFORM_DIR}") {
                            sh 'tflocal init'
                            sh 'tflocal apply -auto-approve'
                        }
                    }
                }
                stage('Deploy Frontend to S3') {
                    steps {
                        dir("${FRONTEND_DIR}") {
                            withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials']]) {
                                sh "aws --endpoint-url=${LOCALSTACK_URL} s3 sync ./build s3://${params.S3_BUCKET}"
                            }
                        }
                    }
                }
                stage('Deploy to Kubernetes') {
                    steps {
                        dir("${KUBERNETES_CONFIG}") {
                            sh 'kubectl apply -f .'
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Build and Deploy successful!'
        }
        failure {
            echo 'Build or Deploy failed.'
        }
    }
}
