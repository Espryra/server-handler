#!/bin/bash

if [ -d $cachepath ]; then
    echo "Cache is in use!";
    exit 1;
fi

mkdir -p $cachepath
tar -xf $backuppath/$filename -C $cachepath

for item in "$cachepath"/*; do
    if [ -e "$item" ]; then
        itemname=$(basename "$item")

        echo $itemname

        rm -rf $serverpath/$itemname
        cp -r $cachepath/$itemname $serverpath
    fi
done

rm -rf $cachepath

echo "Backup restored!";
exit 0;