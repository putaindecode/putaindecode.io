---
date: "2018-06-21"
title: React 16.3 et la nouvelle API Context
tags:
  - javascript
  - react
authors:
  - neovea
---

Depuis fin mars 2018, la version 16.3 de React est sortie et a apporté son lot
de nouveautés, dont l'API Context. Alors ok, cette API existait déjà par le
passé mais il était déconseillé de l'utiliser car sujette à évolution (c'est la
doc de React qui le disait). Et évolution il y a eu. La nouvelle API Context est
devenue beaucoup plus facile à utiliser ; sa syntaxe s'est assouplie et
simplifiée. Ce qui fait désormais d'elle un outil de premier ordre.

## À quoi ça sert exactement ?

Ça permet tout simplement de rendre disponibles des propriétés au sein des ses
composants React sans avoir à les passer directement à ces derniers. Autant dire
que lorsqu'on a une application un peu complexe (entendre beaucoup de composants
et d'héritages de propriétés), il devient très vite compliqué de maintenir tout
ce petit monde ensemble. De plus, cela pose un souci de performance non
négligeable à la longue puisque les données sont traitées par des composants qui
n'ont rien à faire avec, sans compter les `Render`s potentiellement inutiles. Du
coup, très souvent, on a recours à des solutions qui peuvent se montrer
potentiellement _overkill_ (aka Redux, Mobx et consorts) afin de ségréger tout
ou partie de nos données pour des composants spécifiques, et les rendre
disponibles "facilement" à l’ensemble de l'app.

Avec la nouvelle API Context, on peut facilement créer un ou plusieurs `store`s
pour nos données. Cela permet de mieux structurer nos données, mais aussi d'en
passer la juste quantité nos composants, sans avoir à faire face au calamiteux
_[prop-drilling](https://blog.kentcdodds.com/prop-drilling-bb62e02cb691)_. Mais
attention tout de même à ne pas en faire un marteau doré.

## À quoi ça ressemble dans la pratique ?

Assez de blabla, passons à un exemple concret avec des vrais morceaux de
`Context` dedans :

Imaginons que nous souhaitions créer un contexte qui contient les informations
de l'utilisateur connecté pour les rendre facilement accessibles à plusieurs
endroits de notre app. Nous créons un contexte et l'implémentons de la manière
suivante :

### Création du contexte

```jsx
// store/UserProvider.js
import React, { createContext, Component } from "react"; // on importe createContext qui servira à la création d'un ou plusieurs contextes

/**
 * `createContext` contient 2 propriétés :
 * `Provider` et `Consumer`. Nous les rendons accessibles
 * via la constante `UserContext` et on initialise une
 * propriété par défaut "name" qui sera une chaine vide.
 * On exporte ce contexte afin qu'il soit exploitable par
 * d'autres composants par la suite via le `Consumer`
 */
export const UserContext = createContext({
  name: "",
});

/**
 * la classe UserProvider fera office de... Provider (!)
 * en englobant son enfant direct
 * dans le composant éponyme. De cette façon, ses values
 * seront accessibles de manière globale via le `Consumer`
 */
class UserProvider extends Component {
  state = {
    name: "Putain de Code", // une valeur de départ
  };

  render() {
    return (
      /**
       * la propriété value est très importante ici, elle rend
       * le contenu du state disponible aux `Consumers` de l'application
       */
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export default UserProvider;
```

### Initialisation du contexte

```jsx
// app.js
import React from "react";
import { render } from "react-dom";
import Hello from "./Hello";

// On importe la classe `UserProvider`
import UserProvider from "./store/UserProvider";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center",
};

const App = () => (
  <div style={styles}>
    {/* A noter qu'aucune propriété n'est passée au composant `Hello` */}
    <Hello />
  </div>
);

render(
  /**
   * On pourrait tout à fait n'englober que les composants qui
   * nous intéressent, mais pour l'exemple, nous englobons le bootstrap
   * de notre app dans notre `UserProvider`
   */
  <UserProvider>
    <App />
  </UserProvider>,
  document.getElementById("root"),
);
```

### Création du composant Hello qui consommera les datas de notre contexte

```jsx
// Hello.js
import React from "react";
/**
 * On importe cette fois non pas le UserProvider,
 * mais le contexte afin d'accéder au `Consumer`
 */
import { UserContext } from "./store/UserProvider";

/**
 * Le Consumer expose le contenu de la propriété `value`
 * du Provider
 */
export default () => (
  <UserContext.Consumer>
    {value => <h1>Hello {value.name}!</h1>}
  </UserContext.Consumer>
);
```

### Le rendu sera :

```html
<h1>Hello Putain de Code!</h1>
```

En gros, ce qu'il faut retenir ici, c'est que pour utiliser l'API, on a deux
propriétés : le `Provider`, qui se charge de diffuser nos propriétés d'une part,
et un ou plusieurs `Consumer`s qui permettent d'accéder aux données fournies par
le `Provider` d'autre part.

Avec cet exemple minimaliste, on constate qu'il n'est plus nécessaire de passer
les `props` à nos composants enfants. Ceci rend le code plus light et plus
facile à lire et à comprendre. Et ça c'est déjà énorme en soi. Petite note en
passant : vos composants qui se nourrissent de votre contexte seront re-rendus à
chaque fois que ce dernier sera mis à jour. Donc faites gaffe quand même à ne
pas en abuser. Mais avec une bonne gestion on peut aller assez loin :)

