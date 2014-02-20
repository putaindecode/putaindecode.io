init:
	npm install -g bower grunt-cli happyplan-cli

init-osx:
	brew install icoutils

install:
	npm install
	bower install

update:
	npm install
	bower prune
	bower update

favicon:
	icotool -c src/assets/_images/p\!-logo--no-bubble-16.png src/assets/_images/p\!-logo--no-bubble-32.png -o src/favicon.ico
