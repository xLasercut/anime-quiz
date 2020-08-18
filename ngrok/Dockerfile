FROM node:11.15.0-alpine

LABEL maintainer="xLasercut"

ARG WRK_DIR=/home/ngrok

RUN apk update && apk upgrade \
  && apk -q add curl \
  && apk -q add bash \
  && apk -q add bash-completion \
  && mkdir ${WRK_DIR}

WORKDIR ${WRK_DIR}

COPY ./ngrok/entrypoint.sh ${WRK_DIR}/entrypoint.sh
COPY ./ngrok/generate-ngrok-config.js ${WRK_DIR}/generate-ngrok-config.js

RUN curl -Lo ./ngrok.zip https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-arm.zip \
  && unzip -o ./ngrok.zip -d . \
  && chmod +x ./ngrok \
  && rm ngrok.zip

CMD ["/bin/bash", "entrypoint.sh"]
