install:
	npm install -g bower grunt-cli happyplan-cli
	gem install bundler

update:
	npm install
	bower install
	bundle install