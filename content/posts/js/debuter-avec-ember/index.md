---
date: "2014-10-20"
title: Débuter avec Ember
tags:
  - ember
  - javascript
  - frameworks
authors:
  - bmeurant
---

Démarrer une [Single Page Application](http://en.wikipedia.org/wiki/Single-page_application) aujourd'hui ça commence souvent par : "mais quel putain de framework il 
faut que je prenne ?" Et, vu que c'est pas ça qui manque, ça se complique !

Parmi les multiples [technos disponibles](/posts/js/introduction-a-reactjs) il y a [Ember](http://emberjs.com). Pour que le choix 
ne se résume pas à prendre celui qui a le plus joli logo ou qui génère le plus de spam sur votre Twitter, on vous propose de découvrir 
[Ember](http://emberjs.com). Dans les posts à venir on verra comment construire concrètement une application avec ce framework.

## Les fondamentaux

Parce que l'approche "tête la première" c'est bien mais que comprendre un minimum ce qu'on fait c'est encore mieux, il me paraît sage de commencer
par expliquer la philosophie et les principaux éléments du framework, sous peine de se prendre un bon vieux [RTFM](http://en.wikipedia.org/wiki/RTFM) 
sur le coin du pif, comme ça, en passant.

[Ember](http://emberjs.com) se définit comme : "A framework for creating **ambitious** web applications" et ça, ça claque !
Mais je vois bien que ça ne suffit pas à vous convaincre alors je vais détailler un peu. Bon alors, bien que ce soit le mot "ambitious"
qui soit mis en gras, deux autres trucs me paraissent encore plus importants :

* **web** : l'une des caractéristiques majeures d'[Ember](http://emberjs.com) est son attachement au web et aux URL en particulier. **Les URL
  et donc le routeur sont au cœur d'Ember** là ou bien d'autres frameworks les considèrent au mieux comme un addon important. 
  
* **framework** : [Ember](http://emberjs.com) est réellement un framework. Pas une lib, pas une colonne vertébrale, pas une boîte à outils : 
  un framework ! [Ember](http://emberjs.com) propose un véritable modèle de développement que vous allez tout de suite adopter ... ou rejeter
  (au moins ça aura le mérite d'être clair).


### Conventions de nommage

Ce modèle de développement commence par les conventions de nommage. [Ember](http://emberjs.com)
applique en effet le principe de "*conventions over configuration*" et repose sur un nommage cohérent des différents composants 
de votre application. Et finalement, quand on y réflechit bien, la cohérence, ça n'a pas que des mauvais côtés. 

Typiquement pour une URL `test`, [Ember](http://emberjs.com) s'attend à trouver une `TestRoute`, un `TestController`, un gabarit `test`.
Jusqu'ici, tout va bien.

Curieux ? -> [doc officielle](http://emberjs.com/guides/concepts/naming-conventions/).


### Modèles

Un modèle est un objet avec des propriétés contenant des données métier. Le modèle est ensuite passé au gabarit pour être rendu par lui
en HTML. Typiquement, les modèles peuvent être récupérés d'un back end via une API REST JSON via [Ember Data](https://github.com/emberjs/data)
mais pas que.

```js
var Book = DS.Model.extend({
    title               : DS.attr('string'),
    publicationDate     : DS.attr('date'),
    author              : DS.attr('string'),
    publisher           : DS.attr('string'),
    summary             : DS.attr('string')
});
```

Assoifé de connaissances ? -> [doc officielle](http://emberjs.com/guides/models/).


### Routeur

Le routeur permet de faire correspondre à une URL un ensemble de gabarits imbriqués permettant le rendu des modèles associés à 
chacun de ces gabarits.
 
L'exemple suivant permet le rendu des URLs : 

* `/books`
* `/books/:book_id`
* `/books/:book_id/edit`
* `/books/create`
 
```js
App.Router.map(function() {
  this.resource('books', function() {
      this.resource('book', { path: '/:book_id' }, function () {
          this.route('edit');
      });
      this.route('create');
  });
});
```

### Routes

Les routes associent un modèle à un gabarit et sont également impliquées dans les transitions entre les différentes URL (et donc les différents
états) de l'application. Elles gèrent notamment un certain nombre d'opérations sur un modèle lors de ces transitions.

```js
App.BooksRoute = Ember.Route.extend({
    model: function () {
        return this.store.find('book');
    }
});
```

Intrigué ? -> [doc officielle](http://emberjs.com/guides/routing/).


### Contrôleurs

Le contrôleur gère l'état de l'application. Il est situé entre la route dont il récupère le modèle et le gabarit dont il répond aux appels.
Les données du contrôleur sont accessibles au gabarit au même titre que le modèle.

Le contrôleur est par exemple responsable du traitement des actions effectuées par l'utilisateur sur l'interface rendue par le gabarit : 

```html
<button {{action "sort"}}></button>
```

```js
App.BooksController = Ember.ArrayController.extend({
  actions: {
    // appelé lors du clic sur le bouton
    sort: function () {
        ...
    }
  }
});
```

Perdu ? -> [doc officielle](http://emberjs.com/guides/controllers/).


### Vues

Il est très rare d'avoir à définir des vues en [Ember](http://emberjs.com) parce que les gabarits [Handlebars](http://handlebarsjs.com/)
sont surpuissants et que les contrôleurs se chargent de la gestion de l'état de l'application.

Vous en voulez quand même ? -> [doc officielle](http://emberjs.com/guides/views/).

### Gabarits

Un gabarit est un fragment de code HTML permettant, via des expressions, d'afficher les données du modèle associé. Les gabarits d'[Ember](http://emberjs.com)
sont des gabarits [Handlebars](http://handlebarsjs.com/). Les expressions Handlebars sont délimitées par `{{` et `}}`.

L'exemple suivant permet d'afficher le titre d'une app composé d'un prénom et d'un nom pour peu que l'on ait passé au gabarit un
modèle contenant les deux propriétés `firstname` et `lastname`.

```html
<h1>{{firstname}} {{lastname}} Library</h1>
```

[Handlebars](http://handlebarsjs.com/) vient avec de nombreux outils (helpers) permettant de dynamiser nos gabarits : `{{#if isActive}} ... {{/if}}`,
`{{#each users}} ... {{/each}}`, etc.

Dans [Ember](http://emberjs.com), les gabarits peuvent contenir un élément très important : `{{outlet}}`. Cet outlet définit un emplacement
pour un autre gabarit permettant ainsi de multiples imbrications à mesure que les routes de l'application sont activées.

```html
<h1>{{firstname}} {{lastname}} Library</h1>

<div>
  {{outlet}}
</div>
```

Tout élément de modèle injecté dans un gabarit sera **automatiquement mis à jour** (binding) par [Ember](http://emberjs.com) lorsque le modèle
associé au gabarit sera modifié. Évidemment, seul cet élément sera rafraîchit et non le gabarit entier sinon c'est tricher.

Envie de tester ? -> [doc officielle](http://emberjs.com/guides/templates/the-application-template/).


### Composants

Un composant [Ember](http://emberjs.com) permet de définir une balise HTML personnalisée, permettant ainsi de partager de puissants 
éléments réutilisables au sein de votre application.

Vous en avez toujours rêvé ? -> [doc officielle](http://emberjs.com/guides/components/).


### Géneration d'objets

Pour qu'un gabarit soit rendu lorsqu'une URL est demandée, il faut donc que le routeur définisse cette URL, qu'elle soit implémentée par 
une route qui récupèrera un modèle qu'elle mettra à disposition du contrôleur et du gabarit. Le contrôleur écoutera les 
évènements en provenance du gabarit et y apportera la réponse adaptée. À noter que l'évènement peut également remonter jusqu'à la route.
Le gabarit est quant à lui encapsulé dans une vue gérée par Ember tout seul comme un grand.
 
Il n'est cependant **pas nécessaire de créer systématiquement tous ces objets** si aucune logique spécifique n'a besoin d'y être définie.
En effet, [Ember](http://emberjs.com) s'appuie sur les [conventions de nommage](#conventions-de-nommage) pour retrouver successivement,
à partir d'une URL, la route, le contrôleur, la vue et le gabarit associés. Si l'un de ces objet n'est pas trouvé, [Ember](http://emberjs.com)
va en générer un par défaut. 

Donc si l'on crée dans le routeur la route suivante sans créer aucun autre objet : 

```js
App.Router.map(function() {
  this.route("about", { path: "/about" });
});
```

[Ember](http://emberjs.com) va générer les objets suivants :

* **route** : `AboutRoute`
* **contrôleur** : `AboutController`
* **gabarit** : `about`

Dans une application [Ember](http://emberjs.com), **il est donc nécessaire de ne définir que ce dont on a besoin !**. Et c'est bien connu, 
moins il y a de boilerplate, plus il y a de plaisir !

Envie d'en savoir plus ? -> [doc officielle](http://emberjs.com/guides/routing/generated-objects/).

Un bon moyen de se rendre compte de ça consiste à installer le debugger Ember sur votre navigateur préféré (donc pas IE). Vous aurez, entre
autres, la liste de l'ensemble des objets impliqués dans le rendu d'une URL donnée. Cette liste distingue de manière claire les objets
créés par vous et ceux générés par Ember. 

Ce module s'appelle **Ember Inspector** et est disponible pour [Chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi?hl=en) 
et [Firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/). C'est absolument indispensable lorsqu'on développe en Ember.


## Conclusion et next steps

[Ember](http://emberjs.com) est donc un framework très riche et extrêmement plaisant à pratiquer. 
**Un vrai framework avec un vrai parti pris et des vrais choix structurants.**
Il est résolument tourné vers le web et les URL. Ses créateurs sont également ceux de son moteur de gabarit [Handlebars](http://handlebarsjs.com/)
et sont très impliqués dans diverses initiatives autour de la standardisation et de l'évolution du web. Pour n'en citer que deux :
[JSON API](http://jsonapi.org/) et [Web Components](https://gist.github.com/wycats/9144666b0c606d1838be), notamment au travers du moteur
de gabarits [HTMLBars](https://github.com/tildeio/htmlbars). 
Ils embrassent très rapidement les nouveaux standards tels que [ES6 Harmony](https://people.mozilla.org/~jorendorff/es6-draft.html) à l'image des travaux
effectués autour d'[ember-cli](http://www.ember-cli.com/) qui sera abordé dans un prochain article.

Enfin, contrairement aux *a priori*, la courbe d'apprentissage d'[Ember](http://emberjs.com)
est progressive et il est très simple à prendre en main une fois les concepts de base appréhendés - c'est justement le but de cet
article. Au prochain épisode, nous verrons justement - par la pratique cette fois, **comment démarrer et construire progressivement une
application [Ember](http://emberjs.com)**.
