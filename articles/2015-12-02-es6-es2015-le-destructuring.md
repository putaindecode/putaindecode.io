---
date: 2015-12-02
title: "ES6, ES2015 : le destructuring"
author: bloodyowl
oldSlug: js/es2015/destructuring
slug: es6-es2015-le-destructuring
---

## Le principe

Le destructuring consiste à assigner des variables provenant d'un objet ou
tableau en reposant sur leur structure.

```js
// Partons d'un objet `myObject`
var myObject = {
  foo: 1,
  bar: 2,
};

// Avec ES5, vous deviez par exemple faire
var foo = myObject.foo;
var bar = myObject.bar;

foo; // 1
bar; // 2

// Avec ES6, vous pouvez désormais l'écrire sous la forme
const { foo, bar } = myObject;
foo; // 1
bar; // 2

// On peut bien entendu destructurer la valeur retournée par une
// fonction, pour peu qu'il s'agisse d'un objet ou d'un tableau
const getMyObject = function() {
  return {
    foo: 1,
    bar: 2,
  };
};
const { foo, bar } = getMyObject();
foo; // 1
bar; // 2
```

## Les différentes syntaxes

### Tableau

```js
// Pour un tableau, on utilise une forme proche de la déclaration litérale de
// tableau, vous remarquerez que pour ignorer un item, il suffit de ne rien
// placer entre les virgules
const [first, second, , fourth] = [1, 2, 3, 4];
first; // 1
second; // 2
fourth; // 4
```

### Utiliser un nom différent de la clé

Pour un objet, par défaut, le nom de la variable correspond au nom de la clé.
Si, par exemple, vous avez déjà une variable portant le nom de la clé dans le
scope, vous pouvez choisir de nommer différemment votre variable.

```js
var myObject = {
  foo: 1,
  bar: 2,
};
const { foo: renamedFoo } = myObject;
renamedFoo; // 1
```

Cette syntaxe est, il faut tout de même le noter, peu lisible.

### Arguments de fonctions

```js
// On peut directement utiliser le destructuring dans une déclaration de
// fonction
function myFunction({ title, text }) {
  return title + ": " + text;
}

myFunction({ title: "foo", text: "bar" }); // "foo: bar"
```

### Nested destructuring

On peut aussi imbriquer les assignements.

```js
var myObject = {
  foo: {
    bar: 1,
  },
};
const {
  foo: { bar },
} = myObject;
bar; // 1
```

Attention cependant, si le destructuring au premier niveau ne fera que retourner
`undefined` si la valeur n'existe pas, vous aurez bel et bien une erreur avec le
nesting, puisqu'il essaiera d'aller chercher une propriété d'`undefined`. Pour
pallier ces soucis, rendez-vous pour l'article sur les
[defaults](/fr/articles/js/es2015/defaults/).
