---
date: "2014-05-07"
title: Premiers pas avec Ruby
tags:
  - ruby
authors:
  - rhannequin
---

## tl;dr

```console
$ git clone git://github.com/sstephenson/rbenv.git ~/.rbenv
$ echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
$ echo 'eval "$(rbenv init -)"' >> ~/.bashrc
$ source ~/.bashrc
$ git clone git@github.com:sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build
$ rbenv install 2.1.1
$ rbenv global 2.1.1
$ gem install sinatra
$ rbenv rehash
```

Tous les ans, depuis des années, sort un article : *"[Est-ce que Ruby est mort ?](http://www.reddit.com/comments/1oi8wd)"*. Et chaque année les résultats sont les mêmes, *"Ruby perd en intensité"*, *"Node.js prend le dessus"*. Et pourtant Ruby reste chaque année dans l'actualité avec autant d'importance. Il faut être honnête et admettre que [Ruby souffre de certaines difficultés](http://blog.federicocarrone.com/2014/01/18/ruby-dying-or-ruby-hype-dead) comme tous les langages, mais [Ruby n'est pas mort](http://jmoses.co/2013/12/21/is-ruby-dying.html) et il y a encore beaucoup à en tirer, du langage, de ses frameworks et de sa communauté. Sans oublier que de grands sites l'ont utilisé et l'utilisent toujours comme Twitter, Github, Shopify, ou encore Hulu.

Nous commençons donc une série d'articles sur Ruby afin de le découvrir et commencer à développer et à devenir productif avec. Et pour ce premier article, nous allons voir comment l'installer. Dans les suivants nous installerons notre première gem, nous utiliserons Sinatra pour notre premier projet, puis nous n'arriverons plus à nous arrêter.

## Un langage, des implémentations

Tout d'abord, il faut savoir qu'il existe plusieurs implémentations de Ruby, c'est-à-dire différents interpréteurs du langage. L'implémentation principale et originale est *MRI*, pour Matz's Ruby Interpreter, Yukihiro "Matz" Matsumoto étant le créateur de Ruby. On trouve également JRuby, un interpretteur Ruby en Java, permettant de bénéficier de toutes les fonctionnalités de la JVM. Parmi les plus connues également MacRuby qui est une implémentation spécifique à OS X et dont [RubyMotion](http://www.rubymotion.com) dépend. Pour nos articles nous devrions utiliser MRI à moins qu'une envie sur une différente implémentation se fasse ressentir.

> C'est bien tout ça mais au final j'en sais pas plus sur Ruby.

Et ça va en rester ainsi pour le moment, car au lieu de voir la théorie sur Ô combien [Ruby est génial](http://www.slideshare.net/astrails/ruby-is-awesome-16466895), nous allons tout de suite installer Ruby pour nous rapprocher rapidement de notre éditeur de texte.

## Installation avec *rbenv*

Il existe de nombreuses façons d'installer Ruby, un petit peu comme Node.js en passant par Github, par les packages officiels, brew, etc. *rbenv* reste d'après moi la façon la plus simple, propre et légère. Beaucoup pourront préférer *RVM* disant qu'il fait la même chose en mieux, d'autres diront qu'au contraire il en fait trop en écrasant par exemple la méthode `cd`. J'ai utilisé les deux, il fallait faire un choix, ce sera *rbenv*.

Pour utiliser *rbenv*, il faut avoir Git. Si vous ne l'avez pas, vous devriez. Et ça tombe bien, [madx](https://github.com/madx) et [Erwyn](https://github.com/Erwyn) ont fait deux super articles pour l'[utiliser](/posts/git/versionner-avec-git/) et le [dompter](/posts/git/boutez-les-bugs-domptez-votre-historique/). On commence donc par installer *rbenv* :

```console
$ git clone git://github.com/sstephenson/rbenv.git ~/.rbenv
$ echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
$ echo 'eval "$(rbenv init -)"' >> ~/.bashrc
$ source ~/.bashrc
```

Désormais *rbenv* est installé et ses commandes sont disponibles dans votre terminal. Il faut maintenant lui installer le plugin pour récupérer les différentes versions de Ruby :

```console
$ git clone git@github.com:sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build
```

C'est bon, vous pouvez installer Ruby. J'ai constaté sur Ubuntu qu'il était nécessaire d'installer au préalable `libssl-dev` et `g++`, simplement avec `sudo apt-get install libssl-dev g++`. Lançons-nous :

```console
$ rbenv install 2.1.1
$ rbenv global 2.1.1
```

Séquence émotion. Vous êtes désormais maître de l'Univers.

Vous avez Ruby 2.1.1 d'installé. La ligne `rbenv global` permet comme son nom l'indique d'utiliser cette version de Ruby de façon globale à l'utilisateur, si jamais plusieurs versions coexistent.

C'était facile n'est-ce pas ? Et bien c'est encore plus facile d'utiliser une bibliothèque (appelée "gem") ou un framework Ruby. Comme nous allons utiliser Sinatra dans notre prochain article, autant l'installer tout de suite. Pour installer une gem qui sera exécutée dans la console comme Sass il est nécessaire de l'installer de cette façon : `gem install sass`. Seulement pour Sinatra, nous avons seulement besoin que le framework soit disponible dans nos scripts Ruby. Pour cela nous allons utiliser un gestionnaire de dépendance des gem Ruby, et nous verrons cela dans [le prochain article pour nos premiers pas avec Sinatra](/posts/backend/ruby-dependances-et-projet).

D'ici là vous pouvez commencer à jouer avec Ruby en tapant la commande `irb` dans votre terminal, qui lance l'interpretteur Ruby. Pourquoi pas essayer un *Hello World!* à la Ruby ?

```ruby
puts 'Hello World!'
puts (1..3).to_a.reverse.join(' ... ') << ' ... The World is ours!!!'
```

Enjoy!
