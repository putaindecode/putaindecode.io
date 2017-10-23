---
date: "2015-12-10"
title: "ES6, ES2015 : itérateurs et générateurs"
tags:
  - JavaScript
  - ES6
  - ES2015
authors:
  - naholyr
---

Un gros morceau aujourd'hui : les itérateurs et les fonctions qui les génèrent,
appelées "générateurs". ES6/2015 apporte énormément de "sucres syntaxiques",
même s'ils sont terriblement pratiques. Les valeurs par défaut, l'affectation
par déstructuration, les fonctions flêchées… Tout ça n'apporte pas de réelle
nouvelle fonctionnalité. C'est un peu différent pour les générateurs qui vont
permettre de prendre le contrôle sur l'éxécution d'une fonction depuis
l'extérieur.

## Fonction "en pause"

Un nouveau mot-clé fait son apparition : `function*`, une fonction marquée par
l'astérisque n'est jamais exécutée directement, à la place, elle retourne un
*itérateur*. Un générateur est donc capable de s'interrompre (d'ailleurs, il
l'est par défaut). Il est également capable de reprendre là où il s'était arrêté
: l'itérateur retourné est un objet exposant une méthode `next` qui lorsqu'elle
est appelée demande au générateur de reprendre là où il en était.

```js
function* idleFunction() {
  console.log("World");
}

const iterator = idleFunction();
// L'exécution de la fonction est interrompue en attente d'être "débloquée"
console.log("Hello");
iterator.next(); // L'éxécution reprend et on affiche "World"
```

Notez qu'il ne s'agit pas de code **bloquant** : la fonction est mise en pause,
son traitement sera repris plus tard, pendant ce temps l'*event-loop* continue
sa petite vie.

## Reprise du traitement et émission de valeur avec `yield`

La méthode `next()` de l'itérateur retourne un objet possédant les propriétés
suivantes :

* `done` vaut `true` quand le générateur a terminé son exécution
* `value` est la valeur émise par le générateur dans cette portion de code

Comment émettre une valeur ? Le mot-clé `yield` a le double rôle de fournir une
valeur et de remettre en pause l'exécution de la fonction. Le principe étant
qu'on va émettre **plusieurs** valeurs, sinon on utiliserait simplement
`return`.

```js
function* numbers() {
  yield 1;
  yield 2;
}

const iterator = numbers();
iterator.next(); // { value: 1, done: false }
iterator.next(); // { value: 2, done: false }
iterator.next(); // { value: undefined, done: true }
```

Note : si notre générateur `return` une valeur, elle sera affectée à la
propriété `value` de la dernière itération.

### _Use case_ : listes infinies

Un premier _use case_ à ce stade est la possibilité de générer des listes de
longueur non définie à l'avance. On peut parcourir une suite dont on ne sait pas
à l'avance _combien_ d'éléments on veut, par exemple récupérer tous les éléments
de la suite de Fibonacci inférieurs à 100 :

```js
function* fibo() {
  let [a, b] = [1, 1];
  while (true) {
    // Who can stop me?
    [a, b] = [b, a + b];
    yield a;
  }
}

const iterator = fibo();
for (let n of iterator) {
  if (n >= 100) {
    break; // *I* can stop you
  }
  console.log(n);
}
// 1 2 3 5 8 13 21 34 55 89
```

Note : l'opérateur `for … of` sera vu plus en détail dans un prochain article.

## Passage de valeur au générateur

On a vu que `yield` permettait d'émettre une valeur depuis le générateur vers le
code contrôleur. Mais le sens inverse est également possible : la méthode `next`
de l'itérateur accepte une valeur en paramètre, qui sera alors retournée par
l'appel correspondant à `yield`. Exemple :

```js
function* math() {
  // Le premier appel à next() permet de "démarrer" le générateur
  const x = yield; // la valeur de la première itération sera undefined
  // x = le paramètre du second appel à next()
  const y = yield x + 1; // valeur de la seconde itération : x + 1
  // y = paramètre du troisième appel à next()
  yield y; // valeur de la troisième itération : y
  // le 4e appel (et +) à next() retournent { value: undefined, done: true }
}

const iterator = math();
iterator.next(42); // { value: undefined, done: false }
// Passer un paramètre au premier appel à next() n'est pas utile : cette valeur
// n'est pas accessible dans le générateur car aucun "yield" correspondant

iterator.next(33); // { value: 34, done: false }, x = 33 dans le générateur
iterator.next(27); // { value: 27, done: false }, y = 27 dans le générateur
iterator.next(); // { value: undefined, done: true }
```

Ça ne semble pas très utile vu comme ça, mais on peut passer à `next()`
n'importe quel type de donnée : une fonction, un objet, un autre itérateur… Les
possibilités sont infinies. On va en explorer une rapidement avec les promesses.

### _Use case_ : co-routines

Le code du générateur lui-même ne peut être réellement asynchrone : les appels à
`yield` se suivent de manière synchrone. Le code contrôleur par contre, est
libre d'appeler `next()` à loisir, et peut donc le faire de manière asynchrone.

