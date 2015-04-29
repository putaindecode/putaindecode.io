---
date: "2014-05-01"
title: Introduction au testing js front
tags:
  - javascript
  - tape
  - unit-test
  - browserify
authors:
  - bloodyowl
---

Les tests automatisés en front-end ont longtemps été ignorés,
et le sont encore trop.

Écrire des tests peut paraître chiant, mais le temps qu'ils rapportent
compense largement celui que l'on passe à les écrire.

## Écrire du js testable

Prenons un exemple simple et moche :

```javascript
//app.js
;(function(){

  var cart = $("#cart")
  function addToCart(id){
    var element = $("<li></li>")
    element.html(catalog[id])
    cart.append(element)
  }

  $(".js-updateCart")
    .on("click", function(eventObject){
      addToCart($(this).data("id"))
    })

})()
```

Tester ce code est particulièrement lourd, pour plusieurs raisons :

- les functions à tester ne sont pas accessibles
- on doit simuler un `click` pour tester un comportement logique.
- on doit créer un element et modifier son `data-id` à chaque cas souhaité.
- pour tester `addToCart` on doit aller regarder dans le DOM.

### 1. Rendez accessibles vos méthodes au test runner

Vous pouvez utiliser un namespace adéquat.

```javascript
var app = window.app = {}
app.cart = {}
app.cart.addToCart = function(){ /* … */ }
```

Mais ne souhaitez probablement pas rendre vos méthodes accessibles à la console.

