#!/bin/bash
set -e
# generate the JS config from a template using current env vars.
OUTPUT="generated/config.js"
mkdir -p `dirname "${OUTPUT}"`
echo "'use strict';" > ${OUTPUT}
echo -n "module.exports = " >> ${OUTPUT}
CONFIG=`node -p "JSON.stringify(require('./src/configTemplate'), null, 2);" | sed "s/\"/'/g"`
echo "${CONFIG};" >> ${OUTPUT}
