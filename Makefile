.PHONY: docker-build
build:
	docker build -t bookmarks-backend --target $(NODE_ENV) .

.PHONY: docker-run
run:
	docker run --rm -d -p $(PORT):3000 --name bookmarks-backend --link bookmarks-postgres bookmarks-backend:latest

.PHONY: docker-db
db:
	docker run --rm -d -p 5432:5432 --name bookmarks-postgres -v postgres-data:/var/lib/postgresql/data postgres:alpine
