---
date: "2015-12-02"
title: "ES6, ES2015 : the destructuring"
tags:
  - javascript
  - ES6
  - ES2015
authors:
  - bloodyowl
translators:
  - MoOx
---

The destructuring is a feature that helps you assign variables from an object or
an array based on their structure.

```js
// Let's consider this object `myObject`
var myObject = {
  foo: 1,
  bar: 2,
}

// With ES5, you need to do
var foo = myObject.foo
var bar = myObject.bar

foo // 1
bar // 2

// With ES6, you can write the same with
const { foo, bar } = myObject
foo // 1
bar // 2

// We can even destructure the value returned by a function (if this one
// returns a function or an array)
const getMyObject = function() {
  return {
    foo: 1,
    bar: 2,
  }
}
const { foo, bar } = getMyObject()
foo // 1
bar // 2
```

## Different syntaxes

### Array

```js
// For an array, we can use a syntax that is similar to a literal declaration
// of an array
// You might notice that you can ignore an item by just put nothing between the
// commas
const [ first, second, , fourth ] = [1, 2, 3, 4]
first // 1
second // 2
fourth // 4
```

### Use a different name for the key

For an object, the default behavior is that the name of a variable will match
the name of the key.
So if you have already a variable with this name, you can choose another one.

```js
var myObject = {
  foo: 1,
  bar: 2
}
const { foo: renamedFoo } = myObject
renamedFoo // 1
```

This syntax doesn't offer a good readability.

### Function arguments

```js
// We can use destructuring directing in a function declaration
function myFunction({ title, text }) {
	return title + ": " + text
}

myFunction({ title: "foo", text: "bar" }) // "foo: bar"
```

### Nested destructuring

We can also nest the assignments.

```js
var myObject = {
  foo: {
    bar: 1,
  },
}
const { foo: { bar } } = myObject
bar // 1
```

Be careful, if the destructuring of the first level should return `undefined`
(if the value doesn't exist), be sure that you will have a nesting error, since
a value will try to be retrieved from an `undefined` property.
To prevent this issue, you will need to define
[defaults](/en/articles/js/es2015/defaults/) values.