On a donc des fonctions dont on peut choisir quand elles sont interrompues, et
quand elles peuvent reprendre leur traitement. Et si… notre générateur émettait
des promesses ? Histoire d'expliquer à son code contrôleur _quand_ il est sûr de
reprendre le traitement. Et si ce code contrôleur, voyant qu'il récupère une
promesse, attendait que cette dernière soit résolue pour transmettre au
générateur en retour la valeur résolue ? Dans ce cas le générateur pourrait
disposer de manière **synchrone** mais **non bloquante** de résultats de
traitements asynchrones :

```js
execAsync(function*() {
  console.log("Ajax request…");
  var rows = yield fetch("http://my.api/get");
  console.log("Work…");
  console.log("Save…");
  yield fetch("http://my.api/post");
  console.log("OK.");
}); // Ajax request… Work… Save… OK.
```

Ne serait-ce pas merveilleux ? C'est le _*use case*_ le plus intéressant pour
nous au quotidien, et c'est assez simple en fait :

```js
function execAsync(promiseGenerator) {
  const iter = promiseGenerator(); // en pause…

  function loop(iteration) {
    if (iteration.done) {
      // Le générateur a return'é, fin du game
      return iteration.value;
    }

    // c'est un générateur de promesse, dont on attend la résolution ici
    return iteration.value.then(result => {
      // La promesse est résolue, on peut repasser sa valeur au générateur
      const nextIteration = iter.next(result); // cette valeur est return'ée par
      // le même "yield" qui a émis la promesse, ça tombe bien :)

      // Puis on relance notre boucle, et on continue récursivement
      return next(nextIteration);
    });
  }

  const promiseIteration = iter.next(); // exécution reprise jusqu'au prochain "yield"
  // le générateur est remis en pause jusqu'au prochain appel à "iter.next"

  // Première itération de la boucle
  return loop(promiseIteration);
}
```

## More! more! more!

### Gestion d'erreur

Les erreurs, tout comme les valeurs, peuvent être émises dans les deux
directions. Le générateur peut `throw` vers le code contrôleur (le code est
synchrone) :

```js
function* fail() {
  yield 1;
  throw new Error("oops");
  yield 2;
}

const iterator = fail();
iterator.next(); // { value: 1, done: false }
try {
  iterator.next(); // throws
} catch (e) {
  e; // Error('oops')
}
```

Mais le code contrôleur peut également émettre une erreur vers le générateur
avec la méthode `throw` de l'itérateur :

```js
function* fail() {
  try {
    yield 1;
  } catch (e) {
    console.error(e);
  }
  yield 2;
}

const iterator = fail();
iterator.next(); // { value: 1, done: false }
iterator.throw(new Error("nope")); // affiche "[Error: nope]"
iterator.next(); // { value: 2, done: false }
iterator.next(); // { value: undefined, done: true }
```

Note : il faut bien se souvenir que le premier `next` sert à _débloquer_
l'exécution du générateur, qui va alors jusqu'au premier `yield`, évalue
l'expression émise, la transmet en retour de `next()`, et remet la fonction en
pause. C'est au second `yield` seulement que l'exécution reprend **à partir de
`yield 1`**. C'est une partie que je trouve contre-intuitive et que j'ai eu du
mal à assimiler.

### Délégation

L'opérateur `yield*` permet d'émettre les valeurs d'un autre itérateur, par
exemple :

```js
function* oneToThree() {
  yield 1;
  yield 2;
  yield 3;
}

function* zeroToFour() {
  yield 0;
  yield* oneToThree();
  yield 4;
}
```

Cela fonction bien sûr avec tous [les
_itérables_](/fr/articles/js/es2015/iterators/) : `yield * [1, 2, 3]` est valide
par exemple.

### Retour anticipé

Il est possible de terminer le traitement d'un générateur depuis le code
contrôleur avec la méthode `return` de l'itérateur. Tout se passera comme si le
générateur se terminait immédiatement avec la valeur de retour fournie.

```js
function* numbers() {
  yield 1;
  yield 2;
  yield 3;
}

const iterator = numbers();
iterator.next(); // { value: 1, done: false }
iterator.return(4); // { value: 4, done: true } → yield 2 and yield 3 are skipped
iterator.next(); // { value: undefined, done: true }
```

## Conclusion

Un habituel petit coup d'œil sur [la
compatibilité](https://kangax.github.io/compat-table/es6/#test-generators) :

* Les navigateurs modernes (donc pas IE)
* IE Edge ≥ 13
* Niveau polyfill, c'est vers Babel ou Traceur qu'il faudra se tourner

Les générateurs amènent tout un nouveau panel de fonctionnalités qui permettent
d'inverser la responsabilité : c'est le code appelant qui prend le pouvoir sur
la façon dont va s'exécuter la fonction appelée. Ils représentent le premier pas
vers d'autres concepts qui bouleverseront probablement votre façon de coder dans
quelques mois/années : fonctions asynchrones, observables… prennent leurs
racines dans les générateurs. Les comprendre permettra de mieux appréhender de
futures fonctionnalités.
