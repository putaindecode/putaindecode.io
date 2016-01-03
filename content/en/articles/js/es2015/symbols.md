---
date: "2015-12-17"
title: "ES6, ES2015 : symbols"
tags:
  - javascript
  - ES6
  - ES2015
authors:
  - divarvel
---

Following its goal of enriching primitive types, ES6 introduces symbols.
Familiar to developers in many langages, especially Ruby, symbols bring us a
step further towards the eradication of *stringly-typed programming*. Symbols
provide us with a more robust way to encode identifiers.

## Creating Symbols

The `Symbol()` function lets us create new symbols:

```javascript
// A simple symbol
const mySymbol = Symbol();
typeof mySymbol === 'symbol' // true

// A symbol with a label
const myOtherSymbol = Symbol("label");


// Each symbol is unique
const yetAnotherSymbol = Symbol("label");
yetAnotherSymbol === myOtherSymbol; // false
```

Each symbol created with `Symbol` is both unique and immutable. This allows to
avoid collisions: it's impossible to mistakenly have two identical symbols.

## Implement an *enum* with symbols

Instead of using strings as possible values for an *enum*, it's possible to
use symbols.

```javascript
const ANIMAL_DOG = Symbol();
const ANIMAL_CAT = Symbol();

function getDescription(animal) {
  switch(animal) {
    case ANIMAL_DOG:
        return "Loving animal";
    case ANIMAL_CAT:
        return "Evil, sadistic animal";
  }
}
```

This way, there is no risk of mistakenly mixing a user-provided string with an
*enum*. This forces the value through a verifying and parsing stage.

## Symbols as keys

We can use symbols as a key in an object or in a class.

```javascript
const myKey = Symbol("MY_KEY");

const myMutableObject = {};
myMutableObject[myKey] = "a value";

// With *computed property keys*
const myObj = {
    [myKey]: "a value"
}
```

Due to symbols unicity, no more collisions between the keys of an object.
The user can extend objects without having properties overriden by mistake.

For instance, the iterator on an object (used by `for..of`), is a property
whose key is a symbol, available through `Symbol.iterator`.

For instance, an object's iterator (used by `for..of`) is made available as
the property indexed by `Symbol.iterator`, a symbol devised for this use.

```javascript
const myIterableObject = {
  * [Symbol.iterator]() {
    yield "One";
    yield "Two";
    yield "Three";
  }
}

// Displays One, Two and Three
for(x of myIterableObject) {
  console.log(x);
}

// Blows up with 'TypeError: undefined is not a function'
for(x of {}) {}
```

Several symbols (called *well-known symbols*) index behaviour defining
object properties: `Symbol.iterator` for the iterator on an object's
values, `Symbol.hasInstance` to alter the result of `instanceof`, …

These properties are therefore protected against tampering.

### Differences between symbol keys and string keys

Properties indexed by symbols are not available from the commonly used key or
values functions.

#### List symbol keys

Properties indexed by symbols are not visited by `for..in`, nor listed by
`Object.keys`, or `Object.getOwnPropertyNames`. However, they are listed by
`Object.getOwnPropertySymbols`.

```javascript
const myObject = {
  [Symbol()]: "symbol-keyed value",
  "key": "string-keyed value"
}

Object.getOwnPropertyNames(myObject) // [ "key" ]
Object.getOwnPropertySymbols(myObject) // [ Symbol() ]
```

This way, a piece of code written with `Object.getOwnPropertyNames` -- and
expecting strings -- won't be broken by the use of symbols as keys.

#### `JSON.stringify`

Symbol-indexed properties are ignored by `JSON.stringify`.


```javascript
JSON.stringify({
  [Symbol()]: "symbol-keyed value",
  "key": "string-keyed value"
}) // '{"key":"string-keyed value"}'
```

## Global symbol registry

Symbols being unique, one cannot create a new symbol that is equal to an
already existing one. To be useful, a symbol must be somehow accessible. It's
also possible to create a symbol in a global registry with `Symbol.for`, to
make it available from anywhere.

```javascript
// Returns a symbol, creating it if it doesn't already exist
const mySymbol = Symbol.for("mySymbol")

mySymbol === Symbol.for("mySymbol") // true

// It's possible to get the key indexing a symbol in the registry
Symbol.keyFor(mySymbol) // 'mySymbol'

// Symbols not created in the registry are not available in it
Symbol.keyFor(Symbol()) // undefined
```

`Symbol.for` allows to share symbols everywhere in the code, including
different execution contexts (different frames).


## Support

In browsers, symbols are supported since Chrome 38, Firefox 36, Opera 25 and
Safari 9. Nothing in Internet Explorer. Babel support is limited.

In Node.js, symbols are supported since version `0.12`.

Some *well-known symbols* are not available on all platforms. This depends on
implemented features support.

## Round up

Symbols are a way to create unique tokens, which is way more robust than
using strings. Using symbols to implement *enums* prevents collisions and
unwanted mix-up with unqualified data.

Lastly, symbols as object keys prevent collisions and lets us have
*meta-properties* cleanly separated from regular, string-indexed properties.
Properties indexed with symbols can't be read, modified or listed by mistake.
This offers some protection against tampering.

## Further reading

 - [MDN documentation on symbols](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
 - [Thorough article on how symbols work and how they can be used](http://www.2ality.com/2014/12/es6-symbols.html)
