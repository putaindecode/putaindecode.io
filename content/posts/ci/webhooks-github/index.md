---
date: "2015-06-09"
title: Les webhooks GitHub
tags:
  - github
  - webhooks
authors:
  - magsout
header:
  credit: https://www.flickr.com/photos/haru__q/14396323454/
---

Vous avez pu lire récemment une [introduction sur l'intégration
continue](/posts/ci/le-deploiement-continu/) qui mène vers [le déploiement
continu](/posts/ci/introduction/). Si vous utilisez GitHub pour héberger vos
sources et que vous cherchez un moyen très simple (peut-être un peu trop) de
mettre en place le déploiement continu _sans serveur d'intégration continue
dédié_, alors les webhooks peuvent répondre parfaitement à votre besoin.

## Les quoi ?

Les webhooks permettent de lancer une action de façon automatique par
l'intermédiaire d'un ou plusieurs événements depuis un dépôt
[GitHub](http://github.com). Concrètement, il va être possible de déployer son
projet sur un serveur de production, sauvegarder son site Internet, ou même
mettre à jour des stats dès qu'un commit sera envoyé ou même une issue ouverte.
Il est possible de faire tout ce que l'on veut dans la limite de son imagination
comme l'explique GitHub.

## Comment ça marche ?

Le fonctionnement est on ne peut plus simple, un événement (merge, push, release
etc.) va déclencher une requête HTTP POST vers l'URL que vous avez configurée.
Le reste de l'exécution se fera sur le serveur où pointe l'URL, libre à vous
d'écrire le script que vous voulez pour effectuer les opérations que vous
souhaitez.

Il faut cependant être conscient que la simplification a un coût, à savoir que
même si une PR ou un commit venaient à rendre inopérant votre projet l'événement
se lancerait quand même.

## La mise en place

Seul le propriétaire d'un dépôt dispose des droits nécessaires pour configurer
un webhook. Il suffit pour cela de se rendre dans `Settings` puis `Webhooks &
Services` :

![Settings Webhooks GitHub](setting_webhook.jpg)

Un petit clic sur `Add webhook` et vous obtenez une interface encore une fois
très simple :

![Configuration Webhooks GitHub](configuration_webhook.jpg)

Cette interface se compose de trois parties :

1. l'URL vers laquelle votre requête sera lancée
2. une secret key pour sécuriser votre requête
3. l'événement qui va déclencher votre requête

La partie événement est relativement complète et là encore vous disposez de
trois possibilités :

1. se déclenche au push
2. se déclenche à chaque événement
3. à vous de choisir les événements (un ou plusieurs) qui vous conviennent

Une fois le _Webhook_ activé un premier test ou plus exactement un `ping` va se
lancer. Il permettra de détecter que votre serveur répond bien à la requête :

![Test Webhooks request GitHub](test_webhook.jpg)

La requête envoyée est très basique et embarque un JSON sur les informations de
votre dépôt (description, URL) et une liste des API mises à disposition. Le
reste du travail doit se faire sur votre serveur par l'intermédiaire de votre
API/script, etc.

Voici un petit exemple utilisant `express` :

```js
var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var xhub = require("express-x-hub")

//Const
var xhubSecret = "MySecretKey"
var port = "8085"
var host = "localhost"

//Secret key
app.use(xhub({ algorithm: "sha1", secret: xhubSecret }))

// Configure express json
app.use(bodyParser.json())

// Main : Start the express http server
var server = app.listen(port, host, function () {
  console.log(
    "App listening at http://%s:%s",
    server.address().address,
    server.address().port
  )
})

// Add default route
app.post("/webhook", function (req, res) {
  if(!req.isXHubValid()){
    res.status(400).send('Invalid X-Hub Request')
    console.log("Secret key is invalid")
    return
  }

  var command = req.headers["x-github-event"]

  switch(command) {

    //Event create (Branch, or tag created)
    case "create":
      res.send("Event create trigger")
      console.log("Create event")
      break

    //Event release (Release published in a repository)
    case "release":
      res.send("Event release trigger")
      console.log("Release Event")
      break

    default:
      res.status(400).send("Event not supported : " + command)
      console.log("Event not supported : " + req.headers["X-Github-Event"])
  }
})
```

Pour vous donner une idée de ce que peut envoyer GitHub, voici deux gists :

- [Headers](header.txt)
- [Payload](payload.json)

## This is just the beginning

Cette solution est un début de piste pour le déploiement continu, mais elle ne
doit pas se faire sans une solution de test que ce soit coté GitHub ou coté
serveur.

Si vous souhaitez plus d'informations ou même pousser un peu plus la mise en
place des webhooks, GitHub a comme à son habitude publié un
[guide](https://developer.github.com/webhooks/) très bien détaillé et complet.
