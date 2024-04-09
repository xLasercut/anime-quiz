install-%:
	$(MAKE) -C $* install

build-%:
	$(MAKE) -C $* build

format-%:
	$(MAKE) -C $* format

check-format-%:
	$(MAKE) -C $* format-check


install: install-server install-client

build: build-server build-client

format: format-server format-client

check-format: check-format-server check-format-client
