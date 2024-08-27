#!/bin/bash
echo "Starting deployment..."

# Cài đặt git và Node.js nếu chưa cài
apt-get update
apt-get install -y git nodejs npm

git clone https://github.com/ulsyou/MERN.git /home/ubuntu/MERN

cd /home/ubuntu/MERN/WebKidShop_BE
npm install
nohup npm start > /home/ubuntu/Backend.log 2>&1 &

cd /home/ubuntu/MERN/WebKidShop_FE
npm install
npm run build
nohup npm start > /home/ubuntu/Frontend.log 2>&1 &

echo "Deployment completed."
