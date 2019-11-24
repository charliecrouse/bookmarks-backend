.PHONY: build
build:
	docker build . -t bookmarks-backend:latest

.PHONY: run
run:
	docker run --rm -d -p 3000:3000 --name bookmarks-backend bookmarks-backend:latest
