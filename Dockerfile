FROM node:8.11.4-alpine

WORKDIR /usr/src/app

RUN apk update \
    && apk upgrade \
    && apk add build-base python git pdftk

COPY . .

# Copy default config pointing to ENV
COPY config/config.sample.js config/config.js
COPY config/knexfile.sample.js knexfile.js

EXPOSE 8080

RUN yarn install
RUN yarn build

CMD ["yarn", "start"]
