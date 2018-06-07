---
date: "2016-06-07"
title: Introduction à Flow, pour du code qui tourne du premier coup
tags:
  - javascript
  - flow
  - type
authors:
  - bloodyowl
---

```javascript
document.body.firstChild.getBoundingClientRect();
```

Cette hypothétique ligne de code ne fonctionne pas tout le temps.

La raison c'est que `element.firstChild` est un `Node` et que tous les `Node` ne
possèdent pas la méthode `getBoundingClientRect`, que l'on trouve
systématiquement sur les `Element`, une classe héritant de `Node`.

Ce type d'erreur est assez commun, et malheureusement JavaScript n'en fout pas
une pour nous prévenir que _attention là ça peut merder_. Le langage préfère
nous prévenir au _runtime_, quand c'est déjà trop tard, parce que le bug s'est
produit.

Et c'est parce que JavaScript est un langage … à typage **faible** et
**dynamique**.

Faible, parce que si l'on effectue une opération entre deux valeurs ayant des
types incompatibles, JavaScript va essayer de convertir les types de la manière
qui lui semble la moins déconnante.

Exemple _feat. la conscience de JavaScript™_

```javascript
"1" + 1;
// bon alors, vu que la string peut être à peu près n'importe quoi,
// y'a un bon risque pour qu'une conversion en chiffre donne NaN,
// donc on va plutôt convertir le chiffre en string et faire une
// concaténation
("11");
```

```javascript
"1" * 1;
// putain mais qui a écrit cette merde encore ?
// bon ben là si c'est une multiplication j'ai pas le choix,
// on va convertir la string en nombre
1;
```

Dynamique, en opposition à statique, parce que les tests de type sont faits au
runtime.

```javascript
const toLowerCase = value => {
  return value.toLowerCase();
};

toLowerCase(3);
// bon alors, (3).toLowerCase c'est undefined
// undefined c'est pas une fonction, ERREUR
```

## Comment on a fait jusque là ?

### De la documentation

```javascript
/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
const multiply = (a, b) => {
  return a * b;
};
```

Ah bah c'est bien, maintenant toute l'équipe sait quels types sont attendus. Ça
n'empêche pas les erreurs au runtime mais au moins on est au courant.

### Aller à fond dans le typage dynamique

```javascript
const multiply = (a, b) => {
  if (typeof a !== "number") {
    throw new TypeError();
  }
  if (typeof b !== "number") {
    throw new TypeError();
  }
  return a * b;
};
```

On peut vérifier les types au runtime pour détecter les bugs possibles de
manière plus drastique en dev, on se retrouvera toujours avec un souci en
production, qui fera péter le comportement attendu.

### Faire comme si c'était pas grave

```javascript
const multiply = (a, b) => {
  if (typeof a !== "number") {
    a = 0;
  }
  if (typeof b !== "number") {
    b = 0;
  }
  return a * b;
};
```

On peut faire du "defensive programming". Au lieu de laisser le bug arriver, on
le tolère. Dans 99% des cas, le résultat ne sera absolument pas celui que l'on
attend, et on ne prévient même pas de quand ça foire.

## Comment ça se passe ailleurs ?

D'autres langages utilisent un typage statique, ce qui veut dire que le
programme ne compilera pas si les types peuvent être incorrects.

```ocaml
let value = "1";;

value + 1;;
```

OCaml, quand vous essayez de faire tourner ce code va vous sortir un gros

```
File "test.ml", line 3, characters 0-5:
Error: This expression has type string but an expression was expected of type
         int
```

## Et comment peut-on avoir ça en JS ?

C'est là que [Flow](http://flowtype.org) intervient. C'est un outil d'analyse
statique de JS. Il détecte les incompatibilités de types au sein du code.

```javascript
/* @flow */
const multiply = (a, b) => {
  return a * b;
};

multiply(1, "1");
```

