---
date: "2014-12-15"
title: "JavaScript modulaire pour le front-end : les bases"
tags:
  - javascript
  - amd
  - commonjs
  - browserify
  - npm
  - requirejs
  - bower
authors:
  - syvuilliot
---

Quand on réalise des applications en JS pour les navigateurs web, on ne peut plus se contenter de mettre des tags `script` dans le bon ordre pour charger les bibliothèques tierces que l'on utilise comme pour un site web. C'est pourquoi il existe des outils pour permettre d'écrire du JavaScript modulaire et réutiliser plus facilement les innombrables bibliothèques publiées par la communauté JS.

Cependant, ce principe d'écriture modulaire et de publication de code n'étant pas intégré dans le langage lui-même, de très nombreuses solutions existent plus ou moins compatibles les unes avec les autres et aboutissant à une forte fragmentation de la communauté.
Donc quand on décide de se mettre au JavaScript modulaire, on trouve tout un tas d'articles (en anglais) parfois trop vieux ("une étape de build n'est pas adaptée au navigateur"), parfois trop subjectifs ("J'aime pas la syntaxe AMD"), parfois confus ("utiliser les modules pour de l'injection de dépendances"), parfois simplistes ("AMD vs CommonJS").

C'est pourquoi j'ai voulu partager mon expérience, en essayant d'abord de reposer les bases du problème, puis en vous faisant part de ce que j'estime être la solution la plus satisfaisante actuellement.

D'abord, il faut faire la distinction entre 3 aspects du problème :

* le format d'écriture des modules ("module authoring format")
* le système de gestion des packages ("package management")
* la convention de résolution des dépendances de module



# Format d'écriture des modules

Le module est la brique de base pour décomposer un gros fichier JS en plusieurs fichiers plus petits et focalisés sur une fonctionnalité précise. La plupart du temps un module est un fichier JS qui fournit une fonction, un constructeur ou un objet de valeur. Et comme, pour fournir cette fonctionnalité, un module peut avoir besoin d'autres modules, il existe un mécanisme pour déclarer ses dépendances.

Actuellement, 2 standards principaux existent pour écrire ces modules : **AMD** et **CommonJS**.
Il est également possible d'utiliser la [syntaxe retenue par ES6](http://www.2ality.com/2014/09/es6-modules-final.html) (qui j'espère va enfin devenir le standard unique) mais pour l'instant, ça demande encore une étape de "transpilation" en AMD ou CJS.

Le format AMD (dans sa forme la plus courante) est :
```js
define(['moduleA', 'moduleB'], function(a, b) {
  // j'utilise a et b
  return maFonctionTresUtile;
});
```

Le format CommonJS (dans sa forme la plus courante) est :
```js
var a = require('moduleA');
var b = require('moduleB');
// j'utilise a et b
module.exports = maFonctionTresUtile;
```

Ca n'est pas très différent dans l'esprit : tous les 2 permettent de décrire des dépendances et d'exporter une valeur.
La différence principale réside dans le fait que :

* CommonJS prévoit une évaluation en une passe dans laquelle il faut résoudre les dépendances au fur et à mesure
* alors que AMD prévoit une évaluation en 2 passes :
  * une première pour récupérer uniquement la liste des dépendances
  * et une seconde où on exécute le callback (le corps du module) avec les dépendances résolues.
C'est pourquoi on parle de format "synchrone" dans le premier cas et "asynchrone" dans le second car on peut résoudre les dépendances de façon asynchrone en AMD.


Dans les 2 cas, par contre, il y a besoin d'une *résolution des dépendances*, c'est à dire qu'un module ne peut pas être exécuté tel quel dans un navigateur en le chargeant via un tag `script`. Non, il faut un *loader*, c'est à dire un outil qui va charger le module qu'on lui demande et va résoudre les dépendances en cascade. Mais contrairement à ce que l'on pourrait croire, les règles de résolution des dépendances n'ont rien à voir avec le format du module (on verra ça plus tard).


# Package management

Parlons maintenant des packages. En effet, pouvoir découper du code en modules, c'est bien ; mais ce qui est encore mieux c'est de pouvoir le partager avec d'autres pour qu'il soit facilement réutilisable et arrêter le syndrôme de :

> "je recode un event emitter dans ma bibliothèque comme ça je n'ai pas de
> dépendance et c'est plus facile à consommer par mes utilisateurs"

 C'est le problème n°1 des bibliothèques front qui présentent souvent comme un argument de ne pas avoir de dépendances. Sauf que, si on y réfléchit, ça veut dire que : soit c'est une bibliothèque très bas niveau, soit le mec a recodé des trucs qui existent déjà au lieu de s'occuper de son sujet principal.

C'est là qu'entre en jeu la notion de *package* (que je ne traduirai pas en français, car ça ne servirait qu'à apporter de la confusion). Un package est un ensemble de fichiers (pas forcément des fichiers JS d'ailleurs) avec des métadonnées associées pour décrire principalement :

