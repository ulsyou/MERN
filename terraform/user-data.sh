#!/bin/bash

# Deploy Backend
git clone https://github.com/your-repo/WebKidShop_BE.git /home/kali/WebKidShop_BE
cd /home/kali/WebKidShop_BE
npm install
nohup npm start > /dev/null 2>&1 &

# Deploy Frontend
git clone https://github.com/your-repo/WebKidShop_FE.git /home/kali/WebKidShop_FE
cd /home/kali/WebKidShop_FE
npm install
npm run build
nohup npm start > /dev/null 2>&1 &
