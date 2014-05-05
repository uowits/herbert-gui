#!/bin/bash

exec >> deploy.log

cd .. # go up
export HOME="$PWD"
export PATH="$HOME/.meteor:$HOME/node_modules/.bin:$PATH:/usr/local/bin"
umask 022

if ! hash meteor 2>/dev/null
then
	curl https://install.meteor.com | /bin/sh
fi

npm install meteorite

( cd src && mrt bundle bundle.tgz )

tar -zxvf src/bundle.tgz
mv dist dist-old
mv bundle dist
rm -r dist-old

