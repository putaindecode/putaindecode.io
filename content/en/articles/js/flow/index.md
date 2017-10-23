---
date: "2016-06-07"
title: Introduction to Flow, to make your code run on the first try
tags:
  - javascript
  - flow
  - type
authors:
  - bloodyowl
translators:
  - skinnyfoetusboy
---

```javascript
document.body.firstChild.getBoundingClientRect();
```

This hypothetical line of code doesn't always work.

The reason for this is that `element.firstChild` is a `Node`, not all of which
have a `getBoundingClientRect` method, which is always found on `Elements`, a
class that inherits from `Node`.

This kind of error is rather usual, and unfortunately JavaScript doesn't quite
get out of its way to warn us that *oi m8 that might not work*. JS actually
prefers warning us at _runtime_ when it's too late because the bug already
happened.

That is because JavaScript is a **weakly/dynamically-typed** language.

Weakly-typed, because if you try to make an operation with two values that have
incompatible types, JS will convert those types to ones that it thinks will be
the most adequate.

Example _feat. JavaScript's Inner Voice™_

```javascript
"1" + 1;
// alright alright, so that string might contain absolutely anything
// if I tried to make it a number it could become NaN
// let's just make the number a string and concatenate both of them
("11");
```

```javascript
"1" * 1;
// who the fuck wrote that crap?
// okay, that's a multiplication
// no choice but to make that string a number
1;
```

Dynamically-typed, contrary to statically-typed, because type tests are made at
runtime.

```javascript
const toLowerCase = value => {
  return value.toLowerCase();
};

toLowerCase(3);
// uhm. (3).toLowerCase is undefined
// undefined ain't a function, ERROR
```

## How did we do so far?

### Using docs

```javascript
/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
const multiply = (a, b) => {
  return a * b;
};
```

Good, now the team knows what types the function needs. It doesn't quite prevent
runtime errors from happening but at least, hey, it's something.

### Going all the way in dynamic typing

```javascript
const multiply = (a, b) => {
  if (typeof a !== "number") {
    throw new TypeError();
  }
  if (typeof b !== "number") {
    throw new TypeError();
  }
  return a * b;
};
```

We can check types at runtime to find possible bugs in a drastic way, but that
still doesn't protect us from that one issue that will break our app.

### Acting like it's no biggie

```javascript
const multiply = (a, b) => {
  if (typeof a !== "number") {
    a = 0;
  }
  if (typeof b !== "number") {
    b = 0;
  }
  return a * b;
};
```

That's "defensive programming" for you. Instead of preventing the bug from
happening, we tolerate it. In 99% of all cases, the result will definitely not
be the one you expected and you won't even know when something went wrong.

## How are other languages doing?

Other languages use static typing, which means the program won't compile if the
types are wrong.

```ocaml
let value = "1";;

value + 1;;
```

If you try to run the above code, OCaml will grace you with a nice

```
File "test.ml", line 3, characters 0-5:
Error: This expression has type string but an expression was expected of type
         int
```

## Okay, how do we get this in JS?

That's the part where [Flow](http://flowtype.org), a static analysis tool for
JS, does its magic; it detects typing incompatibilities in your code.

```javascript
/* @flow */
const add = (a, b) => {
  return a + b;
};

add(1, "1");
```

```
6: multiply(1, "1")
   ^^^^^^^^^^^^^^^^ function call
3:   return a * b
                ^ string. This type is incompatible with
3:   return a * b
            ^^^^^ number
```

In the previous case, Flow analyses your code and understands that an operation
of a `string` and a `number` is not directly possible. This means we can have
code running on the first try every time, because Flow eliminates all our stupid
little mistakes. As a bonus, it also avoids useless unit tests on types.

Flow also adds a syntax to define expected types in a given situation. We use
`:` followed by the type the value should have.

```javascript
/* @flow */
// built-in types are naturally understood by flow
const foo: string = "foo";
const bar: number = 3;
// we can add typing to values within an array
const baz: Array<string> = ["foo", "bar"];
// we can add typing to structures
const object: { foo: string, bar: number } = { foo, bar };
// or define allowed literal values
const value: "enabled" | "disabled" = "enabled";
// or type unions
const stringOrNumber: string | number = "foo";

function sum(array: Array<number>): number {
  return array.reduce((acc, item) => acc + item, 0);
}

class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}
// or even use prototypal relations to add typing to a specific value
const person: Person = new Person("foo");
```

Flow allows creation of typing aliases, which is essential to share them within
a codebase. A syntax for importing types from a file also exists. Those imports
are purged from the build.

```javascript
/* @flow */
import type { MediaType } from "./MediaType";

export type UserType = {
  username: string,
  firstName?: string,
  lastName?: string,
  email: string,
  avatar: MediaType
};
```

When you write code that doesn't care about types, you can use _generics_ which
are kinda like type placeholders.

```javascript
/* @flow */
// `T here, is a type that will defined at the call-site
function findLast<T>(
  array: Array<T>,
  func: (item: T, index: number, array: Array<T>) => any
): null | T {
  let index = array.length;
  while (--index >= 0) {
    const item = array[index];
    if (func(item, index, array)) {
      return item;
    }
  }
  return null;
}

// Flow knows that in this case, `T` will be a number
const lastEvenNumber: ?number = findLast(
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  item => item % 2 === 0
);
```

Flow also allows typing by expected partial structure.

```javascript
/* @flow */
// the interface allows to ensure that the tested value contains
// a `getName` method that returns a `string`
interface named {
  getName(): string;
}

class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}

const person: named = new Person("Luke Skywalker");
```

React is supported out of the box, and Flow can be used to replace `propTypes`.

```javascript
/* @flow */
import React, { Component } from "react";
import type { Element as ReactElement } from "react";
import type { UserType } from "../types/UserType";

// <DefaultProps, Props, State>
class User extends Component<void, Props, void> {
  render(): ReactElement {
    return <div>{user.username}</div>;
  }
}

type Props = {
  user: UserType
};
```

## But that isn't valid JS

Don't panic, there are babel plugins for that:

```console
npm install --save-dev babel-plugin-syntax-flow babel-plugin-transform-flow-strip-types
```

and then you only have to add `"syntax-flow"` and `"transform-flow-strip-types"`
to your `.babelrc`.

## What if I can't use babel on my project?

Well first off, sorry for you. But you still can use Flow with nice comments.

```javascript
/* @flow */
const add = (a /*: number */, b /*: number */ /*: number */) => {
  return a + b;
};

add(1, 1);
```

Alright, now none of you have any excuses not to type your JS so it would be
quite a good idea to go on [Flow's
website](http://flowtype.org/docs/getting-started.html#_) to learn a little more
about it.

Buh-bye.
