#!/bin/bash

set -eu -o pipefail

rm function.zip
zip function.zip index.js
aws --region us-east-1 lambda update-function-code --function-name ry4anorgRedirects --zip-file fileb://function.zip
