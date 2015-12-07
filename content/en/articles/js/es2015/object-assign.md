---
date: "2015-12-04"
title: "ES6, ES2015 : Object.assign"
tags:
  - JavaScript
  - ES6
  - ES2015
authors:
  - naholyr
translators:
  - MoOx
---

You probably know underscore or lodash ``extend`` method (at leat lodash right)?
Like most of these utilities functions, those are deprecated by an ES6 (ES2015)
feature.

# Object.assign

The new static method ``Object.assign`` take a bunch of objects as arguments :

* The first is a target for copies;
* Next are sources;
* All *own properties* (enumerable keys and non inherited, even those which are
  ``undefined``) will be copied  in the target (so last ones take precedences);
* **The target object is modified** (it must be mutable);
* The modified target object is returned.

```js
const o = { y: 0 }
const o1 = { x: 1, y: 2 }
const o2 = { x: undefined, z: 3 }
Object.assign(o, o1, o2) // { x: undefined, y: 2, z: 3 }
o // { x: undefined, y: 2, z: 3 }
o1 // unmodified
o2 // unmodified
```

## Becareful to mutability

Be warned that the target is always modified.
Since the most frequent use-case is the creation of a new object that will be
generated from others sources, most of the time we will pass an new empty object
as the first parameter.

```js
const o1 = { x: 1 }
const o2 = { y: 2 }
const o = Object.assign({}, o1, o2)
o // { x: 1, y: 2 }
// o1 and o2 are unmodified
```

## Specific use-cases

### Error during the copy

If a property in the target is read-only, ``Object.assign`` should behave like
in strict mode (unlike the *wtf* mode) and throw an error before stoping the
copy.

```js
const o = Object.create({}, {
  val: { value: 42, enumerable: true, writable: false }
})

// "standard" (wtf) mode:
o.val = 0 // no error
o.val // 42 (unmodified value)
Object.assign(o, { x: 1, val: 0, y: 2 }) // Uncaught TypeError: Cannot assign…
o // { val: 42, x: 1 }

// "strict" mode:
o.val = 0 // Uncaught TypeError: Cannot assign…
Object.assign(o, { x: 1, val: 0, y: 2 }) // Uncaught TypeError: Cannot assign…
o // { val: 42, x: 1 }
```

Keys that have already been copied before the throwing of the exception will
be kept in the target object, that's why in our example ``x`` have been copied
but not ``y``.

Note: this is theory, but practise show us that this behavior is variable,
depending of the platform and the context, the error might not always be thrown.
To get a predictable behavior, you should work in *strict* mode.

### Scalar sources

When sources are scalar values (number, boolean, etc) ``Object.keys`` will not
return any keys and values will be ignored.
``null`` and ``undefined`` will also be ignored.

Particular case: strings are treated as array.

```js
const o = {}
Object.assign(o, 1, true, null, "toto", ["b", "a"], undefined)
// 1, true, null, undefined are ignored
// "toto" is converted to {0: "t", 1: "o", 2: "t", 3: "o"}
// ["b", "a"] is converted to {0: "b", 1: "a"}
o // {0: "b", 1: "a", 2: "t", 3: "o"}
```

## Conclusion

We can forget ``_.clone``, ``_.extend`` and friends with this method!

About compatiblity, ``Object.assign`` is pretty well supported by all modern
browsers (IE is not considered as modern until 12) :

* Edge (IE ≥ 12) ;
* Chrome stable (46) ;
* Firefox stable (42) ;
* Node ≥ 4 ;
* If you need to support old browsers, you will need [Babel](http://babeljs.io)
  or one of many users implementations.
