---
date: "2018-11-06"
title: React Hooks (proposal)
tags:
  - javascript
  - react
authors:
  - magsout
---

Cette nouvelle fonctionnalité vient d'être présentée lors de la
[React Conf 2018](https://conf.reactjs.org/).

Disponible dans React 16.7.0 en alpha, une
[RFC](https://github.com/reactjs/rfcs/blob/hooks-rfc/text/0000-react-hooks.md)
est d'ailleurs ouverte afin de recueillir l'avis de la communauté.

### Qu'est-ce que c'est ?

La question que se pose tout développeur avant de définir un composant est : une
classe ou une fonction ?

La façon la plus simple d'écrire un composant est la fonction :

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

Mais on peut également utiliser les classes ES6 pour écrire la même chose :

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

L'avantage des classes est la possibilité d'utiliser les fonctionnalités de
React comme par exemple le
[lifecycle](https://reactjs.org/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-class)
ou encore le
[state](https://reactjs.org/docs/state-and-lifecycle.html#adding-local-state-to-a-class).

C'est très précisement à ce niveau qu'interviennent les hooks. Il est dorénavant
possible (enfin, ça le sera bientôt) d'avoir accès à ces deux concepts (mais pas
que, en gros toutes les fonctionnalités de React comme les `ref` par exemple) dans
les fonctions.

Petit bémol : comme le précise l'équipe de React, ne vous jetez pas tout de suite
dans le refactorisation de vos classes. L'utilisation des hooks dans les
fonctions ne signe pas pour autant la fin des classes.

Il faut cependant avouer qu'on est pas loin non plus d'une utilisation moins
intensives des classes surtout si on ajoute en plus
[React.memo](https://reactjs.org/blog/2018/10/23/react-v-16-6.html#reactmemo)
qui est l'intégration des `PureComponent/shouldComponentUpdate` dans les
fonctions.

### Et dans la pratique ?

#### `state` et `useState`

Partons de notre exemple précédent en y rajoutant l'utilisation d'un state :

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
`<input />`. On a dû, pour cela, définir dans le constructor une valeur par défaut
dans notre objet `state`, définir une fonction pour gérer l'événement `onChange`
sur notre `<input />` sans oublier de bind notre fonction pour le scope de
`this`.

Pfiou, les classes c'est bien, mais ça fait un peu de boilerplate quand même.

Transformons cette classe en fonction et voyons le changement opéré grâce à nos
fameux hooks.

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

Attardons-nous un peu plus sur ce `useState`.

C'est le premier hook introduit par React qui nous permet d'utiliser le state
dans les fonctions React.

Il prend un argument qui est la valeur par défaut de notre state.

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

Il retourne un array comportant 2 éléments : le state courant (`name`) ainsi que
la fonction qui va permettre le changement de notre state (`setName`).

Et voilà, rien de plus, rien de moins. Notre fonction `stateless` devient grâce
au hook `useState` un composant avec un state.

Cette fonction React fait au final exactement la même chose que notre classe
précédente.

### Lifecyle et `useEffect`

Ajoutons un soupçon de lifecycle dans notre exemple.

Mettons à jour notre classe en utilisant les méthodes `componentDidMount()` et
`componentWillUnmount()`.

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

On veut donc surveiller le redimensionnement de notre navigateur et afficher sa
résolution.

Les bonnes pratiques nous conseillent de souscrire à notre événements dans la
methode `componentDidMount()` et pour éviter les fuites mémoires inutiles de
s'en désabonner dans la méthode `componentWillUnmount()`.

Comme précédemment on n'oublie pas d'initialiser la valeur dans notre state et
de bind notre fonction `handleResize()`.

Même exercice, transformons tout cela pour l'appliquer à notre function.

```js
import React, { useState, useEffect } from "react";

function Form(props) {
  const [name, setName] = useState("putaindecode");
  function handleNameChange(e) {
    setName(e.target.value);
  }

  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListner("resize", handleResize);
    return () => {
      window.removeEventListner("resize", handleResize);
    };
  });

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
      <div>{this.state.width}</div>
    </div>
  );
}
```

Pour être conforme à notre classe nous avons de nouveau utilisé le hook
`useState` pour garder un state de notre valeur `width` et déterminer son setter
(`setWidth`).

Pour pouvoir jouer avec le lifecyle nous ajoutons cette fois-ci
[useEffect](https://reactjs.org/docs/hooks-effect.html). Ce hook suit la même
logique que `componentDidMount`, `componentDidUpdate` et `componentWillUnmount`.

Il va donc s'exécuter :

- après le chargement de notre composant ;
- après chaque mise à jour de notre composant ;
- à la destruction de notre composant.

Petit précision sur le `return` de notre hook : il faut considérer cela comme un
mécanisme (optionnelle) de cleanup.

Concrètement, dans notre cas, c'est ici qu'on va pouvoir de se désabonner de notre
événement.

Grace à ces deux hooks, nous nous avons donc accès aux concepts de `state` et du
`lifecycle` dans une fonction.

React a également mis à dispotion un autre hook
[useContext](https://reactjs.org/docs/hooks-reference.html#usecontext) qui
permet de souscrire à
[React context](https://putaindecode.io/fr/articles/js/react/react-new-context-api/)
en évitant l'imbrication des `Consumer` et `Provider`.

Tous ces hooks sont, bien entendu, disponibles dans la version `16.7.0` alpha de
React.

Ils en existent d'autre qui sont listés ici : 
https://reactjs.org/docs/hooks-reference.html#additional-hooks

### Les deux petites règles

Vous l'avez sans doute remarqué mais tous ces hooks commencent pas `use`. Ce
préfixe est primordial pour considérer votre hook comme un hook.

De plus un hook ne doit ni se trouver dans une condition ni dans une boucle et
ne doit s'appeler que dans une fonction React.

Il existe un plugin `ESLint`
[eslint-plugin-react-hooks ](https://reactjs.org/docs/hooks-rules.html#eslint-plugin)
qui permet d'être sûr que ces régles soient bien respectées.

### Custom Hooks

Naturellement il est tout à fait possible de créer soi-même son propre hook, une
[orga](https://github.com/rehooks) sur GitHub existe ayant pour objectif de
recenser tous ces custom hooks.

Revenons à notre exemple pour voir si on ne pourrait pas le modifier un peu pour
tenter de créer un hook.

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

function useWidth() {
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

En externalisant notre partie de code sur le calcul de `width`, on vient tout
simplement de créer un hook.

#### Et la conclusion ?

Les hooks présentés dans cet article permettent donc de s'abstraire des classes.

Elles ouvrent la voix à un peu plus de généricité et à des tests
[orientés sur le comportement plus que sur l'implémentation](https://twitter.com/controlplusb/status/1057922325474148353).

L'équipe de React a très bien
[documenté](https://reactjs.org/docs/hooks-intro.html) tout cela. Tous ces
exemples proviennent de l'excellente conférence de
[Dan Abramov](https://mobile.twitter.com/dan_abramov)
[React Today and Tomorrow and 90% Cleaner React](https://www.youtube.com/watch?v=dpw9EHDh2bM)
que je vous invite vivement à regarder.

Comme precisé en début d'article, les hooks sont une proposition faite par
l'équipe de React. Tout est disponible dans une version alpha, ce qui implique
une possibilité dans le changement de l'API voir même du noms des hooks.
