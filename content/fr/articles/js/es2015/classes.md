---
date: "2015-12-08"
title: "ES6, ES2015 : les classes"
tags:
  - javascript
  - ES6
  - ES2015
authors:
  - magsout
---

Les classes introduites par `ES2015` ne sont clairement que du sucre syntaxique.
Elles n'apportent rien de plus en terme de fonctionnalité. Toutefois, l'objectif
de cette évolution est de rendre le code plus lisible et plus facilement
accessible.

## Déclaration de classes

Oubliez les fonctions anonymes et les prototypes, la sémantique a pris le
relais, comme vous pouvez le constater dans l'exemple de déclaration de la
classe `User` :

```js
class User {
  // méthode constructor
  constructor(firstname, lastname) {
    this.firstname = firstname;
    this.lastname = lastname;
  }

  sayName() {
    return `${this.firstname} ${this.lastname}`
  }
}

// instanciation
const user = new User("John", "Doe")

// appel de la méthode sayName()
console.log(user.sayName()) // John Doe
```

Pour rappelle, voici une [façon possible
d'écrire](https://gist.github.com/magsout/a876b2fa8240a987e523) cette classe en
`es5` :

```js
var User = function(firstname, lastname) {
  this.firstname = firstname
  this.lastname = lastname
}

User.prototype.sayName = function() {
  return(this.firstname + " " + this.lastname)
}

// instanciation
var user = new User("John", "Doe")

// appel de la méthode sayName()
console.log(user.sayName()) // John Doe
```

## Expressions de classes

Toutes les méthodes s'écrivent comme de simples fonctions à l'intérieur de la
classe. Bien entendu les getter/setter sont toujours de la partie mais, bien
plus simple à utiliser :

```JS
class User {
  // constructor
  constructor(firstname, lastname, type) {
    this.firstname = firstname
    this.lastname = lastname
    this.type = type
  }

  // méthode
  sayName() {
   return `${this.firstname}  ${this.lastname}`
  }

  // getter
  get role() {
    return this.type
  }

  // setter
  set role(value) {
    return this.type = value
  }
}

const user = new User("John", "Doe", "Contributor")

console.log(user.sayName()) // John Doe
console.log(user.role) // Contributor
user.role = "owner"
console.log(user.role) // Owner
```

## L'héritage

Pour qu'une sous-classe hérite d'une autre classe on utilisera pour cela le mot
clé `extends`.

En utilisant notre exemple précédent :

```js
class Contributor extends User {
  constructor(firstname, lastname, numberCommit) {

    // le mot clé super est utilisé comme super contructeur. Il permet d'appeler
    // et d'avoir accés aux méthodes du parent
    super(firstname, lastname)
    this.numberCommit = numberCommit
  }

  sayNumberCommit() {
    return this.numberCommit
  }
}

// instanciation
const contributor = new Contributor('Jane', 'Smith', 10)

// appel de la méthode sayName()
console.log(contributor.sayName())
console.log(contributor.sayNumberCommit())

```

A ce propos, voici une [vidéo](https://www.youtube.com/watch?v=wfMtDGfHWpA) très
intéressante sur le principe de la composition plutôt que de l'héritage.

## That's it

Concrètement, tout ce qui est possible de faire avec cette nouvelle notation l'était bien entendue
[avant](https://gist.github.com/bloodyowl/7edc9c973d2236ed17e1).

Au final, on gagne en clarté, en lisibilité et donc en maintenabilité.

À l'heure actuelle, il est nécessaire de passer par un transpileur comme
[babel](https://babeljs.io/) pour utiliser les classes.

Une dernière petite chose, en utilisant les classes on active automatiquement le
[mode strict](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Strict_mode), il n'est donc pas nécessaire de le rajouter manuellement.
