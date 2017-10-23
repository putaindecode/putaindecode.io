---
date: "2015-12-09"
title: "ES6, ES2015 : le protocole d'itération"
tags:
  - javascript
  - ES6
  - ES2015
  - iterators
authors:
  - ffesseler
---

Imaginez un concept si important que si vous l’enleviez du langage, il faudrait
en conséquence enlever le spread, le destructuring, les générateurs, le for…of
et bien d’autres. Ce concept, introduit dans l’ES6, est en fait un protocole :
le protocole d’itération.

Le principe est de définir une convention dans le langage, qui permet de
standardiser la façon dont des sources de données peuvent être traversées.

Première bonne nouvelle, ce protocole est assez simple à comprendre et se base
sur 2 "interfaces" (oui les guillemets c’est pour dire qu’on ne parle pas
d’interface au sens technique, puisqu’elles n’existent pas en JS).

La première interface, appelée **Iterator** permet à un objet de produire des
valeurs en séquence. Un objet est un Iterator lorsqu’il implémente une function
`next()` qui retourne un objet avec 2 propriétés :

* `value`: la valeur courante lors de l'itération
* `done` : un booléen qui indique si on a atteint la fin de l’itération ou non

Les appels successifs à la méthode `next()` d’un Iterator permettent donc de
traverser et récupérer les valeurs d’un objet. Prenons l’exemple de l’Iterator
retourné par un Array qui contiendrait 2 valeurs ("a" et "b") :

```js
iteratorArray.next();
// -> Object {value: "a", done: false}
iteratorArray.next();
// -> Object {value: "b", done: false}
iteratorArray.next();
// -> Object {value: undefined, done: true}
```

Mais comment récupérer l’Iterator d’un objet vas-tu me dire ? (n’est-ce pas ?)
Ça tombe bien, c’est le rôle de la seconde interface, appelée **Iterable**. Un
objet est Iterable s’il implémente une méthode particulière qui va retourner
l'Iterator. Cette méthode particulière (appelée _@@iterator_ dans la
spécification) doit être définie en utilisant le symbole `[Symbol.iterator]`.
(Les symboles seront expliqués dans un prochain article, pas de panique).

En reprenant l’exemple précédent, voici comment récupérer l’Iterator d’un Array
:

```js
const arr = ["a", "b"];
const iteratorArray = arr[Symbol.iterator]();
iteratorArray.next();
// -> Object {value: "a", done: false}
iteratorArray.next();
// -> Object {value: "b", done: false}
iteratorArray.next();
// -> Object {value: undefined, done: true}
```

L’exemple ci-dessus illustre donc l’implémentation du protocole par l’Array. Il
n’est pas très utile en soi, en voici donc un autre qui va permettre de boucler
sur les valeurs et les afficher :

```js
const arr = ["a", "b"];
var iterator = arr[Symbol.iterator]();

var result = iterator.next();
while (!result.done) {
  console.log(result.value);
  result = iterator.next();
}
// 'a'
// 'b'
```

De manière générale, quand un objet qui implémente le protocole d’itération est
traversé, sa méthode _@@iterator_ est appelée (une seule fois donc) et
l’Iterator retourné est utilisé pour boucler sur ses valeurs.

# Consommateurs d'Iterable

La deuxième bonne nouvelle, c’est que plusieurs concepts du langage tirent
avantage de ce protocole :

* Certaines syntaxes s’attendent à recevoir des Iterables

```js
const arr = ["a", "b"];

// La syntaxe à laquelle on pense immédiatement est la syntaxe « for .. of »
// qui permet de boucler sur les valeurs des Iterables.
for (val of arr) {
  console.log(val);
}

// Le spread qui permet d'insérer facilement des valeurs dans un Array
// utilise également des Iterable
["0", ...arr, "1"]; // 0, a, b, 1

// yield nécessite également des Iterable
function* gen() {
  yield* arr;
}
gen().next(); // { value:"a", done:false }

// Le destructuring avec le pattern Array
const [x, y] = arr; // x = 'a',  y = "b"
```

* Des API acceptent également des Iterables

