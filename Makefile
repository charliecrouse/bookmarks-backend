.PHONY: build
build:
	docker build . --build-arg NODE_ENV=$(NODE_ENV) -t bookmarks-backend:latest

.PHONY: run
run:
	docker run --rm -p 3000:3000 --name bookmarks-backend --link bookmarks-postgres bookmarks-backend:latest

.PHONY: run-db
run-db:
	docker run --rm -d -p 5432:5432 --name bookmarks-postgres -v postgres-data:/var/lib/postgresql/data postgres:alpine
