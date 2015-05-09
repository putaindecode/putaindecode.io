---
date: "2014-05-15"
title: "Se mettre au frontend en 2014, par où commencer ?"
tags:
  - frontend
  - css
  - javascript
  - worflow
  - interview
authors:
  - kud
---

Un de nos lecteurs nous a récemment envoyé un email avec tout un tas de questions; nous avons apprécié le geste et plutôt qu'uniquement lui répondre, nous souhaitions en faire profiter tout le monde.

---

> Salut _Putain de code !_,

Salut :)

> Je viens d’être embauché en tant que Product Designer et il est prévu que je fasse du front. Malheureusement, pour diverses raisons, je n’ai plus pratiqué ce métier depuis au moins 1 an. Je continue bien sûr de suivre ce qui se fait mais j’ai comme la sensation de me sentir un peu largué alors que c’était un sujet sur lequel je me sentais vraiment bien. On a un produit SaaS qui tourne sur Rails & Angular, qui demande beaucoup de maintenabilité et une bonne optimisation. Là où j'interviens, c'est sur la définition et la création de la V2. Seulement avant de m’engager sur des sujets que je ne maîtrise plus, je souhaiterais avoir un peu plus d’informations.

Yes, pas de problème, dis-nous tout.

> Au niveau de mes besoins, il me faudrait, je pense, une solution fiable avec une première base de modules prédéfinis (même une version light) pour une question de rendement et d’optimisation du dev. Mon premier avis serait d’utiliser un Bootstrap avec Sass grâce à tout son système de modals / tableaux / tabs / grid / etc… seulement j’ai lu le contraire donc je me retrouve perdu.  Dans vos articles {P!}, vous dîtes qu’il vaut mieux éviter des Frameworks du type Bootstrap, mais… pourquoi ?

Les frameworks comme Bootstrap ne sont pas forcément une mauvaise chose, ils te permettent de mettre les bases d’un site, très pratique pour aller vite et surtout faire des administrations. En revanche ils proposent des structures avec des conventions CSS n’aidant pas forcément à finir avec un front-end maintenable. De plus, cela force à _override_ tout l’aspect visuel dès que ton design est personnalisé. Finalement, tu passes plus de temps à _overrider_ un framework qui ne te convient pas tant que ça que de te créer ton propre ui kit. (sans compter le risque de voir ton site péter lors d’une mise à jour d’un framework).

> Avec une charte un peu custom, n’est-il pas préférable de se baser sur des composants pré-existants pour faciliter la charge et le temps passé à dev ? Il est peut-être possible d’en récupérer des similaires de façon individuelle autre part ?

Si, effectivement, des solutions comme [topcoat](http://topcoat.io/) sont moins _opinionated_ par exemple et permettent vraiment de personnaliser tous les éléments proposés par défaut.
Il faut vraiment trouver un framework qui fait que le strict nécessaire sans design finalement.

> Et les préprocesseurs (Sass surtout) c’est vraiment une bonne idée sur ce type de projet ou tu vois des contre-indications ?

Les préprocesseurs CSS sont généralement une bonne chose, ils apportent de nombreuses options intéressants telles que les variables, les fonctions, là où le w3c met un certain temps à les sortir. Cependant, tous les préprocesseurs ne se ressemblent pas. Certains ont leur propre écriture comme Stylus ou Sass (Sass, pas scss). Certains sont aussi plus lents à compiler que d’autres (coucou Sass). Nous préconisons un pseudo “post-processor” qui s’appelle [Rework](https://github.com/reworkcss/rework). Avec rework, tu ajoutes juste les processing dont tu as besoin, et tout ça, généralement, sans casser le style d'écriture d’un fichier css (article à prevoir).


> Quant à mon workflow, j’aimerais tout reprendre depuis le début pour repartir sur des bases saines. Tu pourrais m’indiquer les indispensables sur Sublime Text (Config, Plugins) et autres outils ?


Orf, ca dépend de chacun mais en général, voici ce qu’on te préconise :
- Editeur : [Sublime text](http://www.sublimetext.com/) (avec BracketHighlighter, Color Highlighter, DocBlockr, EditorConfig, Emmet, Emmet CSS, HTML5, INI, JavaScript Console, JsFormat, Markdown Preview, MarkdownEditing, Modific, Placeholders, Theme - Flatland, Unicode Character Highlighter)
ou [Atom](http://atom.io) (apm install, editorconfig, docblockr, htmlhint, csslint, linter, linter-jscs, linter-jshint, css-color-highlighting, atom-prettify, open-in-github-app, gist-it, autocomplete-plus).  
Pour être à jour sur ces éditeurs, n’hésite pas à Suivre [@SublimePackages](https://twitter.com/SublimePackages) et [@Atom_Packages](https://twitter.com/Atom_Packages) sur Twitter.
- Terminal : [iterm2](http://www.iterm2.com/) sur mac, ou terminal de base
- Shell : zsh (`brew install zsh`), [prezto (plugin zsh)](https://github.com/sorin-ionescu/prezto)
- [Firefox Nightly](http://nightly.mozilla.org/) ou [Chrome Canary](http://www.google.com/intl/fr/chrome/browser/canary.html)

> Je vois souvent passer du NPM / Grunt / Bower / Yo & Co mais jamais vraiment eu le temps de m’y plonger dedans. Il est possible d’avoir un petit résumé et/ou un moyen d’apprendre le plus vite possible ?

Tout d’abord lis ceci : [Automatisez votre workflow front-end](http://www.24joursdeweb.fr/2013/automatisez-votre-workflow-front-end/).

Pour le reste :

- [NPM](https://www.npmjs.org/) : permet de gérer les versions de ce que tu utilises à la fois comme bibliothèque front ou outils de dev. Il sert aussi d’interface de ligne de commande permettant de [lancer des commandes définies dans le package.json](/posts/frontend/npm-comme-package-manager-pour-le-front-end/).

- [Bower](http://bower.io/) ne sert pas à grand chose, c’est une abstraction par dessus NPM. Nous pensons qu’il tend à mourir. [[1](/posts/frontend/npm-comme-package-manager-pour-le-front-end/)] [[2](/posts/nodejs/napa-ou-comment-telecharger-package-napa-package-json/)]

- [Grunt](http://gruntjs.com/) est un _task-runner_, il te permet d’automatiser les actions que tu répètes souvent : concaténer des scripts, preprocessing HTML & CSS, copie des assets… Nous te conseillons d’utiliser gulp, beaucoup plus rapide et simple à prendre en main. [[1](/posts/js/introduction-gulp/)] [[2](/posts/js/premiers-pas-avec-grunt/)]

> Merci beaucoup !

Tout le plaisir est pour nous. ;)
