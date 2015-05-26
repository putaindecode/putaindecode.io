---
date: "2015-05-25"
title: Introduction au déploiement continu
tags:
  - ci
  - tests
authors:
  - MoOx
header:
  linearGradient: 160deg, rgb(204, 51, 51), rgba(204, 51, 51, .6)
  credit: https://www.flickr.com/photos/luciano_meirelles/3461046001/
---

# Déployer en continu ?

Il s'agit d'avoir un site stable en production, ceci de manière automatisée et
continue. Rien que ça.

Il faut comprendre par là sans passer par FTP avec Filezilla.
Pas de bouton "Upload" ou "Sync" après avoir fait une modification de code.
Pas de risque de péter tout votre site si vos modifications rentrent en conflit
avec les modifications de votre collègue, qui lui aussi vient de pousser un
bon gros patch bien sale.

La première conséquence est que les mises en
production ne sont plus stressantes, car très régulières.  
[Certaines personnes ne recommandent pas les mises en production tous les jours
](http://www.estcequonmetenprodaujourdhui.info/) mais lorsque vous avez mis en
place l'intégration continue, vous minimisez grandement les risques.

La preuve en est que certaines entreprises font des mises en productions plusieurs
centaines de fois par jour ! (GitHub est un bon exemple).

## Pré-requis au déploiement continu

Vous n'avez qu'une chose à faire avant de vous attaquer à la mise en place du
déploiement continu : vous devez déjà avoir
[l'intégration continue](/posts/ci/introduction/) en place.

Une fois vous êtes bon à ce niveau, vous pouvez passer à l'étape suivante.

## Faire un script qui fait les choses qui vont bien quand les tests vont bien

Une fois qu'on a une commande qui peut jouer tous les tests et dire "y'a bon" ou
"tatoukassé", il nous faut prévoir les actions à réaliser quand nos tests sont
OK.

Un déploiement FTP, un déploiement git, ou plus compliqué via CDN, peu importe.
**Il faut juste une commande qui marche simplement.**

Pour notre site, la commande est `npm run deploy`. Cette commande pousse le site
généré sur la branche `gh-pages`
(puisqu'on se sert [des pages GitHub](https://pages.github.com/)).

## Automatiser le script qui fait les choses qui vont bien quand les tests vont bien

On peut ensuite éventuellement englober les précédentes étapes dans une seule
commande qui va se débrouiller s'il n'y a pas d'erreur. Mais bon, si vous n'avez
que deux commandes (comme on a dans l'exemple de notre site), un simple appel de
cette façon devrait faire l'affaire :


```console
$ npm test && npm run deploy
```

Si `npm test` retourne une erreur, la deuxième commande ne sera pas exécutée.

## La suite au prochaine épisode

La prochaine étape (dans un prochain article) sera de mettre ça en place sur un
serveur d'intégration continue, nous y étudierons simplement ce que nous avons
fait pour notre site.

Si vous êtes trop curieux, vous pouvez déjà [consulter le code source de notre
site](https://github.com/putaindecode/putaindecode.fr) et fouiller dans le
`package.json` (section `scripts`) pour deviner la suite...
