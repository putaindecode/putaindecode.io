---
date: "2015-12-08"
title: "ES6, ES2015 : Object literals"
tags:
  - JavaScript
  - ES6
  - ES2015
authors:
  - lionelB
translators:
  - MoOx
---

Again, ES6 brings us more syntax sugar, that you might appreciate when
creating new object.

## Shorter property name

When you create an object, you might create a variable and then reuse it to
define a property of an object that have the same name.

```js
var firstname = "Robert"
var lastname = "Laiponje"

return {
  firstname: firstname,
  lastname: lastname,
}
```

Thanks to ES6, you can directly write:

```js
const firstname = "Robert"
const lastname = "Laiponje"

return {
  firstname,
  lastname,
}
// { firstname: "Robert", lastname: "Laiponje" }
```

In the same spirit, you will be able to declare methods without the `function`
keyword (this also apply for *getter* and *setter*).

```js
const obj = {
  get email() {
    return this.email()
  },
  set email(email) {
    this.email = email
  },
  validateEmail(email) {
    return true
  },
}
```

## Dynamic property name

One last thing for *objects literal* will allow you to create dynamic property
name using an expression, directly when you create an object.
With ES5 you have to do that in two steps:

```js
function action(type, data) {
  var payload = {}
  payload[type] = data
  return payload
}
```

Now with ES6, you can do:

```js
function action(type, data) {
  return {
    [type]: data
  }
}
```

**Note:** with dynamic properties, declaring multiples properties with the same
name is accepted and do not throw an error. Keep in mind that only the last
value will be kept.
