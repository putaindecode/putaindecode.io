---
date: "2018-11-06"
title: React Hooks (proposal)
tags:
  - javascript
  - react
authors:
  - magsout
---

Cette nouvelle fonctionnalité en alpha est certainement la feature de la
[React Conf 2018](https://conf.reactjs.org/).

Disponible dans React 16.7.0 en alpha, une
[RFC](https://github.com/reactjs/rfcs/blob/hooks-rfc/text/0000-react-hooks.md)
est d'ailleurs ouverte afin de recueillir l'avis de la communauté.

## Mais Qu'est ce que c'est ?

La question que se pose tout développeur avant de définir un composant est: une
classe ou une fonction ?

La façon la plus simple d'écrire un composant est la fonction:

```js
import React from "react";

function Form(props) {
  return (
    <div>
      <input type="text" value="name" name="putaindecode" />
    </div>
  );
}
```

Mais on peut également utiliser les classes ES6 pour écrire la même chose:

```js
import React from "react";

class Form extends React.Component {
  render() {
    return (
      <div>
        <input type="text" value="name" name="putaindecode" />
      </div>
    );
  }
}
```

La grosse difference entre les deux est l'accès au
[Lifecycle](https://reactjs.org/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-class)
de React mais également au
[State](https://reactjs.org/docs/state-and-lifecycle.html#adding-local-state-to-a-class)
dans les classes.

C'est très précisement dans ces differences qu'interviennent les `Hooks`. Il est
dorénavant possible (enfin ça le sera bientôt) d'avoir accès à ces deux concepts
(mais pas que, en gros toutes les fonctionnalités de React comme les ref par
exemple) dans les fonctions.

Petit bémol, comme le précise la team React, ne vous jetez pas tout de suite
dans le refactorisation de vos `Classes`. L'utilisation des `Hooks` dans les
functions ne signe pas pour autant la mort des `Classes`. La team React n'a pour
le moment pas prévu de les déprécier.

Il faut cependant avouer qu'on est pas loin non plus d'une utilisation moins
intensives des `Classes` surtout si on ajoute en plus
[React.memo](https://reactjs.org/blog/2018/10/23/react-v-16-6.html#reactmemo)
qui est l'intégration des `PureComponent/shouldComponentUpdate` dans les
fonctions.

## Et dans la pratique ?

### state et useState

Partons de notre exemple précédant en y rajoutant l'utilisation d'un state.

```js
import React from "react";

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "putaindecode",
    };
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleNameChange(e) {
    this.setState({
      name: e.target.value,
    });
  }

  render() {
    return (
      <div>
        <label htmlFor="inputName">Name</label>
        <input
          id="inputName"
          type="text"
          value={this.state.name}
          name="firstname"
          onChange={this.handleNameChange}
        />
      </div>
    );
  }
}
```

Nous venons d'écrire un composant très simple qui met à jour un élément
`<input />`. On a du pour cela définir dans le constructor un valeur par defaut
dans notre objet `state`, définir une fonction pour gérer l'event `onChange` sur
notre `<input />` sans oublier de binder notre function pour le scope de `this`.

Pfiou, les classes c'est bien, mais ça fait un peu de boilerplate quand même.

Transformons cette classe en fonction et voyons le changement opéré grace à nos
fameux `Hook`.

```js
import React, { useState } from "react";

function Form(props) {
  const [name, setName] = useState("putaindecode");

  function handleNameChange(e) {
    setName(e.target.value);
  }

  return (
    <div>
      <label htmlFor="inputName">Name</label>
      <input
        id="inputName"
        type="text"
        value={name}
        name="firstname"
        onChange={handleNameChange}
      />
    </div>
  );
}
```

Attardons nous un peu plus sur ce `useState`.

C'est le premier `Hook` introduit par `React` qui nous permet d'introduire le
concept de `state` dans les `React Fontions`.

Il prend un argment qui est la valeur par defaut de notre state.

```js
// fonction
useState("putaindecode")

// classe
constructor(props) {
  this.state = {
    name: "putaindecode"
  }
}
```

`useState` retourne un array comportant 2 élements : le state courant (`name`)
ainsi que la fonction qui va permettre le changement de notre state (`setName`).

Et voila, rien de plus, rien de moins. Notre function `stateless` deviant grace
au Hook `useState` un composant avec un state.

Cette `React Fonction` fait exactement la même chose que notre classe
précédente.

## Lifecyle et useEffect

Ajoutons un soupçon de lifecycle dans notre exemple.

Mettons à jour notre classe en utilisant les methodes `componentDidMount()` et
`componentWillUnmount()`

```js
import React from "react";

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "putaindecode",
      width: window.innerWidth,
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  handleNameChange(e) {
    this.setState({
      name: e.target.value,
    });
  }

  componentDidMount() {
    window.addEventListner("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListner("resize", this.handleResize);
  }

  handleResize() {
    this.setState({
      width: window.innerWidth,
    });
  }

  render() {
    return (
      <div>
        <label htmlFor="inputName">Name</label>
        <input
          id="inputName"
          type="text"
          value={this.state.name}
          name="firstname"
          onChange={this.handleNameChange}
        />
        <div>{this.state.width}</div>
      </div>
    );
  }
}
```

On veut donc surveiller le resize de notre navigateur et afficher sa résolution.

Les bonnes pratiques nous conseillent de subscribe à nos events dans la methode
`componentDidMount()` et pour éviter les fuites mémoires inutiles de les
unsubscribe dans la méthode `componentWillUnmount()`.

Comme précédemment on oublie pas d'initialiser la valeur dans notre state et de
bind notre fonction `handleResize()`.

Même exercice, tranformons tout cela pour l'appliquer à notre function.

```js
import React, { useState, useEffect } from "react"

function Form(props) {

  const [name, setName] = useState("putaindecode")
  function handleNameChange(e) {
    setName(e.target.value)
  }

  const [width, setWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handleResize () => setWidth(window.innerWidth)
    window.addEventListner("resize", handleResize)
    return () => {
      window.removeEventListner("resize", handleResize)
    }
  })

  return (
    <div>
      <label htmlFor="inputName">Name</label>
      <input
        id="inputName"
        type="text"
        value={name}
        name="firstname"
        onChange={handleNameChange}
      />
      <div>
        {this.state.width}
      </div>
    </div>
  );
}
```

Pour être conforme à notre classe nous avons de nouveau utiliser le `Hook`
`useState` pour garder un state de notre valeur `width` et determiner son setter
(`setWidth`).

Pour pouvoir jouer avec le lifecyle nous ajoutons cette fois-ci
[userEffect](https://reactjs.org/docs/hooks-effect.html). Ce `Hook` suit donc la
même logique que `componentDidMount`, `componentDidUpdate` et
`componentWillUnmount`. Il va donc s'exécuter après le chargement de notre
composant, chaque fois qu'il sera mis à jour et à son destruct.

Petit précision sur le `return` de notre `Hook`. Il faut considérer cela comme
un mécanisme (optionnelle) de cleanup.

Concrètement dans notre cas c'est ici qu'on va pouvoir unsubscribe notre event.

Grace à ces deux `Hooks`, nous nous avons donc accès aux concepts de `state` et
du `lifecycle` qui font la force de `React` et tout cela dans une fonction.

`React` a également mis à dispotion un autre `Hook`
[useContext](https://reactjs.org/docs/hooks-reference.html#usecontext) qui
permet de subsribe à
[React context](https://putaindecode.io/fr/articles/js/react/react-new-context-api/)
en évitant le nested des `Consumer` `Provider`.

Tous ces `Hooks` sont bein entendu disponibles dans la version `16.7.0` alpha de
React.

Ils en existent d'autre qui sont listés ici
https://reactjs.org/docs/hooks-reference.html#additional-hooks

## Les deux petites régles

Vous l'avez sans doute remarqué mais tous ces `Hooks` comencent pas `use`. C'est
quelque chose de primordial pour être considéré commeun `Hook`.

De plus un `Hook` ne doit pas se trouver dans une conditon ou dans une boucle.
Tout doit être à plat. De plus un `Hook` ne doit s'appeler que dans une
`React Function`.

Il existe un plugin `ESLint`
[eslint-plugin-react-hooks ](https://reactjs.org/docs/hooks-rules.html#eslint-plugin)
qui permet d'être sur que ces régles sont respectées.

## Custom Hooks

La force de cette nouvelle fonctionnalités c'est de pouvoir soit même créer ses
propres `Hook`, une [orga](https://github.com/rehooks) sur Github existe ayant
pour objectif de recencer tous ces customs `Hooks`.

Revenons à notre exemple pour voir si on ne pourrait pas y rajouter un peu de
généricité en tentant de créer nous mêmes nos propres `Hook` de façon à pouvoir
les utiliser dans d'autre composants.

```js
import React, { useState, useEffect } from "react"

function Form(props) {

  const [name, setName] = useState("putaindecode")
  const width = useWidth()

  function handleNameChange(e) {
    setName(e.target.value)
  }

  return (
    <div>
      <label htmlFor="inputName">Name</label>
      <input
        id="inputName"
        type="text"
        value={name}
        name="firstname"
        onChange={handleNameChange}
      />
      <div>
        {this.state.width}
      </div>
    </div>
  )
}

function userWidth() {
  const [width, setWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handleResize () => setWidth(window.innerWidth)
    window.addEventListner("resize", handleResize)
    return () => {
      window.removeEventListner("resize", handleResize)
    }
  })

  return width
}
```

On vient d'externaliser notre partie de code sur le calcul de la `width` pour
l'ajouter dans notre propre `Hook`. Cela nous permet de pouvoir reutiliser cette
fonction ailleurs dans d'autre composant mais aussi de pouvoir tester une seule
fois cette logique, là ou avec une classe on aurait du tester et implémenter
cette logique à chaque fois.

## Et la conclusion ?

Les `Hooks` présentaient dans cette article permettent donc de s'abstraire des
classes. En d'autres mots utiliser les `state` et les fonctionnalités de React
dans des `Fonctions`.

Elles ouvrent la voix à un peu plus de générecité à des tests plus facile et
moins lourds.

La team React a très bien documenter
[documenter](https://reactjs.org/docs/hooks-intro.html) tout cela. Tous ces
exemples proviennet de l'excellent talk de
[Dan Abramov](https://mobile.twitter.com/dan_abramov)
[React Today and Tomorrow and 90% Cleaner React](https://www.youtube.com/watch?v=dpw9EHDh2bM)
que je vous invite vivement a regarder.
