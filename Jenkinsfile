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
       stage('Deploy') {
            steps {
                script {
                    dir("${TERRAFORM_DIR") {
                        sh 'tflocal init'
                        sh 'tflocal apply -auto-approve'
                    }
                    dir("${FRONTEND_DIR}") {
                        sh """
                        aws --endpoint-url=${LOCALSTACK_URL} s3 mb s3://webkidshop-frontend || true
                        aws --endpoint-url=${LOCALSTACK_URL} s3 sync build/ s3://webkidshop-frontend
                        """
                    }
                    sh '''
                    echo "Checking EC2 instances in LocalStack..."
                    aws --endpoint-url=${LOCALSTACK_URL} ec2 describe-instances
                    '''
                    def backendUrl = "http://localhost:8080/api/health" 
                    echo "Checking backend availability..."
                    sh """
                    curl -I ${backendUrl}
                    """
                }
            }
        }
        stage ('Check file upload'){
            steps {
                script {
                    sh """ 
                    aws --endpoint-url=http://localhost:4566 ec2 describe-instances
                    aws --endpoint-url=http://localhost:4566 s3 ls s3://webkidshop-frontend --recursive
                    """
                }
            }
        }
    }
    post {
        always {
            script {
                sh '''
                    docker-compose down || { echo "docker-compose down failed"; exit 1; }
                '''
            }
            cleanWs()
        }
        success {
            echo 'Build Success!'
        }
        failure {
            echo 'Build Failed.'
        }
    }
}
