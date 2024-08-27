pipeline {
    agent any

    environment {
        TERRAFORM_DIR = 'terraform'
        FRONTEND_DIR = 'WebKidShop_FE'
        BACKEND_DIR = 'WebKidShop_BE'
        AWS_DEFAULT_REGION = 'ap-southeast-2'
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

        stage('Deploy to Frontend EC2') {
            steps {
                script {
                    sshagent(credentials: ['ec2-ssh-key']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ec2-user@ec2-13-237-92-167.ap-southeast-2.compute.amazonaws.com << 'EOF'
                            
                            sudo yum install -y git
        
                            mkdir -p ~/deployment
                            cd ~/deployment
        
                            git clone https://github.com/ulsyou/MERN.git || { echo 'Git clone failed'; exit 1; }
        
                            cd MERN/WebKidShop_FE || { echo 'Failed to change directory'; exit 1; }
        
                            sudo yum install -y nodejs npm
        
                            npm install || { echo 'npm install failed'; exit 1; }
        
                            npm run build || { echo 'npm run build failed'; exit 1; }
        
                            npm test || { echo 'npm test failed'; exit 1; }
        
                            npm start
                            EOF
                        """
                    }
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
            echo 'Deployment Success!'
        }
        failure {
            echo 'Deployment Failed.'
        }
    }
}
