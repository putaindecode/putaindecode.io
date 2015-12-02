---
date: "2015-12-01"
title: "ES6, ES2015: declaring variables with const, let and var"
tags:
  - JavaScript
  - ES6
  - ES2015
authors:
  - Nyalab
translators:
  - MoOx
---

ES6 (also known as ES2015) brings you new ways to declare your variables thanks
to `let` and `const`, but also keeps `var` in the language specification.

The first thing you need to do: forget everything you know about `var`.

# Declarations

## const

`const` allows you to declare a single assignment variable lexically bound.
Sounds posh right? That just means that you can only assign once a value in a
variable, scoped at the block level.

If you have already read stuff about `const`, be careful: this is not a way to
declare immutable variables. Only the assigned reference is immutable, not the
value. This means that the content of an array or an object declared using
`const` can evolve but the re-assignment of the reference is impossible.

```js
function fn() {
  const foo = "bar"
  if (true) {
    const foo // SyntaxError, variable needs to be assigned to something
    const foo = "qux"
    foo = "norf" // SyntaxError, variable cannot be re-assigned
    console.log(foo)
    // "qux", variable belongs to the scope of the current block (the "if" one)
  }
  console.log(foo)
  // "bar", variable belongs to the scope of the "fn" function
}
```

Just a fancy trick using `const` with an iterator:

```js
function fn() {
  const arr = [1, 2, 3]
  for (const el of arr) {
    console.log(el)
  }
}
```

You might think a `let` should be used here but the declaration is evaluated
on each iteration, so `const` fits better here.

## let

`let` allows you to do the same as `const` without the single assignment
constraint. So you can understand here that the use-cases are the same as for
its ancestor, `var`.
By the way, you might have been told that *`let` is the new `var`*.
It is partly true because it can do the same, but even better if we consider
the ability of the variable to be scoped to the block level.

```js
function fn() {
  let foo = "bar"
  var foo2 = "bar"
  if (true) {
    let foo // that's ok (foo === undefined)
    var foo2
    // Be careful, `var` statements are not scoped to the block level
    // so previous foo2 is overwritten!
    foo = "qux"
    foo2 = "qux"
    console.log(foo)
    // "qux", variable belongs to the scope of the current block (the "if" one)
    console.log(foo2)
    // "qux"
  }
  console.log(foo)
  // "bar", variable belongs to the scope of its block (the "fn" function)
  console.log(foo2)
  // "qux"
}
```

You can use `let` in loops, the variable used for the iteration will be scoped
to the block of the loop, not the (parent) scope of the code that contains the
loop. This resolves any issues that you may have had with `i` already defined in
the upper scope!

```js
function fn2() {
  let i = 0
  for (let i=i; i<10; i++) {
    console.log(i)
  }
  console.log(i)
  // 0

  for (let j=i; j<10; j++) {}
  console.log(j)
  // j is not defined
}
fn2() // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
```

Note: the example with `const` used in the `for ... of` loop cannot be
reproduced here.
The classic `for` loop is imperative, and the declaration is only made once when
the loop starts. `const` is not relevant in this case.

## var

With `const` and `let`, there is no more space for `var` anymore.
[Maybe in a `try`/`catch`
context](https://twitter.com/getify/status/658662478528643072).

# Hoisting and TDZ (Temporal Dead Zone) issues

As a reminder, JavaScript does have a hoisting mechanism. For example, you can
write:

```js
function fn() {
  console.log(foo) // "bar"
  var foo = "bar"
}
```

JavaScript engine will read all `var` declarations and virtually move those at
the start of your function scope.

`let` and `const` do not benefit from variable hoisting, and therefore can
create TDZ (Temporal Dead Zone) issues; these occur when a variable does not
exist yet.

```js
function fn() {
  console.log(foo)
  // ReferenceError, we are in the TDZ of "foo"
  let foo = "bar"
}
```

# Outro

So, let's recap:

- Use `const` (might be relevant 99% of the time)
- If during you development you happen to have to change the value of this
variable, switch to `let` (that might happen 1% of the time)
- If you are in the worst use-case of the world, use `var` (you can do the math)
