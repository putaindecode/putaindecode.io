---
date: "2013-12-05"
title: "ExternalInterface.call() de Flash (et Backbone), toute une histoire"
tags:
  - javascript
  - backbone
  - flash
authors:
  - kud
---

<figure class="putainde-Media putainde-Media--left">![](occupyflash.png)</figure>

Je voulais vous parler d'un bug qui m'a bien emmerdé récemment et comme j'aimerais que vous ne perdiez pas de temps avec cela, un article s'imposait.

_Note de la direction : j'y connais rien en Flash (et je ne crois pas avoir trop envie de connaître en fait)._

Dans la boite où je travaille, nous utilisons Flash en tant que lecteur vidéo étant donné qu'il est pour le moment très difficile de faire lire sur toutes les plateformes des vidéos au format _H.264_ et/ou passant par du _HLS_. Longue histoire qui fera office d'un autre article. (Je dis ça à chaque fois, haha).

## Le pitch

Avec notre _flasheur_ attitré, nous nous sommes mis en tête de créer un objet _event_ qui permettrait au Flash de déclencher des évènements lorsqu'il le souhaite afin de communiquer avec l'application JavaScript et que celui-ci fasse en conséquence. Cet objet, nous l'avons appelé `App.FlashManager` et plus précisemment `App.FlashManager.Events` dans le cas des évènements. Nous utilisons **Backbone.js** pour gérer ce principe d'évènement mais vous en avez d'[autres](http://microjs.com/#event) de disponible. En pratique, voilà ce que ça donne :

```javascript
 // on crée un objet vide
App.FlashManager.Events = {}

// on lui ajoute les fonctionnalités des events Backbone
_.extend(App.FlashManager.Events, Backbone.Events)
```

En soi, pas de souci, tout se passe bien à ce moment, nous avons un [objet d'évènement façon Backbone](http://backbonejs.org/#Events). Il pourra alors s'écouter lui-même, écouter un autre objet, mais aussi déclencher des évènements.

## Côté Flash

La base est en place, maintenant on souhaite que le Flash déclenche un évènement. On passe par l'objet `ExternalInterface` :

```javascript
ExternalInterface.call("window.App.FlashManager.Events.trigger", "my-event")
// http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/external/ExternalInterface.html#call
```

Et là, bug.

## Pourquoi bug ?

Pour le moment, je ne sais pas vraiment. Je me pencherai plus sur le sujet dès que j'ai un peu de temps, mais ce que je sais, c'est que `ExtercalInterface.call()` ne s'attend pas à recevoir ce que **Backbone.js** lui propose. Lorsque vous faites `.trigger()`, **Backbone.js** renvoie l'[objet en cours](https://github.com/jashkenas/backbone/blob/master/backbone.js#L144-L153), ce qui provoque un énooooorme bug dans le plugin Flash de votre navigateur.

## La solution côté JavaScript

Pour contrer cela, je vous propose la solution suivante qui est de ne pas utiliser directement l'objet `Backbone.Events|View` mais plutôt de passer par une interface, un objet proxy.

Voici le schéma :

- Créer un objet simple qui contient les mêmes noms de méthodes que les objets évènements **Backbone.js** (en gros, se mapper sur l'API Backbone)
- Utiliser **Backbone.js** dans les méthodes de cet objet _Proxy_

Exemple :

```javascript
// Bridge between flash and js
App.FlashManager = {}
App.FlashManager.Events = {}

// Backbone events used for Flash
App.InternalFlashManager = {}
App.InternalFlashManager.Events = {}

_.extend(App.InternalFlashManager.Events, Backbone.Events)

App.FlashManager.Events.trigger = function(name, opts) {
    App.InternalFlashManager.Events.trigger(name, opts)

    // Must return nothing not to loop JavaScript engine, important!
    return
}
```

## Oh et...

...il existe une version ayant plus ou moins le même souci que moi disponible là : [ExternalInterface#call in a deadly loop (__flash__toXML)](https://coderwall.com/p/e-8niw).

## Conclusion

De manière générale (hors **Backbone.js**), lorsque vous utilisez `ExtercalInterface.call()`, faites en sorte que votre JavaScript retourne quelque chose de simple (un objet ayant que des attributs, pas de fonctions, ou encore un booléen ou un _integer_).
