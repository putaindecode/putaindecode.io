---
date: "2017-11-13"
title: Top 10 des snippets pour démolir le runtime JavaScript
tags:
  - javascript
  - snippets
  - demolir
authors:
  - bloodyowl
header:
  color: "#3A0000"
  image: index.jpg
---

(ou juste faire une blague à vos collègues)

## 10. L'array vide magique

Cette technique fonctionne grace à l'héritage prototypal et au fait que pour une obscure raison, `Array.prototype` est un array (qui hérite de lui même, allez savoir). Il suffit d'appeler une des méthodes mutatives d'`Array.prototype` sur lui-même :

```javascript
Array.protoype.push(1, 2, 3);
```

Puisque dans le corps de `Array.prototype.push()`, `this` correspond à `Array.prototype`, c'est dans celui-ci que seront injectés les éléments.

```javascript
[][0] // 1
```

Et hop. À noter que vu l'implémentation de la plupart des fonctions travaillant avec des *arrays*, ça devrait pas causer grand dommage puisque `length` est géré au niveau de l'array, et pas de son prototype. Ceci-dit ça peut en surprendre en faisant mumuse dans la console.

## 9. L'objet magique

Souvent, dans une boucle `for(name in object)`, on appelle `object.hasOwnProperty(name)` pour vérifier si la propriété appartient bien à l'objet et qu'il ne s'agit pas juste d'un truc hérité.

```javascript
Object.prototype.hasOwnProperty = () => true;
// peut se combiner avec un petit
for(let index = 0; index < 10; index++) {
  Object.prototype[index] = undefined;
};
```

Même concept que pour l'exemple précédent, avec l'héritage prototypal. Le petit côté rigolo ici, c'est que c'est un pattern très courant en JavaScript, notamment dans les bibliothèques que vous utilisez probablement. Et c'est là qu'on se rend compte que de faire hériter la fonction qui vérifie si une propriété est héritée ou non, c'est pas forcément l'idée du siècle.

```javascript
let object = {};
for(let key in object) {
  if(object.hasOwnProperty(object)) {
    console.log(key)
  }
}
// 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
```

## 8. Le DOM fou

Celui là est plutôt sympa quand vous ou vos bibliothèques DOM de prédilection touchez un peu aux élements. Vu que l'appel à `Math.random()` rend l'opération aussi déterministe que l'application de styles assignés à des sélecteurs CSS chargés de manière asynchrone, vous risquez de jolies surprises.

```javascript
Element.prototype.appendChild = function(element) {
  return Element.prototype.insertBefore.call(
    this,
    element,
    this.childNodes[Math.floor(Math.random() * this.childNodes.length)]
  )
};
```

```javascript
for(let index = 0; index < 10; index++) {
  document.body.appendChild(document.createTextNode(String(index)))
};
// "1895234760" (par exemple)
```

## 7. Simple mais efficace, faire de la console une no-op

Bizarrement, j'ai déjà vu des sites qui faisaient ça en production (e.g. Twitter si je me rappelle correctement). Vous rendez inopérable la console, ce qui, peut faire une très bonne blague à vos collègues en cachant ça dans un vieux commit avec l'option `amend`.

```javascript
Object.keys(console).forEach(key => {
  console[key] = () => {}
});
```

## 6. Supprimer les stack traces des erreurs

Là, on est vraiment sur le petit truc horrible, parce que vous pouvez mettre un petit moment avant de le réaliser. Le constructeur `Error` vient normalement ajouter une propriété `stack` qui vous permet de retrouver le chemin qu'a emprunté le code avant de jeter une erreur. Eh ben fini, à vous le debug à l'aveugle !

```javascript
(() => {
  function Error(message) {
    this.message = message;
  }
  Error.prototype = window.Error.prototype;
  window.Error = Error;
})();
```

## 5. Rendre l'asynchrone synchrone

Il est assez courrant d'avoir des `setTimeout(func)` ou `setTimeout(func, 0)` (les deux sont équivalents). Ça permet s'assurer qu'on décale un peu l'execution d'une fonction, et souvent de s'assurer que si elle jette une erreur, elle n'empêchera pas le reste de s'executer.

