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
                    if ! command -v pip &> /dev/null
                    then
                        apt-get update && apt-get install -y python3-pip > /dev/null 2>&1
                    fi

                    if ! command -v tflocal &> /dev/null
                    then
                        pip install terraform-local > /dev/null 2>&1
                    fi

                    if ! command -v aws &> /dev/null
                    then
                        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" > /dev/null 2>&1
                        unzip -o awscliv2.zip > /dev/null 2>&1
                        ./aws/install -i /var/lib/jenkins/.local/aws-cli -b /var/lib/jenkins/.local/bin --update > /dev/null 2>&1
                    fi

                    aws --version
                '''
            }
        }
    

        stage('Build') {
            steps {
                script {
                    dir("${BACKEND_DIR}") {
                        sh 'npm install > /dev/null 2>&1'
                    }
                    dir("${FRONTEND_DIR}") {
                        sh 'npm install --ignore-scripts > /dev/null 2>&1'
                        sh 'npm run build > /dev/null 2>&1'
                    }
                }
            }
        }

        stage('Start LocalStack') {
            steps {
                script {
                    sh '''
                        docker-compose down
                        docker-compose up -d
                        docker-compose ps
                    '''
                }
            }
        }

        // stage('Test EC2 Creation with AWS CLI') {
        //     steps {
        //         sh '''
        //             aws --endpoint-url=http://localhost:4566 ec2 run-instances \
        //                 --image-id ami-12345678 \
        //                 --instance-type t2.micro \
        //                 --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=test-instance}]'
        //         '''
        //         sh 'aws --endpoint-url=http://localhost:4566 ec2 describe-instances'
        //     }
        // }

        stage('Debug Terraform') {
            steps {
                script {
                    dir("${TERRAFORM_DIR}") {
                        sh 'cat main.tf'
                        sh 'tflocal init'
                        sh 'tflocal refresh'
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
        
                        // Wait for the instance to be ready
                        sh "aws --endpoint-url=${LOCALSTACK_URL} ec2 wait instance-status-ok --instance-ids ${env.INSTANCE_ID}"
        
                        // Deploy backend code
                        dir("${BACKEND_DIR}") {
                            sh """
                            scp -o StrictHostKeyChecking=no -r . ec2-user@${env.PRIVATE_IP}:/home/ec2-user/backend
                            ssh -o StrictHostKeyChecking=no ec2-user@${env.PRIVATE_IP} '
                                cd /home/ec2-user/backend
                                npm install
                                npm start &
                            '
                            """
                        }
                    }
                }
            }
        }
        
        stage('Deploy Frontend') {
            steps {
                script {
                    dir("${FRONTEND_DIR}") {
                        sh 'npm run build'
        
                        def frontendInstanceId = sh(script: 'tflocal output -raw frontend_instance_id || echo "No ID"', returnStdout: true).trim()
                        def frontendPrivateIp = sh(script: 'tflocal output -raw frontend_instance_private_ip || echo "No IP"', returnStdout: true).trim()
        
                        sh """
                        scp -o StrictHostKeyChecking=no -r build ec2-user@${frontendPrivateIp}:/home/ec2-user/frontend
                        """
        
                        sh """
                        ssh -o StrictHostKeyChecking=no ec2-user@${frontendPrivateIp} '
                            cd /home/ec2-user/frontend
                            nohup python3 -m http.server 80 &
                        '
                        """
                    }
                    echo "Frontend deployed successfully to EC2"
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
