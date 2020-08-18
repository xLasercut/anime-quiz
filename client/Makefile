build:
	npm run build

build-gh:
	npm run build:gh
	cd dist && git init && git add -A && git commit -m "deploy" && git push -f git@github.com:xLasercut/anime-quiz.git master:gh-pages

run:
	npm run serve
