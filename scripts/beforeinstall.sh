#!/bin/bash
source /home/ubuntu/.bashrc
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
npm install -g pm2
pm2 update