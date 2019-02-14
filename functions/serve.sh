#!/bin/bash -xeu

removeRuntimeConfig(){
    rm .runtimeconfig.json;
    echo removed .runtimeconfig.json
}
trap removeRuntimeConfig exit

firebase functions:config:get > .runtimeconfig.json
echo created .runtimeconfig.json from functions config

echo building functions
yarn build

echo serving functions locally
firebase serve --only functions

