---
date: "2015-12-15"
title: "ES6, ES2015 : Arrow functions"
tags:
  - JavaScript
  - ES6
  - ES2015
authors:
  - MoOx
---

ES2015 brings us some new syntax sugar that will likely make you stop using
``Function.prototype.bind()``.

Arrow functions are just a function shorthand using the `=>` syntax.

```js
// es5
var myFn = function(x) {
    return x + 1
}

// es6
const myFn = (x) => {
  return x + 1
}
```

Arrow functions are syntactically similar to the related feature that exists in
other languages like CoffeeScript, Java (8+), C#…

They support both expression and statement bodies.
In our example above, we have seen a classic statement.
But for simple function, we can use an simple expression, to make things shorter.
That means that the previous example can be also written like this:

```js
const myFn = (x) => x + 1
```

Note that when you have only one argument, you can omit parenthesis around it.
So we can also wrote the example like this

```js
const myFn = x => x + 1
```

And you can also wrap the body in parenthesis if you want to make a multiline expression

```js
const myFn = x => (
  x +
  1 // that can be multilines, you can imagine some JSX here ;)
)
```

So this examples are all the same :

```js
const myFn = (x) => {
  return x + 1
}
// ===
const myFn = (x) => x + 1
// ===
const myFn = x => x + 1
// ===
const myFn = x => (x + 1)
```

In practice you will use this small functions in method like Array
reduce/filter/map etc.

```js
const nums = [1, 2, 3, 4, 5]
const odds = nums.filter(v => v%2) // [1, 3, 5]
const oddsSum = odds.reduce((sum, v) => sum+v, 0) // 9
```

## Arrow functions don’t have a `this`

Yes your read correctly: unlike functions, arrows function share the same lexical this as their surrounding code.
So that means the `this` you might use use in the body of an arrow function refer to the parent scope:

```js
const Someone = {
  name: “MoOx”,
  friends: [], // he got no friends atm :(
  printFriends() {
    this._friends.forEach(f =>
      console.log(this._name + " knows " + f)
      // `this` is not the function of the forEach !
    )
  }
}
```

By reading this code, you might understand that you are likely to stop using
``bind()``:

```js
import React, { Component } from “react”
class Stuff extends Component {

  // old way
  onClick(e) {
    this.setState({ omg: false })
  }

  render() {
    return (
      <div>
        { /* old way */ }
        <button onClick={ this.onClick.bind(this) }>
          Old binded call
        </button>

        { /* LOOK MA', NO BIND ! */ }
        <button onClick={ (e) => this.onClick(e) }>
          I don’t need `bind` anymore !
        </button>

        { /* Simpler way */ }
        <button onClick={ (e) => this.setState({ omg: true }) }>
          Hell yeah
        </button>
      </div>
    )
  }
}
```

## Note about expression body and Object

If you want to return an object you might be surprised to get a syntax error
with this code

```js
const aFn = (obj) => {key: obj.value}
```

Keep in mind that in this context, a brace is to start a statement body, not an
object.
So you will need this

```js
const aFn = (obj) => { return {key: obj.value} }
```

But wait, there is a trick: a stupid couple of parenthesis:

```js
const aFn = (obj) => ({key: obj.value}) // It works !
```

## Conclusion

Take a look to the
[compatibility table](https://kangax.github.io/compat-table/es6/#test-arrow_functions).
You will see that arrow functions are already supported by most browsers but you
might need [Babel](http://babeljs.io) to use it today.

You will probably use this more and more.
Even if `function` keyword is not dead, arrow functions `=>` are probably
going to be a thing !
