---
date: "2014-05-13"
title: "Array.reduce par l'exemple"
tags:
  - javascript
  - array
authors:
  - lionelB
---

Souvent méconnue, la fonction `Array#reduce` se révèle super pratique dès lors
 qu'on prenne un peu le temps de faire un peu plus connaissance.
 Ce n'est que dernièrement que je me suis rendu compte que reduce pouvait servir
 à bien plus de chose que ce qui était présenté dans les documentations.

Voici donc un petit tour d'horizon des cas d'utilisation de cette fonction.
Mais avant cela, et histoire de faire les présentations, voici l'intro tirée de
la documentation de [MDN](https://developer.mozilla.org/fr/docs/JavaScript/Reference/Objets_globaux/Array/reduce).

> ***Résumé***
> La méthode reduce() applique une
> fonction sur un accumulateur et chaque valeur d'une liste (de la gauche
> vers la droite) de sorte à le réduire à une seule valeur.

## Le classique: Opérer une somme sur un tableau

C'est souvent l'exemple qui illustre le plus les documentations. `Array#reduce`
va permettre de parcourir le tableau, et pour chaque élément, appeler une fonction
avec les paramètres suivants :

- le résultat de la précédente exécution de cette fonction (aussi appelé l'accumulateur).
- l'élément courant.
- l'index de l’élément courant.
- le tableau sur lequel on est entrain d'itérer

```javascript
var sum = [1,2,3,4,5].reduce( function( memo, val){
  return memo + val;
});
```

En fait, `Array#reduce` accepte un deuxième argument après la fonction de callback.
 Cet argument sera utilisé comme accumulateur lors de la première exécution.
 Et c'est justement cela qui est intéressant et qui rend le reduce plutôt pratique.

## Chercher/remplacer avec plusieurs motifs

Imaginons que vous souhaitiez appliquer plusieurs opérations de rechercher/remplacer
sur une chaine de caractère. Si vous avez une liste de motifs et leur valeur correspondante,
 reduce permet de faire cela assez simplement, genre en 3 lignes.
 
```javascript
var input = "I'm %USER% and I live in %COUNTRY%"
var data = [{token:'%USER%', value:'lionel'}, {token:'%COUNTRY%', value: 'France'}]

var output = data.reduce( function(memo, item){
  return memo.replace(item.token, item.value);
}, input);
```
## Réaliser un groupBy

Reduce peut aussi nous permettre d'effectuer des manipulations comme des groupBy
 sur un tableau (bon avec l'aide de petits helpers).

Prenons comme point de départ cette liste de stat représentant un découpage par
site et par famille de navigateurs. Nous aimerions pouvoir grouper les résultats par site :

```javascript
var stats = [
  {"site":"google.fr","browser":"Chrome","value":"50%"},
  {"site":"google.fr","browser":"FireFox","value":"30%"},
  {"site":"google.fr","browser":"Internet Explorer","value":"20%"},
  {"site":"mozilla.fr","browser":"FireFox","value":"60%"},
  {"site":"mozilla.fr","browser":"Internet Explorer","value":"20%"},
  {"site":"microsoft.fr","browser":"Chrome","value":"10%"},
  {"site":"microsoft.fr","browser":"FireFox","value":"20%"},
];

function compareSite(site, item){
  return site === item.site
}
function containSite(site, items) {
  return items.some( compareSite.bind(null, site) )
}
function groupBySite(memo, item){
  var site = memo.filter( containSite.bind(null, item.site) );
  if (site.length > 0) {
    site[0].push(item)
  } else {
    memo.push([item])
  }
  return memo
}
// Nous utilisons un tableau vide comme accumulateur
var results = stats.reduce( groupBySite, [] );
```

Concernant cet exemple, on pouvait arriver au même résultat en déclarant une variable
 qui aurait le rôle d'accumulateur et un Array.forEach :

```javascript
var results = {};

function groupBySite( item){
  var site = results.filter( containSite.bind(null, item.site) );
  if (site.length > 0) {
    site[0].push(item)
  } else {
    results.push([item])
  }
}

stats.forEach( groupBySite );
```

Mais ici, la fonction `groupBySite` devient bien moins ré-utilisable car elle
dépend directement de la variable results, déclarée au dessus.


### À noter

L'utilisation de  `Function.bind` nous permet de réutiliser les fonctions `compareSite`
et `containSite` en fixant leur premier paramètre. Ainsi `compareSite.bind(null, 'mozilla.fr')` équivaut à :

```javascript
function compareMozilla(item){
  return "mozilla.fr" === item.site;
}
```

D'ailleurs, on pourrait assez simplement rendre `groupBySite` générique pour la réutiliser avec un `groupByBrowser`.

## Manipuler la structure des données

`Array#reduce` peut aussi permettre de manipuler la structure de vos données et pouvoir la modifier.
Par exemple, voici une liste de sites avec, pour chaque site, le pourcentage de visite par navigateur.
Imaginons que nous souhaitons changer la structure de l'objet pour grouper ces
résultats par type de navigateur plutôt que par site. Là encore `Array#reduce` s'avère plutôt pratique.

```javascript
var data = {
      "google.fr" : [
       {name: "Chrome", value: "50%"},
        {name: "FireFox", value: "30%"},
        {name: "Internet Explorer", value: "20%" }
      ],
      "mozilla.fr" : [
        {name: "Chrome", value: "20%"},
        {name: "FireFox", value: "60%"},
        {name: "Internet Explorer", value: "20%"}
      ] ,
      "microsoft.fr" : [
        {name: "Chrome", value: "10%"},
        {name: "FireFox", value: "20%"},
        {name: "Internet Explorer", value: "70%"}
      ]
    };

function groupByBrowser( site, memo, browser){
  if (!memo[browser.name]){
    memo[browser.name] = [];
  }
  memo[browser.name].push({site:site, value: browser.value});
  return memo
}

var results = Object.keys(data).reduce( function (memo, site) {
  return data[site].reduce(groupByBrowser.bind(null, site), memo)
}, {});
```

J'espère que vous avez apprécié ces quelques exemples d'utilisation de `Array#reduce`.
Et n'hésitez pas à partager vos cas d'utilisations en éditant l'article ou via les commentaires !
