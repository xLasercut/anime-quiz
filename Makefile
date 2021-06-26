build-client:
	cd client && make build

build-client-gh:
	cd client && make build-gh

run-client:
	cd client && make run

build-server-arm:
	docker-compose -f docker-compose.yml build server ngrok_arm

run-server-arm:
	docker-compose -f docker-compose.yml up server

run-server-arm-prod:
	docker-compose -f docker-compose-prod.yml up server ngrok_arm

build-server-x86:
	docker-compose -f docker-compose.yml build server ngrok_x86

run-server-x86:
	docker-compose -f docker-compose.yml up server

run-server-x86-prod:
	docker-compose -f docker-compose-prod.yml up server ngrok_x86
