FROM node:8.12.0-stretch

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
  pdftk \
  && rm -rf /var/lib/apt/lists/*

ADD ./package.json package.json
RUN yarn install

COPY . .

# Copy default config pointing to ENV
COPY config/config.sample.js config/config.js
COPY config/knexfile.sample.js knexfile.js

EXPOSE 8080

RUN yarn build

CMD ["yarn", "start:prod"]
