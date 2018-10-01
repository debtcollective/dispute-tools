# you can use pass the tag like this. make build tag=redis
tag = latest

build:
	docker build -t debtcollective/dispute-tools:$(tag) .

push:
	docker push debtcollective/dispute-tools:$(tag)