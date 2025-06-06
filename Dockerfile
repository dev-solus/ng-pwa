FROM node:22.2-alpine3.19 as build-env
WORKDIR /app

# copy and cahe
COPY package*.json ./

RUN npm i --force

COPY public public
COPY src src
COPY .editorconfig .
COPY angular.json .
# COPY server.ts .
COPY tailwind.config.js .
COPY ngsw-config.json .
COPY tsconfig*.json ./

RUN npm run prod
# RUN ls -al

FROM nginx:alpine
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*
COPY ./ngx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-env /app/dist/browser .
# COPY ./dist .

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