```js
const arr = ["a", "b", "b"];

// Certains constructeurs acceptent des Iterable

// Set et Weakset
const set = new Set(arr);
set.has("b"); // true
// Map et WeakMap
const map = new Map(arr.entries()); // Attention, le constructeur attend un ensemble [clé, valeur]
map.get(0); // 'a'

// Ou encore les API suivants :

Array.from(iterable); // transforme n'importe quel Iterable en Array.
Promise.all(iterableCollectionDePromises); // n'importe quel Iterable qui contient un ensemble de Promises
Promise.race(iterableCollectionDePromises); // idem
```

# Built-in Iterable

Troisième bonne nouvelle, plusieurs objets du langage implémentent déjà ce
protocole :

```js
// évidemment les Array
const arr = ["l", "o", "l"];
for (v of arr) {
  console.log(v);
  // 'l'
  // 'o'
  // 'l'
}

// les String
const str = "lol";
for (v of str) {
  console.log(v);
  // 'l'
  // 'o'
  // 'l'
}

// les Map et Set (mais PAS WeakMap et WeakSet)
const map = new Map().set("l", 1).set("o", 2);
for (v of map) {
  console.log(v);
  // ["l", 1]
  // ["o", 2]
}
const set = new Set().add("l").add("o");
for (v of map) {
  console.log(v);
  // 'l'
  // 'o'
}

// Les TypedArray que vous utilisez tous les jours
const int16 = new Int16Array(2);
int16[0] = 42;
for (v of int16) {
  console.log(v);
  // 42
  // 0
}

// Même l'objet spécial arguments (que vous
// ne devriez plus utiliser avec l'ES6) est un Iterable
function test() {
  for (v of arguments) {
    console.log(v);
    // 'l'
    // 'o'
    // 'l'
  }
}
test("l", "o", "l");

// Les NodeList retournés par l'API DOM également !
const matches = document.querySelectorAll("div");
for (m of matches) {
  console.log(m);
  // <div id="topSection">
  // <div id="brandLogo">
  // ...
}
```

Autre point : Array, TypedArray, Map, Set sont des Iterable mais définissent
aussi des méthodes qui retournent également des Iterable (ça va, vous suivez
toujours ?) :

* entries() retourne un ensemble des clés/valeurs
* keys() retourne les clés
* values() retourne les valeurs

```js
for (cleVals of arr.entries()) {
  console.log(cleVals);
  // [0, "l"]
  // [1, "o"]
  // [2, "l"]
}
```

Détail important, `Object` n'est pas Iterable mais il n'est pas impossible de
voir apparaitre dans l'ES7 les méthodes entries(), keys() et values() sur Object
(cf. [la proposition
spec](https://github.com/tc39/proposal-object-values-entries)).

# Conclusion

J’espère que cet article a bien illustré l’importance de ce protocole dans le
langage. Nous avons vu ci-dessus que de nombreux concepts du langage tirent déjà
avantage de ce protocole mais il est au moins aussi important de noter que cela
permet d’établir une convention sur laquelle des librairies externes peuvent
s’appuyer.

Elles peuvent le faire de 2 manières :

* en proposant des sources de données qui implémentent le protocole (ex: liste
  chaînée)
* en tant que consommateur du protocole (ex: un algorithme de tri)

# Un dernier verre pour la route

Les articles suivants vous permettront d'aller encore plus loin dans le sujet.
Vous y apprendrez notamment qu’un iterator peut retourner en option 2 autres
méthodes, qu’un générateur est à la fois un Iterable et un Iterator, qu’un
Iterable peut être infini ou encore des exemples d’implémentations divers et
variés :

* [Iterables and iterators in ECMAScript
  6](http://www.2ality.com/2015/02/es6-iteration.html)
* [Iteration
  Protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
* [ES6 in depth : iterators and the for of
  loop](https://hacks.mozilla.org/2015/04/es6-in-depth-iterators-and-the-for-of-loop/)
* [ES6 iterators in depth](https://ponyfoo.com/articles/es6-iterators-in-depth)

La pratique restant le meilleur moyen de se former, le site [ES6
Katas](http://es6katas.org/) est très bien fait pour s'exercer.
