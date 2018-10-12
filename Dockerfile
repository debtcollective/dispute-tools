FROM node:8.11.4

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
  pdftk \
  && rm -rf /var/lib/apt/lists/*

COPY . .

# Copy default config pointing to ENV
COPY config/config.sample.js config/config.js
COPY config/knexfile.sample.js knexfile.js

EXPOSE 8080

RUN yarn install
RUN yarn build

CMD ["yarn", "start:prod"]
