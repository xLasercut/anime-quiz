#!/bin/bash

npm run generate-config

./ngrok http server:3001 --config=./ngrok.yml
