FROM node:18-bookworm

LABEL maintainer="xLasercut"

ARG WRK_DIR=/home/aq_server

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y curl bash bash-completion sqlite3 && \
    mkdir ${WRK_DIR}

WORKDIR ${WRK_DIR}

RUN npm install -g pnpm

COPY package.json ${WRK_DIR}/package.json
COPY pnpm-lock.yaml ${WRK_DIR}/pnpm-lock.yaml

RUN pnpm install

COPY src/. ${WRK_DIR}/src/
COPY tsconfig.json ${WRK_DIR}/tsconfig.json
RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
