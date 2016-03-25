#!/bin/sh

curl \
    --header 'Content-Type:application/json' \
    --data '{ "type": "fluid.modelComponent", "model": { "activeNote": -1 } }' \
    http://localhost:9081/components/bonang
