# you can use pass the tag like this. make build tag=redis
tag = latest

build:
	docker build -t debtcollective/dispute-tools:$(tag) .

push:
	docker push debtcollective/dispute-tools:$(tag)

backup:
	docker pull debtcollective/dispute-tools:latest
	docker tag debtcollective/dispute-tools:latest debtcollective/dispute-tools:previous
	docker push debtcollective/dispute-tools:previous

build-test:
	mkdir -p ./tmp && cp Dockerfile.test tmp/Dockerfile
	cd tmp; docker build -t debtcollective/dispute-tools-test:$(tag) .
	rm -R tmp

push-test:
	docker push debtcollective/dispute-tools-test:$(tag)

config:
	cp config/config.sample.js config/config.js
	cp config/knexfile.sample.js knexfile.js

project:
	yarn && yarn utils:resetdb && yarn db:migrate && yarn db:seed && yarn build