```javascript
(() => {
  let originalTimeout = window.setTimeout;
  window.setTimeout = (func, duration, ...args) => !duration ? func(...args) : originalTimeout.call(window, func, duration, ...args);
})()
```

Avec ce snippet, petites surprises bizarres assurées. Et c'est un bug présent dans quelques bibliothèques implémentant une fonction `domReady`, et qui font:

```javascript
function domReady(func) {
  if (document.readyState === "complete") {
    func()
  } else {
    document.addEventListener("DOMContentLoaded", func)
  }
}
```

Avec une implémentation comme celle qu'on voit au dessus, `func` aura un comportement différent si le DOM est chargé ou non:

```javascript
domReady(() => {
  throw new Error()
})
console.log(1)
// Logue 1 si le DOM est prêt, parce que l'execution de func par le handler DOMContentLoaded est asynchrone
// Logue rien du tout si func() est appelé en synchrone par la première branche de domReady
```

## 4. Le réseau qui ne répond jamais

Les `Promise`, c'est bien relou à débugger lorsque ça reste infiniment en "pending": on ne sait pas forcément pourquoi, surtout si c'est derrière une API opaque, comme `fetch`. Plaisir garanti, parce qu'avec ça sur la page, c'est probablement le dernier endroit où on va intuitivement chercher la source la bug.

```javascript
window.fetch = () => new Promise(() => {})
```

## 3. Faire marcher les event listener au hasard

C'est particulièrement horrible quand un bug n'est pas reproduit à tous les coups: pourquoi ne pas attacher les évenements au hasard ?

```javascript
(() => {
  let originalAddEventListener = Element.prototype.addEventListener
  Element.prototype.addEventListener = function(...args) {
    if(Math.random() < 0.75) {
      originalAddEventListener.call(this, ...args)
    }
  };
})();
```

```javascript
document.body.addEventListener("click", () => console.log(1));
document.body.addEventListener("click", () => console.log(2));
document.body.addEventListener("click", () => console.log(3));
document.body.addEventListener("click", () => console.log(4));
document.body.addEventListener("click", () => console.log(5));
```

## 2. Faire foirer parseInt de temps en temps

```javascript
(() => {
  let originalParseInt = window.parseInt;
  window.parseInt = (n) => Math.random() > 0.9 ? originalParseInt(n) : NaN;
})()
```

Pour un bon petit moment à pas comprendre ce qui se passe. Je suis sûr que `NaN` n'est pas toujours géré dans tous les cas dans la plupart des scripts qui tournent aujourd'hui en prod.

```javascript
parseInt("1") // 1
parseInt("1") // NaN
```

## 1. (De)serialiser les URL

Pour ce coup, c'est bien de prévoir les deux fonctions utilisées par tout le monde pour encoder et décoder les URLs. Vu que si l'une ne marche pas, le reflexe est souvent de tester la deuxième, bon arrachage de cheveux en perspective.

```javascript
window.decodeURIComponent = window.encodeURIComponent = window.escape = window.unescape = (a) => String(a)
```

## Bonus: pour rendre tout ça crédible

Si dans la console de développement, vous tapez le nom d'une fonction accessible dans le scope, le navigateur va appeler `Function.prototype.toString` sur cette fonction pour en récupérer l'allure. Couvrez vos arrières en replaçant la méthode :

```javascript
Function.prototype.toString = function() {
  return `function ${ this.name || "" }() {
    [native code]
}`
}
```

```javascript
(() => {})
/* function () {
    [native code]
} */
```

Pour faire un peu de zèle, vous pouvez également déclarer ces fonctions dans un `eval` pour brouiller les pistes sur l'endroit où elles ont été déclarées.

Voilà, vous avez toutes les clés pour faire des petites blagues à vos collègues.

Et n'oubliez pas, JavaScript c'est super, mais faisez gaffe quand même, parce que dans un langage encourageant la mutabilité, qui utilise des globales et de l'héritage par dessus le marché, il suffit d'un petit bout de code innocent pour que plus rien ne marche.

Bisous.
