---
date: "2015-05-21"
title: Qu'est-ce que l'intégration continue ?
tags:
  - ci
  - tests
authors:
  - MoOx
header:
  credit: https://www.flickr.com/photos/zunami/3780218641/
---

Certains risquent d'être déçus puisque nous ne parlerons pas ici des fameux `3x8`,
technique qui consiste à faire tourner 3 équipes d'intégrateurs HTML en
continu afin d'avoir du PSD > HTML 24h sur 24.

## Le principe de l'intégration continue

> L'intégration continue est un ensemble de pratiques utilisées en génie
logiciel consistant à vérifier à chaque modification de code source que le
résultat des modifications ne produit pas de régression dans l'application
développée.

<small>
[Source: Wikipédia](https://fr.wikipedia.org/wiki/Int%C3%A9gration_continue)
</small>

## Pré-requis pour mettre en place l'intégration continue

Avant de rentrer dans le vif du sujet, assurez-vous d'avoir déjà de bonne bases,
pour maintenir une base de code saine en
[versionnant avec git](/posts/git/versionner-avec-git/).
Nous sommes en 2015, l'année où l'on était censé avoir les voitures
volantes, nous n'allons donc pas expliquer ici à quoi sert de versionner du
code.

Du code versionné ne suffit pas, il faut avoir des tests automatisés bien
entendu.
[Front](/posts/js/introduction-au-testing-js-front/) et back, il en faut de tous
les côtés.

Ensuite, il nous faudra choisir un serveur qui va gérer l'intégration continue.
Il existe des services tels que:

- [Travis](http://travis-ci.org/)
- [CircleCI](https://circleci.com/)
- [Bamboo](https://www.atlassian.com/software/bamboo/)
- [Codeship](https://codeship.com/)
- [Jenkins](http://jenkins-ci.org/)

## L'intégration continue en pratique

Un fois qu'on a notre code testé et versionné et qu'on a configuré son serveur
de _CI_, chaque modification va déclencher des actions sur ce serveur, puis,
en fonction des résultats, va déclencher d'autres actions tout en vous notifiant
si besoin.

Un exemple classique serait le suivant : une fois les dernières modifications de
code poussées sur la branche principale sur votre dépôt de code, le serveur
d'intégration continue va jouer tous les tests et déployer le tout en production si
tout a marché sur des roulettes.

Si des problèmes surviennent, rien ne sera déployé et vous serez notifié sur
les services que vous avez configurés (email, IRC, webhook, etc).

Nous pouvons imaginer que votre serveur vienne vous insulter sur
votre logiciel de chat interne, en vous montrant du doigt.
On pourrait aussi imaginer une synthèse vocale crier votre nom et préciser à
toute l'équipe que
[vous avez merté](https://www.youtube.com/watch?v=mbDcnUH6rOc) :
_“MoOx, you just fucked up the build by breaking 42 tests!
Fix that please”_.
Pour finir dans les exemples farfelus, nous pourrions avoir une petite tourelle
type _Nerf_ qui vous met un petit headshot qui va bien.
Des équipes font vraiment ça, et vous vous en doutez, y'a de la grosse marrade au
programme.

L'idée est vraiment de pousser le plus souvent possible, les plus petites
modifications possibles avec la meilleure couverture de tests possible.
Ceci afin de minimiser les risques. De plus, cela aide à rester focalisé.

Tout ce processus (versionné aussi tant qu'à faire), qui permet de jouer tous
les tests **rapidement** (dans un environnement similaire à la production), doit
être transparent et accessible localement, afin que les développeurs aient une
bonne visibilité et une bonne compréhension du système en place.

## Faire des tests automatisés, c'est la vie

J'ai mis un titre pour ça car c'est important. Vraiment.
Tout développeur qui n'a pas encore écrit ses premiers tests a peur.
Puis avec le temps, il se dit que finalement, il ne fallait pas
avoir autant d'appréhension et qu'il était très con de ne pas avoir
testé automatiquement tout ses codes sources plus tôt.
À tel point qu'une
[DeLorean modifiée](http://the--kyza.deviantart.com/art/What-the-Flux-511691704)
pour se prévenir soi-même ne serait pas de refus.

Une fois la barrière franchie, on se dit vraiment qu'on était stupide de pas
avoir essayé avant.

## Une commande qui éxecute les tests

Un fois qu'on a écrit des tests, ou même souvent avant, on automatise
l'exécution des tests. En général c'est rapide, étant donné qu'une simple
commande ou un simple script suffit.
Beaucoup de _test runners_ existent et vous n'aurez aucune difficulté à en
trouver un en adéquation avec votre language favori.

Pour notre site, la commande est `npm test`. Simple, efficace.

Elle exécute tout ce qui est nécessaire à compiler notre application et à jouer
les tests tout en retournant un résultat lisible et un code d'erreur si besoin.

## Et après ?

Là, si vous avez déjà mis tout ça en place, le bonheur ultime du développeur
n'est pas loin : vous pouvez rapidement vérifier qu'il n'y a pas de régressions
et agir en conséquence.

Chez _Putain de code !_ (en date de cet article), notre couverture de
tests est loin d'être bonne. Mais ce site étant un petit plaisir un peu risqué,
nous faisons quand même du
[déploiement continu](/posts/ci/le-deploiement-continu), l'étape d'après !  
On aime bien l'idée du _[move fast & break ~~no~~thing
](http://zachholman.com/talk/move-fast-break-nothing)_.
