---
date: "2015-12-10"
title: "ES6, ES2015 : iterators and generators"
tags:
  - JavaScript
  - ES6
  - ES2015
authors:
  - naholyr
translators:
  - MoOx
---

ES2015 brings a lot of syntax sugar but not a lot of new real features.
Generators are a new feature to generate iterators that follow the
[iterator protocol](/en/articles/js/es2015/iterators/).
They allow to take control of the execution of a function from the outside.

## Idle function

A function followed by an asterisk (``function*``) is never executed directly
and instead calling it will return an iterator.
A generator is able to pause itself (and will do that by default).
It's also capable of continue where it was paused: the iterator returned is an
object that contains a ``next`` method which allows (when you call it) to
continue the execution of the generator where it was paused.

```js
function * idleFunction () {
  console.log('World')
}

const iterator = idleFunction()
// The execution is paused, and is waiting to be continued
console.log('Hello')
iterator.next() // The execution will now continue and will log "World"
```

Note that this is not **blocking** code: the function is paused, the execution
can continue later, but meanwhile, the *event-loop* is still running.

## Emitting new values with ``yield``

Following the [iterator protocol](/en/articles/js/es2015/iterators/), the
``next()`` method will returns an object with 2 properties :

* ``done`` is equal to ``true`` when generator has finished its job exécution
* ``value`` is the value emitted by the generator when it become idle

How to emit a value ? The keyword ``yield`` is made for this:
it will returns a value and idle the execution of the function.
The thing is: you are going to use yield multiple times in the same function.
Otherwise a generator does not make sense, and a simple function with ``return``
is enough.

```js
function * numbers () {
  yield 1
  yield 2
}

const iterator = numbers()
iterator.next() // { value: 1, done: false }
iterator.next() // { value: 2, done: false }
iterator.next() // { value: undefined, done: true }
```

Note: if our generator ``return``s a value, it will be affected to the ``value``
of the last iteration.

### _Use case_ : infinite lists

At this stage, the first interesting use case is to handle an infinite list.
We can loop on a list that do not have a precise length.
Here is an example with the Fibonacci sequence to get all results lower than
100 :

```js
function * fibo () {
  let [a, b] = [1, 1]
  while (true) { // Who can stop me?
    [a, b] = [b, a + b]
    yield a
  }
}

const iterator = fibo()
for (let n of iterator) {
  if (n >= 100) {
    break // *I* can stop you
  }
  console.log(n)
}
// 1 2 3 5 8 13 21 34 55 89
```

Note : The ``for … of`` will be explained in another article.

## Sending value to the generator

We have seen that ``yield`` allows to emit a value from the generator.
The opposite is possible too : ``next`` accepts a value that will be returned by
``yield`` :

```js
function * math () {
  // the first next() will "start" the generator
  const x = yield // the first value will be undefined
  // x = the argument of the other next() call
  const y = yield x + 1 // value of the second iteration : x + 1
  // y = third call of next()
  yield y // value of the last iteration : y
  // the fourth call and the others will return { value: undefined, done: true }
}

const iterator = math()
iterator.next(42) // { value: undefined, done: false }
// Passer un paramètre au premier appel à next() n'est pas utile : cette valeur
// n'est pas accessible dans le générateur car aucun "yield" correspondant

iterator.next(33) // { value: 34, done: false }, x = 33 dans le générateur
iterator.next(27) // { value: 27, done: false }, y = 27 dans le générateur
iterator.next() // { value: undefined, done: true }
```

This might sound not really useful, but keep in mind that you can send any type
of data to ``next()`` : a function, an object, another iterator...
Possiblities are limitless ! Let's take a look to an example using promises.

### _Use case_ : co-routines

The code of the generator itself cannot be async: call to ``yield`` follow each
others synchronously.
The main controller can still be free to call ``next()`` when it wants to.

So we have functions that we can play and pause whenever we want.
What if our generator emitted a promise? In order to tell when it's time to
continue.
What if the controller, when it knows it got a promise wait for it to be
resolved in order to send back the value to the generator?
This way, the generator will be able to run synchronous code in an non blocking
way when handling async operations :

```js
execAsync(function * () {
  console.log("Ajax request…")
  var rows = yield fetch("http://my.api/get")
  console.log("Work…")
  console.log("Save…")
  yield fetch("http://my.api/post")
  console.log("OK.")
}) // Ajax request… Work… Save… OK.
```

How cool is that? This is clearly the most interesting use case for us and is
actually pretty simple :

```js
function execAsync (promiseGenerator) {
  const iter = promiseGenerator() // pause…

  function loop (iteration) {
    if (iteration.done) { // That's the part to detect the last return
      return iteration.value
    }

    // this is a generator of promise, we we wait for the resolution
    return iteration.value.then(result => {
      // promise is resolved so we can send back the value to the generator
      const nextIteration = iter.next(result) // this value is returned by the
      // same "yield" which emitted the promise, how convenient is that?

      // NEXXXTTTT
      return next(nextIteration)
    })
  }

  const promiseIteration = iter.next()
  // we continue the execution until the next "yield"
  // the generator will be paused again until the next call to "iter.next"

  // We run the first iteration it and return it
  return loop(promiseIteration)
}
```

## More! more! more!

### Error handling

Errors, like everything, can be emitted in both directions.
The generator can ``throw`` (the code is synchronous) :

```js
function * fail () {
  yield 1
  throw new Error('oops')
  yield 2
}

const iterator = fail()
iterator.next() // { value: 1, done: false }
try {
  iterator.next() // throws
} catch (e) {
  e // Error('oops')
}
```

The controller can also emit an error inside with the ``throw`` method of the
iterator :

```js
function * fail () {
  try {
    yield 1
  } catch (e) {
    console.error(e)
  }
  yield 2
}

const iterator = fail()
iterator.next() // { value: 1, done: false }
iterator.throw(new Error("nope")) // "[Error: nope]"
iterator.next() // { value: 2, done: false }
iterator.next() // { value: undefined, done: true }
```

Note: you need to keep in mind that the first ``next`` is used to unlock
the execution of the generator, until the first ``yield``, evaluate the emitted
expression, and send it in the ``next()``, and pause the function.
That's the second ``yield`` that will continue **from the ``yield 1``**.
This is a part not really intuitive that can be hard to understand.

### Delegation

The ``yield*`` operator allow to emit value from another iterator :

```js
function * oneToThree () {
  yield 1
  yield 2
  yield 3
}

function * zeroToFour () {
  yield 0
  yield * oneToThree()
  yield 4
}
```

That works with all [*iterables*](/en/articles/js/es2015/iterators/) :
for example ``yield * [1, 2, 3]`` is valid.

### Anticipated return

It's possible to end an operation of a generator from the controller using the
``return`` method of the iterator.
Everything will happen like if the generator was ending immediately with the
returned value.

```js
function * numbers () {
  yield 1
  yield 2
  yield 3
}

const iterator = numbers()
iterator.next() // { value: 1, done: false }
iterator.return(4) // { value: 4, done: true } → yield 2 and yield 3 are skipped
iterator.next() // { value: undefined, done: true }
```

## Conclusion

Take a look to the
[compatibility table](https://kangax.github.io/compat-table/es6/#test-generators).

Generators bring us a new bundle of feature that allow us to inverse
responsibility : the code that calling the generator can take over the way the
called function will be executed.
They represent a new concept that will probably really change the way we will
code in the incoming months/years :
async function, observables... take their roots in generators.
Understanding generators will helps you to work with those other new features.
