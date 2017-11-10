---
date: "2015-12-03"
title: "ES6, ES2015: default values for arguments"
tags:
  - javascript
  - ES6
  - ES2015
authors:
  - naholyr
translators:
  - MoOx
---

Tired of typing `if (typeof x === 'undefined') x = defaultValue`? Again, ES6
will brings us a elegant solution.

# Default values

The `=` operator can now help to define a default value to a parameter.

## Function parameters

You can now specify a default value for a parameter of a function. This value
will be used if the parameter is not defined, or explicitly set to *undefined*.

```js
function incr(value, step = 1) {
  return value + step;
}

incr(41); // 42
incr(41, undefined); // 42
incr(33, 9); // 42
```

### Dynamic default values

We can specify an expression as a default value. This expression will be evalued
**during the function call**, not during the function declaration.

```js
let defaultWho = "world!";
function hello(who = defaultWho.toUpperCase()) {
  return "Hello " + who;
}

hello(); // 'Hello WORLD!'
defaultWho = "Anyone?";
hello(); // 'Hello ANYONE?'
```

### Reusing previous parameters

In the default value expression, you can reuse **previous** function parameters:

```js
function foo(x = 1, y = x + 1) {
  return x + y;
}

function bar(x = y + 1, y = 1) {
  return x + y;
}

foo(); // 1 + (1 + 1) → 3
bar(); // (undefined + 1) + 1 → NaN
```

### Particular case: TDZ (Temporal Dead Zone)

A temporal dead zone is an area of your program where a variable exists, but is
not available yet while it didn't get its value.

The following example is obviously invalid:

```js
function foo(x = x) {
  // throws ReferenceError?
}
```

In fact, during the call of the function, `x` has not been defined yet, so it
cannot be used as a default value. This example should trigger an
[error](http://dmitrysoshnikov.com/ecmascript/es6-notes-default-values-of-parameters/#tdz-temporal-dead-zone-for-parameters)

However, scope rules will make this example invalid:

```js
const x = 1;
function foo(x = x) {
  // 'x' used here is the parameter itself
}
```

After the evaluation of the default values, we are in the scope of the function
and in this scope, `x` corresponds to the parameter (not defined yet) and not
the value defined above.

**ProTip: do not reuse a variable name 3 times** (that might helps to read and
understand your code).

## Destructuring

Like for the function arguments, assignments using
[destructuring](/en/articles/js/es2015/destructuring/) can have a default value.

```js
const obj = { z: 42 };
const { x = 1, y = x + 1, z, w } = obj;
w; // undefined
x; // 1
y; // 2
z; // 42
```

As a reminder, the assignation in the previous example would have been written
this way using ES5:

```js
var x = obj.x === undefined ? 1 : obj.x;
var y = obj.y === undefined ? x + 1 : obj.y;
var z = obj.z;
var w = obj.w;
```

# Enjoy!

There is no more reasons _a priori_ to see an `undefined` in an ES6 codebase.

About the compatibility (at the time of the writing): only Firefox ≥ 43 support
this feature (and just for function...). So you will need
[Babel](http://babeljs.io) or Traceur to be able to use it.