Utilisez un module-system : [browserify](http://browserify.org) ou
[requirejs](http://requirejs.org) (si vous n'avez pas besoin de chargement
conditionnel et souhaitez créer un bundle par build, utilisez browserify qui
possède une syntaxe beaucoup plus sympathique et une codebase réduite, vous
pourrez même `require` depuis un module npm
[comme on vous l'explique dans un article dédié](/posts/js/browserify-all-the-things/)).

```javascript
var $ = require("jquery") // oh, un module npm

module.exports = {
  element : $("#cart"),
  addToCart : function(){
    /* … */
  }
}
```

Vous pourrez ainsi séparer proprement votre application en modules et les tester individuellement.

### 2. Oui, mais les modules interdépendants alors ?

Là, ça devient un peu plus tricky.
Ce que je conseille à titre personnel c'est d'utiliser des events
pour faire communiquer les différentes parties de l'application.

Cela permet d'éviter d'utiliser des mocks d'autres parties de l'application partout.

Par exemple, si je souhaite tester le fait qu'un click sur `.js-updateCart`
déclanchera bien `updateCart` :

```javascript
//view.js

// view est une petite class qui route les events
// en rendant les listeners accessibles aux tests
// vous pouvez très facilement en concevoir une
// à votre goût en quelques lignes de code
var view = require("../lib/view")

// eventbus est l'event bus de l'application, il orchestre
// la communication entre les différents modules
var eventbus = require("../eventbus")

var $ = require("jquery")

module.exports = view.extend({
  element : document.body,
  events : [
    {
      type : "click",
      selector : ".js-addToCart",
      listener : "addToCart"
    }
  ],
  addToCart : function(eventObject){
    var target = eventObject.currentTarget
    var id = $(target).data("id")
    eventbus.fire("addToCart", {
      id : id
    })
  }
})
```

et je n'aurais qu'à écouter cet event depuis `cart` :

```javascript
// cart.js
var eventbus = require("../eventbus")
var catalog = require("../catalog")

module.exports = {
  initialize : function(){
    this._addToCart = this.addToCart.bind(this)
    eventbus.listen("addToCart", this._addToCart)
  },
  release : function(){
    eventbus.stopListening("addToCart", this._addToCart)
  },
  addToCart : function(eventObject){
    // et on a eventObject.id
    this.products.push(catalog[eventObject.currentTarget.data("id")])
  }
}
```

Grâce à cette architecture, je vais pouvoir tester individuellement
les deux modules.

```javascript
// view.test.js

var tape = require("tape")
var view = require("../app/view")
var eventbus = require("../eventbus")
var $ = require("jquery")

tape("view", function(test){
  test.plan(1)
  var element = $("<div></div>")
  element.data("id", 1)
  // on teste facilement l'envoi
  eventbus.listen("addToCart", function(eventObject){
    test.equal(eventObject.id, 1)
  })
  view.addToCart({
    currentTarget : element
  })
})
```

```javascript
// cart.test.js

var tape = require("tape")
var cart = require("../app/cart")
var eventbus = require("../eventbus")
var catalog = require("../catalog")

tape("cart", function(test){
  cart.initialize()
  eventbus.fireSync("addToCart", {id:1})
  test.deepEqual(
    cart[0],
    catalog[1],
    "receives addToCart event"
  )
  test.end()
})
```

## Tester tous les cas possibles

Ce sont souvent les edge-cases qui nous font nous arracher les cheveux.
Pour pallier ces soucis, tester en profondeur est essentiel.

Prenons un exemple, une méthode qui teste si la valeur qu'on lui passe est
une `string`.

On serait tenté de simplement tester les résultats positifs de cette façon :

```javascript
tape("type.isString on strings", function(test){
  test.equal(type.isString(""), true)
  test.end()
})
```

Or, si par mégarde ma méthode `isString` se révèle être :

```javascript
type.isString = function(value) {
  return typeof value == "string"
}
```

on ne vérifie pas le cas `type.isString(new String(""))`.

Du coup, des tests complets :

```javascript
tape("type.isString on strings", function(test){
  test.equal(type.isString(""), true)
  test.equal(type.isString(new String("")), false)
  test.end()
})
```

permettent ici d'identifier qu'en réalité on a besoin de :

```javascript
type.isString = function(value) {
  return Object.prototype.toString.call(value) == "[object String]"
}
```

Et c'est à la force des résultats de tests que vous identifierez rapidement
vous familiariserez à tous ces edge-cases.

À chaque correctif de bug, ajoutez des tests (mais ça, vous le saviez déjà).

## Cross-browser testing

À l'heure actuelle, où l'on se trouve notamment très souvent avec du
feature testing.
Pour le tester complètement, on doit se servir de vrais navigateurs :
un headless (certes, très pratique) comme [phantomjs](http://phantomjs.org)
ne permettra pas d'obtenir 100% de coverage.

```javascript
var supportsAnimationFrame =
  !!(
    win.requestAnimationFrame ||
    win.webkitRequestAnimationFrame ||
    win.mozRequestAnimationFrame ||
    win.ORequestAnimationFrame ||
    // vous avez fait une faute de frappe,
    // et mis un `O` majuscule, seul un
    // test sur les version concernées d'Opera
    // vous permettront de l'identifier
    win.msRequestAnimationFrame
  )
```

De plus, vous pouvez par habitude être tenté d'utiliser un
`Array.prototype.forEach` alors que votre scope navigateur inclut
IE8; seuls des tests sur un vrai browser vous permettront d'identifier le souci.

Je vous conseille fortement testling, très simple à intégrer dans vos
modules, et gratuit pour tout projet open-source.

Dans le `package.json` :

```json
{
  "testling": {
    "files": "test/**/*.js",
    "browsers": [
      "ie/9..latest",
      "chrome/22..latest",
      "firefox/16..latest",
      "safari/6..latest",
      "opera/11.0..latest",
      "iphone/6..latest",
      "ipad/6..latest",
      "android-browser/latest"
    ]
  }
}
```

Et ajouter un webhook dans l'admin de votre repository GitHub pointant vers

> http://git.testling.com

Vous pouvez l'utiliser avec tape (son test harness par défaut)
Mocha, QUnit et n'importe quelle bibliothèque
de test supportant `TAP` comme indiqué sur
[le site de testling](https://ci.testling.com/guide/custom_libraries).

Vous trouverez aussi des alternatives populaires
[similaires](http://www.browserstack.com),
ou ayant [une approche différente](http://karma-runner.github.io).

Par ailleurs, si dans votre code il existe des variations entre les navigateurs,
vous pouvez utiliser du test conditionnel :

```javascript
if(typeof {}.__proto__ == "object"){
  test.equal(list.__proto__ === Array.prototype, false, "__proto__ isn't Array.prototype")
} else {
  test.equal(list instanceof Array, false, "Isn't a window Array")
}
```

Happy testing!

```console
$ testling

TAP version 13
# tests
ok 1 bisous

1..1
# tests 1
# pass  1

# ok
```