```
6: multiply(1, "1")
   ^^^^^^^^^^^^^^^^ function call
3:   return a * b
                ^ string. This type is incompatible with
3:   return a * b
            ^^^^^ number
```

Dans le cas précédent, Flow analyse le code et comprend qu'une opération entre
`string` et `number` comporte une incompatibilité.

Du coup, on peut avoir du code qui tourne du premier coup parce qu'il a éliminé
toutes nos petites erreurs bêtes. En prime, ça permet d'arrêter de faire des
tests unitaires bateau sur les types.

Flow ajoute par ailleurs une syntaxe pour définir les types attendus dans une
situation donnée. On utilise `:` suivi du type attendu.

```javascript
/* @flow */
// les types built-ins sont compris naturellement par flow
const foo: string = "foo";
const bar: number = 3;
// on peut typer les valeurs contenues dans un array
const baz: Array<string> = ["foo", "bar"];
// on peut typer des structures
const object: { foo: string, bar: number } = { foo, bar };
// définir des valeurs litérales autorisées
const value: "enabled" | "disabled" = "enabled";
// des unions de types
const stringOrNumber: string | number = "foo";

function sum(array: Array<number>): number {
  return array.reduce((acc, item) => acc + item, 0);
}

class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}
// utiliser la relation prototypale pour typer une valeur
const person: Person = new Person("foo");
```

Flow permet également de créer des alias de types, ce qui est essentiel pour les
partager au sein d'une codebase. Une syntaxe pour importer les types de fichier
existe également. Ces imports sont supprimés du build final.

```javascript
/* @flow */
import type { MediaType } from "./MediaType";

export type UserType = {
  username: string,
  firstName?: string,
  lastName?: string,
  email: string,
  avatar: MediaType,
};
```

Lorsque l'on écrit du code qui se fout du type, on peut utiliser les _generics_,
qui est une sorte de placeholder de type.

```javascript
/* @flow */
// `T` est ici un type qui sera défini au call-site.
function findLast<T>(
  array: Array<T>,
  func: (item: T, index: number, array: Array<T>) => any,
): null | T {
  let index = array.length;
  while (--index >= 0) {
    const item = array[index];
    if (func(item, index, array)) {
      return item;
    }
  }
  return null;
}

// Flow sait que dans ce cas `T` est un nombre
const lastEvenNumber: ?number = findLast(
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  item => item % 2 === 0,
);
```

Flow permet également de typer par structure partielle attendue.

```javascript
/* @flow */
// l'inteface `named` permet de s'assurer que la valeur testée contient
// une méthode `getName` retournant une `string`
interface named {
  getName(): string;
}

class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}

const person: named = new Person("Luke Skywalker");
```

React est supporté directement, et Flow peut remplacer les `propTypes`.

```javascript
/* @flow */
import React, { Component } from "react";
import type { Element as ReactElement } from "react";
import type { UserType } from "../types/UserType";

// <DefaultProps, Props, State>
class User extends Component<void, Props, void> {
  render(): ReactElement {
    return <div>{user.username}</div>;
  }
}

type Props = {
  user: UserType,
};
```

## Mais c'est pas du JS valide

Pas de panique, pour ça il existe des plugins babel:

```console
npm install --save-dev babel-plugin-syntax-flow babel-plugin-transform-flow-strip-types
```

et vous n'avez plus qu'à ajouter `"syntax-flow"` et
`"transform-flow-strip-types"` à votre `.babelrc`.

## Mais je peux pas utiliser babel sur mon projet

C'est ballot, mais tu peux quand même utiliser Flow avec de jolis commentaires.

```javascript
/* @flow */
const add = (a /*: number */, b /*: number */ /*: number */) => {
  return a + b;
};

add(1, 1);
```

Allez, maintenant pas d'excuse pour ne pas typer son JS, donc ce serait pas mal
d'aller sur [le site de Flow](http://flowtype.org/docs/getting-started.html#_)
pour en savoir un peu plus.

Bisous bisous.
