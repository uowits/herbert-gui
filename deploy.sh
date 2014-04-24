#!/bin/bash

exec >> deploy.log

export PATH=".meteor:$PATH:/usr/local/bin"
export HOME="$PWD"
umask 022

if ! hash meteor 2>/dev/null
then
	curl https://install.meteor.com | /bin/sh
fi

npm install meteorite

./node_modules/.bin/mrt bundle bundle.tgz
tar -zxvf bundle.tgz
mv dist dist-old
mv bundle dist
rm -r dist-old
