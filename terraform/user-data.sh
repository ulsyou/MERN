#!/bin/bash
cd /var/lib/jenkins/workspace/Mono-repo

git clone https://github.com/ulsyou/MERN.git

cd MERN/WebKidShop_BE

npm install
npm start
