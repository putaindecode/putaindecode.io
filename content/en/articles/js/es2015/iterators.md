---
date: "2015-12-09"
title: "ES6, ES2015 : Iteration protocol"
tags:
  - javascript
  - ES6
  - ES2015
  - iterators
authors:
  - ffesseler
translators:
  - MoOx
---

Imagine something so big, that if you remove it from the language, you will need
to remove lots of others features like spread operator, destructuring,
generators, for of...
This thing is just a protocol: the iterator protocol.

The principle is just a convention in the language which allow to standardise
how we can iterate on some data.

First good news, this protocol is pretty simple to understand and use 2
"interfaces" (quotes are just to warn you that we cannot really call that
_Interface_, since we don't have this "thing" in JavaScript).

The first interface, **Iterator**, allow to an object to produce sequences of
values. An object is an iterator when it implements a ``next()`` function
which return an object that contains two properties :

* ``value``: current value of the current execution
* ``done`` : a boolean that indicates whether the iteration is finished or not

Successif calls of the ``next()`` method of an iterator will allow to get all
the value of an object.
Let's see how we can iterate on a simple array ``["a", "b"]`` :

```js
iteratorArray.next()
// -> Object {value: "a", done: false}
iteratorArray.next()
// -> Object {value: "b", done: false}
iteratorArray.next()
// -> Object {value: undefined, done: true}
```

So you will probably now ask "How to get this Iterator?".
That's the second interface,  **Iterable**.
An iterable object implements a particular method which is going to return an
iterator.
This method (called *@@iterator* in the spec) must be defined using the
Symbol ``[Symbol.iterator]``.
(Symbol will be explained in a dedicated).

```js
const arr = ["a", "b"]
const iteratorArray = arr[Symbol.iterator]()
iteratorArray.next()
// -> Object {value: "a", done: false}
iteratorArray.next()
// -> Object {value: "b", done: false}
iteratorArray.next()
// -> Object {value: undefined, done: true}
```

Now you know how to use the array iterator implementation.
Not really useful right?
Here is another example to loop on an array following this protocol :

```js
const arr = ["a", "b"]
const iterator = arr[Symbol.iterator]()

const result = iterator.next()
while (!result.done) {
  console.log(result.value)
  result = iterator.next()
}
// 'a'
// 'b'
```

Let's recap: when an object which implements the iteration protocol is traversed
its *@@iterator* method is called once and the iterator is returned to be used
to loop an all values.

# Iterable consumers

Second good new is that a lots of concept of JavaScript benefits of this
protocol :

* Some syntaxes expect to get iterables

```js
const arr = ["a", "b"]

// for...of has been precisely made to loop on custom iterables
for (val of arr) {
    console.log(val)
}

// spred operator will use it too
['0', ...arr, '1'] // 0, a, b, 1

// yield also needs an iterator
function* gen(){
  yield* arr
}
gen().next() // { value:"a", done:false }

// same for destructuring
const [x, y] = arr // x = 'a',  y = "b"
```

* Some APIs acccepts iterables

```js
const arr = ["a", "b", "b"]

// Set and Weakset accepts iterables
const set = new Set(arr)
set.has("b") // true
// same for Map and WeakMap
const map = new Map(arr.entries()) // Not that a (weak)map needs a [key, value] combo
map.get(0) // 'a'


// MOAR APIs

Array.from(iterable) // tunr anything into an array !
Promise.all(iterableCollectionDePromises) // any iterable that will contains a set of Promises
Promise.race(iterableCollectionDePromises) // same
```

# Built-in Iterable

Third good news: a lot's of objects already implement this protocol :

```js
// obviously, arrays
const arr = ["l", "o", "l"]
for (v of arr) {
  console.log(v)
  // 'l'
  // 'o'
  // 'l'
}

// strings too
const str = "lol"
for (v of str) {
  console.log(v)
  // 'l'
  // 'o'
  // 'l'
}

// Map and Set (BUT NOT WeakMap and WeakSet)
const map = new Map().set('l', 1).set('o', 2)
for (v of map) {
  console.log(v)
  // ["l", 1]
  // ["o", 2]
}
const set = new Set().add('l').add('o')
for (v of map) {
  console.log(v)
  // 'l'
  // 'o'
}

// TypedArray that you use EVERY SINGLE DAYS
const int16 = new Int16Array(2)
int16[0] = 42
for (v of int16) {
  console.log(v)
  // 42
  // 0
}

// Even the special `argument` object
// (that you will probably stop to use in es6, thanks to spread operator)
function test() {
  for (v of arguments) {
    console.log(v)
    // 'l'
    // 'o'
    // 'l'
  }
}
test('l', 'o', 'l')

// NodeList returned by DOM APIs
const matches = document.querySelectorAll('div')
for (m of matches) {
  console.log(m)
  // <div id="topSection">
  // <div id="brandLogo">
  // ...
}
```

Another detail: Array, TypedArray, Map, Set are iterables but also define
methods which also return iterables (...Are you still with us ?) :

- entries() returns a set of key/values
- keys() returns keys
- values() returns values

```js
for (cleVals of arr.entries()) {
  console.log(cleVals)
  // [0, "l"]
  // [1, "o"]
  // [2, "l"]
}
```

Important note: ``Object`` is not an iterable (but we might get in ES2016
entries(), keys() and values() on ``Object``
([spec proposal](https://github.com/tc39/proposal-object-values-entries)).

# Conclusion

We have seen that a lots of interesting syntaxes and features use the iterable
protocol, so we hope that you will use all of that in your libraries.
That's important to rely on commons patterns so we can reach an agreement.

Libraries can do that by :

* offering data that implements this protocol
* use this protocol directly (eg: for a sorting algorithm)

# One last thing...

The following post will allow you to deep dive into this subject :

* [Iterables and iterators in ECMAScript 6](http://www.2ality.com/2015/02/es6-iteration.html)
* [Iteration Protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
* [ES6 in depth : iterators and the for of loop](https://hacks.mozilla.org/2015/04/es6-in-depth-iterators-and-the-for-of-loop/)
* [ES6 iterators in depth](https://ponyfoo.com/articles/es6-iterators-in-depth)


The practice remains the best way to train yourself, so take a look to
[ES6 Katas](http://es6katas.org/) which has been made for that.
