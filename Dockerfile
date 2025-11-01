FROM node:25-bookworm

LABEL maintainer="xLasercut"

ARG WRK_DIR=/home/aq_server
ARG DOCKER_SERVER_VERSION
ENV SERVER_VERSION=${DOCKER_SERVER_VERSION}

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y curl bash sqlite3 && \
    mkdir ${WRK_DIR}

WORKDIR ${WRK_DIR}

RUN npm install -g pnpm

COPY ./shared-resources ${WRK_DIR}/shared-resources/
COPY ./server ${WRK_DIR}/server/
COPY ./tsconfig.json ${WRK_DIR}/tsconfig.json
COPY ./package.json ${WRK_DIR}/package.json
COPY ./pnpm-lock.yaml ${WRK_DIR}/pnpm-lock.yaml
COPY ./pnpm-workspace.yaml ${WRK_DIR}/pnpm-workspace.yaml

RUN pnpm install

EXPOSE 3000

CMD ["pnpm", "start"]
