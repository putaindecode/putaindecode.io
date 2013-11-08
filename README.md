# Putain de Code !


[![Build Status](https://travis-ci.org/putaindecode/website.png?branch=master)](https://travis-ci.org/putaindecode/website)
[![Code Climate](https://codeclimate.com/github/putaindecode/website.png)](https://codeclimate.com/github/putaindecode/website)

<img align="right" alt="" src="https://raw.github.com/putaindecode/website/master/src/assets/_images/p!-logo--no-bubble-512--trim.png" width="128">

Code source du site [Putain de Code](http://putaindecode.fr/).
Contient tout le nécessaire pour faire fonctionner le site.
Pas de base de données à installer, pas de serveurs à configurer.

## Contributions

Les articles peuvent être postés ici sous forme de PR une fois qu'on est OK dans une
issue du repo de [proposition de posts](https://github.com/putaindecode/propositions-de-posts)
(afin de pas polluer les issues techniques du site).
Si vous souhaitez voir un post écrit, ou même en écrire un, faites un tour là bas ;)

Pour contribuer au site, n'hésitez pas, en plus de lire la partie technique ci-dessous,
à lire le fichier spécifique [CONTRIBUTING.md](CONTRIBUTING.md)

---

## Développement

__Notice: merci de faire attention à la configuration de vos éditeurs de texte et IDE.  
Nous utilisons [`.editorconfig`](.editorconfig) pour garder une cohérence.
Merci de respecter cela (il vous suffit d'aller sur le site [editorconfig.org/](http://editorconfig.org/) 
pour télécharger le plugin adéquat pour votre éditeur.__

Ce site utilise [happyplan](https://github.com/happyplan/happyplan),
il vous est donc conseillé de jeter un coup d'oeil au [README d'happyplan](https://github.com/happyplan/happyplan#readme) 
avant d'intervenir sur le projet ;).

**Nécessite [Node.js](http://nodejs.org/) >=0.10.21**

## Récupérer les sources du site

    git clone https://github.com/putaindecode/website.git
    cd website
    make init
    make install

__Les commandes `make init` et `make update` installeront les dépendances Node
nécessaires (Bower, et les lanceurs `grunt` et `happyplan`).__

## Mettre à jour les sources

Lorsque vous n'avez pas travaillé sur le site depuis un petit moment, on vous conseille
d'exécuter les commandes suivantes :

    git pull
    make update

Si vous rencontrez des erreurs lors du `git pull` (par ex. pour une histoire de
fichiers modifiés non commités (fontes d'icônes ?)), vous pouvez juste avant faire
un petit

    git reset --hard

__Note: cela supprimera toutes vos modifications locales sans avertissement, à
faire avec précaution__.

## Lancer le site web localement

    happyplan

Oui oui, c'est tout, vous devrier avoir le site web qui s'ouvre tout seul dans votre navigateur.
Si ce n'est pas le cas, et que vous n'avez pas d'erreurs dans votre console,
rendez vous à l'adresse suivante: [http://localhost:4242](http://localhost:4242).


## Mise en production

La commande suivante (lorsque vous avez les droits nécessaires) va construire le site
en version optimisée, et le publier (mise à jour de la branche  `gh-pages`, qui,
grâce à GitHub, suffit à mettre en ligne le site).

    happyplan publish

---

## Mise à jour spécifiques

### Mettre à jour les icônes

Le site utilise des icônes SVG (scalables) et donc les convertit en une police d'icônes
grâce à une tache Grunt, incluse dans happyplan.
Cependant pour l'instant, il vous faut avoir sur votre machine la dépendance _fontforge_:

#### OS X

    brew install fontforge ttfautohint

#### Linux
    
    sudo apt-get install fontforge ttfautohint

Une fois cette dépendance installé, vous n'avez rien à faire de plus que de modifier/ajouter
des icônes SVG avec les autres.
La police devrait se générer et se mettre à jour grâce à happyplan.

**Attention: une fois que vous avez cette dépendance, vous devriez faire pour l'instant
attention à ne pas commit à chaque fois les polices d'icônes, seule une date change dans les fichiers**
[Nous sommes en réflexion pour changer ce processus](https://github.com/putaindecode/website/issues/69)

### Générer le favicon

Installez [icoutils](http://www.nongnu.org/icoutils/). Par exemple sur OS X:

    brew install icoutils

Ensuite utilisez la commande suivante

    make favicon

---

## Crédits

### Auteurs et contributeurs

* [Membres de l'organisation](https://github.com/putaindecode?tab=members)
* [Liste des contributeurs](https://github.com/putaindecode/website/graphs/contributors)

### Logo & Avatar

Remerciements à toutes les personnes impliquées dans cette discussion [putaindecode/organisation/issues/4](https://github.com/putaindecode/organisation/issues/4).
Remerciement spécial à [@mlbli](https://github.com/mlbli) pour le [logo initial](https://github.com/putaindecode/website/blob/3324cbe7637dacd1f42a412c1085431a2d551928/src/assets/_images/p!-logos.png).

--- 

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/putaindecode/website/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

