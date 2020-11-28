---
date: 2015-12-05
title: "ES6, ES2015 : les classes"
author: magsout
oldSlug: js/es2015/classes
slug: es6-es2015-les-classes
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
    return `${this.firstname} ${this.lastname}`;
  }
}

// instanciation
const user = new User("John", "Doe");

// appel de la méthode sayName()
console.log(user.sayName()); // John Doe
```

Pour rappel, voici une
[façon possible d'écrire](https://gist.github.com/magsout/a876b2fa8240a987e523)
cette classe en `es5` :

```js
function User(firstname, lastname) {
  if (!(this instanceof User)) {
    throw new TypeError("Class constructors cannot be invoked without 'new'");
  }
  this.firstname = firstname;
  this.lastname = lastname;
}

User.prototype.sayName = function() {
  return this.firstname + " " + this.lastname;
};

// instanciation
var user = new User("John", "Doe");

// appel de la méthode sayName()
console.log(user.sayName()); // John Doe
```

## Expressions de classes

Toutes les méthodes s'écrivent comme de simples fonctions à l'intérieur de la
classe. Bien entendu, les getter/setter sont toujours de la partie mais bien
plus simples à utiliser :

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

// le `new` est obligatoire pour appeler une classe
const user = new User("John", "Doe", "Contributor")

console.log(user.sayName()) // John Doe
console.log(user.role) // Contributor
user.role = "Owner"
console.log(user.role) // Owner
```

## L'héritage

Pour qu'une sous-classe hérite d'une autre classe on utilisera le mot clé
`extends`.

En utilisant notre exemple précédent :

```js
class Contributor extends User {
  constructor(firstname, lastname, numberCommit) {
    // le mot clé super est utilisé comme super contructeur. Il permet d'appeler
    // et d'avoir accès aux méthodes du parent
    super(firstname, lastname);
    this.numberCommit = numberCommit;
  }

  sayNameWithCommit() {
    // on peut appeler une méthode de la classe parente avec `super.method`
    return super.sayName() + " " + this.sayNumberCommit();
  }

  sayNumberCommit() {
    return this.numberCommit;
  }
}

// instanciation
const contributor = new Contributor("Jane", "Smith", 10);

// appel de la méthode sayName()
console.log(contributor.sayName());
console.log(contributor.sayNumberCommit());
```

**Rappel :
[préférez la composition à l'héritage](https://www.youtube.com/watch?v=wfMtDGfHWpA).**

## That's it

Concrètement, tout ce qui est possible de faire avec cette nouvelle notation
l'était bien entendu
[avant](https://gist.github.com/bloodyowl/7edc9c973d2236ed17e1).

Au final, on gagne en clarté, en lisibilité et donc en maintenabilité.

À l'heure actuelle, il est nécessaire de passer par un transpileur comme
[babel](https://babeljs.io/) pour utiliser les classes.

Une dernière petite chose, le
[mode strict](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Strict_mode)
est automatiquement activé dans le corps des classes et leurs déclarations. Il
n'est donc pas nécessaire de le rajouter manuellement.

```js
/* Mode strict initial */
class MyClass {
  someMethod() {
    /* Ici le mode strict est implicitement activé */
  }
}
/* Mode strict inchangé */
```
