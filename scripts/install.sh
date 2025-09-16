#!/bin/bash

# Base checks
if [ ! $serverpath ]; then
    echo "It seems that the server path is missing from the env.";
    exit 1;
fi
if [ -d $serverpath ]; then
	echo "It seems the server already exists!";
    exit 2;
fi

# Installing server
mkdir -p $serverpath
wget -O $serverpath/server.zip --user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0" $serverlink
unzip $serverpath/server.zip -d $serverpath/
rm $serverpath/server.zip

echo "Finished installing server!"
exit 0
