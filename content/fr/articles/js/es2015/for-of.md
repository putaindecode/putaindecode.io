---
date: "2015-12-16"
title: "ES6, ES2015 : la boucle for..of"
tags:
  - javascript
  - ES6
  - ES2015
  - for..of
authors:
  - Freezystem
---

## Introduction

Avec l'arrivée de nouveaux objets itérables, ECMAScript avait la nécessité de
s'enrichir de
nouvelles façons de parcourir ces derniers. Dans l'unique souci de maintenir la
rétro-compatibilité
avec l'existant, l'ES6 se devait de garder la boucle `for..in` intacte.

> Mais alors, comment créer une variante de cette même boucle avec des capacités
améliorées ?  

La solution est simple : "Bienvenue au mot-clé `of` !"

Mais avant d'en dire plus, et pour comprendre l'utilité de ce nouveau mot-clé,
revoyons un peu l'existant.

## Le bon vieux `for..in`

Tout _JavaScript enthusiast_ qui se respecte connaissait déjà la fameuse boucle
`for..in`
dont l'utilité première est d'itérer sur les différentes clés d'un objet ou d'un
tableau.

```js
const obj = { foo : 'hello', bar : 'world' };

for ( const key in obj ) {
  console.log( key + '->' + obj[key] );  // 'foo->hello', 'bar->world'
}
```

La boucle `for..in`, malgré son apparente simplicité d'utilisation, cache
certains pièges :
 - Lors de l'itération sur un tableau la valeur de l'index est convertie en
chaîne
 de caractères : "0", "1", "2", etc. Cela peut potentiellement poser problème
lors de
 l'utilisation de l'index dans des opérations de calcul.
 - La boucle itère sur l'ensemble des clés du tableau, mais aussi sur chacune de
ses propriétés.

    ```js
    const arr = ['foo', 'bar'];
    arr.oups = 'baz';

    for ( const key in arr ) {
      console.log( key + '->' + arr[key] ); // '0->foo', '1->bar', 'oups->baz'
    }
    ```
 - L'ordre d'itération sur l'ensemble des clés d'un objet peut varier selon
l'environnement d'éxecution du code.

## La methode alternative `.forEach()`

La boucle
[`Array.prototype.forEach()`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/forEach)
permet une itération plus sécurisée, mais présente certains autres inconvénients
tels que :

 - L'impossibilité d'interrompre la boucle avec les instructions traditionnelles
`break;` et `return;`
 - Il s'agit d'une méthode réservée aux tableaux.

## `for..of` à la rescousse

Le consortium ECMA a donc décidé de procéder à la création d'une nouvelle
version améliorée
de la boucle `for..in`. Ainsi naquit la boucle `for..of` qui coexistera
désormais avec la précédente,
permettant de maintenir la rétro-compatibilité avec les versions antérieures de
la norme.

Le principe est le même : parcourir n'importe quel type _d'objet itérable_.

Dans sa forme la plus simple, la boucle `for..of` permet donc d'itérer sur
l'ensemble des valeurs des clés d'un tableau.

```js
const arr = ['hello', 'world'];
arr.baz = 'and mars';

for ( const arrValue of arr ) {
  console.log( arrValue ); // 'hello', 'world'
}
```

La boucle `for..of` peut aussi itérer sur des types plus complexes. Examinons
cela de plus près.

### Les _Strings_

Dans ce cas, chaque caractère est traité comme une entité Unicode.

```js
const str = 'sm00th';

for ( const chr of str ){
  console.log(chr); // 's', 'm', '0', '0', 't', 'h'
}
```

### Les _NodeList_

```js
// Note: cela ne fonctionnera que sur les environnements
// implémentant NodeList.prototype[Symbol.iterator]

// ce code ajoute une class "read" à toutes les balises <p>
// contenues dans la(les) balises <article>

const articleParagraphs = document.querySelectorAll("article > p");

for ( const paragraph of articleParagraphs ) {
  paragraph.classList.add("read");
}
```

### Les _Maps_

```js
const m = new Map([['foo', 'hello'], ['bar', 'world']]);

for ( const [name, value] of m ) {
  console.log(name + "->" + value); //"foo->hello", "bar->world"
}
```

### Les _Sets_

```js
const s = new Set(['foo', true, 42]);

for ( const value of s ) {
  console.log(value); // 'foo', true, 42
}
```

### Les _Generators_

```js
function *foo() {
    yield 'foo';
    yield false;
    yield 42;
    yield 'bar';
}

for (const v of foo() ) {
    console.log( v ); // 'foo', false, 42, 'bar'
}
```

> Et les objets traditionnels dans tout ça ?

Étonnamment, les objets ne peuvent pas être parcourus avec cette nouvelle 
boucle sauf s'ils définissent le symbole `Symbol.iterator`. Heureusement, 
il existe une solution de contournement par l'utilisation de
[`Object.keys()`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object/keys)
ou encore 
d'[`Object.values()`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object/values)
et
[`Object.entries()`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object/entries)
(ajouts ECMAScript7).

```js
const obj = { foo : 'hello', bar : 'world' };

for ( const key of Object.keys(obj) ) {
  console.log(key + "->" + obj[key]); // 'foo->hello', 'bar->world'
}

```

Exemple définissant un itérateur :

```js
const iterableObj = {
  *[Symbol.iterator]() {
    yield* Object.entries(obj);
  }
};

for ( const [key, val] of iterableObj ) {
  console.log(key + "->" + val); // 'foo->hello', 'bar->world'
}
```

## En résumé

`for..of` vient compléter les lacunes de `for..in` et permet
une itération simplifiée sur les _objets itérables_ tels que :

* [Array](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array)
* [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String)
* [Maps & WeakMaps](http://putaindecode.io/fr/articles/js/es2015/maps-weakmaps/)
* [Sets & WeakSets](http://putaindecode.io/fr/articles/js/es2015/sets-weaksets/)
* [Generators](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Instructions/function*)
* [NodeList](https://developer.mozilla.org/fr/docs/Web/API/NodeList)
* [arguments](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Fonctions/arguments)

De plus, `for..of` résout à présent les pièges tels que l'ordre d'itération non
constant ou la coercion
automatique des index en chaîne de caractères.

## Pour aller plus loin

La boucle `for..of` est donc une corde de plus à l'arc de l'ES6 qui
permet de parcourir, de manière native, les tout nouveaux _objets itérables_ du
langage.

Pour en savoir plus sur ses spécificités :

* [Documentation
MDN](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Instructions/for...of)
* [Le post de Jason
Orendorff](https://hacks.mozilla.org/2015/04/es6-in-depth-iterators-and-the-for-of-loop/)
* [Le post de Dave Herman](http://tc39wiki.calculist.org/es6/for-of/)
* [Specification
ECMA-262](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-for-in-and-for-of-statements)
