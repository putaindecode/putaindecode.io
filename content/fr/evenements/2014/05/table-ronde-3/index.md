---
date: "2014-05-05"
title: "Table ronde #3 - Les bonnes pratiques et organisation CSS/HTML"
tags:
  - table-ronde
  - css
  - html
authors:
  - kud
---

Mardi 29 avril s'est déroulée la troisième table ronde qui est finalement la première sous le nom de **{p!}**. Une petite explication s'impose étant donné que nous allons en faire de plus en plus et que je souhaite vraiment vous faire un compte rendu sur chacun de ces évènements.

## Préambule

Partant du constat qu'il est difficile d'apprendre et d'échanger en conférence du fait du manque du niveau assez élevé (trop de gens avec un niveau différent, il faut forcément s'aligner) et à sens unique (une personne parle, les autres écoutent), nous avons décidé de créer des tables rondes où un fil conducteur est suivi amenant à débattre, échanger, affirmer.

Attention, je ne dis pas que les conférences ne servent à rien mais à mon sens elles sont trop magistrales et parfois trop marketing (coucou WebRTC Paris).

Les premières tables rondes n'étaient pas sous le nom de **p!**, elles étaient plutôt de mon initiative (@_kud) dans le but de rassembler des gens que j'appréciais et dont je connaissais le niveau afin de progresser tous ensemble.

Je tiens à vous mettre en garde ici que les propos tenus ne sont pas forcément toujours justifiés, c'est un compte rendu qui synthétise des choix que vous devriez sûrement explorer par vous-même ou au travers de d'autres articles **p!**.

Bon allez, on y va.

## Où ?

C'est cette fois-ci Altima qui nous a gentillement accueilli dans ses locaux.

