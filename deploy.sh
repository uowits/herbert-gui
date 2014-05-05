#!/bin/bash

exec >> deploy.log

export HOME="$PWD/home"
mkdir -p "$HOME"
export PATH="$HOME/.meteor:$PATH:/usr/local/bin"
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
