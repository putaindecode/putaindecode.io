---
date: "2015-12-13"
title: "ES6, ES2015 : les nouvelles méthodes d'Array"
tags:
  - javascript
  - ES6
  - ES2015
authors:
  - lionelB
---

~~ES6~~ ES2015 enrichit les objets de la bibiliothèque standard de nouvelles
fonctionnalités. Voici les nouveautés que l'on va trouver dans `Array`.

## Array.from()

Parmi les nouvelles méthodes ajoutées à Array, `Array.from()` est peut-être
celle que vous allez utiliser le plus souvent. Elle va nous permettre de créer
un tableau à partir d'un itérable ou d'un objet qui ressemble à un tableau comme
une NodeList, ou encore `arguments`.

```javascript
const nodes = Array.from(document.querySelectorAll("div"));
nodes.forEach(node => console.log(node));
```

## Array.of()

Cette méthode va permettre de créer un tableau à partir des arguments reçus.

```javascript
const arr = Array.of("hello", "world");
console.log(arr.join(" ")); // "hello world"
```

## Array.prototype.keys() & Array.prototype.entries()

On retrouve aussi ces méthodes sur d'autres itérables comme Map ou Set.
`Array.prototype.keys()` va renvoyer un nouveau tableau dont les valeurs seront
les clefs du tableau passées en paramètre :

```javascript
const arr = [...Array(3).keys()];
console.log(arr); // [0,1,2]
```

`Array.prototype.entries()` quant à lui va renvoyer un tableau composé des
paires clé/valeur :

```javascript
const arr = ["hello", "world"];
console.log(arr.entries()); // [[0, "hello"], [1, "world"]]
```

## Array.prototype.find()

Cette méthode va permettre de renvoyer une valeur contenue dans le tableau si
celle-ci vérifie la condition définie par la fonction de prédicat passée en
paramètre. On retrouve le même principe qu'avec `filter`, `some` et `every`. Si
aucune valeur ne valide la fonction de prédicat, alors la méthode renverra
`undefined`.

```javascript
const arr = [{ id: 1, label: "hello" }, { id: 2, name: "world" }];
const found = arr.find(item => item.id === 2);
const notfound = arr.find(item => item.id === 3);
console.log(found, notfound); // {id:2, name: "worl"}, undefined
```

À noter qu'il existe aussi `Array.prototype.findIndex()` qui renverra non pas
l'objet, mais l'index de l'objet qui validera la fonction de prédicat.

## Array.prototype.fill()

Cette méthode va permettre de remplir un tableau avec une valeur passée en
paramètre. Il est toutefois possible de définir un index de début et un index de
fin (comme avec slice par exemple) si l'on ne souhaite remplacer qu'une partie
du tableau.

```javascript
const arr = Array(3).fill(1);
console.log(arr); // [1,1,1]
```

## Array.prototype.copyWithin()

Cette méthode va permettre de renvoyer un nouveau tableau en remplaçant une
partie du tableau par une séquence de ce dernier. Pour cela, on va indiquer à
partir de quel index on souhaite démarrer la copie de la séquence, ainsi que
l'index de début et de fin de la séquence que l'on souhaite voir répétée.

```javascript
const arr = ["hello","alice", "my", "name", "is", "bob"]
console.log(arr.copyWithin(1, 5)]) //  "hello","bob", "my", "name", "is", "bob"]
```

Certaines méthodes ne paraissent pas forcément super utiles alors n'hésitez à
utiliser les commentaires pour partager des exemples d'utilisation plus
intéressants 😛
