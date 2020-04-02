#!/usr/bin/env bash
apt-get update
apt-get install nodejs
curl -L https://npmjs.org/install.sh | sh

srcPortNumber=80
dstPortNumber=3000
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport $srcPortNumber -j REDIRECT --to-port $dstPortNumber
