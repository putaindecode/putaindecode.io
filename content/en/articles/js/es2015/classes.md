---
date: "2015-12-05"
title: "ES6, ES2015 : Classes"
tags:
  - javascript
  - ES6
  - ES2015
authors:
  - magsout
translators:
  - MoOx
---

Classes introduced by ES2015 are just some syntax sugar.
They don't really bring anything.
That said, this can helps to improve code readability and make the code more
accessible.

## Class declaration

Forget functions and prototypes, semantic is taking the relay as you will see in
the following example :

```js
class User {
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

// call of the method sayName()
console.log(user.sayName()) // John Doe
```

As a reminder, here is one
[way to code](https://gist.github.com/magsout/a876b2fa8240a987e523)
this class in `es5` :

```js
function User(firstname, lastname) {
  if(!(this instanceof User)) {
    throw new TypeError("Class constructors cannot be invoked without 'new'")
  }
  this.firstname = firstname
  this.lastname = lastname
}

User.prototype.sayName = function() {
  return this.firstname + " " + this.lastname
}

// instanciation
var user = new User("John", "Doe")

// call of the method sayName()
console.log(user.sayName()) // John Doe
```

## Classes expressions

All methods should be written as simple function inside the class.
You might denote the nice way to write getter and setter :

```JS
class User {
  constructor(firstname, lastname, type) {
    this.firstname = firstname
    this.lastname = lastname
    this.type = type
  }

  // method
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

// the `new` is mandatory to instanciate a class
const user = new User("John", "Doe", "Contributor")

console.log(user.sayName()) // John Doe
console.log(user.role) // Contributor
user.role = "owner"
console.log(user.role) // Owner
```

## Inheritance

In order to have a class that inherite from another, we have the `extends`
keyword.

Here is the an example :

```js
class Contributor extends User {
  constructor(firstname, lastname, numberCommit) {

    // keyword `super` is used to call the constructor of the parent class
    super(firstname, lastname)
    this.numberCommit = numberCommit
  }

  sayNameWithCommit() {
    // we can can also use `super` to call a method of the parent class
    return super.sayName() + " " + this.sayNumberCommit()
  }

  sayNumberCommit() {
    return this.numberCommit
  }
}

const contributor = new Contributor('Jane', 'Smith', 10)

console.log(contributor.sayName())
console.log(contributor.sayNumberCommit())

```

**Reminder: [prefer inheritance to composition](https://www.youtube.com/watch?v=wfMtDGfHWpA).**

## That's it

As you saw, all what you can do know was already possible
[before](https://gist.github.com/bloodyowl/7edc9c973d2236ed17e1).

We just have a more readable code that should be more easily maintainable.

For now, you will need to use a transpiler like [babel](https://babeljs.io/)
to be able to use classes.

One last thing: when you are in a class context,
[strict mode](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Strict_mode)
is enabled automatically.
