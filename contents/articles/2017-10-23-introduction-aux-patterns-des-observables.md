---
date: 2017-10-23
title: "Introduction aux patterns des observables"
author: wyeo
oldSlug: js/observable
slug: introduction-aux-patterns-des-observables
---

En JavaScript, nous pouvons exécuter du code de manière synchrone (bloquant) ou
asynchrone (non bloquant).

Prenons une fonction `logValue`, qui prend une valeur et l'affiche dans la
console :

```javascript
function logValue(value) {
  console.log(value);
}
```

Nous allons passer `logValue` comme callback à la méthode
`Array.prototype.forEach`, qui va l'exécuter de manière **synchrone** :

```JavaScript
const arrayOfValues = [1, 2, 3, 4, 5]

arrayOfValues.forEach(logValue)
// Log 1, 2, 3, 4 puis 5
```

On peut également passer `logValue` comme callback de `setTimeout`, qui va
l'exécuter de manière **asynchrone** :

```JavaScript
setTimeout(logValue, 3000, "Hello world!")
logValue("How are you?")
// Log "How are you?"
// Log "Hello world!" 3 secondes plus tard
```

Une fonction est agnostique: elle peut être appelée de manière synchrone ou
asynchrone, c'est la façon dont elle est exécutée qui définira le "mode".

Un cas où il est utile d'utiliser des APIs asynchrones avec Node.js: les accès
au _file-system_. Si vous lisez un gros fichier en mode synchrone, il va bloquer
l'exécution de votre programme tant qu'il n'a pas fini, mieux vaut attendre
qu'il vous l'envoie quand il est prêt.

Node.js propose l'API suivante: `fs.readFile(fileToRead, options, callback)`

```JavaScript
fs.readFile("./alphabet.txt", {encoding: "utf-8"}, (err, data) => {
  if (err) {
    onError(err)
  } else {
    onData(data)
  }
})
```

Cet exemple montre une API utilisant un simple callback qui est exécuté lorsque
`readFile` a lu le fichier ou échoué à le faire.

Un autre cas où utiliser des APIs asynchrones est particulièrement important :
les appels réseaux. On ne peut pas se permettre de _freeze_ toute notre
interface pendant que la requête réseau tourne.

```JavaScript
function logValue(value) { console.log(value) }
function logError(err) { console.error(err) }

fetch("https://api.github.com/users/wyeo")
  .then(res => res.json())
  .then(logValue) // Log le payload JSON lorsque la requête est terminée
  .catch(logError) // Lance une erreur dans la console si quelque chose s'est mal passé
```

Dans cet exemple, l'API renvoie une `Promise`:
[une structure représentant une valeur potentielle](/fr/articles/js/es2015/promises/).
Lorsque sa valeur est disponible, la promesse est _remplie_, et exécutera les
callbacks qu'on lui a passé dans `.then`, si elle constate une erreur, elle
exécutera les callbacks qu'on lui a passé dans `.catch`.

Les `Promise` ne permettent cependant pas de traiter de la donnée au fur et à
mesure de son arrivée: elle est remplie une seule fois.

C'est là que les `Observable` arrivent à la rescousse.

Un `Observable` est un objet implémentant une méthode `.subscribe` qui prend
comme paramètre un `Observer`. Ce dernier a cette forme :

```javascript
const observer = {
  next: val => console.log(val), // une fonction à exécuter à chaque nouvel évenement
  error: err => console.error(err), // une fonction à exécuter en cas d'erreur
  complete: () => console.info("Complete!") // une fonction à exécuter lorsque l'observable a fini
};
```

Implémentons naïvement un `Observable` qui va réagir lorsqu'un user va taper sur
son clavier et se considérer terminé une fois `Enter` pressé:

```javascript
const KeyboardObservable = {
  subscribe: observer => {
    const handleKeyUp = event => {
      if (typeof event.keyCode === "number") {
        if (event.keyCode === 13 /* Enter */) {
          document.removeEventListener("keyup", handleKeyUp);
          observer.complete();
        } else {
          observer.next(event.keyCode);
        }
      } else {
        observer.error(new Error("No keyCode found"));
      }
    };
    document.addEventListener("keyup", handleKeyUp);
    // subscribe retourne la "soucription", contenant une fonction pour la stopper
    return {
      unsubscribe: () => document.removeEventListener("keyup", handleKeyUp)
    };
  }
};

let keys = [];
KeyboardObservable.subscribe({
  next: keyCode => keys.push(String.fromCharCode(keyCode)),
  error: error => console.error(error),
  complete: () => alert(keys.join(""))
});
```

Un `Observable` fonctionne à la fois pour du code synchrone et asynchrone, et il
s'agit d'un pattern qui peut s'appliquer à des cas où `Promise` manque de
granularité, puisqu'il permet de traiter la donnée au fur et à mesure de son
arrivée. _In fine_, un observable est un _event emitter_ avec un concept de
completion.

Il existe d'ailleurs un
[_proposal_ en stage 1](https://tc39.github.io/proposal-observable/) pour en
faire une API de la specification de JavaScript. On peut très bien imaginer que
les observables deviennent une interface très répandue dans un futur proche.

Dans les prochains articles, nous verrons pourquoi et comment combiner des
observables ainsi que les cas d'usage au sein d'une application React.
