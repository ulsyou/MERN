#!/bin/bash
echo "Starting deployment..."

git clone https://github.com/ulsyou/MERN.git /home/kali/MERN

cd /home/kali/MERN/WebKidShop_BE
npm install
nohup npm start > /home/kali/Backend.log 2>&1 &

cd /home/kali/MERN/WebKidShop_FE
npm install
npm run build
nohup npm start > /home/kali/Frontend.log 2>&1 &

echo "Deployment completed."
