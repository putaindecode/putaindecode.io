---
date: "2016-01-23"  
title: "Se lancer dans le TDD : Cas d'utilisations et cas pratique"  
tags:
  - tdd
  - bdd
  - ci  
authors:
  - Freezystem
---

[Les bases étant posées](/fr/articles/tdd/se-lancer-dans-le-tdd-definitions-et-variantes/), 
tout un tas de questions doivent commencer à émerger de votre esprit critique.
Essayons de répondre aux plus fréquentes d'entre elles.

## Pourquoi teste-on ?

Le test est un outil polyvalent, il ne faut pas le percevoir comme une contrainte 
mais comme une aide au développement. Il apporte ainsi de nombreux points de soutien.

### Une ligne directrice

La première chose à faire lors de la mise en place de tests, c’est de définir avec 
précision comment sera organisé l’environnement, les variables ainsi que les fonctions 
et leur retours. Celà permet de définir l’ensemble des moyens à utiliser 
afin d’aboutir à un résultat précis.

### Un cahier des charges

Les tests sont les garants de la confirmité du code face aux exigences exprimées 
de la manière la plus concise possible. 

### Un modèle formateur

L’écriture des tests force le développeur à produire un code testable, et un code 
testable c’est un code lisible qui sépare correctement les actions clés.

### Une pseudo-documentation

Les tests sont sans conteste une documentation malgré eux. Ils ont l’avantage 
d’être toujours à jour et de définir avec précision les attentes en terme de 
comportement de l’objet testé.

### Une prévention active de la régression.

Les tests permettent de prévenir tout problème lié à une éventuelle régression 
dans le comportement d’un objet. Ils attestent que l’objet modifié ne perds pas 
des fonctionnalités précédemment validées comme fonctionnelles.

### Une assurance (santé ?)

Ceux qui ont déjà écrit des tests vous le diront, on ne peut pas tout tester. 
Mais savoir que les cas les plus évidents sont assurés est un pas de plus 
vers la paix de l’esprit. Et mieux dormir la nuit, ça n’a pas de prix.

## Pour qui ?

Pour tous ceux qui en ressentent l’utilité, pour ceux qui aime le travail 
rigoureux et sont soucieux de la transmission des connaissances. On vous 
reprochera rarement votre volonté de vouloir écrire un code robuste. 

Dans vos projets perso comme dans votre vie professionnelle cette expérience 
vous enrichira intellectuellement en vous poussant à comprendre les choses 
en profondeur et à vous poser les bonnes questions. 

> Les tests permettent de prendre du recul par rapport à son code et de 
> confronter le travail effectué aux attentes réelles des spécifications. 

## Quand tester ?

Le plus souvent possible et de préférence dès que le projet est bootstrappé et 
que les premiers composants font leur apparition. En effet les tests requièrent une 
organisation spécifique de son code afin que les fonctions et objects puissent être mockées. 
Il faut bien avoir ça en tête dès le départ car transformer un code à posteriori 
pour le rendre testable est une tâche complexe. 

Pour commencer, vous pouvez vous fixer des objectifs : écrire un code par jour. 
C’est un bon début. Puis, avec le temps et l’expérience, leur écriture deviendra naturelle.

## Quoi tester ?

Contrairement aux idées reçues, il n’est pas nécessaire de tester tous les aspects 
d’une application de manière exhaustive. 

> On test les fonctionnalités et comportements clés/critiques.

Prenons l’exemple d’une application front : on peut utiliser des _tests fonctionnels_ 
pour vérifier le comportement des composants de l’interface. Imaginons ensuite que 
l’on reçoive des données dynamiques brutes d’une API. On mettra alors en place 
des _tests unitaires_ sur les fonctions permettant de s’assurer que les retours 
de l’API sont correctement traités.

> Attention : en aucun cas il ne faut s’occuper de la vérification des données 
> renvoyées par l’API. C’est à l’API de tester ce qu’elle retourne.

## Et en vrai, ça ressemble à quoi ?

Trève de bavardages, entrons dans le concret. Rien de tel qu'un petit exercice
pratique pour mieux comprendre la logique et l'intérêt du TDD.

Pour toute les démonstrations ci-dessous j’utiliserai JavaScript et la méthode 
[`.assert()`](https://developer.mozilla.org/fr/docs/Web/API/Console/assert) 
de la console navigateur. Vous pouvez ainsi reproduire ces tests vous même. 
Un petit conseil pour la route :

> Ne faites confiance à aucun code que vous n’avez pas testé vous-même avant.

Tentons de créer une fonction qui compare deux nombres et retourne le plus grand.

```js
function higher () {};
console.assert(higher(3,4) === 4, '4 est plus grand que 3');
```
> `Assertion failed: 4 est plus grand que 3`

Ok, le test est maintenant établi, et il échoue comme prévu. 
Maintenant il faut penser à la manière la plus simple de passer ce test. 

```js
function higher () { return 4; };
console.assert(higher(3,4) === 4, '4 est plus grand que 3');
```
> `undefined // rien n’est renvoyé, le test est passé`

Bien, l’affirmation est vérifiée. Bon, ça ne trompe personne, il est clair qu’on a triché. 
Mais souvenez-vous, le but est de faire passer l’assertion de la manière la plus simple possible.

A l’évidence, on ne teste ici qu’un seul cas. En effet, rien ne garanti le fonctionnement 
avec d’autres nombres. On pourrai, par exemple, essayer d’inverser les paramètres, 
de changer les nombres, ou encore de mettre des valeurs négatives.

On passe donc à l’étape suivante, ajouter un nouveau test reflétant de manière plus 
précise le fonctionnement attendu.

```js
function higher () { return 4; };
console.assert(higher(3,4) === 4, '4 est plus grand que 3');
console.assert(higher(-2,10.7) === 10.7, '10.7 est plus grand que -2');
```
> `Assertion failed: 10.7 est plus grand que -2`

Oups ! Nous voila démasqué, le test à mis en évidence la supercherie. 
Nous allons donc passer à l’étape d’amélioration du code. 

Il s’agit ici de rendre la fonction `higher` dynamique en fonction des ses paramètres.

```js
function higher ( a, b ) { return a > b ? a : b; };
console.assert(higher(3,4) === 4, '4 est plus grand que 3');
console.assert(higher(-2,10.7) === 10.7, '10.7 est plus grand que -2');
```
> `undefined // rien n’est renvoyé, le test est passé sans régression`

On pourrait ensuite améliorer cette suite de tests en envoyant des valeurs erronnées 
et définir comment gérer les cas d’erreurs. On peut aussi prévoir des améliorations 
comme d’augmenter le nombre de paramètres.

Dans cet exemple j’exagère la naïveté des assertions et du code. Il est évident que 
dans la pratique, les fonctions testées, l'algorithme et les assertions seront 
bien plus complexes. 

Cette démonstration a pour but d’éveiller votre esprit au processus incrémental 
induit par les tests. 

> C’est génial tout ça, mais les gens autour de moi restent sceptiques. Que faire ?

Voici, spécialement pour vous, quelques idées de réponses : 
[10 arguments pour promouvoir le TDD](/fr/articles/tdd/10-arguments-pour-promouvoir-le-tdd/)
