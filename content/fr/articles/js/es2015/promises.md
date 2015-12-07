---
date: "2015-12-07"
title: "ES6, ES2015 : les promises"
tags:
  - javascript
  - ES2015
	- ES6
authors:
  - Uhsac
---

ES2015 apporte une fonctionnalité simplifiant grandement l'asynchrone en
Javascript, les promises ! Visible depuis longtemps dans l'écosystème Javascript
grâce a diverses librairies, on peut maintenant utiliser directement la
spécification officiel.

## C'est quoi une promise ?

Une promise peut être vue comme la promesse d'une valeur non-disponible
immédiatement. Comme toute promesse, elle peut être tenue, la valeur est arrivée
et on peut s'en servir, ou ne pas l'être, dans ce cas une erreur arrive et on
peut réagir en conséquence.

Ce mécanisme permet de remplacer les callback d'une manière plus élégante. Au
revoir, la suite de callback qui rend votre code illisible ! Vous ne me croyez
pas ? Voici un exemple pour vous le prouvez :

``` javascript
// En utilisant les callback
// Imaginez que chacune de ces fonctions effectue des tâches asynchrones
// plus ou moins complexe (requête HTTP, appelle à une base de données
// ou encore lecture de fichier)
const functionWithCallback1 = callback => callback('test', undefined)
const functionWithCallback2 = (arg, callback) => callback(arg, undefined)
const functionWithCallback3 = (arg, callback) => callback(arg, undefined)
const functionWithCallback4 = (arg, callback) => callback(arg, undefined)
const functionWithCallback5 = (arg, callback) => callback(arg, undefined)
const functionWithCallback6 = (arg, callback) => callback(arg, undefined)

functionWithCallback1((result1, err) => {
  if (err) {
    throw err
  }
  functionWithCallback2(result1, (result2, err) => {
    if (err) {
      throw err
    }
    functionWithCallback3(result2, (result3, err) => {
      if (err) {
        throw err
      }
      functionWithCallback4(result3, (result4, err) => {
        if (err) {
          throw err
        }
        functionWithCallback5(result4, (result5, err) => {
          if (err) {
            throw err
          }
          functionWithCallback6(result5, (result6, err) => {
            if (err) {
              throw err
            }
            console.log(`Exemple avec les callback : ${result6}`)
          })
        })
      })
    })
  })
})

// En utilisant les promises
// Imaginez que chacune de ces fonctions effectue des tâches asynchrones
// plus ou moins complexe (requête HTTP, appelle à une base de données
// ou encore lecture de fichier)
const functionWithPromise1 = () => Promise.resolve('test')
const functionWithPromise2 = arg => Promise.resolve(arg)
const functionWithPromise3 = arg => Promise.resolve(arg)
const functionWithPromise4 = arg => Promise.resolve(arg)
const functionWithPromise5 = arg => Promise.resolve(arg)
const functionWithPromise6 = arg => Promise.resolve(arg)

functionWithPromise1()
  .then(functionWithPromise2)
  .then(functionWithPromise3)
  .then(functionWithPromise4)
  .then(functionWithPromise5)
  .then(functionWithPromise6)
  .then(result => console.log(`Exemple avec les promises : ${result}`))
  .catch(err => {
    throw err
  })
```

Comme vous pouvez le voir l'exemple avec le promise est tout de même plus
lisible !

## Trop bien ! Comment je les utilise ?

Une promise peut avoir plusieurs états au cours de son existence :
- En cours : la valeur qu'elle contient n'est pas encore arrivée
- Résolue : la valeur est arrivée, on peut l'utiliser
- Rejetée : une erreur est survenue, on peut y réagir

Une promise possède 2 fonctions : `then` et `catch`, vous pouvez utiliser `then`
pour récupérer le resultat ou l'erreur d'une promise et `catch` pour récuperer
l'erreur d'une ou plusieurs promise.

Voyons comment utiliser les promise à l'aide de la future implémentation de
fetch.

``` javascript
// À ce moment, la promise est en attente
const fetchPromise = fetch('http://putaindecode.io')

// Quand la requête est terminée la promise est résolue avec le résultat de
// la requête
const parsePromise = fetchPromise.then(fetchResult => {
  // Je peux retourner une nouvelle promise à partir d'un then, ici
  // j'appelle .text() qui parse le contenu de la requête et retourne
  // une promise
  return fetchResult.text()
})

// Quand le parsing est terminé je peux recuperer son contenu
parsePromise.then(textResult => {
  console.log(`Voici le résultat : ${textResult}`)
})

// Si la requête a un problème, la promise est rejetée avec une erreur
fetchPromise.catch(fetchError => {
  console.log(`Une erreur a eu lieu pendant la requête : ${fetchError}`)
})

// S'il y a une erreur pendant le parsing, je peux la récupérer
parsePromise.catch(parseError => {
  console.log(`Une erreur a eu lieu pendant le parsing : ${parseError}`)
})

// Peut aussi être écrit
fetch('http://putaindecode.io')
  .then(fetchResult => fetchResult.text())
  .then(textResult => {
    console.log(`Voici le résultat : ${textResult}`)
  })
  .catch(error => {
    console.log(`Une erreur a eu lieu pendant la requête ou le parsing : ${error}`)
  })

// Ou encore
fetch('http://putaindecode.io')
  .then(fetchResult => {
    return fetchResult.text()
  }, fetchError => {
    console.log(`Une erreur a eu lieu pendant la requête : ${fetchError}`)
  })
  .then(textResult => {
    console.log(`Voici le résultat : ${textResult}`)
  }, parseError => {
    console.log(`Une erreur a eu lieu pendant le parsing : ${parseError}`)
  })
```

## Mais comment je crée mes propres promise ?

C'est bien beau d'utiliser les promises, mais c'est encore mieux de savoir créer
les vôtres ! Je vous rassure, c'est très simple.

``` javascript
const functionThatReturnAPromise = () => {
  // On utilise la classe Promise pour en créer une, le constructeur prend 2
  // fonctions en paramètre :
  // - resolve que l'on pourra appeler avec le résultat de notre fonction
  // - reject que l'on pourra appeler avec une erreur s'il y a une erreur
  return new Promise((resove, reject) => {
    if (success) {
      resolve('success')
    } else {
      reject('failed')
    }
  })
}

// Vous pouvez maintenant utiliser votre fonction comme vu précédemment
functionThatReturnAPromise()
  .then(res => console.log(res)) // log : 'success'
  .catch(error => console.log(error)) // log : 'failed'
```

## Et demain ?

Une fonctionnalité encore plus pratique que les promises arrivent en Javascript,
les mots-clés async et await ! Ces mots-clés vous permettront d'avoir un code
encore plus lisible quand vous ferez de l'asynchrone, mais ça ne concerne pas
ES2015 :)
