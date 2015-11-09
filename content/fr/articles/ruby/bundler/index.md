---
date: "2014-10-14"
title: Dépendances et premier projet en Ruby
tags:
  - backend
  - ruby
authors:
  - rhannequin
---

[tl;dr](#tl-dr)

Dans l'[article précédent](/posts/backend/premiers-pas-avec-ruby)
nous avons installé Ruby. Désormais nous allons aborder les gems,
les dépendances et commencer notre web service.

Un gem en Ruby c'est une lib, comme un paquet NPM pour NodeJS. C'est
d'ailleurs le système de rubygems qui a inspiré le système de NPM.
Pour installer un gem, rien de plus simple que `gem install sass`,
qui ici va installer la bibliothèque `sass`.

Un projet Ruby nécessite la plupart du temps des bibliothèques afin
de ne pas tout faire soi-même, il est donc nécessaire d'avoir une
gestion des dépendances pour le projet.

## Bundler, le gem qui gère les gems

[Bundler](http://bundler.io) est un gem qui va vous permettre de créer un fichier Gemfile
contenant vos dépendances, et qui vous installera les gems
nécessaires avec la gestion des versions et de leurs propres
dépendances. Un fichier Gemfile se présente comme ceci :

```ruby
source 'https://rubygems.org'
ruby '2.1.2'
gem 'sinatra'
```

L'instruction `source` permet de préciser l'url des dépôts de gems.
La version de ruby n'est pas obligatoire mais j'aime la préciser pour
ne pas me mélanger dans mes projets avec différentes versions de Ruby
(voir le
[précédent article pour les versions du Ruby](/posts/backend/premiers-pas-avec-ruby)
et [rbenv](https://github.com/sstephenson/rbenv)). Et enfin, la
déclaration de notre première bibliothèque de dépendance :
[Sinatra](http://www.sinatrarb.com).

Il est possible d'être bien plus précis dans le Gemfile, comme...

Préciser dans quel environnement charger les gems :

```ruby
gem 'sqlite3', group: [:development, :test]
```

Une numéro de version :

```ruby
gem 'rails', '4.1.6'         # version 4.1.6
gem 'sass-rails', '~> 4.0.3' # >= 4.0.3 mais < 4.1.0
```

Préciser la classe à charger :

```ruby
gem 'valid_email', require: 'valid_email/email_validator'
```

Aller chercher directement sur Github :

```ruby
gem 'nokogiri', github: 'sparklemotion/nokogiri'
# https://github.com/sparklemotion/nokogiri.git

gem 'rails', github: 'rails'
# https://github.com/rails/rails.git

gem 'rails', github: 'rails', branch: '4-1-stable'
# https://github.com/rails/rails.git sur la branche 4-1-stable
```

Il existe encore d'autres instructions, de quoi rendre sa gestion des
dépendances vraiment fine et précise.

Une fois le Gemfile prêt, bundler a plusieurs commandes de
disponibles pour pouvoir les télécharger et utiliser.

- `$ bundle install` installera les gems requis
- `$ bundle update` mettra à jour vers les versions les plus récentes si possible les gems requis
- `$ bundle exec` permettra de précéder une commande ruby afin de l'exécuter dans le contexte du Gemfile, très utile lorsque l'on a différentes versions de Ruby qui se baladent dans le terminal

Bundler va générer un fichier `Gemfile.lock` qui est la description
exhaustive des dépendances de votre application, chaque gem avec le
numéro de sa version installée, chaque dépendance pour chaque gem,
une jolie arborescence plus que précise.

## Commençons notre web service

Assez parlé des outils qui existent, utilisons-les. Tout d'abord
installons Bundler, sans oublier le `$ rbenv rehash` nécessaire si vous
utilisez rbenv pour vos versions de Ruby afin de mettre à jour les
commandes disponibles dans le terminal :

```
$ gem install bundler
$ rbenv rehash
```

Pour notre première application, nous allons faire un web service
avec Sinatra qui est un micro-framework web, ayant d'ailleurs
clairement inspiré Express ("Sinatra inspired web development
framework for node.js"). Notre Gemfile va donc être exactement
comme notre premier exemple :

```ruby
source 'https://rubygems.org'
ruby '2.1.2'
gem 'sinatra'
```

Un petit `bundle install` et nous sommes prêts à démarrer !

Pour ne pas brusquer les choses, nous allons faire la version la plus
simple d'un web service avec Sinatra, ce qui nous permettra de
constater la simplicité extrême de Ruby et du framework :

```ruby
########
# app.rb
#

require 'sinatra'

get '/' do
  'Hello World!'
end
```

Qu'avons-nous fait là ? Pas grand chose, et en même temps tout juste
ce qu'il faut. Nous avons inclus le gem à notre script et utilisé la
méthode Sinatra `get` nous permettant de déclarer un point d'entrée
en `GET` sur la route '/'. Cette méthode prend également comme
argument un `block` caractérisé par le `do` et le `end`. La dernière
valeur du block étant la valeur de retour, nous renvoyons la seule
chaîne de caractères "Hello World!".

Et maintenant : lancement ! `$ bundle exec ruby app.rb` va lancer
l'application (mais `ruby app.rb` suffit), par défaut sur le port
`4567`. Regardez vite [http://localhost:4567](http://localhost:4567)
et là magie, "Hello World!" sur une magnifique page blanche, notre
tout premier web service est fonctionnel.

Alors oui, ce n'est pas une révolution. Mais tout de même, en
réduisant la syntaxe du block on se retrouve avec un script de deux
lignes qui crée un vrai web service web. Et vous allez vite voir
qu'en quelques lignes de plus on peut vite complexifier le bousin.

## Au prochain épisode

Dans l'article suivant nous allons ajouter des fonctionnalités à
notre toute nouvelle application, de nouvelles routes, de la
persistence et aussi des vues dans un format un peu plus utile.

Stay tuned!

## tl;dr

Voici la version abrégée de cet article :

```ruby
# Gemfile
source 'https://rubygems.org'
ruby '2.1.2'
gem 'sinatra'
```

```ruby
# app.rb
require 'sinatra'
get '/' do
  'Hello World!'
end
```

```console
$ gem install bundler
$ rbenv rehash
$ bundle install
$ ruby app.rb
```

## Sources

- [RubyGems](https://rubygems.org)
- [Bundler](http://bundler.io)
- [rbenv](https://github.com/sstephenson/rbenv)
- [Sinatra](http://www.sinatrarb.com) et surtout son [README](http://www.sinatrarb.com/intro.html)
