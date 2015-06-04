---
date: "2015-06-09"
title: Les webhooks
tags:
  - git
  - webhooks
authors:
  - magsout
header:
  credit: https://www.flickr.com/photos/haru__q/14396323454/

---


Si vous utilisez GitHub pour héberger vos sources et que vous cherchez un moyen très simple (peut-être un peu trop) de mettre en place le déploiement continue _sans serveur d'intégration continue dédié_, alors les webhooks peuvent répondre parfaitement à votre besoin.

## Les quoi ?

Les webhooks permettent de lancer une action de façon automatique par l'intermédiaire d'un ou plusieurs événements depuis un dépôt [GitHub](GitHub.com). Concrètement il va être possible de déployer son projet sur un serveur de production, sauvegarder son site internet, ou même mettre à jour des stats des qu'un commit sera envoyé ou même une issue ouverte. Il est possible de faire tout ce qu'on veut dans la limite de son imagination comme l'explique Github.

## Comment ça marche ?

Le fonctionnement est on ne peut plus simple, un événement (merge, push, release etc..) va déclencher une requête HTTP POST vers l'url que vous avez configurée. Le reste de l'exécution, se fera sur le serveur où pointe l'url, libre à vous d'écrire le script que vous voulez pour effectuer les opérations que vous souhaitez.

Il faut cependant être contient que la simplification a un coût, à savoir que même si une PR, un commit venaient à rendre inopérant votre projet l'événement se lancerait quand même.

## La mise en place

Seul le propriétaire d'un dépôt dispose des droits nécessaires pour configurer un webhook. Il suffit pour cela de se rendre dans `Settings` puis `Webhooks & Services` :

![](setting_webhook.jpg)

Un petit clic sur `Add webhook` et vous obtenez une interface encore une fois très simple :

![](configuration_webhook.jpg)

Cette interface se compose de trois parties :

- 1) l'URL vers laquelle votre requête sera lancée
- 2) une secret key pour sécuriser votre requête
- 3) l'événement qui va déclencher votre requête

La partie événement est relativement complète et là encore vous disposez de trois possibilités :

- 1) se déclenche au push
- 2) se déclenche à chaque événement
- 3) à vous de choisir les événements (un ou plusieurs) qui vous conviennent

Une fois activée un premier test va se lancer qui permettra de détecter que votre serveur répond bien à la requête :

![](test_webhook.jpg)

La requête envoyée est très basique et embarque un JSON sur les informations de votre dépôt (description, url) et une liste des api mises à disposition. Le reste du travail doit se faire sur votre serveur par l'intermédiaire de votre api/script etc.

## This is just the beginning

Cette solution est un début de piste pour le déploiement continu, mais elle ne doit pas se faire sans une solution de test que ce soit coté Github ou coté serveur.

Si vous souhaitez plus d'informations ou même pousser un peu plus la mise en place des webhooks, Github a comme à son habitude publier un [guide](https://developer.github.com/webhooks/) très bien détaillé et complet.