Bon c'est bien tout ça, mais si on veut permettre à nos composants de modifier
les valeurs de notre contexte ?

## Passer des méthodes à nos composants via `Context`

La partie la plus fun commence : on va enrichir notre contexte avec des méthodes
qui seront accessibles aux enfants, et créer un `store` "à la Redux" en quelques
lignes de code seulement ! 😈

### Implémenter une méthode

On va déclarer notre méthode à deux endroits : Dans le `context`, et dans le
`state` de notre `UserProvider` :

```jsx
// store/UserProvider.js
...

/**
 * On ajoute la propriété `setName` à notre contexte
 */
export const UserContext = createContext({
  name: "",
  setName: () => {}
});

...

/**
 * et on implémente une méthode dans notre `state`
 * qui va mettre à jour ce dernier avec la valeur passée en paramètre.
 * A noter qu'on peut aussi faire appel à des méthodes de notre
 * composant, mais on va faire simple pour l'exemple.
 */
class UserProvider extends Component {
  state = {
    name: "Franck", // une valeur de départ
    setName: name => this.setState({ name: name }) // nouvelle propriété de mutation
  };

  render() {
    return (
      // Ici, rien ne change !
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export default UserProvider;
```

Comme implémenter le `Consumer` dans chaque composant est rébarbatif, on va
créer un `Higher Order Component` qui se chargera d'implémenter ce dernier à
notre place :

```jsx
// store/UserProvider.js

...

/**
 * A la suite de notre classe `UserProvider`, on créé notre HOC
 * qui se chargera d'injecter les propriétés de notre contexte
 * à n'importe quel composant qui l'appellera
 */
export const withUser = Component => props => (
  <UserContext.Consumer>
    {store => <Component {...props} {...store} />}
  </UserContext.Consumer>
)
```

Il ne reste plus qu'à modifier notre composant `Hello` comme suit :

```jsx
// Hello.js
import React, { Fragment } from "react";
/**
 * On replace `UserContext` par notre HOC `withUser`
 */
import { withUser } from "./store/UserProvider";

/**
 * et on utilise `withUser` comme n'importe quel HOC
 * de ce type
 */
export default withUser(({ name, setName }) => (
  <Fragment>
    <h1>Hello {name}!</h1>
    <input type="text" value={name} onChange={e => setName(e.target.value)} />
  </Fragment>
));
```

Et tadam ✨✨ ! On a créé un micro store pour notre application !

## En conclusion

Avec l'API Context, les possibilités sont nombreuses, on peut :

- créer des "micro stores" pour certaines parties de notre application, voire
  les faire hériter d'un store plus global.
- imaginer combiner les `store`s et les faire "hériter" les uns des autres.

On résout au passage pas mal de problèmes liés à l'imbrication et à la
hiérarchisation des composants. Ainsi, on peut très facilement faire face à une
application qui grossit sans avoir à sortir l'artillerie parfois lourde de
Redux.

Maintenant vous avez le pouvoir ! Mais usez en avec sagesse :)

Le code source est disponible ici :

[![Edit mq8jq87v9p](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/mq8jq87v9p)
