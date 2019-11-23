.PHONY: build
build:
	docker build . -t bookmarks-backend:latest

.PHONY: run
run:
	docker run --rm -p 3000-4000:3000 --name bookmarks-backend --link peaceful_ishizaka bookmarks-backend:latest

.PHONY: up
up:
	docker-compose up
