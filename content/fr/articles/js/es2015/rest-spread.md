---
date: "2015-12-16"
title: "ES6, ES2015 : paramètres rest et opérateur spread"
tags:
  - javascript
  - ES6
  - ES2015
authors:
  - zoontek
---

Identiques en apparence et en syntaxe, ils permettent d'effectuer plus
simplement des opérations complexes sur les tableaux, ou tout autre objet
itérable.

## Les paramètres rest

Avez vous déjà eu l'occasion d'utiliser l'horrible variable magique `arguments`?
Disponible au sein de chaque fonction, elle permet d'en récupérer, comme son
nom l'indique, les arguments. S'il l'objet récupéré est similaire à un `Array`,
il ne dispose d'aucune des propriétés ou des méthodes de celui-ci, à
l'exception de `length`.

```js
function myFunction(separator) {
  // conversion nécessaire en objet de type Array
  var words = Array.prototype.slice.call(arguments, 1)
  return words.join(separator)
}

myFunction("-", "foo", "bar") // "foo-bar"
```

Les paramètres rest vous permettent de récupérer un véritable `Array` à l'aide
du simple préfixe `...` appliqué sur le **dernier** argument de votre fonction.

```js
function myFunction(separator, ...words) {
  return words.join(separator)
}

myFunction("-", "foo", "bar") // "foo-bar"
```

Il vous sera par contre impossible de lui attribuer une [valeur par défaut](/fr/articles/js/es2015/defaults/).

## L'opérateur spread

Aussi appelé opérateur de décomposition, il permet de développer un objet
itérable (comme un `Array`) lorsqu'on a besoin de plusieurs arguments.

```js
const myArray = [1991, 8, 1]
new Date(...myArray) // object Date - équivaut à: new Date(1991, 8, 1)

const myString = "foo bar"
// les objets String étant itérables
[...myString] // ["f", "o", "o", " ", "b", "a", "r"]
```

À noter que contrairement aux paramètres rest, l'opérateur spread peut être
mélangé aux autres arguments d'une fonction.

```js
const myArray = [8, 1]
new Date(1991, ...myArray, 12) // object Date - équivaut à: new Date(1991, 8, 1, 12)
```

Les possibilités offertes par cette nouveauté sont très nombreuses. Voici
quelques usages un peu plus avancés pour stimuler votre inspiration:

#### Éviter l'utilisation de .apply()

```js
// ES5
console.log.apply(console, ["foo", "bar"])

// ES6 / ES2015
console.log(...["foo", "bar"]) // même résultat
```

#### Concaténer plusieurs itérables

```js
const stronglyTyped = ["scala", "haskell"]

// ES5
["go", "rust"].concat(stronglyTyped) // ["go", "rust", "scala", "haskell"]

// ES6 / ES2015
["go", "rust", ...stronglyTyped] // ["go", "rust", "scala", "haskell"]
```

#### Destructurer dans un tableau

Si vous n'avez pas encore connaissance des possibilités offertes par le
destructuring, je vous invite à lire ce [précédent article](/fr/articles/js/es2015/destructuring/).

```js
const words = ["foo", "bar", "baz"]

// ES5
const first = words[0] // "foo"
const rest = words.slice(1) // ["bar", "baz"]

// ES6 / ES2015
const [first, ...rest] = words // même résulat
```

#### Itérer sur le résultat d'un .querySelectorAll()
```js
[...document.querySelectorAll('div')] // [<div>, <div>, <div>]
```

## En résumé

Comme vous avez pu le constater par vous même, les cas d'utilisation des
paramètres rest et de l'opérateur spread sont légion.

[Gérés](http://kangax.github.io/compat-table/es6/#spread_(...)_operator)
correctement par Babel et Traceur, ils vous permettront de rendre votre code
plus concis en évitant bien souvent l'écriture de boucles inutiles.
