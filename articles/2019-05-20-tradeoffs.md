---
date: 2019-05-20
title: Tradeoffs
author: bloodyowl
slug: tradeoffs
---

Notre métier implique d'arbitrer ce qu'on appelle des tradeoffs. Il s'agit de définir les points positifs et négatifs d'une solution et d'en estimer la balance. Et on choisit la solution correspondant le mieux (du moins à nos yeux) à nos besoins de cette façon.

Il existe cependant dans notre industrie un système de dogme. On ne cherche alors plus à mettre en perspective des tradeoffs et à les comparer, mais à faire se battre des "écoles de pensées", chacune ayant développé des axiomes (principe non démontré mais utilisé comme base d'un raisonnement).

Suite à un énième débat sur les technologies modernes utilisées en front-end, réfutées par les défenseurs de certains de ces axiomes, je vais tenter de rationaliser notre approche et d'expliquer ses tradeoffs.

L'idée est ici de faire **comprendre** pourquoi on utilise ces approches et technologies, **dans quel contexte**, et non de les imposer à qui que ce soit. Avec un peu de chance, cet article fera passer certains discours de "nimportawak (sic)" à "ce n'est pas pour ma typologie de projet".

Au départ, le web est conçu comme **un ensemble de documents**, chaque page en est un. À chaque navigation, on déclenche **un nouveau cycle de vie** de page: on termine la page courante, et on initialise la suivante.

Ce modèle est très simple et permet une expérience très correcte pour des pages majoritairement statiques.

On a une page servie en HTML, une feuille de style servie en CSS. Et _that's it_. On apprend qu'il faut bien les séparer (au nom du principe de _separation of concerns_, au cas où il y'en ait un qui foire, une expérience dégradée doit-être proposée.

Avec les années, les exigences des utilisateurs sont devenus plus hautes: il a fallu y répondre par des pages **plus interactives** et des techniques de **rechargements partiel** de page (le cycle de vie d'une page étant plutôt coûteux). On a donc commencé à ajouter une intelligence limitée avec un peu de JS, notamment quelques briques interactives, charger des bouts de page avec AJAX.

Ces techniques ont permis de drastiquement **améliorer l'expérience de navigation** des utilisateurs : on a moins de données à charger, on affiche ce que les gens veulent voir plus vite (ce serait quand même un poil relou de charger une nouvelle page dès que vous zoomez sur Google Maps). Et c'est ici **le premier tradeoff**:

- on charge plus de données au chargement initial de page (le JS)
- **mais** cela nous permet de charger moins de données aux chargements successifs

Puis arrive la multiplication des plateformes mobiles. Pour toucher les utilisateurs, le web n'est plus **LA** plateforme, mais **UNE** plateforme parmi d'autres. Il devient alors stratégiquement intéressant pour les entreprises de commencer à développer des socles communs sous la forme d'**APIs auxquelles de multiples clients sous différentes plateformes souscriront**.

À cette époque, le front-end connait une mutation sans précédent: on commence à créer de **véritables applications**, et plus des documents auxquels on greffe hasardeusement quelques fonctionnalités. On se dote alors d'outillages plus avancés, issus de patterns déjà éprouvés dans d'autres domaines du software (comme le MVC). L'ère du fichier JS fourre tout qui initialise 3 plugins jQuery pour faire des carousels est révolue.

On commence alors à réfléchir en termes de **vues**. On gagne également une certaine indépendance vis à vis du back-end, on peut générer notre interface directement depuis le JS.

On n'a plus à nécessairement apprendre le fonctionnement de stack back-end, son organisation, son langage de templating: on devient maîtres de nos stacks.

On s'approprie de nouvelles problématiques comme le routage, le data-fetching et la création de caches clients intelligents. Des frameworks proposant des solutions à celles-ci émergent alors (Angular, Ember et Backbone pour ne citer qu'eux).

Puis débarque React avec une approche unique face à ses concurrents: les composants. On en crée un pour chaque bloc réutilisable de l'application.

Un composant, c'est une boite noire qui prend des paramètres (`props`), peut avoir un état local (`state`) et qui va décrire l'interface à n'importe quel point dans le temps.

React arrive également avec JSX, une extension de JS, qui permet de décrire son interface sous une forme ressemblant à HTML (du XML), mais s'affranchissant de ses limitations (comme la nécessité de serialiser les attributs). Tout en conservant la familiarité d'HTML (et la pertinence d'une telle syntaxe pour représenter un arbre d'éléments) JSX répond à une frustration grandissante face aux templates "logic-less" qui forçaient la création de helpers et la transformation de donnée en amont.

En nous abstrayant complètement du DOM et en nous offrant un modèle conceptuel simple (`(props, state) => UI`), React permet de créer des interfaces plus riches, plus simplement et surtout d'une manière maintenable : le comportement d'un composant étant couplé à son markup, on n'a plus à naviguer entre une fichier HTML et un JS pour les synchroniser. L'isolation des composants permet d'éviter les effets de bords indésirables.

HTML et JS sont donc colocalisés, leur édition est mise en commun. Et surprise, on s'est rendu compte que c'était une façon de faire plus productive, et qu'on avait moins tendance à laisser pourrir du vieux code dans son coin.

Ce problème subsiste avec CSS : il est toujours possible d'écrire du code CSS ayant un **impact non désiré sur un composant autre que celui que l'on visait**. On constate des guerres de spécificités, des régressions visuelles, et un manque de visibilité sur l'impact d'un changement: si vous héritez de code avec lequel vous n'êtes pas ou plus familier, le **risque de casser quelque chose** est grand.

Les techniques d'**isolation** "manuelles" telles que BEM prennent de la popularité. On évite alors les sélecteurs ésotériques, et on fait au plus simple, avec une méthodologie de découpage faite en parallèle de nos composants (les classNames de mon composant `Button` vont être préfixées par `Button`), plus maintenable. Étant à la discrétion des devs, cette méthodologie reste sujette à l'erreur, il faut vérifier que l'on n'utilise et ne casse pas pas un namespace existant.

Puis arrivent les solutions automatisant cette isolation, délégant la tâche à la machine plutôt qu'à l'humain: CSS modules et CSS-in-JS. Avec ces techniques, **une erreur ne peut plus dépasser le scope de son composant**. Le CSS non utilisé sur une route donnée n'est jamais injecté: le CSS mort est éliminé par défaut (un problème virtuellement impossible, et pour le moins non automatisable, avec une feuille de style traditionnelle).

CSS-in-JS **ramène le style au sein du composant**, dans son scope. Notre composant contient désormais son markup, son style et son comportement.

Il a été dit que cette approche rompt la _separation of concerns_, mais cette vision part du postulat que l'on doit impérativement coder des documents, oublier l'approche composant. Un postulat qu'on a oublié de réévaluer avec la perspective du développement tel qu'il est fait. **Dans un contexte applicatif,** séparer markup, style et comportement revient à s'imposer une séparation technologique non nécessaire, et pouvant au nom d'une "bonne pratique" impacter négativement l'expérience des devs et des users.

Il n'existe plus de raison autre que la "nostalgie du bon vieux temps" de le faire, il s'agit de reflexes acquis à l'époque mais jamais remis en perspective. Demandez à quelqu'un pourquoi c'est mal, il vous répondra "SEPARATION OF CONCERNS !". Demandez-lui pourquoi, il y a peu de chances qu'il vous sorte quoique ce soit de tangible.

L'approche CSS-in-JS ne pose pas de problème lorsque l'application est entièrement gérée côté client, mais peut-être embêtante pour des applications rendues côté serveur: le CSS sera absent de la page HTML chargée initialement et vous aurez un FOUC (Flash Of Unstyled Content). Heureusement, la grande majorité des solutions de CSS-in-JS proposent l'extraction des styles lors du rendu serveur. Il extrait les styles critiques de la page et les accole au rendu de l'application généré. Vous chargez moins de CSS, et l'application côté client prendra le relai pour charger et injecter les règles au besoin.

Chaque solution possède ses tradeoffs. Prenons pour exemples les temps de chargement des différentes approches, et notons les avec des lettres de A à F (A étant le plus rapide, F le moins):

- **approche traditionnelle**
  - **premier chargement**: C (on doit charger le fichier CSS pour la première fois avant rendu) 
  - **navigation directe**: B (on ne peut pas contrôler la performance perçue de la transition, mais le fichier de style est en cache)
  - **chargement ultérieur**: B (le fichier CSS est en cache)
- **approche React sans SSR**:
  - **premier chargement**: D (le HTML est "vide" mais on doit charger le JS, on doit charger le fichier CSS)
  - **navigation directe**: A (la transition est contrôlée et nécessite peu d'effort)
  - **chargement ultérieur**: C (les fichiers CSS et JS sont en cache)
- **approche React avec SSR**:
  - **premier chargement**: C (on doit charger le fichier CSS pour la première fois avant rendu)
  - **navigation directe**: A (la transition est contrôlée et nécessite peu d'effort)
  - **chargement ultérieur**: C (les fichiers CSS et JS sont en cache)
- **approche React avec SSR et CSS-in-JS**:
  - **premier chargement**: B (la page est 100% disponible et visible dès la fin d'une seule requête pour le HTML)
  - **navigation directe**: A (la transition est contrôlée et nécessite peu d'effort)
  - **chargement ultérieur**: B (la page est 100% disponible, les fichiers CSS et JS sont en cache)
- **approche React avec SSR et CSS-in-JS et service worker**:
  - **premier chargement**: B (la page est 100% disponible et visible dès la fin d'une seule requête pour le HTML)
  - **navigation directe**: A (la transition est contrôlée et nécessite peu d'effort)
  - **chargement ultérieur**: A (la page peut proposer un contenu immédiatement sans network, et peut proposer une expérience de chargement le cas échéant)

Chacune de ses solution peut correspondre à vos besoins. Un document privilégiera le chargement initial et une application les navigations en son sein. Rien n'est parfait, il s'agit (et s'agira encore probablement pour longtemps) de décider du tradeoff que vous êtes prêt à faire.

On écrit aujourd'hui des applications avec une technologie en pleine évolution, initialement prévue uniquement pour faire des documents.

On se heurte au conservatisme de certains que refusent de voir le modèle "détourné" d'une utilisation telle qu'elle a été prévue il y a 20 ans. Mais il faut leu rappeler qu'on veut faire des applications utiles à nos utilisateurs, plus légères, plus rapides, qui dépassent le cadre prévu initialement par une approche document, et qu'on veut pouvoir les faire **maintenant**, parce que nos users n'ont pas grand chose à carrer du fait qu'une fonctionnalité doive exister dans les standards pour que les devs puissent l'utiliser. Si Dulux Valentine ne vendait que des couleurs primaires, ça vous viendrait à l'idée d'aller gueuler sur les gens qui font leur mur en vert en mélangeant du jaune et du bleu ?

Alors on expérimente, on détourne des usages, on crée des choses, on tire profit d'APIs pas prévues pour ça à la base, et on délivre des applications capables de choses qu'on n'imaginait pas possible sur le web il y a quelques années. Grâce à toutes ces approches, et en s'enlevant le poids de règles obsolètes, on le fait plus vite, on le fait mieux, on le fait plus proprement.

Et vous savez quoi ? Ça ne casse pas le web. Ça ne casse pas vos pages. Ça n'est pas moins accessible. Ça ne fait qu'utiliser les ~~outils~~ standards web qu'on a disposition pour faire plus. Et ça permet en plus de guider le W3C en leur montrant que certaines solutions sont utilisées pour résoudre certaines problématiques qui ne sont pas directement adressées par les standards.

Vous n'avez personnellement pas besoin de ces approches ? Le jour où ces besoins émergent, vous saurez qu'elles existent, il suffit de comprendre **pourquoi** elles sont mises en place, quelles problématiques elles adressent, **quels sont leur tradeoffs**. Vous pourrez toujours ne pas les apprécier, mais au moins vous les aurez comprises, et elles constitueront une alternative supplémentaire pour le jour fatidique. Quand on a suffisamment de cordes à son arc, on peut jouer de la harpe.

Bisous.
