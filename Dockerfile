FROM node:11.15.0-alpine

LABEL maintainer="xLasercut"

ARG WRK_DIR=/home/aq_server
ARG SERVER_DIR=${WRK_DIR}/server
ARG SHARED_DIR=${WRK_DIR}/shared

RUN apk update && apk upgrade \
 && apk -q add curl \
 && apk -q add bash \
 && apk -q add bash-completion \
 && mkdir ${WRK_DIR}

WORKDIR ${SERVER_DIR}

COPY ./server/package.json ${SERVER_DIR}/package.json
COPY ./server/package-lock.json ${SERVER_DIR}/package-lock.json

RUN npm ci

WORKDIR ${WRK_DIR}

COPY ./server/. ${SERVER_DIR}/.
COPY ./shared/. ${SHARED_DIR}/.

WORKDIR ${SERVER_DIR}

RUN npm run compile

EXPOSE 3001

CMD ["npm", "run", "start"]
