---
date: 2015-12-11
title: "ES6, ES2015 : les Maps & WeakMaps"
author: bloodyowl
oldSlug: js/es2015/maps-weakmaps
slug: es6-es2015-les-maps-weakmaps
---

## Maps

Comme les objets, les maps et weak maps introduites avec ES6 sont des
dictionnaires. La différence avec un objet, c'est que n'importe quelle valeur
peut être utilisée comme clé.

```javascript
const myMap = new Map();
myMap.set(window, 1);
myMap.get(window); // 1
```

Pour créer une map avec des valeurs, on peut passer un tableau de clés/valeurs
en argument :

```javascript
const myMap = new Map([[1, "foo"], [window, "bar"]]);
```

Pour tester si une clé est présente, on peut utiliser la méthode `has` :

```javascript
map.has(1); // false
```

On peut itérer sur les entrées d'une map à l'aide de `forEach` :

```javascript
const myMap = new Map([[1, "foo"], [window, "bar"]]);

myMap.forEach((value, key) => {
  // do something
});
```

On peut aussi itérer à l'aide du `for … of` :

```javascript
for (const [key, value] of myMap) {
  console.log(key, value);
}
```

Ainsi que convertir la map en tableau à l'aide du spread, puisqu'une map est
itérable :

```javascript
const myEntries = [...myMap]; // […[key, value]]
const myEntries = [...myMap.entries()]; // alternativement
```

On peut aussi récupérer des itérables par clés et valeurs :

```javascript
const myKeys = [...myMap.keys()];
const myValues = [...myMap.values()];
```

Particularité, la valeur `NaN`, qui en JS n'est pas égale à elle même, est bien
gérée :

```javascript
myMap.set(NaN, 1);
myMap.get(NaN); // 1
```

Une utilisation possible des Maps est la fonction `dedupe` pour éliminer les
doublons d'un array :

```javascript
const dedupe = array => {
  return [...new Map(array.map(item => [item, true])).keys()];
};

dedupe([1, 1, 2, 3, 4, 4]); // [1, 2, 3, 4]
```

## WeakMaps

Les WeakMaps sont comme les Maps mais qui ne gardent pas les valeurs "oubliées".
Le garbage collector ne tient donc pas compte des weak maps.

Les WeakMaps ne possèdent pas de méthodes d'itération et n'acceptent pas de
valeurs primitives comme clés.

```javascript
const myWeakMap = new WeakMap();
myWeakMap.set(1, 1); // TypeError
```

```javascript
const myWeakMap = new WeakMap();
myWeakMap.set(window, 1)(() => {
  const object = {};
  myWeakMap.set(object, 2);
})();
// myWeakMap a oublié la valeur 2, car `object` n'est plus accessible
// seule la clé `window` persiste.
```

Un usage possible est le stockage d'informations lié à une instance de classe,
permettant de "cacher" cette information de l'instance :

```javascript
const callbacks = new WeakMap();

class SimpleEventEmitter {
  constructor() {
    callbacks.set(this, []);
  }
  addEventListener(callback) {
    callbacks.set(this, callbacks.get(this).concat(callback));
  }
  removeEventListener(callback) {
    callbacks.set(this, callbacks.get(this).filter(func => func !== callback));
  }
  triggerEvent(...args) {
    callbacks.get(this).forEach(func => func(...args));
  }
}
```
