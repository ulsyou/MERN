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

        stage('Print Working Directory') {
            steps {
                sh 'pwd'
            }
        }

        stage('List Directories') {
            steps {
                sh 'ls -l /home'
                sh 'ls -l /'
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

        stage('Check LocalStack') {
            steps {
                script {
                    def health = sh(script: "curl -s http://localhost:4566/_localstack/health", returnStdout: true)
                    echo "LocalStack health: ${health}"
                    if (!health.contains('"ec2": "running"')) {
                        error "EC2 service is not running in LocalStack"
                    }
                }
            }
        }

        stage('Debug Terraform') {
            steps {
                script {
                    dir("${TERRAFORM_DIR}") {
                        sh 'tflocal init'
                        sh 'tflocal plan -out=tfplan'
                        sh 'tflocal show tfplan'
                        def tfOutput = sh(script: 'tflocal apply -auto-approve', returnStdout: true)
                        echo "Terraform Apply Output: ${tfOutput}"
                        
                        sh 'tflocal show'
                        sh 'tflocal state list'
                        
                        def vpcId = sh(script: 'tflocal output vpc_id || echo "No VPC ID"', returnStdout: true).trim()
                        def subnetId = sh(script: 'tflocal output subnet_id || echo "No Subnet ID"', returnStdout: true).trim()
                        def s3BucketId = sh(script: 'tflocal output s3_bucket_id || echo "No S3 Bucket ID"', returnStdout: true).trim()
                        def instanceId = sh(script: 'tflocal output backend_instance_id || echo "No Instance ID"', returnStdout: true).trim()
                        def privateIp = sh(script: 'tflocal output backend_instance_private_ip || echo "No Private IP"', returnStdout: true).trim()
                        
                        echo "VPC ID: ${vpcId}"
                        echo "Subnet ID: ${subnetId}"
                        echo "S3 Bucket ID: ${s3BucketId}"
                        echo "EC2 Instance ID: ${instanceId}"
                        echo "EC2 Private IP: ${privateIp}"
                        
                        sh 'aws --endpoint-url=http://localhost:4566 ec2 describe-instances'
                        sh 'aws --endpoint-url=http://localhost:4566 s3api list-buckets'
                    }
                }
            }
        }
        
        stage('Deploy Backend') {
            steps {
                script {
                    dir("${TERRAFORM_DIR}") {
                        sh 'tflocal init'
                        sh 'tflocal plan -out=tfplan'
                        sh 'tflocal show tfplan'
                        def tfOutput = sh(script: 'tflocal apply -auto-approve', returnStdout: true)
                        echo "Terraform Apply Output: ${tfOutput}"
                        
                        sh 'tflocal show'
                        sh 'tflocal state list'
                        
                        def instanceId = sh(script: 'tflocal output -raw backend_instance_id || echo "No ID"', returnStdout: true).trim()
                        def privateIp = sh(script: 'tflocal output -raw backend_instance_private_ip || echo "No IP"', returnStdout: true).trim()
                        
                        env.INSTANCE_ID = instanceId
                        env.PRIVATE_IP = privateIp
                        
                        echo "EC2 Instance ID: ${env.INSTANCE_ID}"
                        echo "EC2 Private IP: ${env.PRIVATE_IP}"
                    }
                }
            }
        }

        stage('Wait for Backend Startup') {
            steps {
                script {
                    def maxRetries = 10
                    def retryInterval = 30
                    def backendUrl = "http://${env.PRIVATE_IP}:3000"

                    for (int i = 0; i < maxRetries; i++) {
                        try {
                            def response = sh(script: "curl -s -o /dev/null -w '%{http_code}' ${backendUrl}", returnStdout: true).trim()
                            if (response == "200") {
                                echo "Backend is up and running"
                                return
                            }
                        } catch (Exception e) {
                            echo "Backend not ready, retrying in ${retryInterval} seconds..."
                        }
                        sleep retryInterval
                    }
                    error "Backend failed to start after ${maxRetries} attempts"
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
