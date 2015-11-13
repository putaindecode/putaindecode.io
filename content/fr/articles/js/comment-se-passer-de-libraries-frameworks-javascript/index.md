---
date: "2013-12-06"
title: Comment se passer de libraries/frameworks JavaScript
tags:
  - javascript
  - frameworks
  - libraries
authors:
  - bloodyowl
---

** Petite note préalable ** : évidemment que ça ne marche pas sous les vieux navigateurs, cet article s'adresse principalement à toi pour te faire comprendre comment les choses marchent.

De plus en plus, le besoin de légèreté se fait sentir sur les pages. En dépit d'un web plus rapide sur desktop, on a maintenant beaucoup de devices connectés via 3G ou Edge (un petit coucou au métro parisien). Du coup, tu te rendras vite compte qu'embarquer jQuery + jQuery Mobile + jQuery UI et un tas d'autres plug-ins grapillés sur le web, ça commence à peser.

## Pour la sélection d'élements

Pour remplacer ton bon vieux <code>$</code> magique, `document.querySelectorAll` semble faire l'affaire. En revanche, il retourne une instance de `NodeList`, pas d'`Array`, ce qui ne nous arrange pas des masses.

Du coup, on peut écrire une petite function toute con, qui nous retourne un `Array` et ses méthodes bien utiles.

```javascript
var nativeSlice = [].slice // la méthode de conversion

function $(selector){
  var list = document.querySelectorAll(selector)
  return nativeSlice.call(list)
}
```

Alternativement, tu peux utiliser `Array.apply(null, list)` plutôt que `nativeSlice.call(list)`, si vraiment ça te fait plaisir.

Une troisième solution, un peu plus chiante au quotidien (et terriblement laide), c'est d'utiliser directement les méthodes qui t'intéressent (ex. `[].forEach`) de cette façon :

```javascript
;[].forEach.call(document.querySelectorAll(selector), function(element){
  // do something w/ element
})
```

Pour en revenir à notre petite méthode <code>$</code>, on peut du coup faire :

```javascript
// prends bien l'habitude de garder
// tes nodeLists si tu les réutilises

var elements = $(".my-elements-className")

elements.forEach(function(element){
  // do something w/ element
})
```

### Pour l'event delegation

