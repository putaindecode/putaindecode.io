# Synchrone, Asynchrone : tous les types mènent aux Observable

Bienvenue dans la 1ère partie de cette série de 3 articles qui vont vous plonger dans le monde merveilleux des oberservable.

En Javascript nous devons faire face à deux types de valeurs  :

- Synchrone
- Asynchrone

Et pour traiter ces données nous avons la possibilité de faire appel à une callback (fonction de rappel).

Prenons cette fonction "AfficheValue”, qui servira de fonction de rappel pour afficher la valeur qu’elle reçoit en paramètre dans la console :

```Javascript
// Fonction de rappel

function afficheValue(value) {
   console.log(value)
}
```

Nous allons appliquer cette fonction à différentes valeurs dites **synchrones** :

```Javascript
const val  = 12

afficheValue(val) // Affiche 12
```

```Javascript
const arrayOfValues = [1, 2, 3, 4, 5]

arrayOfValues.forEach(function (elem) {
	afficheValue(elem) // Affiche 1 2 3 4 5
})
```

Appliquons maintenant notre fonction de rappel à des valeurs dites **asynchrones** :

```Javascript
let i = 0

setInterval(function() {
	afficheValue(i++) /// Incremente i toutes les 3 secondes
}, 3000)
```
* [Resultat](https://jsbin.com/sutilo/edit?js,console)

> Notre fonction afficheValue est appelée toutes les 3000 millisecondes avec une nouvelle valeur pour la variable i. Il s’agit d’une fonction asynchrone puisque nous subissons la contrainte de setInterval. Nous sommes dans l’obligation d’attendre l’écoulement des 3 secondes avant de pouvoir afficher la valeur de i.

```Javascript
const result =
    fetch('https://api.github.com/users/wyeo')
        .then(res => res.json())

result.then(afficheValue) // Affiche le résultat de notre requête au format JSON
```
* [Resultat](https://jsbin.com/sagubeh/edit?js,console)

> Nous avons fetcher l’API de GitHub avec API fetch qui nous renvoie une promesse à laquelle nous appliquons notre fameuse fonction de rappel pour afficher les résultats de notre requête. TOUT VA BIEN !

Maintenant imaginons que ma requête échoue pour X raisons : C’est LA MERDE !
Il s’agit d’un cas d’erreur et nous avons aussi la possibilité de gérer les cas d’erreurs avec la promesse qui nous a été renvoyé par fetch.
Nous allons donc implémenter une seconde fonction de rappel qui aura pour rôle de gérer les cas d’erreurs.

```Javascript
// Nouvelles fonctions de rappel

function afficheValue(value) { console.log(value) }
function afficheErreur(err) { console.log(err) }

```

```Javascript

const result =
    fetch('https://api.gitxyzhub.com/users/wyeo').then(res => res.json())

result.then(afficheValue).catch(afficheErreur) // Nous interceptons les erreurs
```
* [Resultat](https://jsbin.com/tixerix/edit?js,console)

> Les deux cas envisageables sont maintenant gérer par nos fonctions de rappel : OUF !

Voyons maintenant un dernier exemple de valeur asynchrone qui devrait surtout parler aux fans de NodeJS :

Nous allons lire le contenu d’un fichier de manière asynchrone. Et parce qu’il s’agit d’une opération asynchrone nous aurons aussi besoin d’être informer lorsque le fichier aura été lu entièrement.

En NodeJS, voici comment se présente la fonction qui nous permet de lire un fichier : `fs.readFile(path, options, callback)`

*elle nous renvoie soit une erreur, soit le contenu du fichier: (err, data)*

* Implémentons nos trois fonctions de rappel :

``` Javascript
// callback

function afficheData(data) {
    console.log(value)
}

function afficheErreur(data) {
    console.log(erreur)
}

function afficheLectureComplete() {
    console.log(‘Lecture complète du fichier’)
}
```

* Appliquons nos fonctions de rappel à fs.readFile:

>On imagine un fichier nommé alphabet.txt, qui comporte toutes les lettres de l’alphabet

``` Javascript
fs.readFile('./alphabet.txt', {encoding: 'utf-8'}, (err, data) => {
    if (err) {
        afficheErreur(err)
    } else {
        afficheData(data)
    }
    afficheLectureComplete()
})
```

Tout fonctionne. Mais il y a un problème.. écrire des lignes et des lignes de fonctions de rappel tout le temps devient très vite laissant et épuisant pour les pauvres développeur paresseux que nous sommes. Par conséquent pourquoi ne pas imaginer d’implémenter une petite API / Object / Bloc de fonction qui pourrait s’adapter à tous formes de donner synchrones/asynchrones ( fournies par arrayOfValues, fetch, fs.readFile etc… ).

```Javascript

// API / Object / Ensemble de fonctions de rappel qui nous permet de traiter toutes les formes de données

const observer = {
   next: function(val) { console.log(val) },
   error: function(err) { console.log(err) },
   complete: function() { console.log(‘complete!’)
}
```

Maintenant nous pouvons juste envoyer notre objet observer en tant que “callback” :

`function subscribe(observer) {
  [1,2,3,4,5].forEach(observer.next)
}`

Le nommage de cette fonction n'est pas du au hasard. "Subscribe" par soucis de comprehension. Finalement, nous pouvons très imaginer que nous souscrivons à une source donnée qui est interprétée dans notre “API” de callback **observer**.

> Nous disposons d’une source de données. Pour avoir accès à cette source de données, nous allons souscrire.

Maintenant imaginons un monde où toutes les sources de données synchrones comme asynchrones nous permettent un accès à ses données tout simplement par souscription. Nous allons appelé ces objets des Observable.

**Un observable est donc un objet qui comporte une méthode subscribe qui prend
prend en paramètre une suite de callback(Observer).
L'observable s'occupe d'appeler l'observer adéquat en fonction des situations**

* Deux exemples de ce monde parfait avec une suite d’observable :

```Javascript

const observer = {
  next: function(val) { console.log(val) },
  err: function(err) { console.log(err) },
  complete: function() { console.log('Done.') }
}

const observableWithArrayOfInteger = {
   values: [1,2,'trois',4,5],
   subscribe: function (observer) {
      this.values.forEach((elem) => {
        if (Number.isInteger(elem)) {
          observer.next(elem)
        } else {
          observer.err(new Error("NOT A NUMBER"))
        }
      })
      observer.complete()
   }
}

observableWithArrayOfInteger.subscribe(observer)

const observableAlphabetWithInterval = {
    subscribe: function(observer) {
        let i = 0
        const values = ['a','b','c', 'd', 'e', 'f', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
        setInterval(function(){
          if (i === 25) {
            observer.complete()
          }
          if (typeof values[i] !== "string") {
              observer.err(new Error("NOT A STRING"))
          } else {
            observer.next(values[i])
          }
          i++
        }, 3000)
    }
}


observableAlphabetWithInterval.subscribe(observer) // a...b...c...

```
* [oberservableArrayOfInteger Resultat](https://jsbin.com/mixalip/edit?js,console)

* [observableAlphabetWithInterval Resultat](https://jsbin.com/cecitop/edit?js,console)

> Nous souscrivons aux deux sources de données(Observable) via la méthode subscribe à qui nous appliquons notre Observer(Suite de callback).

Voilà ! ce tutoriel touche à sa fin.
Nous avons vu la construction, le fonctionnement interne d’un Observable et surtout à quoi il pourrait nous servir.
