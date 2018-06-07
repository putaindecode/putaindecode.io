---
date: "2015-12-16"
title: "ES6, ES2015 : for..of loop"
tags:
  - javascript
  - ES6
  - ES2015
  - for..of
authors:
  - Freezystem
---

## Introduction

With the arrival of new iterable objects, ECMAScript had to create new ways to
read through them. In the unique concern of maintaining the backward
compatibility, ES6 had to const his `for..in` loop untouched.

> But then, how to create a copycat of this same loop with improved capabilities
> ?

Solution is quite simple: "Welcome to the `of` keyword!"

But before I tell you more, and to fully understand the usefulness of this new
keyword, const review the existing.

## The good ol' `for..in`

All self-respecting _JavaScript enthousiast_ already knows the famous `for..in`
loop whose first value is to iterate over the different keys of an object or an
array.

```js
const obj = { foo: "hello", bar: "world" };

for (const key in obj) {
  console.log(key + "->" + obj[key]); // 'foo->hello', 'bar->world'
}
```

The `for..in` loop, despite its ease of use hide some pitfalls:

- When itarating over an array, index value is parsed to string : "0", "1", "2",
  etc.. This behaviour can lead to potential error when index is used in
  computation.
- The loop iterate across all the table keys, but also over each of its
  properties.

  ```js
  const arr = ["foo", "bar"];
  arr.oups = "baz";

  for (const key in arr) {
    console.log(key + "->" + arr[key]); // '0->foo', '1->bar', 'oups->baz'
  }
  ```

- Iteration order over a given object properties may vary across depending on
  the code executing environment.

## The alternative `.forEach()` method

The
[`Array.prototype.forEach()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
loop allow a more secure iteration, but bring other downsides as:

- Impossibility to halt the loop with the traditional `break;` and `return;`
  statements.
- Array only dedicated method.

## `for..of` to the rescue

ECMA consortium has so decided to proceed with establishment of a new enhanced
version of the `for..in` loop. Thus was born the `for..of` loop which, from now
on, will coexist with the previous one allowing to maintain the backward
compatibility with former version of the standard.

The principal is the same : run across any type of _iterable object_.

In its simplest form, the `for..of` loop therefore allow to iterate over all
values of a table keys.

```js
const arr = ["hello", "world"];
arr.baz = "and mars";

for (const arrValue of arr) {
  console.log(arrValue); // 'hello', 'world'
}
```

The `for..of` loop can also iterate over more complex types like:

### _Strings_

In this case, each character is evaluated as a Unicode entity.

```js
const str = "sm00th";

for (const chr of str) {
  console.log(chr); // 's', 'm', '0', '0', 't', 'h'
}
```

### _NodeList_

```js
// Note: This will only work in platforms that have
// implemented NodeList.prototype[Symbol.iterator]

// this code add a "read" class to each <p> markup
// contained in each <article> markup

const articleParagraphs = document.querySelectorAll("article > p");

for (const paragraph of articleParagraphs) {
  paragraph.classList.add("read");
}
```

### _Maps_

```js
const m = new Map([["foo", "hello"], ["bar", "world"]]);

for (const [name, value] of m) {
  console.log(name + "->" + value); //"foo->hello", "bar->world"
}
```

### _Sets_

```js
const s = new Set(["foo", true, 42]);

for (const value of s) {
  console.log(value); // 'foo', true, 42
}
```

### _Generators_

```js
function* foo() {
  yield "foo";
  yield false;
  yield 42;
  yield "bar";
}

for (const v of foo()) {
  console.log(v); // 'foo', false, 42, 'bar'
}
```

> What about traditional object ?

Suprisingly, objects can't be directly browsed by this brand new loop.
Fortunately a workaround exists such as
[`Object.keys()`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object/keys)

```js
const obj = { foo: "hello", bar: "world" };

for (const key of Object.keys(obj)) {
  console.log(key + "->" + obj[key]); // 'foo->hello', 'bar->world'
}
```

## In a nutshell

`for..of` comes to address `for..in` loop gaps and allow a simplified iteration
over _iterable objects_ such as:

- [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
- [Maps & WeakMaps](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [Sets & WeakSets](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [Generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function%2A)
- [NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList)
- [arguments](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments)

Furthermore, `for..of` as of now resolve pitfalls such as unpredictable
iteration order or automated coercion of index to string.

## To go further

`for..of` loop is another added arrow to ES6 bow that allows to run through, in
a native way, the brand new _iterable objects_ of the language.

For information about this feature :

- [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of)
- [The post of Jason Orendorff](https://hacks.mozilla.org/2015/04/es6-in-depth-iterators-and-the-for-of-loop/)
- [The post of Dave Herman](http://tc39wiki.calculist.org/es6/for-of/)
- [ECMA-262 Specification](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-for-in-and-for-of-statements)
