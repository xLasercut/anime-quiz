FROM node:lts-alpine

LABEL maintainer="xLasercut"

ARG WRK_DIR=/home/aq_server

RUN apk update && apk upgrade \
  && apk -q add curl \
  && apk -q add bash \
  && apk -q add bash-completion \
  && mkdir ${WRK_DIR}

WORKDIR ${WRK_DIR}

COPY package.json ${WRK_DIR}/package.json

RUN npm install

COPY data/. ${WRK_DIR}/data/
COPY src/. ${WRK_DIR}/src/
COPY tsconfig.json ${WRK_DIR}/tsconfig.json

WORKDIR ${WRK_DIR}

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
