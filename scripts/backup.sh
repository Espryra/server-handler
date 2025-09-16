#!/bin/bash

if [ -d $cachepath ]; then
    echo "Backup was already in progress."
    exit 1
fi

mkdir -p $cachepath

for item in $backupitems; do
    if [ -e "$serverpath/$item" ]; then
        echo "Backing up $item..."
        cp -r $serverpath/$item $cachepath/ || exit 2
    fi
done

if [ ! -d $backuppath ]; then
    mkdir -p $backuppath
if

tar -cJf $backuppath/$filename -C $serverpath/worlds/ $worldfolder

echo "Backup created!"
exit 0