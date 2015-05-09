---
date: "2014-10-27"
title: Première application Ember
tags:
  - ember
  - javascript
  - frameworks
authors:
  - bmeurant
---

Après l'[article précédent](/posts/js/debuter-avec-ember) qui a détaillé les principaux concepts d'[Ember][ember], il est grand temps de
se dégourdir les doigts. Comme on a peur de rien, on va même construire progressivement ensemble une application
avec [Ember][ember].

Bon, faut pas non plus trop vous emballer, c'est juste une application bateau de gestion d'une collection de BD. 
Ça pourrait être des clients, des légumes ou des timbres mais là, c'est des BD.

## Structure d'une application Ember

L'[article précédent](/posts/js/debuter-avec-ember) a insisté sur le fait qu'[Ember][ember] était un framework avec des partis pris forts et un modèle de développement structurant. 

_Note : sur ce sujet, vu que [ça fait réagir](/posts/js/debuter-avec-ember/#comment-1644383934), je précise. Je ne dis pas que c'est bien ou que ce n'est pas bien.
Je dis juste que c'est une caractéristique importante d'[Ember][ember]. Autant le savoir._

Eh bien, aussi étonnant que cela puisse paraître, [Ember][ember] **nous laisse quand même nous débrouiller tout seul comme des grands pour organiser nos applications**.

Il existe donc différentes manières de structurer une application [Ember][ember], de la plus basique à la plus complète et, sur ce point, chacun pourra trouver ce qui conviendra le mieux à ses goûts, ses envies, ses contraintes, son contexte... Que sais-je ? Ci-dessous, quelques exemples parmi d'autres.


### À la mano

De base, avec [Ember][ember] on peut donc déclarer nos routes, contrôleurs, modèles, etc. dans un seul fichier JavaScript ou dans une balise `<script>`. On doit par contre impérativement respecter les [conventions de nommage](http://emberjs.com/guides/concepts/naming-conventions/) et enregistrer nos objets dans une variable globale : 

```js
App = Ember.Application.create();

App.Router.map(function() {
  ...
});

App.BookRoute = Ember.Route.extend({
  ...
});
```

De la même manière, on peut déclarer nos gabarits [Handlebars](http://handlebarsjs.com/) via des balises `<script>` :

```html
<script type="text/x-handlebars">
  <div>
    {{outlet}}
  </div>
</script>
```

### Outillé

Comme on peut trouver ça un peu limité dans la vraie vie, on peut essayer d'organiser nous-même notre application, nos fichiers, gérer des modules, etc. Tout ça va passer par l'utilisation d'un outil de build javascript de type [Grunt](http://gruntjs.com/), [Gulp](http://gulpjs.com/), [Broccoli][broccoli]. Ces outils vont nous permettre
de concaténer nos différents fichiers JavaScript en un seul, de sortir les gabarits dans des fichiers `.hbs` et de les précompiler. On n'aura ensuite qu'à importer ces fichiers dans notre index.html :

```html
...
<script src="dist/libs/handlebars.min.js"></script>
<script src="dist/libs/ember.js"></script>
<script src="dist/application.js"></script>
<script src="dist/templates.js"></script>
...
```

Ça peut convenir parfaitement et on peut se mitonner des phases de build aux petits oignons pour nos besoins spécifiques. Mais on peut aussi rester un peu sur sa faim. Surtout si on a choisi [Ember][ember] pour son côté structurant.

Du coup, une partie des membres de l'équipe [Ember][ember] a mis au point [Ember CLI][ember-cli].

### Ember CLI

[Ember CLI][ember-cli] est une **interface en ligne de commande** pour [Ember][ember]. Elle repose
sur l'outil de build [Broccoli][broccoli] et permet : 

* d'initialiser une application Ember avec, cette fois, une [structure de fichiers][folder-layout] et des
  [conventions de nommage](http://www.ember-cli.com/#naming-conventions)
* de générer différents objets en mode scaffolding via des [commandes](http://www.ember-cli.com/#using-ember-cli). Autant le dire tout de suite, je ne suis pas fan du scaffolding mais on va regarder quand même pour ne pas mourir idiots.
* d'utiliser des outils de build basés sur [Broccoli][broccoli] pour le prétraitement des pré-processeurs CSS par exemple
* d'utiliser les [modules ES6](https://people.mozilla.org/~jorendorff/es6-draft.html) plutôt 
  qu'[AMD](http://en.wikipedia.org/wiki/Asynchronous_module_definition) ou 
  [CommonJS](http://en.wikipedia.org/wiki/CommonJS) pour la modularisation. Cette question a été
  largement débattue. Si ça vous intéresse, je vous laisse découvrir un 
  [article très intéressant](http://tomdale.net/2012/01/amd-is-not-the-answer/) à ce sujet.
* ...

Je ne vais pas vous détailler davantage le truc, vous trouverez vous-même la [doc officielle][ember-cli]. Et puis, on va tout de suite le mettre en pratique.

_Note : là encore, [Ember CLI][ember-cli], c'est un parti pris. Ce sera probablement très bien accueilli par certains pour qui cela offre un cadre de travail structuré et structurant. Mais ce sera aussi rejeté par d'autres qui le verront comme une grosse machine inutile.
Ici encore, question de goût, question de contexte, question de besoins._

Trèves de bavardages, on s'y met sérieusement :

On installe [Node][node], [Ember CLI][ember-cli], [Bower](http://bower.io/) :

```console
$ npm install -g ember-cli
$ npm install -g bower
```

Ça y est, on peut maintenant demander gentiment à [Ember CLI][ember-cli] de nous créer notre application grâce à la 
commande `ember` et voir ensuite une magnifique page de bienvenue sur http://localhost:4200/ :

```console
$ ember new ember-articles
$ cd ember-articles
$ ember server
```

Je ne vous fais pas l'affront de détailler ici la structure de l'application, tout est décrit dans la 
[documentation][folder-layout].

### Styles & Fonts

Pour que cela ne soit pas trop moche dans le cadre de cet exemple ou va ajouter un peu de CSS et des fonts mais comme c'est pas l'objet de l'article,
on ne va pas passer de temps là-dessus. Ceci dit, comme il y a  quand même un peu de conf [Ember CLI][ember-cli] qui peut vous intéresser, vous avez les styles 
et la conf sur [GitHub](https://github.com/bmeurant/ember-articles/tree/premiere-app-ember) et l'explication dans ce [gist](https://gist.github.com/bmeurant/1bba49d8a12bf69a4cf0).

## Et maintenant, on code !

_Note: le code de l'exemple est dispo sur [github](https://github.com/bmeurant/ember-articles/tree/premiere-app-ember)._

* Modification du gabarit général de l'application `/app/templates/application.hbs` : 

```html
<div class="app">
    <a class="sources" href="https://github.com/bmeurant/ember-articles">View source on GitHub</a>
    <h1>Comic books library</h1>
    <div class="main">
      {{outlet}}
    </div>
</div>
```

_Note : on en profite pour remarquer le rechargement à chaud via `ember server` lorsqu'on modifie un fichier._

* Création de la première route `/series` via `ember` :

```console
$ ember generate route series
```

[Ember CLI][ember-cli] met à jour le routeur : 

```js
// routeur app/router.js
Router.map(function() {
  this.route('series');
});
```

Il génère aussi pour nous une route `app/routes/series.js` et un gabarit `app/templates/series.hbs`, vides.

Modifions tout de suite le gabarit `app/templates/series.hbs`, histoire de mieux visualiser les choses : 

```html
<h2>Comics Series</h2>
```

L'URL `/series` est désormais accessible sur http://localhost:4200/series et on peut constater l'imbrication du gabarit `series.hbs` dans le gabarit
général `application.hbs` grâce à son `{{outlet}}`.

### `{{outlet}}` et routes imbriquées

Ces notions sont au cœur d'[Ember][ember]. Leur fonctionnement est assez simple. Lorsqu'une route est imbriquée dans une autre,
[Ember][ember] va rechercher les gabarits de ces deux routes et remplacer la zone `{{outlet}}` de la *route mère*
avec le rendu de la *route fille*. Ainsi de suite jusqu'à résolution complète de la route. Lors des transitions entre routes, les
zones des `{{outlet}}` concernées par le changement sont mises à jour.

Toutes les routes de l'application sont imbriquées dans la route `ApplicationRoute` générée par [Ember][ember] et dont le gabarit est `application.hbs`. 
C'est ce qui explique que, dans le cas présent, le gabarit `series.hbs` ait été *injecté* dans `application.hbs` pour construire l'application 
entière.

### Routes et contrôleurs implicites

Pour rappel, [Ember][ember] définit et utilise différents types d'objets ayant chacun une responsabilité propre (voir [article précédent](/posts/js/debuter-avec-ember)) et, pour ne pas
nous obliger à fournir nous-même une implémentation par défaut de ces objets, les génère pour nous (voir [article précédent - *Génération d'objets*](/posts/js/debuter-avec-ember/#generation-d-objets)).

Si nous n'avons eu ici qu'à fournir le gabarit `application.hbs`, c'est qu'[Ember][ember] a généré pour nous la route implicite `ApplicationRoute` activée au démarrage
de l'application et le contrôleur `ApplicationController`.

Mais [Ember][ember] a également généré pour nous la route `IndexRoute` et le contrôleur `IndexController` en réponse à l'URL `/`. Pour être tout à
fait complet, [Ember][ember] a aussi généré les éléments suivants `LoadingRoute`, `LoadingController`, `ErrorRoute` et `ErrorController` dont les
caractéristiques peuvent être trouvées dans la [documentation](http://emberjs.com/guides/routing/loading-and-error-substates/).

Ces éléments implicites sont générés pour chaque route qui n'est pas une route de dernier niveau et peuvent être surchargés.


* L'URL `/` ne nous intéresse pas. Surchargeons la route `IndexRoute` pour rediriger vers `/series` :

```js
// /app/routes/index.js
import Ember from 'ember';

export default Ember.Route.extend({
    redirect: function(){
        this.transitionTo('series');
    }
});
```

-> Par-là la [doc sur les redirections](http://emberjs.com/guides/routing/redirection/).

Maintenant, on veut afficher la liste des séries en allant sur `/series`. Encore faut-il avoir des séries... Pour ça, on va utiliser
la librairie [Ember Data][ember-data] pour la gestion de nos modèles. Ce n'est pas obligatoire
et beaucoup font sans, mais nous on va l'utiliser quand même. 


### Ember Data

Cette librairie qui est développée en parallèle d'[Ember][ember] permet de gérer les modèles de données et les relations entre eux 
à la manière d'un [ORM](http://fr.wikipedia.org/wiki/Mapping_objet-relationnel) (à la [ActiveRecord](http://en.wikipedia.org/wiki/Active_record_pattern)). 
Elle permet notamment de récupérer les données depuis une interface REST HTTP 
(et est parfaitement adaptée à [JSON API](http://jsonapi.org/)) mais pas que.

[Ember Data][ember-data] s'appuie sur un `store` (cf. [doc](http://emberjs.com/api/data/classes/DS.Store.html)) manipulé par l'application
et qui contient des méthodes telles que `find`, `createRecord`, `update`, etc. qui permettent d'effectuer des actions sur les différents modèles
du store. Au travers d'`Adapters`, le `store` transmet à la couche de persistence (REST ou autre).

Le `RESTAdapter` (cf. [doc](http://emberjs.com/api/data/classes/DS.Store.html)) et son jumeau maléfique le `RESTSerializer` 
(cf. [doc](http://emberjs.com/api/data/classes/DS.RESTSerializer.html)) peuvent être étendus facilement de manière à s'adapter à une 
interface REST spécifique.

Pour un [POC](http://en.wikipedia.org/wiki/Proof_of_concept), on peut utiliser le `FixtureAdapter` 
(cf. [doc](http://emberjs.com/api/data/classes/DS.FixtureAdapter.html)) qui permet
de charger simplement les objets depuis la mémoire. C'est ce que l'on utilise ici.

```js
// /app/adapters/application.js
import DS from 'ember-data';

export default DS.FixtureAdapter.extend({});
```

* On va donc créer un modèle correspondant. Seulement, voilà, comme j'ai eu la bonne idée de prendre un des rares mots en anglais
  où le pluriel et le singulier sont identiques (*serie* n'existe pas), on va devoir créer un modèle *seriesItem* :
  
```js
// /app/models/series-item.js
import DS from 'ember-data';

var SeriesItem = DS.Model.extend({
    title               : DS.attr('string', {defaultValue: 'New Series'}),
    scriptwriter        : DS.attr('string'),
    illustrator         : DS.attr('string'),
    publisher           : DS.attr('string'),
    coverName           : DS.attr('string', {defaultValue: 'default.jpg'}),
    summary             : DS.attr('string'),
    coverUrl: function() {
        return '/assets/images/series/covers/' + this.get('coverName');
    }.property('coverName')
});

SeriesItem.reopenClass({
    FIXTURES: [{
    id: 1,
    title: 'BlackSad',
    scriptwriter: 'Juan Diaz Canales',
    illustrator: 'Juanjo Guarnido',
    publisher: 'Dargaud',
    coverName: 'blacksad.jpg',
    summary: 'Private investigator John Blacksad is up to his feline ears in mystery, digging into the backstories behind murders, child abductions, and nuclear secrets. Guarnido\'s sumptuously painted pages and rich cinematic style bring the world of 1950s America to vibrant life, with Canales weaving in fascinating tales of conspiracy, racial tension, and the "red scare" Communist witch hunts of the time. Guarnido reinvents anthropomorphism in these pages, and industry colleagues no less than Will Eisner, Jim Steranko, and Tim Sale are fans! Whether John Blacksad is falling for dangerous women or getting beaten to within an inch of his life, his stories are, simply put, unforgettable'
}, {
    id: 2,
    title: 'The Killer',
    scriptwriter: 'Luc Jacamon',
    illustrator: 'Matz',
    publisher: 'Casterman',
    coverName: 'the-killer.jpg',
    summary: 'A man solitary and cold, methodical and unencumbered by scruples or regrets, the killer waits in the shadows, watching for his next target. And yet the longer he waits, the more he thinks he\'s losing his mind, if not his cool. A brutal, bloody and stylish noir story of a professional assassin lost in a world without a moral compass, this is a case study of a man alone, armed to the teeth and slowly losing his mind.'
}, ...
]});

export default SeriesItem;
```

Au passage, on remarque les valeurs par défaut ainsi que la [propriété calculée][computed-prop] `coverUrl`. On aura l'occasion d'en reparler.
 

* On modifie donc notre application pour afficher, lors de l'activation de `SeriesRoute`, la liste des séries :

```js
// /app/routes/series.js
import Ember from 'ember';

export default Ember.Route.extend({
    model: function() {
        return this.store.find('seriesItem');
    }
});
```

```html
<!-- /app/templates/series.hbs -->
<div class="series">
    <h2>Comic Series</h2>

    <ul class="series-list">
      {{#each}}
          <li class="series-item">
              {{title}}
          </li>
      {{/each}}
    </ul>

    <span>Number of series: {{length}}</span>
</div>

{{outlet}}
```

On remarque le `{{#each}}` sans arguments qui par convention retrouve l'objet `model` du contrôleur. `{{#each model}}`, `{{#each controller}}` ou `{{#each controller.model}}` sont
des notations équivalentes.

* Maintenant, on va essayer de dynamiser un peu tout ça en ajoutant un bouton pour trier la liste :

```html
<!-- /app/templates/series.hbs -->
...
<h2>Comic Series</h2>

<button {{action "sort"}} {{bind-attr class=":sort sortAscending:asc:desc"}}></button>

<ul class="series-list">
...
```

Pour ça, il est nécessaire de définir notre propre `SeriesController` :

```js
// /app/controllers/series.js
import Ember from 'ember';

export default Ember.ArrayController.extend({
  sortAscending: true,

  actions: {
    sort: function() {
      this.toggleProperty('sortAscending');
    }
  }
});
```

Ce simple ajout demande de s'arrêter sur quelques points importants, histoire de bien comprendre ce qui se passe.

### Types de contrôleurs

Nous avons dû remplacer le `SeriesController` implicite par notre propre contrôleur, histoire de proposer cette fonction de tri. [Ember][ember]
dispose de deux types de contrôleurs : [ObjectController](http://emberjs.com/api/classes/Ember.ObjectController.html) et [ArrayController](http://emberjs.com/api/classes/Ember.ArrayController.html).
Comme leur nom l'indique, ces contrôleurs permettent respectivement de gérer des modèles de type objet ou de type collection.

Dans notre cas, nous souhaitons manipuler la liste des séries et utilisons donc un `ArrayController`. Il utilise notamment le [SortableMixin](http://emberjs.com/api/classes/Ember.SortableMixin.html)
qui fournit des fonctions de tri natives. Il nous suffit donc d'initialiser et de mettre à jour la propriété `sortAscending` apportée par ce mixin pour bénéficier du tri sur notre
collection de séries, sans avoir besoin d'autre chose.

### Actions

La mise à jour de cette propriété est effectuée grâce à `{{action "sort"}}` qui nous permet de lier l'action sur le bouton (le clic) à une
fonction `sort` du contrôleur définie dans `actions: { ... }`.

-> Plus d'infos sur les actions [ici](http://emberjs.com/guides/templates/actions/).

### *Bindings* de classes dynamiques

On remarque aussi la manière dont les classes de l'élément `button` sont liées aux propriétés du contrôleur de manière à être mises à
jour dynamiquement grâce à `{{bind-attr class="..."}}`. Cette syntaxe permet de basculer la classe du bouton de `asc` à `desc` automatiquement
lorsque la valeur de `sortAscending` change. On note la notation `:sort` qui permet d'ajouter une classe de base, statique.

-> Plus d'infos sur les classes [ici](http://emberjs.com/guides/templates/binding-element-class-names/).


* Mais on ne va pas s'arrêter là. On va ajouter un petit filtre sur le titre des séries :

```html
<!-- /app/templates/series.hbs -->
<div class="series">
    <h2>Comic Series</h2>

    {{input value=filter class="filter"}}
    <button {{action "sort"}} {{bind-attr class=":sort sortAscending:asc:desc"}}></button>

    <ul class="series-list">
      {{#each filteredModel}}
          <li class="series-item">
              {{title}}
          </li>
      {{/each}}
    </ul>

    <span>Number of series: {{filteredModel.length}}</span>
</div>

{{outlet}}
```

```js
// /app/controllers/series.js
...
filter: "",
sortAscending: true,

filteredModel: function() {
  var filter = this.get('filter');

  return this.get('content').filter(function(item){
    if (item.get('title') === undefined) {
      return true;
    }
    return item.get('title').toLowerCase().match(new RegExp(filter.toLowerCase()));
  }).sort(function(a, b) {
    return this.get('sortAscending') ? (b.get('title') < a.get('title')) : (b.get('title') > a.get('title'));
  }.bind(this));
}.property('filter', 'sortAscending', 'model.@each.title'),

actions: {
...
```

### Propriétés calculées

Je vous passe le contenu de la fonction `filteredModel` qui n'apporte rien au sujet. Examinons par contre la notation `.property('filter', 'sortAscending', 'model.@each.title')`. 
Cela constitue la définition d'une [propriété calculée][computed-prop] : propriété
accessible et manipulable comme n'importe quelle propriété au sein des gabarits mais qui est le résultat d'une fonction dont le retour dépend de l'état d'autres propriétés. 

La syntaxe `.property('filter', 'sortAscending', 'model.@each.title')` définit les autres propriétés *observées* par cette propriété calculée et dont le changement provoquera
l'exécution de la fonction ainsi que le rafraîchissement du gabarit. Ici, on peut constater que l'affichage est mis à jour et la liste filtrée à chaque changement du champ 
de formulaire `filter` et donc de la propriété `filter` associée ou du sens du tri via la propriété `sortAscending`. 

La syntaxe particulière `model.@each.title` permet de mettre à jour l'affichage en cas de changement externe du titre de l'une (`@each`) des séries. Vous pouvez facilement vous rendre compte de
ça en utilisant **Ember Inspector** ([Chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi?hl=en) et 
[Firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)). Allez dans `Data > MODEL TYPES / series-item`, sélectionnez-en une et modifiez son titre. Vous constaterez que 
la liste est mise à jour automatiquement.

Les *bindings* et les [propriétés calculées][computed-prop] constituent deux manières d'observer les changements et de *rafraîchir*
l'application en conséquence. Les [observeurs](http://emberjs.com/guides/object-model/observers) en sont une troisième. Si vous avez un doute sur ce qu'il faut utiliser, allez
voir [ici](http://emberjs.com/guides/object-model/what-do-i-use-when).

### *Bindings* et mise à jour des gabarits

Alors, comment ça marche ? Comment, concrètement, [Ember][ember] se débrouille pour mettre à jour le gabarit lors de la mise à jour d'un modèle, d'une propriété ? En réalité, lorsqu'on
affiche dans un gabarit une propriété dynamique liée à un modèle ou à une propriété, [Ember][ember] va l'encadrer par des éléments HTML spéciaux, des marqueurs de type `<script>` d'id unique
appelé `metamorph`. Attention, je préfère vous prévenir, ça va piquer !

Ainsi,

```html
<h1>Blog de {{name}}</h1>
```

va se transformer en : 

```html
<h1>
Blog de 
<script id="metamorph-0-start" type="text/x-placeholder"></script>
Baptiste Meurant
<script id="metamorph-0-end" type="text/x-placeholder"></script>
</h1>
```

Alors oui, il faut avouer que là on est tenté de partir en courant. C'est le point qui m'a vraiment gêné quand j'ai découvert [Ember][ember] et ça me gêne encore. C'était même
à la limite du rédhibitoire. Ça pollue vraiment le DOM et introduit même quelques effets de bord en CSS lorsqu'on utilise les `:first-child` ou `:last-child`. Ceci étant,
c'est ce qui permet à [Ember][ember] de mettre à jour non pas un gabarit mais uniquement ces zones dynamiques de manière performante - j'ai fini par voir ça comme un mal nécessaire.
Mais surtout, j'ai compris que ces `metamorph` étaient voués à disparaître assez rapidement avec l'utilisation du moteur [HTMLBars][html-bars]. Vous pouvez
jeter un œil à ce sujet à la [présentation d'Eric Bryn](http://talks.erikbryn.com/htmlbars/) (notamment slide 10). Ouf ! Le support d'[HTMLBars][html-bars] est prévu pour 
[Ember][ember] 1.9 ou 1.10 (la release actuelle est 1.7) ... On est impatients !

_Bonus: l'élément est un élément `script` et pas un autre car c'est à priori le seul élément qui peut être inséré partout sans rien casser._

_**Edit**: Aujourd'hui (28/10/2014) est sortie la [version 1.8.0 d'Ember](http://emberjs.com/blog/2014/10/26/ember-1-8-0-released.html). Cette release ne contient pas encore
le support complet d'[HTMLBars][html-bars] mais signe déjà la fin des `metamorph` au profit de l'utilisation d'élements `Text` vides, non intrusifs ! Ça méritait d'être signalé._ 

### *RunLoop*

Un autre mécanisme important est impliqué tant dans le rendu des gabarits que dans le calcul et la synchronisation des propriétés entre elles : la *RunLoop*. Ce mécanisme est
absolument central dans le fonctionnement d'[Ember][ember] et s'appuie sur la lib [Backburner](https://github.com/ebryn/backburner.js/). Dans la plupart des cas, vous n'avez pas
à vous en préoccuper et vous pouvez parfaitement mettre en place une application [Ember][ember] complète sans interagir directement avec la *RunLoop*, sauf lorsque
vous ajoutez vos propres `helpers` [Handlebars](http://handlebarsjs.com/) ou vos propres composants avancés. C'est par contre important d'en comprendre le fonctionnement.

Comme son nom ne l'indique pas, la *RunLoop* n'est pas une loop mais un ensemble de queues permettant à [Ember][ember] de différer un certain nombre d'opérations
qui seront ensuite exécutées en dépilant ces queues dans un ordre de priorité donné. Les queues sont `sync`, `actions`, `routerTransitions `, `render`, `afterRender`, et `destroy`.
Je vous laisse découvrir par vous-même dans la [doc officielle](http://emberjs.com/guides/understanding-ember/run-loop/) et dans cette 
[présentation d'Eric Bryn](http://talks.erikbryn.com/backburner.js-and-the-ember-run-loop) le contenu de ces queues et la manière dont est faite l'exécution.

Je voudrais juste insister sur un aspect particulier : c'est ce mécanisme qui permet, en quelque sorte, d'empiler les calculs de propriétés calculées lorsque les propriétés
*observées* sont modifiées et surtout c'est grâce à ce mécanisme que le rendu n'est effectué qu'une seule fois lors de la modification d'un modèle.

Pour reprendre l'exemple de la [doc officielle](http://emberjs.com/guides/understanding-ember/run-loop/), si vous avez l'objet suivant :

```js
var User = Ember.Object.extend({
  firstName: null,
  lastName: null,
  fullName: function() {
    return this.get('firstName') + ' ' + this.get('lastName');
  }.property('firstName', 'lastName')
});
```

Et le gabarit :

```html
{{firstName}}
{{fullName}}
```

Tout ça, sans la *RunLoop*, ferait qu'on exécuterait le rendu deux fois si l'on modifie successivement `firstname` puis `lastname`. La *RunLoop* met tout ça (et plein d'autres
choses) en queue et n'effectue le rendu qu'une seule et unique fois, lorsque nécessaire.

* Après ça, on va finir en douceur en ajoutant simplement ou nouvelle route pour afficher la série qu'on a sélectionné :

```js
// /app/router.js
Router.map(function() {
  this.resource('series', function() {
    this.route('seriesItem', { path: '/:seriesItem_id' });
  });
});
```

```html
<!-- /app/templates/series.hbs -->
...
  <ul class="series-list">
    {{#each filteredModel}}
        <li class="series-item">
          {{#link-to 'series.seriesItem' this title=title}}
            {{title}}
          {{/link-to}}
        </li>
    {{/each}}
  </ul>
...

<!-- /app/templates/series/series-item.hbs -->
<div class="series-details">
  <h3>{{title}}</h3>
  <img {{bind-attr src="coverUrl"}} alt="Series's first album cover" class="cover"/>
  <dl class="description">
      <dt>scriptwriter</dt>
      <dd>{{scriptwriter}} </dd>
      <dt>illustrator</dt>
      <dd>{{illustrator}}</dd>
      <dt>publisher</dt>
      <dd>{{publisher}}</dd>
  </dl>
  <p class="summary">
    {{summary}}
  </p>
</div>
```

Et voilà ! Quelques remarques en passant : 

* on peut maintenant sélectionner une série dans la liste grâce au `{{link-to}}`. On remarque au passage qu'[Ember][ember] sélectionne automatiquement
  (ajoute une classe `active`) la série de la liste dont la route est activée. On note également l'utilisation de `this` pour référencer l'objet courant
  (ici l'instance courante de `SeriesItem`). -> [doc officielle](http://emberjs.com/guides/templates/links/).
* on a transformé la route `series` en *Resource* qui permet de grouper les routes sous un même espace de nommage. Notez que si la route `seriesItem`
  avait été une ressource, on aurait dû fournir le template `/app/templates/series-item.hbs` au lieu de `/app/templates/series/series-item.hbs` car
  une ressource réinitialise l'espace de nommage et permet ainsi de simplifier les URL. -> [doc officielle](http://emberjs.com/guides/routing/defining-your-routes/#toc_resources)
* on a ajouté un *segment dynamique* `{path: '/:seriesItem_id'}` à la route `seriesItem` pour l'ID de la série. -> [doc officielle](http://emberjs.com/guides/routing/defining-your-routes/#toc_dynamic-segments).


## Conclusions

Cet article est un peu plus long que ce que j'avais prévu et je n'ai pas abordé tous les sujets que je voulais traiter. Mais, plutôt que de dérouler simplement du code pour montrer que ça marche, j'ai
préféré m'arrêter sur les points importants pour en expliquer le fonctionnement. Ça me paraissait important. J'espère que ce n'était pas trop pénible à lire. Les points que je n'ai pas eu le temps
de traiter (API REST avec un backend, tests, helpers, partials, composants, relations avec ember-data, etc.) feront peut-être l'objet d'un autre post mais un peu plus tard parce que je suis fatigué là et 
je sens que vous aussi.

Concernant [Ember][ember], j'apprécie vraiment le modèle de développement, la structure et j'aime vraiment développer avec cet outil. La discussion framework / lib déjà évoquée fera sans doute toujours rage.
En ce qui me concerne, quand j'ai besoin d'un framework, ma préférence va à [Ember][ember].

Concernant [Ember CLI][ember-cli], je suis plus partagé. J'apprécie l'aspect normalisation de la structure de l'appli ainsi que l'outillage assez fourni qu'il embarque, le transpileur ES6. Je ne suis, par contre, pas fan
du scaffolding en général mais, au démarrage, ça peut donner une idée de la manière de faire. J'espère cependant vous avoir donné suffisamment de clefs pour que vous vous fassiez une idée.

Pour finir, je souhaite remercier l'équipe de *Putain de code !* qui ne partage pas mes opinions sur les frameworks en général mais qui m'accueille quand même. Cet article a vraiment dû
vous piquer les yeux. Désolé :-)


_Note: les sources de l'application exemple sont [disponibles sur github](https://github.com/bmeurant/ember-articles/tree/premiere-app-ember)._

[ember]: http://emberjs.com
[ember-cli]: http://www.ember-cli.com/
[node]: http://nodejs.org/
[broccoli]: https://github.com/broccolijs/broccoli
[computed-prop]: http://emberjs.com/guides/object-model/computed-properties/
[folder-layout]: http://www.ember-cli.com/#folder-layout
[html-bars]: https://github.com/tildeio/htmlbars
[ember-data]: https://github.com/emberjs/data
