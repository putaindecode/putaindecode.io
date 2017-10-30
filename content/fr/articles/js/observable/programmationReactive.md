---
 date: "2017-11-7"
 title: "La programmation reactive avec RxJS"
 tags:
   - Observable
   - JavaScript
 authors:
   - wyeo
 ---

# La programmation reactive avec RxJS

La [programmation reactive](https://www.reactivemanifesto.org/fr) est un paradigme de programmation dont le concept repose sur l'émission de données depuis une ou plusieurs sources (producteurs) à destinations d'autres éléments appelés *consommateurs*. Elle repose sur le design pattern [Observable - Observer](http://design-patterns.fr/observateur) implémenté par les observables, aisément manipulable via les operateurs.

**Programmation réactive = programmation avec des flux de données asynchrones**. Tout peut être un flux : les variables, les entrées utilisateurs, les propriétés, les caches, les structures de données, etc.
Un flux peut être utilisé comme entrée d'un autre. Plusieurs flux peuvent aussi être combinés pour en produire un nouveau. Deux flux peuvent être fusionnés. Un flux peut être filtré pour produire un nouveau flux avec uniquement les événements qui vous intéressent. Vous pouvez transformer chaque événement d'un flux pour en produire un nouveau.

![Programmation Reactive](https://camo.githubusercontent.com/36c0a9ffd8ed22236bd6237d44a1d3eecbaec336/687474703a2f2f692e696d6775722e636f6d2f634c344d4f73532e706e67)

Un flux est simplement une séquence d'événements en cours de production et ordonnés dans le temps. Trois types de signaux peuvent être émis par un flux : une valeur (d'un certain type), une erreur, ou un signal « fin ». Le signal de « fin » est par exemple envoyé quand l'utilisateur ferme la fenêtre qui émettait les événements souris.

Dans [l'introduction aux observables](http://putaindecode.io/fr/articles/js/observable/), nous avons découvert cet objet permettant de souscrire à une source de donnée avec un `Observer`. Cette mécanique permet de réagir aux données émisent par l'`Observable` par le biais de `Observer`, et cela pendant toute la durée du **flux**.

Maintenant, voyons comment nous pouvons manipuler ce flux grâce aux opérateurs de transformation.

## Les opérateurs

Un Observable peut se représenter comme un tableau dont les elements arrivent avec le temps. Vous connaissez probablement les méthodes `Array.prototype.map`, `Array.prototype.filter`. Nous appliquons le même principe avec les operateurs sur un observable :

```JavaScript
KeyBoardObservable
  .map(x => String.fromCharCode(keyCode))
  .filter(x => /[a-z]/.text(x))
  .subscribe(observer)
```

Les opérateurs peuvent être coupler dans l’ordre que l’on souhaite. Mais pour accéder au résultat de notre transformation, nous devrons faire appel à **l'operateur `.subscribe()`** et lui appliquer un `Observer`.

Schema d’exploitation d’un observable sans opérateur :

	ArrayObservable
		|--> 1, 2, 3 --> .subscribe(Observer) // Affiche 1, 2, 3

Schema d’exploitation d’un observable avec opérateurs :

	ArrayObservable
		|—-> 1, 2, 3      —->	.map(x => x * 10)       --> Renvoie 10, 20, 30
		|—-> 10, 20, 30   -->	.filter(x => x >= 20)   --> Renvoie 20, 30
		|—-> 20, 30       -->	.subscribe(Observer)    --> Affiche 20, 30

L'opérateur n’échappe pas à la règle : pour accéder aux données de l’observable, il doit dans un premier temps y souscrire. Ensuite devra renvoyer un nouvel observable(avec le resultat de sa transformation) à l'operateur qui suit.

Voyons maintenant un exemple simple d'implémetation des operateurs `.map()` et `.subscribe()` :

```JavaScript
function createObservable (subscribe) {
  return {
    subscribe: subscribe,
    map: function(transformFn) {
      const inputObservable = this
      const outputObservable = createObservable(function
        subscribe(outputObserver) {
          inputObservable.subscribe({
            next: function (x) {
              const y = transformFn(x)
              outputObserver.next(y)
            },
            error: function (err) {
              outputObserver.error(err)
            },
            complete: function() {
              outputObserver.complete()
            }
          })
        })
      return outputObservable
    }
  }
}

const ArrayObservable = createObservable(function subscribe(observer) {
  [1, 2, 3].forEach(val => observer.next(val))
  observer.complete()
})
```

```JavaScript
const observer = {
  next: val => console.log(val),
  error: err => console.log(err),
  complete: () => console.log('Complete!')
}

ArrayObservable
  .map(x => x * 10)
  .subscribe(observer) // log: 10, 20, 30 et 'Complete!'
```

## La bibliothèque RxJS

[RxJS](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/libraries/main/rx.md) est l'implémentation JavaScript de [ReactiveX](http://reactivex.io/), ou "extensions-réactives", un projet visant à ajouter des outils pour la programmation reactives dans de multiples languages.
Aussi appelé le **Lodash** des données asynchrones, il implémente la notion d'observables-observer et fournit tout un panel d'opérateurs (transformation, filtrage, combinaison et bien d'autres).
Vous pourrez facilement plugger Rx à l'aide d'operateurs tels que `Rx.from` (pour des valeurs synchrones), `Rx.fromEvent`, `Rx.fromPromise`, `Rx.Ajax` et bien d'autres.

Cette bibliothèque vous permettra d'avoir une meilleure qualité de code grâce à l'abstraction fonctionnelle : les operateurs agissent sur le stream sans **effets de bord** et permettent d'écrire moins de code.

Un exemple d'implementation avec RxJS :

```JavaScript
const Rx = require('rxjs')

const button = document.getElementById('btn')

const button$ = Rx.Observable.fromEvent(button, 'click')
  .scan(count => count + 1, 0)
  .subscribe(console.log)

// Incrémente count à chaque clic et log la valeur courante
```
Vous verrez souvent le suffixe **$** après la définition d'un observable. Il s'agit d'une convention pour montrer que c'est un stream/flux.

Pour pouvez vous aider des [`Marbles diagrams`](http://rxmarbles.com/) pour avoir une idée du fonctionnement de chaque operateur et des effets sur le flux de données.


Nous avons pu voir le fonctionnement du paradigme de la programmation reactive ainsi que des élements qui la composent.
N'hésitez pas à vous exercer avec les operateurs, merger les observables entre eux pour bien assimuler leur fonctionnement.

Dans le prochain prochain chapitre, nous verrons les cas d'usages des Observables au sein d'une application React/Redux.
