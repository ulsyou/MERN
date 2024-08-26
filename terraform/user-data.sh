#!/bin/bash
cd /var/lib/jenkins/workspace/Mono-repo

git clone https://github.com/ulsyou/MERN.git

cd MERN/WebKidShop_BE

npm install
nohup npm start > /dev/null 2>&1 &
