# Synchrone, Asynchrone : tous les types de données mènent aux Observable

Bienvenue dans la 1ère partie de la série d'articles qui va vous plonger dans le monde merveilleux des oberservables.

## Synchrone - Asynchrone

En JavaScript, nous pouvons executer du code synchrone (bloquant) et du code asynchrone (non bloquant).

Pour traiter ces données nous avons la possibilité de faire appel à une callback (fonction de rappel).
Prenons la fonction `logValue`, qui servira de callback pour afficher la valeur qu’elle reçoit en paramètre dans la console :

```Javascript
function logValue(value) {
  console.log(value);
}
```

Nous allons appliquer `logValue()` à des valeurs dites **synchrones** :

```Javascript
const arrayOfValues = [1, 2, 3, 4, 5]

arrayOfValues.forEach(logValue) // Affiche 1, 2, 3, 4, 5
```

Appliquons maintenant `logValue()` à des valeurs dites **asynchrones** :

```Javascript
setTimeout(logValue, 3000, "HELLO WORLD !") // Affiche 'HELLO WORLD !' au bout de 3 secondes
```
* [Resultat](https://jsbin.com/sutilo/edit?js,console)

```Javascript
const result = fetch("https://api.github.com/users/wyeo").then(res => res.json());

result.then(logValue) // Affiche le résultat de notre requête au format JSON
```
* [Resultat](https://jsbin.com/sagubeh/edit?js,console)

> Nous avons interrogé l’API de GitHub avec API fetch qui nous renvoie une promesse à laquelle nous appliquons notre fameuse callback pour afficher les résultats de notre requête : TOUT VA BIEN !

Maintenant imaginons que ma requête échoue pour X raison.
Il s’agit d’un "cas d’erreur". Nous avons aussi la possibilité de gérer les cas d’erreurs avec la `Promise` qui nous a été renvoyée par `fetch`.
Nous allons donc implémenter une seconde `callback` qui aura pour rôle de gérer les cas d’erreurs.

```Javascript
function logValue(value) { console.log(value) }
function logError(err) { console.log(err) }
```

```Javascript
const result =
    fetch('https://api.gitxyzhub.com/users/wyeo').then(res => res.json())

result.then(logValue).catch(logError) // Nous interceptons les erreurs
```
* [Resultat](https://jsbin.com/tixerix/edit?js,console)

> Les deux cas envisageables sont maintenant gérés par nos fonctions de rappel : OUF !

Voyons maintenant un dernier exemple de valeur asynchrone :

Nous allons lire le contenu d’un fichier de manière asynchrone.
Et parce qu’il s’agit d’une opération asynchrone, nous aurons aussi besoin d’être informé lorsque le fichier aura été lu entièrement.

En Node.js, voici comment se présente la fonction qui va nous permettre de lire notre fichier : `fs.readFile(path, options, callback)`

*`readFile` va soit parvenir à lire le fichier, soit échouer. Pour nous le signaler,
 elle appellera `callback` avec deux paramètres `error` et `data`, si `error`
 est `null` cela signifie que tout s'est bien passé et qu'on peut lire `data`,
 dans le cas contraire, on devra gérer `error`*

* Implémentons nos trois `callbacks` :

``` Javascript
function logData(data) {
    console.log(data)
}

function logErr(err) {
    console.log(err)
}

function onComplete() {
    console.log('Done.')
}
```

* Appliquons nos fonctions de rappel à `fs.readFile()`:

>On imagine un fichier nommé `alphabet.txt`, qui comporte toutes les lettres de l’alphabet

``` Javascript
fs.readFile('./alphabet.txt', {encoding: 'utf-8'}, (err, data) => {
    if (err) {
        logErr(err)
    } else {
        logData(data)
    }
    onComplete()
})
```

Ça fonctionne ! Mais bon écrire des lignes et des lignes de callback devient très vite laissant et épuisant pour les pauvres développeurs paresseux que nous sommes. Par conséquent pourquoi ne pas implémenter une petite API / Object / Bloc de fonction qui pourrait s’adapter à toutes formes de donner synchrones ou asynchrones ( fournies par `arrayOfValues`, `fetch`, `fs.readFile` etc… ).

> Ce objet est appelé un `Observer` dans le monde des Observables

## Observer

```Javascript
// API / Object / Ensemble de callback (bref un `Oberserver` quoi !) qui nous permet de traiter toutes les formes de données
const observer = {
   next: function(val) { console.log(val) },
   error: function(err) { console.log(err) },
   complete: function() { console.log(‘complete!’)
}
```

Maintenant nous pouvons juste envoyer notre objet `observer` en tant que “callback” :

`function subscribe(observer) {
  [1,2,3,4,5].forEach(observer.next)
}`

> Nous disposons d’une source de données. Pour avoir accès à cette source de données, nous devons faire appel à la fonction `subscribe()` en lui passant notre Observer.

## Observable

*Un observable est un objet qui dispose d'une méthode `subscribe()` qui elle-même prend en paramètre un `observer`.
L'`Observable` se charge d'appeler l'`Observer` ayant *souscrit* lorsqu'il recoit la donnée.*

* Exemple d’`Observable` :

```Javascript
const observer = {
  next: function(val) { console.log(val) },
  err: function(err) { console.log(err) },
  complete: function() { console.log('Done.') }
}

const values = [1,2,'trois',4,5]

const observableWithArrayOfInteger = (values) => ({
   subscribe: function (observer) {
      values.forEach((elem) => {
        if (Number.isInteger(elem)) {
          observer.next(elem)
        } else {
          observer.err(new Error("NOT A NUMBER"))
        }
      })
      observer.complete()
   }
})

observableWithArrayOfInteger(values).subscribe(observer)
```
* [oberservableArrayOfInteger Resultat](https://jsbin.com/mixalip/edit?js,console)

> Nous *souscrivons* aux sources de données(Observable) via la méthode `subscribe()` à qui nous appliquons notre `Observer`.

## Résumons

Nous avons vu la construction, le fonctionnement interne d’un Observable et surtout un petit aperçu de ce à quoi il pourrait nous servir.

Dans la seconde partie de la série, nous verrons comment implementer d'autres méthodes, combiner les Observables et enfin comment nous pouvons intégrer le tout dans un environnement React.
