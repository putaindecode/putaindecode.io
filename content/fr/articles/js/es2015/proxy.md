---
date: "2015-12-18"
title: "ES6, ES2015 : les Proxy"
tags:
  - JavaScript
  - ES6
  - ES2015
authors:
  - DavidBruant
---

## Proxies Origin

### What the DOM?

ES5 avait laissé un petit trou nommé _["host
objects"](http://www.ecma-international.org/ecma-262/5.1/#sec-4.3.8)_ afin de
donner un "cadre légal" aux trucs bizarres qui peuvent arriver dans le DOM. Par
exemple, certaines collections sont dites
["live"](https://dom.spec.whatwg.org/#concept-collection-live) et même si on ne
touche pas l'objet directement, on se rend compte que la collection a été
modifiée.

```js
var childNodes = document.body.childNodes;
console.log(childNodes.length); // 0
document.body.appendChild(document.createElement("div"));
// Personne n'a touché explicitement l'objet dans la variable divs, pourtant :
console.log(childNodes.length); // 1, wat!
```

Ce genre de comportement n'est pas explicable par la sémantique d'ES5 (à moins
d'accepter des gros problèmes de performances qui consisteraient à ce que le DOM
garde une référence vers toutes les collections live et les mette à jour
régulièrement, ou des getter partout, etc.). La [spec
WebIDL](https://heycam.github.io/webidl/) qui fait le lien entre les objets
décrits dans les spec W3C et la sémantique ECMAScript se contentait d'un "c'est
un *host object*, allé, salut les gars les filles !" (en fait, c'était pire que
ça&nbsp;: [la spec de
l'époque](http://www.w3.org/TR/DOM-Level-2-Core/ecma-script-binding.html) était
absurde tant elle manquait de détails, mais je vous fais la version de Noël).

Mais ce genre d'explication n'est pas vraiment acceptable. Et si un navigateur a
un bug, comment je polyfille le comportement correct, hein ?

Les proxies peuvent aider.

### Qu'est-il arrivé à mon objet ?

Avant que la planète JS ne s'amourache des [structures des données
immutables](https://facebook.github.io/immutable-js/), on créait des objets et
des fois, on les passait à du code qui les modifiait et on se demandait bien
quand/comment l'objet en question en était arrivé dans cet état. Depuis ES5, on
peut logger dans des _getters_ et *setters*, mais on ne peut pas savoir quand on
s'est pris un `delete` ou un
[Object.freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)&nbsp;;
on peut constater le résultat, mais c'est dur de remonter à la source.

Les proxies peuvent aider.

### Laisse mon objet tranquille !

La sémantique des objets tel qu'on les utilise permet à différents scripts
d'agir sur les mêmes objets, mais d'une manière qui ne permet pas forcément
toujours un contrôle fin. Par exemple, si je donne accès à la référence d'un
objet à quelqu'un, il possède cette référence pour toujours et dans la foulée
tous les droits associés (donc modifier l'objet arbitrairement souvent) ; il
n'est pas possible de **révoquer** l'accès dans le temps. Ce script a aussi
accès à toutes les propriétés de l'objet, même si on voudrait n'en partager que
certaines ; il n'est pas facile **d'atténuer** les droits à un objet (sans créer
de nouveaux objets et de se lancer dans des synchronisations coûteuses).

## Les proxies, comment ça marche

Un **proxy** est un nouvel objet (on ne peut pas transformer un objet en un
proxy) qui "emballe" (*wrap*) un objet existant, la **target** et décrit le
comportement du proxy via un objet appelé le **handler** qui définit les _traps_
du proxy.

```js
const target = { a: 1 };

const handler = {
  get(target, prop) {
    console.log("It's a (get) trap!", prop, target[prop]);
    return target[prop] + 1;
  }
};

const proxy = new Proxy(target, handler);
console.log(proxy.a);
```

console output:

```
It's a (get) trap! a 1 // inside the trap
2 // new value modified by the trap
```

### Liste des traps

L'exemple ci-dessus montre la trap `get`. Voici la liste des traps
disponible&nbsp;:

* getPrototypeOf
  * pour `Object.getPrototypeOf`
* setPrototypeOf
  * pour `Object.setPrototypeOf`
* isExtensible
  * pour `Object.isExtensible`
* preventExtensions
  * pour `Object.preventExtensions`
* getOwnPropertyDescriptor
  * pour `Object.getOwnPropertyDescriptor`
* defineProperty
  * pour `Object.defineProperty`
* has
  * pour l'opérateur `in`
* get
  * pour _getter_ une propriété
* set
  * pour _setter_ une propriété
* deleteProperty
  * pour l'opérateur `delete`
* enumerate
  * pour les `for...in` et `Object.keys`
* ownKeys
  * pour `Object.getOwnPropertyNames`
* apply
  * pour quand on appelle le proxy comme une fonction.
* construct
  * pour quand on appelle le proxy comme un constructeur (avec `new`).

Le lecteur attentif aura remarqué que cette liste (et les signatures des
fonctions) correspondent à l'API

[Reflect](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect#Methods)

## Solutions aux problèmes précédents

### Logger les opérations

Vous voulez savoir quand on objet se prend un `delete`&nbsp;? Rien de plus
facile&nbsp;!

```js
const p = new Proxy(
  { b: 2 },
  {
    deleteProperty(target, prop) {
      console.log("Wow, someone just deleted", prop);
      return Reflect.deleteProperty(target, prop);
    },
    freeze(target) {
      console.log("Wow, someone just froze the object");
      return Reflect.freeze(target);
    }
  }
);

delete p.b;
Object.freeze(p);
```

### Implémenter des NodeList live

Ici, on prétend réimplémenter une collection DOM *live*.

```js
function getChildNodesLiveCollection(parent) {
  return new Proxy(
    {},
    {
      get: function(target, prop) {
        if (prop === "length") {
          // l'astuce qui n'est pas de la triche , c'est qu'on va
          // chercher la valeur au moment de l'appel
          return parent.childNodes.length;
        } else return target[prop];
      }
    }
  );
}

var liveChildNodes = getChildNodesLiveCollection(document.body);
console.log(liveChildNodes.length); // 0
document.body.appendChild(document.createElement("div"));
console.log(liveChildNodes.length); // 1, magie magie !
```

### Atténuation

J'ai un objet avec plein de propriété et je veux en partager une version
atténuée à une bibliothèque en laquelle je n'ai qu'une confiance partielle.

```js
// On va se faire MitM avec ce HTTP sans 'S' !
import dubiousLib from 'http://dubious-lib.com/main.js';

const myImportantObject = {
    jfkKillerName: '...',
    elvisGeoloc: {
        long: '...',
        lat: '...'
    },
    name: "David Bruant",
    xmasPresentList: [
        "Raspberry Pi B",
        "Nouveau téléphone (mais pas FirefoxOS, parce qu'ils arrêtent les
téls)",
        "Une boîte de Tic Tac"
    ]
}

function makeWhitelistProxy(t, whitelist){
    return new Proxy(t, {
        get(target, prop){
            if(!whitelist.has(prop))
                throw new Error('Attempt to access forbidden property')

            return Reflect.get(target, prop);
        },
        set(target, prop, value){
            if(!whitelist.has(prop))
                throw new Error('Attempt to access forbidden property')

            return Reflect.set(target, prop, value);
        },
        getOwnPropertyDescriptor(target, prop){
            if(!whitelist.has(prop))
                throw new Error('Attempt to access forbidden property')

            return Reflect.getOwnPropertyDescriptor(target, prop);
        },
        deleteProperty(target, prop){
            if(!whitelist.has(prop))
                throw new Error('Attempt to access forbidden property')

            return Reflect.deleteProperty(target, prop);
        },
        defineProperty(target, prop, desc){
            if(!whitelist.has(prop))
                throw new Error('Attempt to access forbidden property')

            return Reflect.defineProperty(target, prop, desc);
        },
        has(target, prop){
            if(!whitelist.has(prop))
                throw new Error('Attempt to access forbidden property')

            return Reflect.has(target, prop);
        }
    })
}

const attenatedObject = makeWhitelistProxy(
    myImportantObject,
    new Set(["name", "xmasPresentList"])
);

console.log(myImportantObject.name === attenatedObject.name);
console.log(myImportantObject.jfkKillerName); // "..."
console.log(attenatedObject.jfkKillerName);
// error thrown! 'Error: Attempt to access forbidden property'

dubiousLib(attenatedObject);
```

On peut imaginer d'autres formes d'atténuation, comme ne donner accès qu'en
lecture à l'objet alors que l'on garde soi-même un accès en écriture (ce qui est
impossible avec `Object.freeze`).

### Révocation

On peut révoquer l'accès à un objet en implémentant le _pattern_ "caretaker"

```js
function makeCaretaker(t) {
  return {
    revoke() {
      t = undefined;
    },
    proxy: new Proxy(t, {
      get(target, prop) {
        return Reflect.get(target, prop);
      },
      set(target, prop, value) {
        return Reflect.get(target, prop, value);
      }
      // flemme d'écrire et vous faire lire les autres traps,
      // mais faut toutes les faire ;-)
    })
  };
}

const o = {};
const { revoke, proxy } = makeCaretaker(o);

proxy.a = 12;

console.log(o.a, proxy.a); // 12 12

proxy.b = 37;
delete proxy.a;

revoke();

proxy.b; // BOOM! TypeError: target is not a non-null object
```

#### ...via un meta-proxy

La petite astuce rigolote avec les proxy, vu que l'API est dite *stratifiée*,
c'est que vu que le handler est un objet, on pourrait en faire un proxy pour
implémenter la révocation plus simplement.

```js
function makeCaretaker(target) {
  const metaHandler = {
    get(handler, trapName) {
      if (!target) throw new Error("Revoked object!");
      else
        // Le miroir entre les traps et l'API Reflect vient de là ;-)
        return Reflect[trapName];
    }
  };

  const handler = new Proxy({}, metaHandler);

  return {
    revoke() {
      target = undefined;
    },
    proxy: new Proxy(target, handler)
  };
}

const o = {};
const { revoke, proxy } = makeCaretaker(o);

proxy.a = 12;

console.log(o.a, proxy.a); // 12 12

proxy.b = 37;
delete proxy.a;

revoke();

proxy.b; // BOOM! TypeError: target is not a non-null object
```

Il fait mal au crâne au début celui-là, mais après relecture, on se sent bien.

Pour des raisons par très intéressantes, les proxy révocables sont fournis
directement via

[Proxy.revocable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/revocable),
donc, pas besoin de se fatiguer à le coder avec toutes les traps ou avec un meta
handler.

## Conclusion

Les proxies sont un outil bas niveau et puissant. Avec de grands pouvoirs
viennent de grandes responsabilités, alors comprenez bien cet outil avant de
vouloir l'utiliser partout.
