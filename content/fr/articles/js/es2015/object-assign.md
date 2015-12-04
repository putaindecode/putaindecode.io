---
date: "2015-12-07"
title: "ES6, ES2015 : Object.assign"
tags:
  - javascript
  - ES6
  - ES2015
authors:
  - naholyr
---

Vous connaissez les méthodes ``extend`` d'underscore ou lodash (mais plutôt
lodash quand même) ? Comme la plupart de ces fonctions utilitaires, elles sont
rendues obsolètes par une fonctionnalité d'ES6 (aka ES2015).

# Object.assign

La nouvelle méthode statique ``Object.assign`` prend en paramètres une série
d'objets :

* le premier objet est la "cible" des copies ;
* les suivants sont les sources ;
* toutes les clés propres (*own properties*, soit les clés énumérables et non
  héritées, même celles dont la valeur est ``undefined``) des sources sont
  copiées vers la cible (les suivantes écrasant les précédentes) ;
* **l'objet cible est donc modifié** (il doit être mutable) ;
* puis on retourne l'objet cible.

```js
const o = { y: 0 }
const o1 = { x: 1, y: 2 }
const o2 = { x: undefined, z: 3 }
Object.assign(o, o1, o2) // { x: undefined, y: 2, z: 3 }
o // { x: undefined, y: 2, z: 3 }
o1 // non modifié
o2 // non modifié
```

## Attention à la mutabilité

Prenez garde au fait que la source est systématiquement modifiée. Le *use-case*
général étant plutôt la création d'un nouvel objet résultant de la fusion des
sources, on passera habituellement un nouvel objet en premier paramètre.

```js
const o1 = { x: 1 }
const o2 = { y: 2 }
const o = Object.assign({}, o1, o2)
o // { x: 1, y: 2 }
// o1 et o2 n'ont pas été modifiés
```

## Cas particuliers

### Erreurs lors de la copie

Si une propriété de la cible est en lecture seule, ``Object.assign`` devrait se
comporter comme en mode *strict* (par opposition au mode *WTF*), et lever
l'erreur correspondante avant d'interrompre la copie.

```js
const o = Object.create({}, {
  val: { value: 42, enumerable: true, writable: false }
})

// En mode "standard":
o.val = 0 // pas d'erreur
o.val // 42 (valeur non modifiée)
Object.assign(o, { x: 1, val: 0, y: 2 }) // Uncaught TypeError: Cannot assign…
o // { val: 42, x: 1 }

// En mode "strict":
o.val = 0 // Uncaught TypeError: Cannot assign…
Object.assign(o, { x: 1, val: 0, y: 2 }) // Uncaught TypeError: Cannot assign…
o // { val: 42, x: 1 }
```

Les clés déjà copiées avant la levée d'erreur sont conservées dans la cible,
ainsi dans notre exemple ``x`` a été copiée mais pas ``y``.

Note : ça c'est la théorie, lors de mes tests ce comportement a été le plus
variable, en fonction de la plate-forme et du contexte, l'erreur n'est pas
toujours levée. Le mieux est de travailler en mode *strict* pour s'assurer d'un
comportement prédictible.

### Sources scalaires

Lorsque les sources sont des valeurs scalaires (nombre, booléen, etc.)
``Object.keys`` ne listera généralement aucune clé et ces valeurs seront donc
ignorées. Les valeurs ``null`` et ``undefined`` également.

Cas particulier : les chaînes de caractères sont traitées comme des tableaux.

```js
const o = {}
Object.assign(o, 1, true, null, "toto", ["b", "a"], undefined)
// 1, true, null, undefined sont ignorées
// "toto" est converti en {0: "t", 1: "o", 2: "t", 3: "o"}
// [1, 2] est converti en {0: "b", 1: "a"}
o // {0: "b", 1: "a", 2: "t", 3: "o"}
```

## Conclusion

Plus besoin de ``_.clone``, ``_.extend``, etc. avec cette méthode :)

Pour finir, le topo compatibilité : ``Object.assign`` est plutôt bien supportée
par les navigateurs modernes (donc pas IE) :

* Edge (IE ≥ 12) ;
* Chrome stable (46) ;
* Firefox stable (42) ;
* Node ≥ 4 ;
* et si vous devez supporter IE, il y a bien sûr [Babel](http://babeljs.io/)
  ou les nombreuses implémentations utilisateur.
