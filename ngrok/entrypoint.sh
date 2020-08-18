#!/bin/bash

node ./generate-ngrok-config.js

./ngrok http server:3001 --config=./ngrok.yml
