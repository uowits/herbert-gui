#!/bin/bash

exec >> deploy.log

export PATH="$PATH:/usr/local/bin"
export HOME="$PWD"
umask 022

curl https://install.meteor.com | /bin/sh

npm install
npm install meteorite

./node_modules/.bin/mrt bundle bundle.tgz
tar -zxvf bundle.tgz
mv dist dist-old
mv bundle dist
rm -r dist-old
