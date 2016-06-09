---
date: "2016-06-09"
title: Redux, comment ça marche ?
tags:
  - javascript
  - redux
authors:
  - bloodyowl
---

Alors si vous faites du développement web et que vous ne vivez pas dans une cave, vous avez certainement déjà entendu parler de [Redux](http://redux.js.org).

## Kesako ?

Redux est une implémentation dérivée de Flux. Ça permet de créer un **Store** qui contient un **état**, réagit à des **actions dispatchées**, et auquel on peut **souscrire** pour être notifié des changements. Il permet également l'ajout de **middlewares**, qui peuvent en quelque sorte *pre-process* les actions.

Du coup, on va écrire une implémentation de Redux pour mieux décomposer son fonctionnement.

## 1. Gérer l'état

Redux se distingue par son mécanisme d'update de l'état, puisqu'il est décrit dans des **reducers**. Vous connaissez [`Array.prototype.reduce`](/fr/articles/js/array-reduce/) ? Eh ben votre **reducer** a exactement la même signature que la fonction de `reduce`.

Pour faire simple, votre état vaudra toujours :

```javascript
dispatchedActions.reduce(reducer, undefined)
```

Si ça vous paraît un peu abstrait, prenons un exemple tout con de reducer :

```javascript
// on part de 0
const initialState = { counter: 0 }

const counter = (state = initialState, action) => {
  switch(action.type) {
    // selon l'action …
    case "INCREMENT":
      // … on retourne un nouvel état incrémenté
      return { counter: state.counter + 1 }
    case "DECREMENT":
      // … ou décrémenté
      return { counter: state.counter - 1 }
    default:
      // ou l'état actuel, si l'on n'y touche pas
      return state
  }
}
```

Le petit `state = initialState` c'est un [paramètre avec une valeur par défaut](/fr/articles/js/es2015/defaults/), si vous avez bien vu le bout de code avec le `reduce` un peu plus haut, on passe la valeur `undefined` comme accumulateur initial, ça permet d'avoir un state valant `initialState` au passage de la première action.

Le `switch` permet de retourner un nouvel état selon les actions passées, avec un `default` qui retourne l'état actuel, dans le cas où on se fout de l'action dans ce reducer.

C'est parti pour implémenter ça :

```javascript
const createStore = (reducer) => {
  // on balance une première action "opaque",
  // qui ne sera pas traitée par le reducer, histoire de commencer avec un état
  let state = reducer(undefined, { type: "@@INIT" })
  return {
    // une méthode pour dispatcher les actions
    dispatch: (action) => {
      state = reducer(state, action)
    },
    // une méthode pour récupérer le state
    getState: () => state
  }
}
```

Super, on peut écrire et lire notre état.

## 2. Le mécanisme de souscription

Pour pouvoir signaler aux intéressés que des updates ont eu lieu sur l'état, on doit ajouter un mécanisme de souscription : un bête event emitter.

```javascript
const createStore = (reducer) => {
  let state = reducer(undefined, { type: "@@INIT" })
  // on crée un `Set` où l'on va stocker les listeners
  const subscribers = new Set()
  return {
    dispatch: (action) => {
      state = reducer(state, action)
      // à chaque dispatch, on appelle les subscribers
      subscribers.forEach((func) => func())
    },
    subscribe: (func) => {
      // on ajoute `func` à la liste de subscribers
      subscribers.add(func)
      // et on retourne une fonction permettant d'unsubscribe
      return () => {
        subscribers.delete(func)
      }
    },
    getState: () => state
  }
}
```

Ayé, le mécanisme est en place.

## 3. Combiner les reducers

Maintenant ce qui serait pas mal, ce serait de permettre d'avoir plusieurs reducers, afin de pouvoir les découper et d'éviter d'avoir du gros code bloated qui tâche. Pour ce faire, on va créer la fonction `combineReducers` qui va prendre un objet contenant des reducers, et transformer ça en un seul reducer qui va retourner un objet de la même forme, avec l'état retourné par le reducer de la même clé.

```javascript
const combineReducers = (reducers) => {
  const reducersKeys = Object.keys(reducers)
  return (state = {}, action) => {
    return reducersKeys.reduce((acc, key) => {
      acc[key] = reducers[key](state[key], action)
      return acc
    }, {})
  }
}
```

Maintenant, on peut bien séparer ses reducers :

```javascript
import { users } from "./reducers/user"
import { tweets } from "./reducers/tweets"

const reducer = combineReducers({
  users,
  tweets,
})

const store = createStore(reducer)
```

## 4. Permettre l'ajout de middlewares

Les middlewares apportent toute la liberté de personalisation de Redux. L'un des plus populaires est le [*thunk middleware*](https://github.com/gaearon/redux-thunk), qui permet de passer une fonction à la place d'une action, et de dispatcher depuis cette fonction, ce qui peut s'avérer très utile pour gérer des réponses asynchrones.

On va donc créer une fonction `applyMiddleware`, qui va enrichir un store en ajoutant une sorte de hook sur sa méthode dispatch.

```javascript
// compose(a, b, c) équivaut à (...args) => a(b(c(...args)))
const compose = (...funcs) => {
  const last = funcs[funcs.length - 1]
  const rest = funcs.slice(0, -1)
  return (...args) => rest.reduceRight((composed, f) => f(composed), last(...args))
}

const applyMiddleware = (...middlewares) => {
  return (store) => {
    // cette API sera passée à chaque middleware, afin qu'il puisse récupérer
    // l'état en cours et dispatcher des actions
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    }
    const chain = middlewares.map((middleware) => middleware(middlewareAPI))
    let dispatch = compose(...chain)(store.dispatch)
    return {
      ...store,
      dispatch,
    }
  }
}
```

> NOTE: l'API de Redux prend `createStore` plutôt que `store` en paramètre, la différence est volontaire dans cette démarche de simplification

Voilà, maintenant on peut faire

```javascript
const thunk = ({ dispatch, getState }) => (next) => (action) => {
  if (typeof action === "function") {
    return action(dispatch, getState)
  }
  return next(action)
}

const store = applyMiddleware(thunk)(createStore(reducer))

// et maintenant on peut faire
store.dispatch((dispatch, getState) => {
  dispatch({ type: "FOO" })
  setTimeout(() => {
    dispatch({ type: "BAR" })
  })
})
```

Voilà voilà, j'espère que cet article a pu vous éclairer un petit peu sur le fonctionnement de Redux et vous permettra de l'aborder avec plus de serénité.

Zoub'
