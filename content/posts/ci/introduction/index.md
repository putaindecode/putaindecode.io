---
date: "2015-05-26"
title: Qu'est ce que l'intégration continue ?
tags:
  - ci
  - tests
authors:
  - MoOx
---

Certains risque d'être déçu puisque nous ne parlerons pas ici des fameux  `3x8`,
technique qui consiste à faire tourner 3 équipes d'intégrateurs HTML en
continue afin d'avoir du PSD > HTML 24h sur 24.

## Le principe de l'intégration continue

Nous allons aborder un sujet qui permet d'avoir un site stable en production,
ceci de manière automatisé et continue.

Il faut comprendre par là sans passer par FTP avec Filezilla.
Pas de bouton "Upload" ou "Sync" après avoir fait une modifications de code.
Pas de risque de tout péter votre site si vos modifications rentre en conflit
avec les modifications de votre collègue, qui lui aussi vient de pousser un
bon gros patch bien sale.

> L'intégration continue est un ensemble de pratiques utilisées en génie
logiciel consistant à vérifier à chaque modification de code source que le
résultat des modifications ne produit pas de régression dans l'application
développée.

[Source: Wikipédia](https://fr.wikipedia.org/wiki/Int%C3%A9gration_continue)

Notez que dans cette définition il manque un point assez important :
le déploiement automatisé à la suite des vérifications.

## Pré-requis pour mettre en place l'intégration continue

Avant de rentrer dans le vif du sujet, assurez vous d'avoir déjà de bonne bases,
pour maintenir une base de code saine en
[versionnant avec git](/posts/git/versionner-avec-git/).
Nous sommes est en 2015, l'année où l'on était sensé avoir les voitures
volantes, nous n'allons donc pas expliquer ici à quoi sert de versionner du
code.

Du code versionné ne suffit pas, il faut avoir des tests automatisés bien
entendu.
[Front](/posts/js/introduction-au-testing-js-front/) et back, il en faut de tous
les côtés.

Ensuite il nous faudra choisir un serveur qui va gérer l'intégration continue.
Il existe des services tel que:

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

Un exemple classique serait le suivant: une fois les dernières modifications de
code poussé sur la branche principale sur votre dépôt de code, le serveur
d'intégration continue va jouer tous les tests et déployer cela en production si
tout a marché sur des roulettes.

Si des problèmes surviennent, rien ne sera déployé et vous serez notifié sur
les services que vous avez configurer (email, IRC, webhook etc).

Nous pouvons imaginez que votre serveur vienne vous insulter sur
votre logiciel de chat interne, en vous montrant du doigt.
On pourrait aussi imaginer une synthèse vocale crier votre nom et préciser à
toute l'équipe que
[vous avez merté](https://www.youtube.com/watch?v=mbDcnUH6rOc) :
_“MoOx, you just fucked up the build by breaking 42 tests !
Fix that please“_.
Pour finir dans les exemples farfelus, nous pourrions avoir une petite tourelle
type _Nerf_ vous fasse un petit headshot qui va bien.
Des équipes font vraiment ça, et vous vous en doutez, y'a de la grosse marade au
programme.

L'idée est vraiment de pousser le plus souvent possible, les plus petites
modifications possibles avec la meilleur couverture de tests possibles.
Ceci afin de minimiser les risques. De plus, cela aide à rester focalisé.

Tout ce processus (versionné aussi tant qu'à y être), qui permet de jouer tous
les tests **rapidement** (dans un environnement similaire à la production), doit
être transparent et accessible localement, afin que les développeurs aient une
bonne visibilité et une bonne compréhension du système en place.

## Faire des tests automatisés, c'est la vie

J'ai mis un titre pour ça car c'est important. Vraiment.
Tout développeur qui n'a pas écrit ses premiers tests à peur.
Puis avec le temps tout développeur se dit que finalement, il ne fallait pas
avoir autant d'appréhension et qu'il était très con de ne pas avoir
tester automatiquement tout ses codes sources plus tôt.
À tel point qu'une
[DeLorean modifiée](http://the--kyza.deviantart.com/art/What-the-Flux-511691704)
pour se prévenir soi-même ne serait pas de refus.

Une fois la barrière franchie, on se dit vraiment qu'on était stupide de pas
avoir essayer avant.

Même chez _Putain de code !_ (en date de cette article), notre couverture de
tests est loin d'être bonne. Mais ce site étant un petit plaisir un peu risqué,
nous faisons quand même du déploiement continue.
On aime bien l'idée du _[move fast & break nothing
](http://zachholman.com/talk/move-fast-break-nothing)_.

## Une commande qui éxecute les tests

Un fois qu'on a écrit des tests, ou même souvent avant, on automatise
l'éxecution des tests. En général c'est rapide, étant donnée qu'une simple
commande ou un simple script suffit.
Beaucoup de _test runners_ existent et vous n'aurez aucune difficulté à en
trouver en adéquation avec votre language utilisé.

Pour notre site, la command est `npm test`. Simple, efficace.

Elle éxecute tout ce qui est nécessaire à compiler notre application et à jouer
les tests tout en retourant un résultat lisible et un code d'erreur si besoin.

## Faire un script qui fait les choses qui vont bien quand les tests vont bien

Une fois qu'on a une commande qui peut jouer tous les tests et dire "y'a bon" ou
"tatoukasé", il nous faut prévoir les actions à faire quand nos tests sont ok.

Un déploiement FTP, un déploiement git, ou plus compliqué via CDN, peut importe.
**Il faut juste qu'une commande marche simplement.**

Pour notre site, la command est `npm run deploy` pousse le site généré sur la
branche `gh-pages`
(puisqu'on se sert [des pages GitHub](https://pages.github.com/)).

## Automatiser le script qui fait les choses qui vont bien quand les tests vont bien

On peut ensuite éventuellement englober les précentes étapes dans une seul
commande qui va se débrouiller s'il n'y a pas d'erreur. Mais bon si vous n'avez
que 2 commandes comme on vient de voir, un simple appel de cette façon devrait
faire l'affaire


```console
$ npm test && npm run deploy
```

Si `npm test` retourne une erreur, la 2e commande ne sera pas éxecuté.

## La suite au prochaine épisode

Là si vous avez déjà mis tout ça en place, le bonheur ultime du développeur
n'est pas loin: vous pouvez rapidement vérifier qu'il n'y à pas de régressions
et agir en conséquence.

La prochaine étape (dans un prochain article) sera de mettre ça en place sur un
serveur d'intégration continue, nous y étudirons simplement ce que nous avons
fait pour notre site.

Si vous êtes trop curieux, vous pouvez déjà [consulter le code source de notre
site](https://github.com/putaindecode/putaindecode.fr) et fouiller dans le
`package.json` (section `scripts`) pour deviner la suite...