* où est stocké le package,
* qui est l'auteur,
* quelle est la licence,
* quelle est la version,
* et ... quelles sont les dépendances et leurs versions !

Ici les dépendances sont des dépendances entre packages, [ce qui n'a rien à voir avec les dépendances entre modules](http://fr.slideshare.net/domenicdenicola/client-side-packages).

Pour faciliter l'utilisation des packages, on utilise un *package manager*, dont le rôle principal est, à partir d'un id de module (et éventuellement d'un numéro de version), de trouver l'adresse où se trouve les fichiers, les télécharger et les installer localement... et ceci de façon récursive pour les dépendances, ce qui est le gros avantage par rapport à le faire à la mano. Mais sinon, ça n'est pas plus compliqué que ça dans le principe, et ça reste valable pour des fichiers JS ou non, front-end ou non.


Les principaux package managers pour le front-end sont [npm](https://www.npmjs.com/) et [bower](http://bower.io).
La grande différence entre les deux est que **npm installe les dépendances de façon relative** : pour chaque package, les dépendances sont installées dans un sous-dossier (node_modules).

 - mon-projet-avec-nmp
   - app.js
   - node_modules
     - une-dependance
       - main.js
       - nodes_modules
         - une-dependance-indirecte
           - main.js
     - une-autre-dependance
       - main.js

Alors que **bower prend le parti d'installer les dépendances à plat** : le package et ses dépendances et les dépendances des dépendances sont toutes installées au même niveau dans le même dossier.

 - mon-projet-avec-bower
   - app.js
   - bower_components
     - une-dependance
       - main.js
     - une-autre-dependance
       - main.js
     - une-dependance-indirecte
       - main.js

L'approche bower semble être une bonne idée car si 2 packages ont la même dépendance (ou des dépendances compatibles semver), une seule est installée. Alors qu'avec npm chaque package installe sa propre dépendance.

Cependant, s'il y a une incompatibilité de versions :

> le package A déclare une dépendance sur X en version 1
> le package B déclare une dépendance sur X mais en version 2

Avec bower, on est coincé : on ne peut installer qu'une seule version. Lors du `bower install`, il faudra choisir quelle version on garde : soit A devra utiliser X2, soit B devra utiliser X1.

 - mon-app-avec-bower
   - bower_components
     - package-A
     - package-B
     - package-X
       - main.js // v1 ou v2 mais pas les 2

Bower appelle cela de la *résolution de conflits*. Mais concrêtement, cela veut dire qu'on force une dépendance qui n'est pas supportée officiellement par le package en question. Donc on se retrouve responsable de vérifier que le package B fonctionne correctement avec X1. Pas cool :-(

Alors qu'avec npm les versions des dépendances sont respectées, il n'y a pas de question à se poser.

 - mon-app-avec-npm
   - node_modules
     - package-A
       - node_modules
         - package-X
           - main.js // v1
     - package-B
       - node_modules
         - package-X
           - main.js // v2


# Résolution des dépendances de module

La question est alors :

> "Pourquoi existe-t-il des package managers spécifiquement pour le web front-end ?"

Réponse :

>  "Pour faciliter l'utilisation de modules publiés dans des packages dans le contexte du front-end"

Super ! Mais concrêtement ?

Et bien, venons en au coeur du problème : *la résolution des module-id en fichier*. Comme on l'a vu, pour charger un module dans le navigateur, il faut utiliser un loader. Et une de ses tâches est de *résoudre* les `module_id` en adresse de fichier.

Au pire il faudrait explicitement dire au loader pour chaque `module_id` où est le fichier correspondant. Heureusement, ce n'est pas le cas, ni avec requireJS, ni avec les loaders compatibles npm.

## AMD ##
RequireJS et les autres loaders AMD vont assez loin en  matière de [configuration](http://requirejs.org/docs/api.html#config) mais souvent , ça revient à décrire des règles du style *tous les modules id qui commencent par `mon-package` sont à chercher dans le dossier `./mon-package`*.

En fait, ça n'est pas tout à fait vrai qu'il faille systématiquement configurer les règles de résolution avec RequireJS : il y a une règle par défaut qui stipule que les module_id sont résolus par rapport à une "baseURL" (qui par défaut est celle du fichier html). Donc si on installe tous les packages au même niveau, ça marche par défaut.
C'est pour cela que bower est souvent utilisé pour les packages front-end en AMD car il installe les fichiers à plat et de cette façon on limite le besoin de configuration.

## NPM ##
A l'opposé de cette approche très flexible, il y a nodeJS avec une [convention simple et statique](https://github.com/substack/browserify-handbook#how-node_modules-works), qui dit en gros :

* si c'est une référence relative, il suffit de suivre le chemin
* si c'est une référence absolue, il faut chercher dans le dossier `node_modules` et ceci de façon récursive jusqu'à arriver à la racine

Et donc zéro config, puisque ça n'est pas configurable. Ca peut paraître être une limitation mais c'est une force.



# Conclusion

Si tous les packages en AMD utilisaient la règle de résolution par défaut et que l'on utilisait bower pour les installer, on n'aurait rien à configurer. Mais dans la pratique, ça n'est pas le cas et on se retrouve à devoir configurer les règles de résolution non seulement pour ses propres dépendances (*pourquoi pas*) mais également pour les dépendances de ses dépendances (*et là ça ne va plus*).
Et il reste toujours le problème des conflits de version liés à l'approche de mettre les dépendances à plat.


D'un autre côté, il y a la convention nodeJS qui impose des règles simples, non modifiables et qui n'a pas de problème de conflit de versions. C'est à dire qu'il suffit de faire `npm install mon-package` et ça marche. Une convention qui fait l'unanimité pour le backend JS.

Côté front, on lui reproche de charger les dépendances sans les dédoublonner et de le faire en synchrone, ce qui n'est pas adapté quand le chargement des fichiers se fait via un réseau en http et pas directement depuis un disque local comme sur un serveur.

C'est pourquoi a été inventé [browserify](http://http://browserify.org/) qui apporte actuellement [le meilleur des 2 mondes](http://putaindecode.fr/posts/js/browserify-all-the-things/) : toujours zéro config selon la convention nodeJS et un système de bundle/build (via une analyse syntaxique du code JS pour détecter les dépendances) afin d'assembler tous les modules en un seul fichier adapté au navigateur.
On peut lui reprocher la nécessité d'une étape de build et le fait que le code source en débug est en un seul fichier mais :

 1. de toute façon pour la prod, il y aura une étape de build et en dév, avec un outillage adapté (par exemple `watchify` qui rebuild en incrémental) ça n'est pas la mer à boire
 2. avec le support des sources-map dans les navigateurs, on peut maintenant retrouver en debug les mêmes noms de fichiers et les mêmes numéro de ligne que dans les fichiers d'origine et les points d'arrêt fonctionnent.

Au final, ça en devient même un avantage, car le code que l'on exécute en dev dans le navigateur est très proche de ce que l'on aura en prod, en tout cas plus proche qu'avec requireJS pour lequel on développe sans build et pour lequel il faut écrire à nouveau une config de build pour la mise en prod.



# Conclusion de la conclusion

Ma conclusion est que le point crucial pour faciliter la réutilisation de modules, c'est de **minimiser les contraintes sur les utilisateurs** et donc de se rapprocher d'un usage *plug and play*. Pour cela il faut une convention forte entre le package manager et le loader/builder de modules, afin d'éviter à l'utilisateur de devoir écrire des configs ... la plupart du temps.
Bien sûr, la recherche du "zéro config" n'est pas une fin et c'est particulièrement vrai côté front où les contraintes de chargement de fichiers sont fortes. Et si vous voulez diviser votre bundle en plusieurs fichiers ou si vous voulez des règles d'optimisation complexes pour votre build, il est normal de devoir mettre les mains dans le cambouis.
Mais si au moins le cas d'usage le plus fréquent (compiler son appli en un seul fichier qui sera chargé via un tag `script`) est simplifié au maximum, alors on pourra sûrement voir côté front, le même état d'esprit que côté back. Et je suis plutôt optimiste, [contrairement à certains](https://medium.com/@trek/last-week-i-had-a-small-meltdown-on-twitter-about-npms-future-plans-around-front-end-packaging-b424dd8d367a).

Utilisateur de la première heure d'`AMD` et de `Dojo loader`, puis de `bower`, je me suis rendu compte de leurs limites et surtout j'ai été régulièrement gêné par la complexité de la configuration... surtout lorsqu'il fallait passer au build. Cela freine la réutilisation de modules tiers et c'est dommage.
Ce n'est pas un problème intrinsèque au format de module et toutes les discussions sur "moi j'aime / j'aime pas la syntaxe AMD" sont secondaires (d'ailleurs [browserify peut fonctionner avec des bibliothèques en AMD](https://www.npmjs.com/package/deamdify)).
Mais dans la pratique, nous migrons vers la solution `npm + browserify` et c'est vraiment moins compliqué.

J'espère que cet article vous permettra d'y voir plus clair, de dépasser les querelles sur les préférences personnelles de chacun, et de vous aider à faire votre choix.
Je n'estime pas être un expert du sujet, il y a sûrement beaucoup de choses à compléter ou préciser, donc n'hésitez pas à réagir.

Pour aller plus loin et regarder vers le futur que nous amène ES6, il y a cet [excellent article](https://medium.com/@brianleroux/es6-modules-amd-and-commonjs-c1acefbe6fc0).
