FROM node:8.9.1

WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get install -y imagemagick graphicsmagick pdftk

COPY package.json ./
COPY yarn.lock ./

COPY . .

EXPOSE 8080

RUN yarn install

CMD ["yarn", "start"]
