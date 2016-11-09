#!/bin/bash
set -e
rm -rf dist
mkdir dist
cp -a node_modules src generated dist/
cd dist
zip -9 ../lambda_dist.zip *
