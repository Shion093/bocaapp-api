#!/bin/bash
source /home/ubuntu/.bashrc
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
nvm install 9.3.0
npm install -g pm2
pm2 update