---
date: "2015-12-17"
title: "ES6, ES2015 : les symboles"
tags:
  - javascript
  - ES6
  - ES2015
authors:
  - divarvel
---

Dans sa politique d'enrichissement des types primitifs, ES6 introduit les
symboles. Chers aux développeurs de nombreux langages, Ruby en tête, les
symboles constituent une étape de plus vers l'éradication du *stringly-typed
programming*. En effet, les symboles fournissent un moyen plus robuste de
représenter des identifiants.

## Créer un symbole

La fonction `Symbol()` permet de créer de nouveaux symboles :

```javascript
// Un symbole tout bête
const mySymbol = Symbol();
typeof mySymbol === 'symbol' // true

// Un symbole avec une description
const myOtherSymbol = Symbol("description");


// Chaque symbole est unique
const yetAnotherSymbol = Symbol("description");
yetAnotherSymbol === myOtherSymbol; // false
```

Chaque symbole créé avec `Symbol` est unique et immutable. Cela permet
d'éviter les collisions : on ne peut pas avoir deux symboles identiques par
erreur.

## Utiliser les symboles pour l'implémentation d'un *enum*

Plutôt que d'utiliser des chaines de caractères comme valeurs possible d'un
*enum*, on peut utiliser des symboles.

```javascript
const ANIMAL_DOG = Symbol();
const ANIMAL_CAT = Symbol();

function getDescription(animal) {
  switch(animal) {
    case ANIMAL_DOG:
        return "Loving animal";
    case ANIMAL_CAT:
        return "Evil, sadistic animal";
  }
}
```

De cette manière, on ne risque pas de mélanger accidentellement une chaine de
caractères fournie par l'utilisateur et la valeur d'un *enum*. On est obligé
de passer par une phase de parsing et de vérification.

## Utiliser un symbole comme clé

Il est possible d'employer des symboles comme clés d'un objet ou d'une classe.

```javascript
const myKey = Symbol("MY_KEY");

const myMutableObject = {};
myMutableObject[myKey] = "a value";

// En utilisant les *computed property keys*
const myObj = {
    [myKey]: "a value"
}
```

Grâce à l'unicité des symboles, plus de problèmes de collision entre les clés
d'un objet. On peut laisser l'utilisateur étendre des objets sans prendre le
risque d'avoir des propriétés écrasées par erreur.

Par exemple, l'itérateur d'un objet employé par `for..of` est une propriété
qui a pour clé un symbole, accessible via `Symbol.iterator`.

```javascript
const myIterableObject = {
  * [Symbol.iterator]() {
    yield "One";
    yield "Two";
    yield "Three";
  }
}

// Affichera One, Two et Three
for(x of myIterableObject) {
  console.log(x);
}

// Plantera avec 'TypeError: undefined is not a function'
for(x of {}) {}
```

Différents symboles (les *well-known symbols*) sont disponibles pour indexer
des propriétés qui personnalisent le comportement des objets :
`Symbol.iterator` pour itérer sur les valeurs d'un objet, `Symbol.hasInstance`
pour modifier le retour de `instanceof`, …

Ces propriétés sont ainsi protégées contre tout accès involontaire.

### Différences avec l'utilisation d'une chaine de caractères comme clé

Les propriétés indexées par des symboles ne sont pas accessibles depuis les
fonctions habituellement utilisées pour itérer sur les propriétés ou les valeurs.

#### Énumération

Les propriétés indexées par des symboles ne sont pas visitées par `for..in`,
ni listées par `Object.keys` ni `Object.getOwnPropertyNames`. En revanche,
elles sont listées par `Object.getOwnPropertySymbols`.

```javascript
const myObject = {
  [Symbol()]: "symbol-keyed value",
  "key": "string-keyed value"
}

Object.getOwnPropertyNames(myObject) // [ "key" ]
Object.getOwnPropertySymbols(myObject) // [ Symbol() ]
```

Ainsi, du code utilisant `Object.getOwnPropertyNames` et s'attendant à
recevoir des chaines de caractères ne sera pas cassé par l'utilisation de
symboles en tant que clés.

#### `JSON.stringify`

Les propriétés indexées par un symbole sont ignorées par `JSON.stringify`.


```javascript
JSON.stringify({
  [Symbol()]: "symbol-keyed value",
  "key": "string-keyed value"
}) // '{"key":"string-keyed value"}'
```

## Registre global des symboles

Un symbole est unique, une fois créé, il est impossible d'en créér un autre
ayant les mêmes propriétés. Il faut donc que le symbole créé soit accessible
d'une manière ou d'une autre pour pouvoir l'employer. En revanche il est
possible de créer un symbole dans un registre global accessible de n'importe
où, grâce à `Symbol.for`.

```javascript
// Renvoie un symbole, en le créant s'il n'existe pas déjà
const mySymbol = Symbol.for("mySymbol")

mySymbol === Symbol.for("mySymbol") // true

// Il est possible de récupérer la clé avec laquelle un symbole a été inséré
// dans le registre
Symbol.keyFor(mySymbol) // 'mySymbol'

// Un symbole non créé dans le registre n'est pas disponible
Symbol.keyFor(Symbol()) // undefined
```

`Symbol.for` permet donc de partager des symboles partout dans le code, y
compris dans des contextes d'exécution différents (différentes frames).

## Support

Côté navigateur, les symboles sont supportés depuis Chrome 38, Firefox 36,
Opera 25 et Safari 9. Rien chez Internet Explorer. Le support Babel est
limité.

Côté Node.js, le support des symboles est là depuis la version `0.12`.

Les *well-known symbols* ne sont pas tous disponibles sur les différentes
plateforme, leur présence dépendant des fonctionnalités auxquelles ils sont
liés.

## Pour résumer

Les symboles fournissent un moyen de créer des tokens uniques, ce qui est bien
plus robuste que l'utilisation de chaines de caractères. L'utilisation des
symboles pour représenter les valeurs d'un *enum* permet d'éviter les
collisions et le mélange avec des données non qualifiées.

En tant que clés d'un objet, les symboles permettent d'éviter les collisions
et d'avoir des *méta-propriétés* séparées et indépendantes des propriétés
indexées par des clés. Les propriétés indexées par des symboles ne peuvent pas
être lues, modifiées ou listées par erreur, ce qui leur offre un certain degré
de protection contre des manipulations accidentelles.


## Pour aller plus loin

 - La documentation des symboles sur MDN <https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Symbol>
 - Un article complet sur le fonctionnement des symboles et leur cas d'utilisation. <http://www.2ality.com/2014/12/es6-symbols.html>
