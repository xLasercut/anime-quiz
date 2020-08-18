build-client:
	cd client && make build

build-client-gh:
	cd client && make build-gh

run-client:
	cd client && make run

build-server:
	docker-compose -f docker-compose.yml build

run-server:
	docker-compose -f docker-compose.yml up

run-server-prod:
	docker-compose -f docker-compose-prod.yml up -d
