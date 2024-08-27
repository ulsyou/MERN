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

        stage('Prepare Deployment') {
            steps {
                script {
                    // Create docker-compose.yml
                    writeFile file: 'docker-compose.yml', text: '''
                    version: '3'
                    services:
                      frontend:
                        build: ./WebKidShop_FE
                        ports:
                          - "3000:3000"
                      backend:
                        build: ./WebKidShop_BE
                        ports:
                          - "5000:5000"
                      mongodb:
                        image: mongo:6.0
                        ports:
                          - "27017:27017"
                    '''
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                withAWS(credentials: 'aws-credentials', region: 'ap-southeast-2') { 
                    script {
                        def instanceId = sh(script: "aws ec2 describe-instances --filters Name=tag:Name,Values=webkidshop-frontend --query 'Reservations[0].Instances[0].InstanceId' --output text", returnStdout: true).trim()
                        
                        def sessionId = sh(script: "aws ssm start-session --target ${instanceId} --document-name AWS-StartInteractiveCommand --parameters command=\"bash -l\" --output text | awk '{print \$4}'", returnStdout: true).trim()
                        
                        sh """
                            aws ssm send-command \\
                                --instance-ids "${instanceId}" \\
                                --document-name "AWS-RunShellScript" \\
                                --parameters 'commands=[
                                    "mkdir -p ~/deployment",
                                    "cd ~/deployment",
                                    "git clone https://github.com/ulsyou/MERN/WebKidShop_FE.git",
                                    "git clone https://github.com/ulsyou/MERN/WebKidShop_BE.git",
                                    "sudo yum update -y",
                                    "sudo amazon-linux-extras install docker -y",
                                    "sudo service docker start",
                                    "sudo usermod -a -G docker ec2-user",
                                    "sudo curl -L \\"https://github.com/docker/compose/releases/download/1.29.2/docker-compose-\$(uname -s)-\$(uname -m)\\" -o /usr/local/bin/docker-compose",
                                    "sudo chmod +x /usr/local/bin/docker-compose",
                                    "docker-compose up -d --build"
                                ]' \\
                                --output text
                        """
                        sh "aws ssm terminate-session --session-id ${sessionId}"
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
