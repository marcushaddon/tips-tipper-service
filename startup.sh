#!/usr/bin/env bash
apt-get update
sudo apt-get install build-essential
apt-get install nodejs
curl -L https://npmjs.org/install.sh | sh

curl https://s3.amazonaws.com/aws-cloudwatch/downloads/latest/awslogs-agent-setup.py -O
sudo python ./awslogs-agent-setup.py --region us-east-2 #  --only-generate-config

srcPortNumber=80
dstPortNumber=3000
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport $srcPortNumber -j REDIRECT --to-port $dstPortNumber
