---
date: 2015-12-08
title: "ES6, ES2015 : Les object literals"
author: lionelB
oldSlug: js/es2015/object-literals
slug: es6-es2015-les-object-literals
---

Là encore, cette évolution du langage amène un sucre syntaxique bien pratique
lors de l'initialisation d'objets.

## Nom des propriétés raccourcies

Lorsqu'on crée un objet, il arrive fréquemment que lorsqu'on définisse une
propriété depuis une variable, la clé porte le même nom que la variable.

```js
var firstname = "Robert";
var lastname = "Laiponje";

return {
  firstname: firstname,
  lastname: lastname,
};
```

Avec ES2015, on va pouvoir l'écrire comme ça :

```js
const firstname = "Robert";
const lastname = "Laiponje";

return {
  firstname,
  lastname,
};
// { firstname: "Robert", lastname: "Laiponje" }
```

De la même manière, on pourra déclarer des méthodes en se passant du mot clé
`function`. Idem pour les _getter_ / _setter_.

```js
const obj = {
  get email() {
    return this.email();
  },
  set email(email) {
    this.email = email;
  },
  validateEmail(email) {
    return true;
  },
};
```

## Nom de propriétés calculées

La dernière nouveauté concernant les _literal objects_ va nous permettre de
créer des noms de propriétés depuis une expression, directement à la création de
l'objet. Auparavant, il fallait procéder en 2 temps, création puis affectation.

```js
function action(type, data) {
  var payload = {};
  payload[type] = data;
  return payload;
}
```

En ES2015, cela donnerait :

```js
function action(type, data) {
  return {
    [type]: data,
  };
}
```

**À noter** qu'avec l'introduction des propriétés calculées, on va pouvoir aussi
déclarer plusieurs fois une même propriété, la dernière déclaration écrasant les
précédentes (et plus de `syntaxError`).