L'event delegation, c'est bien, mangez-en. Ça permet, entre autres, de ne pas attacher 150 listeners uniques à 150 éléments différents, mais à attacher un seul listener sur un parent commun, et analyser les sources des évènements à l'intérieur en se basant sur le **bubbling** (remontée d'évènements de la source au plus haut parent) ou **capturing** (descente d'évènements du plus haut parent à la source, avant même que la source ne le reçoive).

Pour faire de la délégation, on va procéder en trois temps :

* Choper `event.target`
* Vérifier que le sélecteur qui nous intéresse correspond bien à `event.target` ou un de ses parents (dans le cas où l'on clique sur le `.icon-Arrow` dans `.js-Button-action`)
* Si ça match, on garde l'élement correspondant au sélecteur, sinon, exit

Les browsers relativement récents possèdent une méthode : `matchesSelector` (et tous ses alias préfixés). Ce qu'on peut donc faire, c'est ceci :

```javascript
var docEl = document.documentElement
    // si c'est dans docEl, c'est que c'est dispo
var nativeMatchesSelector =
      docEl.matchesSelector ||
      docEl.webkitMatchesSelector ||
      docEl.mozMatchesSelector ||
      docEl.oMatchesSelector ||
      docEl.msMatchesSelector
var matchesSelector = nativeMatchesSelector || matchesPolyfill

// le polyfill utilise querySelectorAll
// et cherche dans le parent de l'élement
function matchesPolyfill(selector){
  var node = this
  var parent = node.parentNode
  var query, index, length
  if(!parent || parent.nodeType != 1) {
    return false
  }
  query = parent.querySelectorAll(selector)
  index = -1
  length = query.length
  while(++index < length) {
    if(query[index] == node) return true
  }
  return false
}

function getCurrentTarget(node, selector){
  if(matchesSelector.call(node, selector)) return node
  while(node = node.parentNode) {
    if(node.nodeType != 1) return false
    if(matchesSelector.call(node, selector)) return node
  }
  return false
}
```

Dès lors, dans nos listeners, on pourra directement procéder ainsi :

```javascript
element.addEventListener("click", function(evt){
  var currentTarget = getCurrentTarget(evt.target, ".Button-action")
  if(!currentTarget) return
  // all good with currentTarget
})
```

### Pour l'Ajax

Pourquoi est-ce que l'on appelle ça encore Ajax, d'ailleurs ? Bref.

Simple comme bonjour :

```javascript
function isSuccessStatus(status){
  return status >= 200 && status < 300 || status == 304
}

function ajax(options){
  var xhr = new XMLHttpRequest()
  var done = false
  var async = options.hasOwnProperty("async") ? options.async : true

  xhr.open(options.method || "GET", options.url, async)

  xhr.onreadystatechange = function(){
    if(done) return
    if(this.readyState != 4) return
    done = true

    if(isSuccessStatus(this.status)) {
      if(options.success) {
        options.success.call(this)
      }
      return
    }

    if(options.error) {
      options.error.call(this)
    }
  }
  Object.keys(options.headers || {})
    .forEach(function(key){
      xhr.setRequestHeader(key, options.headers[key])
    })
  xhr.send(options.data || null)
  return xhr
}
```

Cette fonction offre un support basique de XHR :

```javascript
var myXHR = ajax({
    url : "api/users",
    success : function(){
      doStuff(this.responseText)
    },
    error : function(){
      showError(this.status)
    }
})
```

### ES5 magic

ECMAScript 5 délivre des petites méthodes très intéressantes pour se simplifier la vie, fortement inspirées par ce qu'on a l'habitude de trouver dans les bibliothèques ayant connu l'âge d'or, comme [PrototypeJS](http://prototypejs.org) ou [MooTools](http://mootools.net).

Dès lors, plutôt qu'un ennuyeux :

```javascript
var key, item
for(key in myObject) {
  if(myObject.hasOwnProperty(key)) {
    item = myObject[key]
    // do something
  }
}
```

on peut se contenter d'un :

```javascript
Object.keys(myObject)
  .forEach(function(key){
    var item = myObject[i]
    // do something
  })
```

De même, on bénéficie de méthodes s'avérant très utiles, comme
[`Array.prototype.map`, `Array.prototype.reduce`, `Array.prototype.filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype),
[`Object.create`, `Object.getPrototypeOf`, `Object.getOwnPropertyNames`, `Object.defineProperty`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object). Si cela t'intéresse, je t'invite vivement à te renseigner sur ces dernières.
Et si tu veux avoir plus de détails, read the fucking manual :
[http://es5.github.io](http://es5.github.io).


### Des petits détails cools du côté des events

Avec `addEventListener`, on peut aussi passer un objet comme listener, avec `handleEvent` pour interface :

```javascript
var myElementClickEvents = {
    element : myElement,
    callbacks : [],
    handleEvent : function(evt){
      var self = this
      this.callbacks.forEach(function(item){
        item.call(self.element, evt)
      })
    }
}
myElement.addEventListener("click", myElementClickEvents)

myElementClickEvents.callbacks.push(function(evt){
  console.log(evt)
})
```

Avec ça, on peut facilement garder une trace de ce qu'on passé comme listeners.

### Du type checking ?

```javascript
var getClass = function(o){ return Object.prototype.toString.call(o) }
var someString = new String("foo")

typeof someString // "object"
getClass(someString) // "[object String]", sounds more reasonable
```

### Petit bonus

Un petit bonus rien que pour toi : pour avoir une syntaxe plus sympathique et plus claire que les prototypes.

En principe, on fait comme ça :

```javascript
function Animal(name){
  this.name = name
}

Animal.prototype.getName = function(){
  return this.name
}

function Cat(name){
  Animal.call(this, name)
}

function K(){}
K.prototype = Animal.prototype

Cat.prototype = new K
Cat.prototype.constructor = Cat
Cat.prototype.type = "cat"

var myAnimal = new Animal("Foo")
var myCat = new Cat("Bar")

myCat instanceof Cat // true
myCat instanceof Animal // true
```

Maintenant, à l'aide de deux petites méthodes :

```javascript
// wow
//         many magic
//   very es5
//            wow
function extend(object){
  var self = Object.create(this)
  if(!object) return self
  Object.keys(object)
    .forEach(function(key){
      self[key] = object[key]
    })
  return self
}

function create(){
  var self = Object.create(this)
  if(typeof self.constructor == "function") {
    self.constructor.apply(self, arguments)
  }
  return self
}

var klass = {
    create : create,
    extend : extend
}
```

Tu peux faire ça :

```javascript
var animal = klass.extend({
    constructor : function(name){
      this.name = name
    },
    getName : function(){
      return this.name
    }
})

var cat = animal.extend({
    constructor : function(name){
      animal.constructor.call(this, name)
    },
    type : "cat"
})

var myAnimal = animal.create("Foo")
var myCat = cat.create("Bar")

cat.isPrototypeOf(myCat) // true
animal.isPrototypeOf(myCat) // true
```

Voilà, j'espère que cela a pu attiser ta curiosité d'en apprendre plus sur le langage lui-même et le DOM.
