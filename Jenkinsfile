pipeline {
    agent any

    environment {
        TERRAFORM_DIR = 'terraform'
        FRONTEND_DIR = 'WebKidShop_FE'
        BACKEND_DIR = 'WebKidShop_BE'
        AWS_DEFAULT_REGION = 'ap-southeast-2'
        KEY_NAME = 'my-key'
        PATH = "$HOME/.local/bin:$PATH"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Terraform') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', 
                                  credentialsId: 'aws-credentials', 
                                  accessKeyVariable: 'AWS_ACCESS_KEY_ID', 
                                  secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                    script {
                        dir("${TERRAFORM_DIR}") {
                            sh 'terraform init -no-color'
                            sh 'terraform plan -out=tfplan -no-color'
                            sh 'terraform apply -auto-approve -no-color'
                        }
                    }
                }
            }
        }

        stage('Install on EC2') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'KEY')]) {
                    script {
                        def ec2Ip = sh(script: "aws ec2 describe-instances --query 'Reservations[0].Instances[0].PublicIpAddress' --output text", returnStdout: true).trim()
                        
                        sh """
                        ssh -o StrictHostKeyChecking=no -i ${KEY} ubuntu@${ec2Ip} << 'EOF'
                            # Update and install Node.js
                            sudo apt-get update
                            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                            sudo apt-get install -y nodejs
                            
                            # Install MongoDB
                            wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
                            echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu \$(lsb_release -cs)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
                            sudo apt-get update && sudo apt-get install -y mongodb-org
                            sudo systemctl start mongod
                            sudo systemctl enable mongod
                            
                            # Install project dependencies
                            cd /path/to/backend && npm install
                            cd /path/to/frontend && npm install
                        EOF
                        """
                    }
                }
            }
        }
        
        stage('Deploy Application') {
            steps {
                script {
                    // Add your deployment steps here
                    echo 'Deploying application...'
                    // Example: scp files to EC2 instances, or configure services to start
                }
            }
        }

        stage('Check EC2 Instances') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', 
                                  credentialsId: 'aws-credentials', 
                                  accessKeyVariable: 'AWS_ACCESS_KEY_ID', 
                                  secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                    script {
                        sh '''aws ec2 describe-instances --query 'Reservations[*].Instances[*].[InstanceId,PrivateIpAddress,PublicIpAddress,State.Name]' --output table'''
                    }
                }
            }
        }        
    }
    
    post {
        success {
            echo 'Build Success!'
        }
        failure {
            echo 'Build Failed.'
        }
    }
}
