---
date: "2015-12-06"
title: "ES6, ES2015 : Les templates strings"
tags:
  - JavaScript
  - ES6
  - ES2015
authors:
  - jbleuzen
---

ES2015 ajoute le support des template strings qui va permettre enfin de se
simplifier la vie lorsqu'on doit manipuler des chaines de caractères.

## Le principe

Pour définir une chaîne en JavaScript, il faut utiliser soit des single quotes,
soit des double quotes. Malheureusement ces délimiteurs posent quelques
problème lorsque justement la chaine contient un single quote ou une
double quote.

Ainsi les templates strings utilisent le caractère "backtick" ou accent grave
simple pour délimiter les chaînes de caractères.

``` js
// Avant en ES5
var myString = 'Je suis une "chaines de caractères"'

// Maintenant en ES6
const myNewString = `Je suis une "template string"`
```

Jusque là, rien de bien novateur mais voyons un exemple que l'on rencontre
tout le temps : l'interpolation d'expression dans les chaînes de texte.

## Interpolation d'expression

On peut maintenant directement utiliser les variables dans une template string
si on les insert dans un placeholder qui s'écrit `${variable}`.

``` js
// Avant en ES5
var name = "world";
var myStrin = "Hello " + name; // => Hello world

// Maintenant en ES6
const newName = `developer`;
const myStrin = `Hello ${ newName }`; // => Hello developer
```

Il est également possible de faire des traitements dans un placeholder et
d'appeler des fonctions

``` js
const x = 1;
const y = 2;
const result = `${ x } + ${ y } = ${ x + y }` // => 1 + 2 = 3

function square(num) {
  return num * num;
}
const result = `${square(5)}` // => 25
```
Ce qui rend l'utilisation des template strings extrêmement intéressante.

## Les template strings multi-lignes

Une autre avancée des template strings est le support multi-ligne, en effet en
ES5 il n'existe aucune solution esthétique (et pratique) pour générer des
chaines multi-ligne.
Ce problème disparait avec les template strings.

``` js
// Avant en ES5
var multiline = "foo \
                 bar \
                 baz";

var multiline2 = "foo";
multiline2 += "bar";
multiline2 += "baz";

// Aujourd'hui en ES6
const multiline = `foo
                   bar
                   baz`;
```

*Attention* cependant, les espaces sont conservés avec les templates strings,
ce qui peut surprendre si vous devez tester des strings multi-lignes.

``` js
const str1 = `foo
bar`;

const str2 = `foo
             bar`;

str1 === str2 // => false
```

## Les template strings taggués

On entre dans les fonctions moins connues et peu utilisées des template strings.
Les tags sont des fonctions que l'on place juste avant une template string et
qui permettent de modifier le contenu de la dite chaîne de caractères.

Ce tag aura pour paramètres un tableau de "literals" (les chaines de caractères),
et ensuite tous les paramètres correspondront aux valeurs interpolées qui auront
déjà évaluées, mais que l'on pourra quand même modifier.

``` js
function capitalizeVowels(strings, ...values) {

  function replaceVowels(string) {
    return string.replace(/[aeiou]/g, function(c){
      return c.toUpperCase();
    });
  }

  let result = "";
  for(let i = 0; i < strings.length; ++i) {
    const nextValue = values[i] || "";
    result += replaceVowels(strings[i]);
    if(! parseInt(nextValue)) {
      result += replaceVowels(nextValue)
    } else {
      result += nextValue;
    }
  }
  return result;
}


capitalizeVowels`foo bar ?` // => fOO bAr ?
const n = 42
const c = "f"
const v = "o"
capitalizeVowels`foo ${ n } bar ${ c }${ v }${ v } ?` // => fOO 42 bAr fOO ?
```

Voici un exemple intéressant d'utilisation des template strings taggués qui
présente un système [de localization de chaînes de caractères](http://jaysoo.ca/2014/03/20/i18n-with-es6-template-strings/).

## String.raw

Et pour finir, une nouvelle fonction a été ajouté au prototype de `String` qui
permet d'afficher le contenu d'un template string brut. C'est à dire que la
fonction permettra de voir les caractères d'échappements qui sont
automatiquement gérés avec une template string.

``` js
String.raw`FOO\nbar` // => FOO\\nbar
```

## Conclusion

Les template strings sont bien utiles au quotidien, l'ajout de l'interpolation
simplifie grandement la vie et permettent d'oublier les erreurs d'échappements.

Aujourd'hui, [la grande majorité des navigateurs les supportent](https://kangax.github.io/compat-table/es6/#test-template_strings)
ainsi que babel et traceur, donc usez et abusez des template strings…
