FROM alpine:latest

LABEL maintainer="xLasercut"

ARG WRK_DIR=/home/ngrok

RUN apk update && apk upgrade \
  && apk -q add curl \
  && apk -q add bash \
  && apk -q add bash-completion \
  && mkdir ${WRK_DIR}

WORKDIR ${WRK_DIR}

COPY ./ngrok/entrypoint.sh ${WRK_DIR}/entrypoint.sh
COPY ./ngrok/ngrok.yml ${WRK_DIR}/ngrok.yml

RUN curl -Lo ./ngrok.zip https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.zip \
  && unzip -o ./ngrok.zip -d . \
  && chmod +x ./ngrok \
  && rm ngrok.zip

CMD ["/bin/bash", "entrypoint.sh"]
