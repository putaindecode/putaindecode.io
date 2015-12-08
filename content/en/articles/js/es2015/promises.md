---
date: "2015-12-06"
title: "ES6, ES2015 : Promises"
tags:
  - JavaScript
  - ES6
  - ES2015
authors:
  - Uhsac
translators:
  - MoOx
---

With ES2015, you can now very easily write asynchronous code thanks to the
promises.
The concept of promises exists is not new in the JavaScript world, but now
we got an official feature!

## What's a promise?

It's a promise of an incoming value, not available yet. It's a promise so it can
be fulfilled or not (rejected). If fulfilled, it will give us the the value we
were waiting for. If rejected, we will get the error so we can handle it.

This mechanism allows to avoid the callback hell :

```js
// With callbacks.
// Let's say that all those function are doing async tasks (like http or
// database request, fs read...)
const functionWithCallback1 = (callback) => callback('test', undefined)
const functionWithCallback2 = (arg, callback) => callback(arg, undefined)
const functionWithCallback3 = (arg, callback) => callback(arg, undefined)
const functionWithCallback4 = (arg, callback) => callback(arg, undefined)
const functionWithCallback5 = (arg, callback) => callback(arg, undefined)
const functionWithCallback6 = (arg, callback) => callback(arg, undefined)

functionWithCallback1((result1, err) => {
  if (err) {
    throw err
  }
  functionWithCallback2(result1, (result2, err) => {
    if (err) {
      throw err
    }
    functionWithCallback3(result2, (result3, err) => {
      if (err) {
        throw err
      }
      functionWithCallback4(result3, (result4, err) => {
        if (err) {
          throw err
        }
        functionWithCallback5(result4, (result5, err) => {
          if (err) {
            throw err
          }
          functionWithCallback6(result5, (result6, err) => {
            if (err) {
              throw err
            }
            console.log(`Example with callbacks: ${result6}`)
          })
        })
      })
    })
  })
})

// Now the same thing with promises
const functionWithPromise1 = () => Promise.resolve('test')
const functionWithPromise2 = (arg) => Promise.resolve(arg)
const functionWithPromise3 = (arg) => Promise.resolve(arg)
const functionWithPromise4 = (arg) => Promise.resolve(arg)
const functionWithPromise5 = (arg) => Promise.resolve(arg)
const functionWithPromise6 = (arg) => Promise.resolve(arg)

functionWithPromise1()
  .then(functionWithPromise2)
  .then(functionWithPromise3)
  .then(functionWithPromise4)
  .then(functionWithPromise5)
  .then(functionWithPromise6)
  .then(result => console.log(`Example with promises: ${result}`))
  .catch(err => {
    throw err
  })
```

As you can see, example with promises is clear and more concise.

## That's cool. How can I use promises?

A promise can have different status:
- in progress: value is not ready yet
- resolved: value is here, we can use it
- rejected: an error has been thrown, we should handle it.

A promise have 2 functions: `then` and `catch`.
You can use `then` to wait for the result (or handle an error), and `catch` to
catch all possibles errors of one promise or more.

Let's see how to use promises with an example of the incoming standardized
[`fetch`](https://fetch.spec.whatwg.org) method.

```js
// At this moment, promise is in progress
const fetchPromise = fetch('http://putaindecode.io')

// When promise is resolved, you go a value you can work with
const parsePromise = fetchPromise.then(fetchResult => {
  // I can return a new result that can be used as a new promise
  // Here we call .text() which parse the content of the request and return
  // promise
  return fetchResult.text()
})

// When parsing is done, we can work with the content
parsePromise.then(textResult => {
  console.log(`Here is the text result : ${textResult}`)
})

// If the request encounter an issue, promise might be rejected with an error
fetchPromise.catch(fetchError => {
  console.log(`We got an issue during the request`, fetchError)
})

// If there is an issue during the parsing, we can handle it too
parsePromise.catch(parseError => {
  console.log("We got an issue during the parsing", parseError)
})

// The same can be written like this
fetch('http://putaindecode.io')
  .then((fetchResult) => fetchResult.text())
  .then((textResult) => {
    console.log(`Here is the text result : ${textResult}`)
  })
  .catch((error) => {
    console.log(`We got an issue during the request or the parsing`, fetchError)
  })

// Or like this
fetch('http://putaindecode.io')
  .then(
    (fetchResult) => {
      return fetchResult.text()
    },
    (fetchError) => {
      console.log(`We got an issue during the request`, fetchError)
    })
  .then(
    (textResult) => {
      console.log(`Here is the text result : ${textResult}`)
    },
    (parseError) => {
      console.log("We got an issue during the parsing", parseError)
    }
  )
```

## How do I create my own promises?

Using a promise is nice, but creating yours is even better. Let's be clear: it's
easy.

```js
const functionThatReturnAPromise = (success) => {
  // We will need to use Promise class to use one.
  // constructor takes 2 arguments:
  // - resolve, a callback to pass the value you want to send
  // - reject, a callback to throw an error
  return new Promise((resolve, reject) => {
    if (success) {
      resolve('success')
    }
    else {
      reject('failed')
    }
  })
}

// You can use this promise like this
functionThatReturnAPromise(success)
  .then(res => console.log(res))
  .catch(error => console.log(error))

// In our case, the previous example can be also written
functionThatReturnAPromise(success)
  .then(
    (res) => console.log(res),
    (error) => console.log(error)
  )
```

## What's next?

A new way to write asynchronous will land in JavaScript with `async` and `await`
keywords, but we will need to way another ES year (or two) for it !
