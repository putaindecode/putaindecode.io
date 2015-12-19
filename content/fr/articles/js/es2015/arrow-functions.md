---
date: "2015-12-15"
title: "ES6, ES2015 : Les fonctions fléchées"
tags:
  - JavaScript
  - ES6
  - ES2015
authors:
  - MoOx
---

ES2015 nous apporte encore du sucre syntaxique qui risque très probablement de
vous faire oublier ``Function.prototype.bind()``.

Les fonctions fléchées offrent une syntaxe raccourcie des fonctions en utilisant
la syntaxe `=>`.

```js
// es5
var myFn = function(x) {
    return x + 1
}

// es6
const myFn = (x) => {
  return x + 1
}
```

Les fonctions fléchées sont syntaxiquement similaire à ce qu'on trouve déjà dans
d'autres langages comme CoffeeScript, Java (8+), C#…

Elles supportent les expressions ou les blocs en tant que corps de fonction.
Dans notre exemple précédent, nous avons utilisé un corps classique.
Pour de simples fonctions, nous pouvons utiliser des expressions, le but étant
d'avoir quelque chose de concis.
Notre exemple précédent peut ainsi s'écrire de la sorte :

```js
const myFn = (x) => x + 1
```

Notez que lorsque l'on a qu'un argument dans notre fonction, on peut omettre les
parenthèses. Notre exemple peut donc aussi s'écrire ainsi :

```js
const myFn = x => x + 1
```

Si notre expression mérite d'être sur plusieurs lignes, on peut aussi utiliser des
parenthèses :

```js
const myFn = x => (
  x +
  1 // Ici vous pouvez faire du multi lignes tranquille, on peut imaginer du JSX
)
```

Les exemples suivants sont donc tous les mêmes :

```js
const myFn = (x) => {
  return x + 1
}
// ===
const myFn = (x) => x + 1
// ===
const myFn = x => x + 1
// ===
const myFn = x => (x + 1)
```

Dans la pratique vous utiliserez souvent cette syntaxe pour des petites méthodes
comme par exemple lors de l'utilisation des fonctions de tableau
reduce/filter/map etc.

```js
const nums = [1, 2, 3, 4, 5]
const odds = nums.filter(v => v%2) // [1, 3, 5]
const oddsSum = odds.reduce((sum, v) => sum+v, 0) // 9
```

## Les fonctions fléchées n'ont pas de `this`

Oui, vous avez bien lu : à l'inverse des fonctions normales, les fonctions
fléchées partagent le même ``this`` lexical que leur scope parent.
Du coup, le ``this`` que vous pourrez utiliser dans votre corps de fonction
fléchée est celui du code parent :

```js
const Someone = {
  name: “MoOx”,
  friends: [], // Malheureusement, il n'a pas d'amis :(
  printFriends() {
    this._friends.forEach(f =>
      console.log(this._name + " knows " + f)
      // `this` ne réfère pas à la fonction fléchée du forEach !
    )
  }
}
```

En lisant ce code, vous avez peut être compris qu'il peut être possible de ne
plus avoir besoin du ``bind()`` aussi souvent que ça pouvait être le cas :

```js
import React, { Component } from “react”
class Stuff extends Component {

  // à l'ancienne
  onClick(e) {
    this.setState({ omg: false })
  }

  render() {
    return (
      <div>
        { /* à l'ancienne */ }
        <button onClick={ this.onClick.bind(this) }>
          Old binded call
        </button>

        { /* REGARDE MAMAN, JE BIND RIEN */ }
        <button onClick={ (e) => this.onClick(e) }>
          I don’t need `bind` anymore !
        </button>

        { /* Encore plus simplement */ }
        <button onClick={ (e) => this.setState({ omg: true }) }>
          Hell yeah
        </button>
      </div>
    )
  }
}
```

## Note sur les expressions et les objets

Si vous voulez retourner un objet, vous serez surement supris par une erreur de
syntaxe avec ce code :

```js
const aFn = (obj) => {key: obj.value}
```

Gardez en tête que dans ce contexte, une accolade ouvre un corps de fonction,
pas un objet.
Vous devrez donc faire comme ceci :

```js
const aFn = (obj) => { return {key: obj.value} }
```

Mais attendez, avec une simple astuce, on s'en sort avec un couple de
parenthèses :

```js
const aFn = (obj) => ({key: obj.value}) // It works !
```

## Conclusion

Regardez
[la table de compatibilité](https://kangax.github.io/compat-table/es6/#test-arrow_functions).
C'est plutôt bien supporté par la plupart des navigateurs, mais vous risquez
surement d'avoir à utiliser [Babel](http://babeljs.io) afin d'être tranquille.

Vous verrez que vous utiliserez les fonctions fléchées de plus en plus.
Même si le mot clé ``function`` n'est pas mort, les fonctions fléchées ont un
avenir certain !
