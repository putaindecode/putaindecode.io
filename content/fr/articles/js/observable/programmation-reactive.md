---
date: "2017-11-16"
title: "La programmation reactive avec RxJS"
tags:
  - Observable
  - JavaScript
authors:
  - wyeo
---

La [programmation réactive](https://www.reactivemanifesto.org/fr) est un
paradigme de programmation dont le concept repose sur l'émission de données
depuis une ou plusieurs sources (producteurs) à destinations d'autres éléments
appelés _consommateurs_. Elle repose sur le design pattern
[Observable - Observer](http://design-patterns.fr/observateur).

Dans ce paradigme, on traite toutes les données, quelles qu'elles soient, de la
même façon: au travers de flux. Un flux, c'est en gros une structure qui balance
une ou plusieurs données dans le temps au travers d'observables, comme on l'a vu
dans le [post précédent](/fr/articles/js/observable/).

![Programmation Réactive](https://i.imgur.com/NLqK4bF.png)

Un flux, pour résumer, c'est simplement de la donnée qui arrive de manière
ordonnée dans le temps. Comme expliqué précédemment, trois types de signaux
peuvent être émis par un flux : une valeur, une erreur ou un signal de fin
indiquant que le flux n'a plus de données à envoyer.

L'idée des flux, c'est cool, mais comment on manipule ça ?

## La bibliothèque RxJS

[RxJS](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/libraries/main/rx.md)
est l'implémentation JavaScript de [ReactiveX](http://reactivex.io/),
_extensions-réactives_ en français, un projet visant à implémenter sous la forme
de bibliothèque les outils nécessaire pour utiliser le paradigme réactif dans de
multiples languages. Aussi appelé le **Lodash** des données asynchrones, il
implémente la notion d'observables-observer et fournit tout un panel
d'opérateurs pour travailler avec les données qui y passent.

Vous pourrez facilement intégrer progressivement Rx à votre codebase à l'aide
d'opérateurs tels que `Rx.from` (qui crée un observable à partir d'une valeur
synchrone), `Rx.fromEvent` (qui va carrément écouter les évenement DOM d'un
élement pour en faire un observable), `Rx.fromPromise`, `Rx.Ajax` et bien
d'autres.

Exemple tout simple : on va compter le nombre de clics sur un bouton.

```JavaScript
const Rx = require('rxjs')

// on écoute les clics
const button$ = Rx.Observable.fromEvent(document.getElementById("button"), "click")
  // scan est l'équivalent de reduce ; il va garder l'accumulateur et retourner le nouveau à chaque clic
  .scan(count => count + 1, 0)
  .subscribe(clickCount => {
    // on met ça dans le DOM à chaque changement
    document.getElementById("count").innerHTML = "You clicked " + clickCount + " times"
  })
```

Si vous vous demandez pourquoi `button$` et pas `button`, c'est que le suffixe
**$** est une convention montrant qu'il s'agit d'un flux.

La programmation réactive peut être compliquée à se représenter, ainsi, pour
mieux la visualiser, il existe les [`marbles diagrams`](http://rxmarbles.com/)
qui vous permettront de mettre en rapport entrée et sortie de chaque
transformation de la data avec une idée plus concrète que de simples bouts de
code.

Le cœur de la programmation réactive, c'est de concevoir votre programme comme
quelque chose qui est valable à n'importe quel point dans le temps, et c'est son
avantage principal. Si une donnée change, toutes les parties de votre programme
l'utilisant en seront notifiées et pourront agir en conséquence.

Si vos programmes récupèrent des données de manière asynchrone (et il y a de
fortes chances pour que ce soit le cas), ça peut valoir le coup de jeter un œil
à ce paradigme, vous pourrez peut-être vous enlever un paquet d'épines du pied.

Dans le prochain chapitre, nous verrons les cas d'usages des Observables au sein
d'une application React/Redux.
