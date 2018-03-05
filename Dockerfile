FROM node:8.9.1

WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get install -y imagemagick graphicsmagick pdftk

COPY . .

# Copy default config pointing to ENV
COPY config/config.sample.js config/config.js
COPY config/knexfile.sample.js knexfile.js

EXPOSE 8080

RUN yarn install 
RUN yarn build

CMD ["yarn", "start"]
