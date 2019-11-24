.PHONY: build
build:
	docker build . --build-arg NODE_ENV=$(NODE_ENV) -t bookmarks-backend:latest

.PHONY: run
run:
	docker run --rm -d -p 80:3000 --name bookmarks-backend --link bookmarks-postgres bookmarks-backend:latest
