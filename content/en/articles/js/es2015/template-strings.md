---
date: "2015-12-07"
title: "ES6, ES2015 : Template strings"
tags:
  - JavaScript
  - ES6
  - ES2015
authors:
  - jbleuzen
translators:
  - MoOx
---

ES2015 add a new way to write better strings that will simplify our code: the
_template strings_.

## Principle

To define a string in JavaScript, we have single quotes or double quotes. No one
is really better than the other since you need to escape the quotes you are
using in the string itself.

_Template strings_ use _back-tick_ (grave accent) to delimitate strings.

```js
// ES5
var myString = 'I\'m a "string"';

// ES6
const myNewString = `I'm a "template string"`;
```

Nothing really awesome. So let's see the interesting new feature: interpolation.

## Interpolation

Now you can directly use expression in a _template string_ if you use the new
place holder syntax.: `${ expression }`.

```js
// ES5
var name = "world";
var myStrin = "Hello " + name; // => Hello world

// ES6
const newName = `developer`;
const myStrin = `Hello ${newName}`; // => Hello developer
```

Here we are just using a variable, but we can use any expression:

```js
const x = 1;
const y = 2;
const result = `${x} + ${y} = ${x + y}`; // => 1 + 2 = 3

function square(num) {
  return num * num;
}
const result = `${square(5)}`; // => 25
```

This is what make _template strings_ awesome.

## _template strings_ are multi-lines capable

Another cool thing is that _template strings_ handle multi-lines.

```js
// ES5
var multiline =
  "foo \
                 bar \
                 baz";

var multiline2 = "foo";
multiline2 += "bar";
multiline2 += "baz";

// ES6
const multiline = `foo
                   bar
                   baz`;
```

_Note_ keep in mind that spaces are as you write them, which can surprise you.

```js
const str1 = `foo
bar`;

const str2 = `foo
             bar`;

str1 === str2; // => false
```

## Tagged _template strings_

Let's dive into another interesting feature of _template strings_. Tags are
functions that will use just before the _template string_ and they allow us to
enhance the string result.

A tag take an array of "literals" (strings), and then all interpolated
(evaluated) expressions that we can still modify.

```js
function capitalizeVowels(strings, ...values) {
  function replaceVowels(string) {
    return string.replace(/[aeiou]/g, function(c) {
      return c.toUpperCase();
    });
  }

  let result = "";
  for (let i = 0; i < strings.length; ++i) {
    const nextValue = values[i] || "";
    result += replaceVowels(strings[i]);
    if (!parseInt(nextValue)) {
      result += replaceVowels(nextValue);
    } else {
      result += nextValue;
    }
  }
  return result;
}

capitalizeVowels`foo bar ?`; // => fOO bAr ?
const n = 42;
const c = "f";
const v = "o";
capitalizeVowels`foo ${n} bar ${c}${v}${v} ?`; // => fOO 42 bAr fOO ?
```

Here is an interesting example of tagged _template strings_ to handle
[i18n for strings](http://jaysoo.ca/2014/03/20/i18n-with-es6-template-strings/).

## String.raw

A new function has been added to `String` prototype that allows us display raw
content so you can see unescaped characters:

```js
String.raw`FOO\nbar`; // => FOO\\nbar
```

## Conclusion

When you will start to use _template strings_, you are likely going to like
them. They are clearly really useful in a daily basis.

Almost all
[modern browser handle template strings](https://kangax.github.io/compat-table/es6/#test-template_strings)
today, as well as [Babel](http://babeljs.io/) and Traceur, so you do not
hesitate to use _template strings_.
