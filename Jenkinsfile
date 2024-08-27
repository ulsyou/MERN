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
        
        stage('Install Dependencies') {
            steps {
                sh '''
                    whoami
                    # Install pip if not available
                    which pip3 || sudo -S apt-get update && sudo -S apt-get install -y python3-pip

                    # Install or upgrade AWS CLI
                    pip3 install --user --upgrade awscli

                    # Install Terraform if not available
                    if ! command -v terraform &> /dev/null; then
                        wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
                        echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
                        sudo -S apt-get update && sudo -S apt-get install -y terraform
                    fi

                    # Print versions
                    terraform version
                    aws --version
                '''
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
                            sh 'terraform show -no-color tfplan'
                            sh 'terraform apply -auto-approve -no-color'
                            sh 'terraform state list -no-color'
                            
                            def subnetId = sh(script: 'terraform output -no-color subnet_id || echo "No Subnet ID"', returnStdout: true).trim()
                            def instanceId = sh(script: 'terraform output -no-color backend_instance_id || echo "No Instance ID"', returnStdout: true).trim()
                            def privateIp = sh(script: 'terraform output -no-color backend_instance_private_ip || echo "No Private IP"', returnStdout: true).trim()
                            
                            echo "Subnet ID: ${subnetId}"
                            echo "EC2 Instance ID: ${instanceId}"
                            echo "EC2 Private IP: ${privateIp}"

                            sh 'aws ec2 describe-instances'
                            sh 'aws s3api list-buckets'
                        }
                    }
                }
            }
        }

        stage('Manage Key Pair') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', 
                                  credentialsId: 'aws-credentials', 
                                  accessKeyVariable: 'AWS_ACCESS_KEY_ID', 
                                  secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                    script {
                        def keyExists = sh(script: "aws ec2 describe-key-pairs --key-names ${KEY_NAME} --query 'KeyPairs[*].[KeyName]' --output text", returnStatus: true) == 0

                        if (!keyExists) {
                            echo "Creating new key pair..."
                            sh """
                            aws ec2 create-key-pair --key-name ${KEY_NAME} --query 'KeyMaterial' --output text > ${KEY_NAME}.pem
                            chmod 400 ${KEY_NAME}.pem
                            """
                        } else {
                            echo "Key pair already exists."
                        }
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
            echo 'Build Success!'
        }
        failure {
            echo 'Build Failed.'
        }
    }
}