[Altima](http://www.altima.fr) est une agence web composée de 6 bureaux dans le monde, proposant des expertises notamment dans les domaines du design, UX, SEO, in-store, hosting, et développement.

On les remercie bien fort, tout était nickel.

## Thèmes

Voici le fil conducteur de la soirée.

- les resets / normalize, lesquels, pourquoi, quand ?
- stratégie de dossiers / fichiers (architecture)
- OOCSS, BEM, SMACSS, Atomique etc.
- sémantique
- accessibilité
- les pièges de l'intégration (e.g. display: inline-block)
- unités px, rem, em, pt
- CSS Frameworks ? lesquels ? pourquoi ? quand ?

## Qui ?

Voici les personnes présentes. Si vous avez d'ailleurs le moindre problème avec ce qui est dit dans cet article, c'est à eux que vous devriez vous adresser. 😊

Membres | Statut
--------|:------:
[_kud](https://twitter.com/_kud) | 👮
[bloodyowl](https://twitter.com/bloodyowl) | 🏠
[yannickc](https://twitter.com/yannickc) |
[dhoko_](https://twitter.com/dhoko_) |
[philippebarbosa](https://twitter.com/philippebarbosa) |
[tchak13](https://twitter.com/tchak13) |
[remitbri](https://twitter.com/remitbri) |
[dizwix](https://twitter.com/dizwix) |

## C'est parti

### Reset / Normalize

Bon, alors, commençons. Ce sont évidemment les resets / normalizes qui débutent étant donné que c'est la base de toute intégration.

Pour rappel, la différence entre un normalize et un reset est simple.

- Le **normalize** fait en sorte que les styles de base se ressemblent sur tous les navigateurs.
- Le **reset** va plus loin que ça puisqu'il s'occupe d'écraser totalement les styles par défaut pour finalement n'avoir aucun style sur votre page lorque vous débutez votre intégration.

Bref, peu ou pas de gens dans cette salle utilisent finalement des resets. Les resets sont uniquement intéressants lors d'applications très poussées où le style par défaut des navigateurs n'est pas du tout pertinent. Mais attention, ceci peut être dangereux car il est plus compliqué de retrouver le style par défaut d'un navigateur que de le supprimer. D'où l'intérêt du normalize.

Je vous indique tout de même les plus connus :

- [Le reset d'Eric Meyer](http://meyerweb.com/eric/tools/css/reset/)
- [Le normalize de Necolas](http://necolas.github.io/normalize.css/)

### Stratégie de fichiers

Allez, on continue, stratégie de fichiers, où est ce qu'on range tout ce beau monde, comment on s'y retrouve.

On en a discuté un peu, certains préfèrent mettre leurs fichiers dans directement dans le _root_ du projet, moi je préfère le mettre dans un dossier `/src` afin de bien différencier source, sortie, et fichiers de configuration du projet. Ce qui donne ceci :

```
.
├── README.md
├── bin // executables
├── dist // fichiers finaux
├── src // votre application
│   ├── assets // fichiers statiques (pas de compilation)
│   ├── collections
│   ├── events
│   ├── glyphicons // svg qui seront transformés en font
│   ├── images
│   ├── lib
│   ├── models
│   ├── styles
│   │   ├── base
│   │   ├── shared
│   │   ├── views
│   │   ├── import.css
│   │   └── shame.css // hack css où il est obligatoire de commenter pourquoi
│   ├── routers
│   ├── templates
│   └── views
│   ├── app.js
│   ├── bootstrap.js
|   └── import.json
├── gulpfile.js
├── Makefile
├── package.json
```

### OOCSS, BEM, SMACSS, whatever else

Haaaaaaa, grand débat ici. Quelle est la meilleure façon, la meileure manière de maintenir du CSS, de nommer ses classes, d'avoir des conventions de nommage.

Tout d'abord, on s'est tous accordés sur un point : OOCSS, SMACSS, le reste, ça ne marche pas. Ca marche pas parce que ça casse dans certains cas la sémantique, dans d'autres cas, ça revient à faire du style inline mais avec des noms de classes style `.left` pour un `float: left`. On a tous plus ou moins essayé et ça devient vite le bordel. On s'est aussi accordés, mais ça c'est évident, qu'avoir une convention de nommage est primordiale pour maintenir correctement du style (ou autre d'ailleurs).
Et surtout il n'est plus nécessaire d'utiliser les IDs. Les IDs doivent servir uniquement dans le cas de la combinaison label/input, mais sinon ils empêchent toute généralisation d'un block.

Il est clair qu'après des années d'intégration, le constat est là, la cascade, ce n'est vraiment pas l'idéal. Cela reste toujours aussi difficile de faire du css generique et/ou maintenable, et c'est justement en quoi BEM permet de résoudre à la fois les problématiques de cascade mais aussi de nommage.

Il y a de nombreux articles sur BEM, sur ses conventions (oui, il peut y avoir plusieurs conventions de nommage, BEM reste plus une méthologie).

En quelques termes, BEM redéfinit la cascade en ne plus l'utilisant comme par exemple : `.header .title.is-active` mais `.header__title--is-active`, BEM venant de Block, Element, Modifier. C'est exactement ce que je viens de découper en une seule classe plutôt que 3.

Pour ma part, j'utilise la convention de nommage qui se rapproche très fortément du framework JavaScript "Montage.js" : `.org-(js-)-MyBlock-myElement--myModifier`.

Je ne souhaite volontairement pas m'étendre sur le sujet car je vous invite à lire [mon article à ce sujet](/posts/css/petite-definition-bem/).

Je vous laisse tout de même deux articles à ce sujet qui présentent plutôt bien le principe (ils sont en anglais).

- [A New Front-End Methodology: BEM](http://www.smashingmagazine.com/2012/04/16/a-new-front-end-methodology-bem/)
- [An Introduction to the BEM Methodology](http://webdesign.tutsplus.com/articles/an-introduction-to-the-bem-methodology--cms-19403)


### Sémantique

On est tous d'accord, faire de la sémantique oui, quand cela ne va pas à l'encontre de la maintenabilité et de la réutilisation de code.

Pour ma part, trop de fois je me suis pris la tête sur la sémantique au point de faire des classes uniques qui ont du sens mais qui `@extend` (voir pré-processeurs) une classe générique.


### Accessibilité

Pour être franc, l'accessibilité a un coût en terme de temps qui n'est jamais négligeable et rentre souvent en conflit avec l'UX d'une personne sans handicap.

Typiquement, imaginons que nous avons un formulaire bancaire, comment faire un boucle uniquement sur ce formulaire (pratique dans le cas d'une personne sans handicap) tout en ne contraignant pas la navigation "classique" ?

Le constat est là aussi, nous sommes tous ici sensibilisés par l'accessibilité, nous essayons d'en faire le plus possible (souvent sur notre temps libre ou entre deux tâches) mais personne n'administre du temps à cela.

Une éventuelle solution a émmergé durant les discussions : pourquoi ne pourrait-on pas connaître d'emblée la situation de l'utilisateur lorsqu'il arrive sur le site ?

Un navigateur dédié à certains handicaps devrait être détectable d'entée de jeu et que l'on puisse nous développeurs faire en conséquence dans ce cas-là.

C'est exactement comme l'histoire de résolution / bande passante. Le W3C nous propose à l'heure actuelle de détecter la résolution pour faire en conséquence sur notre site, or, ce n'est pas du tout le pivot intéressant, c'est surtout la bande passante qui nous permet d'ajuster notre site web.

Bref, comme souvent, le W3C est à la rue, n'avance pas comme le web avance (vite, très vite) et les outils nous font défaut à l'heure actuelle pour répondre à certains besoins. (Note : je ne dis pas qu'ils ne font pas un bon boulot ou que ce n'est pas compliqué, je dis simplement qu'il y a un grand écart entre les besoins et les solutions à l'heure actuelle sur plusieurs domaines : l'accessibilité, la video, la capacité de fournir un site en fonction de la bande passante plutôt que la résolution, etc, etc).

### Les pièges de l'intégration (e.g. display: inline-block)

Certains cas de l'intégration restent encore du domaine hack plutôt qu'une solution propre et fiable. On ne dit pas que ces hacks sont difficiles ou laborieux mais qu'ils sont encore nécessaires sur des propriétés CSS très communes en 2014.

L'inline-block par exemple, il n'y a malheureusement pas le choix de soit coller les balises, soit minifier le html (ou la partie ayant des inline-block), soit de mettre des commentaires.

Les layouts seront toujours aussi pénibles tant que les flexbox ne sont pas supportés par la majorité des navigateurs du marché. Les 3 solutions principales pour le moment : float, inline-block, table(-cell).

En ce qui concerne le box-sizing, il sauve beaucoup d'intégration. Il faut juste voir le support des navigateurs que vous supportez.
Oh et attention, tous les navigateurs ne font pas 16px de base. Je dis ça si vous utilisez les `(r)em` (qui sont expliqués juste après).

Enfin, `<input type="number">` est tout buggé sous Firefox. Par exemple, mettre min="1900" sur cet input et que vous cliquez sur le "+", vous commencerez à "1" et non "1900"... Je sens que je vais devoir encore faire un ticket. :')

### Unités px, rem, em, pt, %

Pour être clair, personne n'utilise des `pt`, les `px`, faut les oublier de plus en plus, et `rem` est sûrement le plus simple et le mieux mais dépend malheureusement de vos supports navigateurs où dans quels cas il faut souvent se rabattre sur les `em`. Le pourcentage est forcément préconisé.

### CSS Frameworks ? Lesquels ? Pourquoi ? Quand ?

[Foundation](http://foundation.zurb.com/), [Bootstrap](http://getbootstrap.com/), [pure](http://purecss.io/) sont les plus connus (et peut-être les pires). Il ne vous serviront uniquement que dans le cas d'une [PoC](http://fr.wikipedia.org/wiki/Preuve_de_concept) ou une administration de site (_back-office_).

Par contre, [topcoat](http://topcoat.io/) peut se révéler assez intéressant de par sa haute personnalisation et de son _BEM-way_. Éventuellement [inuit.css](http://inuitcss.com/) sinon.


### Bonus

Lors de cas de contenus affichés via de l'ajax, pensez de plus en plus à faire du "prerender", c'est à dire que pendant que le contenu se charge, au lieu de mettre des _spinners_, _loaders_, _toussa_, essayez de mettre des visuels qui ressembleront à l'élément final. C'est ce que fait par exemple facebook, et c'est pas mal du tout. Tenez :

<figure>
  ![facebook prerender](prerender.jpg)
  <figcaption>Image d'aperçu des posts sur Facebook</figcaption>
</figure>

Voilà pour cette table ronde, j'espère que le compte rendu vous a plu. Il est évident que c'est sûrement plus intéressant en direct, on essayera peut-être par la suite de faire du streaming (live) ou du podcast, à voir.

N'hésitez pas à continuer le débat dans les commentaires.

Pour ma part, j'ai déjà d'autres articles "dans le pipe" (comme disent certains marketeux). Je vous retrouve bientôt ici ou sur Twitter, kiss.
