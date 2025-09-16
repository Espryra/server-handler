#!/bin/bash

if [ -d $cachepath ]; then
    echo "Cache is in use."
    exit 1
fi

mkdir -p $cachepath

for item in $backupitems; do
    if [ -e "$serverpath/$item" ]; then
        echo "Backing up $item..."
        cp -r $serverpath/$item $cachepath/ # || exit 2
    fi
done

if [ ! -d $backuppath ]; then
    mkdir -p $backuppath
fi

tar -cJf "$backuppath/$filename" -C "$cachepath" .
rm -rf $cachepath

echo "Backup created!"
exit 0