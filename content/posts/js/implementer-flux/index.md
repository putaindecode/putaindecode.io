---
date: "2015-05-01"
title: "Implémenter Flux"
tags:
  - javascript
  - reactjs
  - flux
authors:
  - bloodyowl
---

Si vous n'avez pas encore lu
[l'introduction à flux](http://putaindecode.fr/posts/js/flux-qu-est-ce-c-est/),
n'hésitez pas à jeter un œil avant de lire ce post.

Une des choses importantes avec Flux, et pourtant pas évidentes après lecture
[des exemples officiels](https://github.com/facebook/flux/tree/master/examples/),
c'est que les stores doivent être des instances, et non des singletons que
les composants récupèrent en dépendance directe.

La raison de cette nécessité, c'est la possibilité de servir une page
pre-rendue sur le serveur. En soi, vous devez impérativement amorcer votre
dispatcher et vos stores dans le scope de la requête, ou vos utilisateurs
se retrouveront avec des stores remplis de data ne leur appartenant pas.

Puisque l'intérêt d'une solution comme react dans le cadre du server-side
rendering est d'utiliser les mêmes composants que sur le client, il faut
que notre approche soit convenable sur nos deux environements.

La question dès lors est «comment passer les stores à nos composants react
maintenant qu'ils ne sont plus des dépendances directes ?».

On va les passer via les `props` de parent à enfant ? lolnope.
La plupart de nos composants n'auront pas conscience de la présence de ces
stores, et seront utilisés dans différents contextes. Et c'est justement
l'API `context` que nous allons utiliser.

Cette API est assez simple, en soi, le `context` d'un composant est construit
au fur et à mesure que ses ancêtres décident d'y ajouter de la data.

Exemple simple :

```javascript
import React, {Component, PropTypes} from "react"

class App extends Component {

  // on définit les types de ce que l'on souhaite passer dans
  // le contexte
  static childContextTypes = {
    foo: PropTypes.string,
  }

  // on crée une méthode qui retourne ce contexte
  getChildContext() {
    return {
      foo: this.props.foo,
    }
  }

  render() {
    return (
      <div className="putainde-App">
        <Container />
      </div>
    )
  }
}

class Container extends Component {

  // les contextes sont *merged*, ce qui nous permet de le construire
  // sans se soucier du niveau auquel sera notre composant.
  static childContextTypes = {
    bar: PropTypes.string,
  }

  getChildContext() {
    return {
      bar: "oh hai",
    }
  }

  render() {
    return (
      <div className="putainde-Container">
        <IntermediaryComponent />
      </div>
    )
  }

}

// ce composant n'a pas besoin de savoir que ses enfants on besoin
// de certaines propriétés du contexte
class IntermediaryComponent extends Component {
  render() {
    return (
      <Content />
    )
  }
}

class Content extends Component {

  // pour chaque composant utilisant des propriétés du contexte,
  // on stipule ce dont on a besoin
  static contextTypes = {
    foo: PropTypes.string,
    bar: PropTypes.string,
  }

  render() {
    return (
      <div className="putainde-Content">
        <div className="putainde-Content-line">
          <strong>foo</strong>: {this.context.foo}
        </div>
        <div className="putainde-Content-line">
          <strong>bar</strong>: {this.context.bar}
        </div>
      </div>
    )
  }

}

React.render(
  <App foo={Date.now()} />,
  document.getElementById("App")
)
```

Cela nous donne cet output :
[http://jsbin.com/zitohibaze/1/](http://jsbin.com/zitohibaze/1/)

Grâce à cette API, on peut créer des composants isolés, et dont les
composants parents n'auront pas nécessairement besoin de connaître le
contexte.

L'idée, pour en revenir à Flux, c'est de passer notre dispatcher dans
ce contexte, et de placer les stores dans le dispatcher au moment de
l'amorce de l'app.

```javascript
const dispatcher = new Dispatcher()

dispatcher.registerStore(new SomeStore())
dispatcher.registerStore(new SomeOtherStore())

React.render(
  <App dispatcher={dispatcher} />,
  document.getElementById("App")
)
```

Désormais, pour avoir une API décente pour récuperer les données des stores,
on a deux principales solutions:

- utiliser un mixin
- utiliser un higher-order component

Puisque la direction que prend l'API de React, à terme, est de ne plus
fournir de mixins, et de laisser au TC39 le temps de prendre la bonne
décision sur la façon dont JavaScript traitera la composition ; il semble
plus adéquat d'utiliser un higher-order component. Cela aura en plus
l'avantage de rendre le composant récupérant les données *stateless*.

Ce genre d'API ressemble à ça :

```javascript
class ComponentWithData extends Component {
  static stores = {
    // nom du store: nom de la prop souhaitée
    MyStore: "my_store",
  }

  render() {
    return (
      <div>
        {/* la data est passée via les props*/}
        {this.props.my_store.foo}
      </div>
    )
  }
}

// storeReceiver wrap `ComponentWithData` dans un higher-order component
// et se charge de récupérer le store dans le contexte pour les passer
// dans les props de `ComponentWithData`
export default storeReceiver(ComponentWithData)
```

Enfin, avec cette approche, les action creators que l'on voit dans les
exemples de flux ne peuvent plus garder la même forme, puisqu'il ne doivent
plus avoir le dispatcher comme dépendance directe (ce dernier étant une
instance). Du coup, ce sont désormais des fonctions pures :

```javascript
const PostActions = {
  getPost(slug) {
    return {
      type: ActionTypes.POST_GET,
      slug: slug,
    }
  },
  receivePost(res) {
    return {
      type: ActionTypes.POST_RECEIVE,
      res,
    }
  },
  error(res) {
    return {
      type: ActionTypes.POST_ERROR,
      res,
    }
  },
}
```

et nos composants utilisent :

```javascript
import React, {Component, PropTypes} from "react"
import PostActions from "actions/PostActions"

class MyComponent extends Component {

  static contextTypes = {
    dispatcher: PropTypes.object,
  }

  static propTypes = {
    slug: PropTypes.string,
    title: PropTypes.title,
  }

  handleClick() {
    this.context.dispatcher.dispatch(
      PostActions.getPost(this.props.slug)
    )
  }

  render() {
    return (
      <button
        onClick={() => this.handleClick()}>
        {this.props.title}
      </button>
    )
  }
}
```

Pour résumer, les avantages de cette approche sont :

- un meilleur découplage
- une isolation solide des composants
- la possibilité de pre-render sur le serveur
- une testabilité accrue, puisqu'il est simple d'utiliser un mock ou des
  instances crées pour le test dans le contexte de nos composants.

Bisous bisous.
