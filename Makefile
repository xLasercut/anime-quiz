install-%:
	$(MAKE) -C $* install

build-%:
	$(MAKE) -C $* build

format-%:
	$(MAKE) -C $* format

format-check-%:
	$(MAKE) -C $* format-check


install: install-server install-client

build: build-server build-client

format: format-server format-client

format-check: format-check-server format-check-client
