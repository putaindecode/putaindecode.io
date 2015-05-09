---
date: "2014-10-27"
title: "Flux, qu'est-ce que c'est ?"
tags:
  - javascript
  - reactjs
  - flux
authors:
  - bloodyowl
---

Allez, tant pis, on saute l'intro et on entre directement dans le vif du sujet (on n'a pas que ça à foutre, après tout).

## La petite histoire

Il était une fois un gros site web *que s'apelorio* Facebook. Qui dit Facebook, dit webapp plus grosse que la plus grosse de tes copines (*no offense* <sup>[1](#foonote-1)</sup>) ; et du coup, propension à se retrouver submergé de bugs plus élevée.

Les ingénieurs front-end de Facebook, confrontés à une codebase de plus en plus bordélique (personne ne voulant toucher certaines parties de celle-ci) ont dû repenser la structure des composants les plus cruciaux.

Face à ce besoin, ces développeurs sont donc parvenus à deux solutions :

- [ReactJS](http://putaindecode.fr/posts/js/introduction-a-reactjs/)
- Flux

Flux n'est pas un framework, mais simplement une architecture, une sorte de *guideline* qui résout pas mal de problèmes ayant pu apparaître avec les divers bibliothèques et frameworks MV* apparus lors des dernières années.

## Flux, l'explication claire

Flux comporte 4 concepts :

- les **actions**, qu'elles proviennent du serveur ou d'une interaction utilisateur ;
- le **dispatcher** dans lequel sont envoyées les actions que ce dernier transmet *à qui veut*, un peu comme un `EventEmitter` global ;
- les **stores**, qui sont l'équivalent du `model` de l'architecture MVC, ils contiennent les données, et réagissent aux actions que le dispatcher leur transmet ;
- les **views**, qui s'occupent du rendu des données dans le DOM, et de lancer des actions lorsque l'utilisateur effectue certaines actions.

Jusque-là, rien de bien fou. C'est dans leur manière d'interagir que la particularité se dessine :

<figure>
  ![](http://cl.ly/YENt/flux.png)
  <figcaption>Oh bah dis donc, ça va toujours dans le même sens</figcaption>
</figure>

En effet, le *flux* en question est unidirectionnel. Pour faire simple, on procède ainsi :

On définit une action via un **action creator** (on passera toujours par ces action-creators pour signaler une action) :

```javascript
// actions/BasketActions.js
var AppDispatcher = require("../AppDispacher")
/*
  On garde un dictionnaire des types d'actions
  afin d'avoir un fichier donnant une vision
  globale de toutes les interactions de l'app.
 */
var ActionTypes = require("../constants").ActionTypes

module.exports = {
  addToBasket : function(productId){
    AppDispatcher.handleViewAction({
      type : ActionTypes.ADD_TO_BASKET,
      productId : productId
    })
  }
}
```

On lancera par la suite cette action lorsque l'utilisateur aura cliqué sur un certain bouton, dans la vue concernée.

```javascript
// components/Product.jsx
var React = require("react/addons")
var BasketActions = require("../actions/BasketActions")

var Button = require("./common/Button.jsx")

var Product = React.createClass({
  addToBasket : function(productId){
    BasketActions.addToBasket(productId)
  },
  render : function(){
    return (
      <div className="Product">
        {/* rest of the component*/}
        <Button
          onClick={this.addToBasket.bind(this.props.productId)}
          label="Add to basket"
        />
      </div>
    )
  }
})

module.exports = Product
```

Dès lors, à chaque clic sur le bouton en question, l'action `ADD_TO_BASKET` sera passée au dispatcher, qui le signalera aux stores.

```javascript
// stores/BasketStore.js
var AppDispatcher = require("../AppDispatcher")
var ActionTypes = require("../constants").ActionTypes
var API = require("../api")

var merge = require("../utils/merge")
var Store = require("../utils/store")

var _store = {
  products : []
}

var BasketStore = merge(Store, {
  /*
    Ici, on `register` un callback sur l'AppDispatcher,
    ce qui signifie qu'on verra passer toutes les actions
    de l'app.
   */
  dispatchToken : AppDispatcher.register(function(payload){
    var action = payload.action
    switch(action.type) {
      case ActionTypes.ADD_TO_BASKET:
          /*
             L'API va ajouter le produit et lancer une
             action `BASKET_UPDATED` dès que le serveur a répondu.
          */
        API.addToBasket(action.productId)
        break
      case ActionTypes.BASKET_UPDATED:
          /*
            L'API a répondu, on peut stocker la réponse
            et signaler le changement
            aux vues récupérant ces données.
          */
          _store = action.reponse
          BasketStore.emitChange()
        break
      default:
        break
    }
  })
})

module.exports = BasketStore
```

La vue, quant à elle, sera notifiée du changement, et effectuera un `render()` :

```javascript
// components/Basket.jsx
var React = require("react/addons")
var BasketActions = require("../actions/BasketActions")
var BasketStore = require("../stores/BasketStore")

function getState(){
  return BasketStore.getStore()
}

var Product = React.createClass({
  getInitialState : function(){
    return getState()
  },
  _onStoreChange : function(){
    /*
      À chaque changement du store, on update naïvement
      le component et on laisse le virtual DOM faire son job.
    */
    this.setState(getState())
  },
  componentDidMount : function(){
    /*
      On écoute le store uniquement lorsque le
      component est monté.
     */
    BasketStore.addChangeListener(this._onStoreChange)
  },
  componentWillUnmount : function(){
    /*
      Et on arrête d'écouter quand il ne l'est plus.
     */
    BasketStore.removeChangeListener(this._onStoreChange)
  },
  render : function(){
    return (
      <div className="Basket">
        <div className="Basket-count">
          {this.state.products.length + " products"}
        </div>
        {/* rest of the component */}
      </div>
    )
  }
})

module.exports = Product
```

Tout cela peut sembler relativement verbeux, mais il faut préciser deux choses :

- les exemples ici le sont volontairement pour la démonstration, et il est aisément faisable d'utiliser un `StoreMixin` simplifier la déclaration des `class` React ;
- pour ce qui est du reste, notamment stocker les noms d'actions dans un objet partagé dans l'app, c'est pour rendre plus idiomatique et cohérente la façon dont on code l'app, et pour simplifier ses *refactoring*.

## Ce qu'il faut savoir sur l'alliance Flux + React

Si React et Flux vont si bien ensemble, c'est que l'approche de rendu "naïf" de React (comprendre "React s'en fout de ce qui change, il appelle `render` à chaque changement") permet de réduire la logique à écrire dans les Stores, et donc de simplifier très fortement la codebase de l'app.

Lorsque qu'un ou plusieurs stores composent l'état d'un state React, alors à chaque changement de l'un de ces stores, tous les composants React concernés et leurs enfants vont appeler leur méthode `render()`. Afin d'éviter des appels superflus à ces méthodes, React donne la possibilité de tester soi-même s'il est nécessaire de mettre à jour le component en déclarant une méthode `shouldComponentUpdate` retournant un `boolean` qui stipulera si oui ou non il est nécessaire d'appeler `render()`.

## tl;dr

- Flux, c'est comme du MVC en plus simple, et avec moins de bugs
- L'architecture est unidirectionnelle
- On raisonne en actions, qui sont déclenchées par la vue ou le serveur
- Toutes les actions passent par le dispatcher
- Seuls les stores signalent aux vues qu'il faut se mettre à jour

Bisous bisous.

![angulol](http://media.giphy.com/media/lxd2cZ2BkM4IE/giphy.gif)


Pour aller un peu plus loin :

- [Les sources des exemples](https://gist.github.com/bloodyowl/b41532cf3627c560b57e) contenant le dispatcher et les constants ;
- [La doc de Flux](http://facebook.github.io/flux/docs/overview.html#content) ;
- [Le repository Flux](https://github.com/facebook/flux) et ses différents exemples.

<small>
  <a id="foonote-1"></a>1: [Référence utile (`ntm install reference`)](https://www.youtube.com/watch?v=jRzv9gep5Ng&t=4m)
</small>
