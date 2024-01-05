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

COPY src/. ${WRK_DIR}/src/
COPY tsconfig.json ${WRK_DIR}/tsconfig.json
RUN npm run build

COPY data/. ${WRK_DIR}/data/

EXPOSE 3000

CMD ["npm", "run", "start"]
