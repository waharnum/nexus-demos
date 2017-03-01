#!/bin/bash

# Pass device path as first command line argument

device_path=$1

echo Monitoring $device_path

while true
do
    if [ -e "$device_path" ]
    then
        node RunAtlasScientificDriver.js --device $device_path
    fi
done
