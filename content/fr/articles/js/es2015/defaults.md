---
date: "2015-12-03"
title: "ES6, ES2015 : les valeurs par défaut des arguments"
tags:
  - javascript
  - ES6
  - ES2015
authors:
  - naholyr
---

Fatigués de taper ``if (typeof x === 'undefined') x = defaultValue`` ? Là encore
ES6 va nous apporter une solution élégante.

# Valeurs par défaut

L'opérateur ``=`` permet maintenant en plus d'affecter une valeur à une variable
de définir une valeur par défaut à un paramètre.

## Paramètres de fonction

Il est maintenant possible de spécifier une valeur par défaut à un paramètre de
fonction. Cette valeur sera utilisée si le paramètre n'est pas fourni, ou qu'il
est explicitement défini à *undefined*.

```js
function incr (value, step = 1) {
  return value + step
}

incr(41) // 42
incr(41, undefined) // 42
incr(33, 9) // 42
```

### Valeurs par défaut dynamiques

On peut spécifier une expression en tant que valeur par défaut. Cette expression
sera évaluée **à l'appel de la fonction**, pas lors de sa déclaration.

```js
let defaultWho = 'world!'
function hello (who = defaultWho.toUpperCase()) {
  return 'Hello ' + who
}

hello() // 'Hello WORLD!'
defaultWho = 'Anyone?'
hello() // 'Hello ANYONE?'
```

### Réutilisation des paramètres précédents

Dans l'expression d'une valeur par défaut, on peut réutiliser les paramètres
**précédents** de la fonction :

```js
function foo (x = 1, y = x + 1) {
  return x + y
}

function bar (x = y + 1, y = 1) {
  return x + y
}

foo() // 1 + (1 + 1) → 3
bar() // (undefined + 1) + 1 → NaN
```

### Cas particulier : TDZ (Temporal Dead Zone)

Une *temporal dead zone* désigne une zone du programme où une variable "existe"
mais n'est pas encore accessible tant qu'elle n'a pas reçu de valeur.

L'exemple suivant semble très logiquement invalide :

```js
function foo (x = x) { // throws ReferenceError?
}
```

En effet, au moment de l'appel à la fonction, ``x`` n'a pas encore été défini,
et ne peut donc être utilisé comme valeur par défaut. Il semble que cet exemple
devrait [lever une erreur](http://dmitrysoshnikov.com/ecmascript/es6-notes-default-values-of-parameters/#tdz-temporal-dead-zone-for-parameters).

Néanmoins, les règles de portée font que ce programme est également invalide :

```js
const x = 1
function foo (x = x) { // Le 'x' référencé ici est le paramètre
}
```

On est bien, dès l'évaluation des valeurs par défaut, dans le scope de la
fonction, et dans ce scope ``x`` fait référence au paramètre (pas encore défini)
et pas à la variable du dessus.

**ProTip:  ne réutilisez pas 3 fois le même nom de variable**
(ça pourra aussi aider à la compréhension).

## Décomposition

De la même manière que pour les paramètres de fonction, les affectations par
décomposition
([destructuring](/fr/articles/js/es2015/destructuring/))
peuvent bénéficier de valeurs par défaut.

```js
obj // {z: 42}
const { x = 1, y = x + 1, z, w } = obj
w // undefined
x // 1
y // 2
z // 42
```

Pour rappel, l'affectation de l'exemple précédent aurait été écrit de cette
manière en ES5 :

```js
var x = (obj.x === undefined) ? obj.x : 1
var y = (obj.y === undefined) ? obj.y : x + 1
var z = obj.z
var w = obj.w
```

# Enjoy!

Il n'y a *a priori* plus aucune raison de croiser un test sur ``undefined`` dans
votre code une fois passé à ES6.

Un petit mot sur la compatibilité (à la date de cet article) : seul Firefox ≥ 43
implémente les valeurs par défaut, et encore seulement pour les paramètres de
fonctions.
Il faudra donc utiliser [Babel](http://babeljs.io) ou Traceur pour en profiter.
