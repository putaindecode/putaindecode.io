---
date: "2014-12-09"
title: Première application Ember. Suite et fin.
tags:
  - ember
  - javascript
  - frameworks
authors:
  - bmeurant
---

L'[article précédent](/posts/js/premiere-app-ember) vous a accompagné pour la création d'une première application [Ember][ember]. 
Mais il faut bien reconnaître que l'exemple était très simple et que, du coup, le mérite est faible. 
Pour se  rattraper, on va complexifier un peu les choses.

Tout comme dans l'article précédent, nous détaillerons régulièrement les concepts mis en œuvre. Parce que vous le valez bien.

## Sommaire

* [Édition d'une série](#edition-d-une-serie)
  * [Routes imbriquées](#routes-imbriquees)
  * [Outlets](#-code-outlets-code-)
  * [Liens entre routes](#liens-entre-routes)
  * [Enregistrement des modifications](#enregistrement-des-modifications)
  * [Actions sur les transitions](#actions-sur-les-transitions)
* [Relations avec Ember Data](#relations-avec-ember-data)
* [Insertion d'un gabarit](#insertion-d-un-gabarit)
* [Création d'une nouvelle série](#creation-d-une-nouvelle-serie)
* [Conclusion](#conclusion)

## Édition d'une série

On veut pouvoir basculer depuis la fiche d'une série vers son édition en mode *in place*. C'est-à-dire
en **remplaçant** la zone de visualisation de cette fiche par sa zone d'édition.

On accède à la fiche en mode visualisation à l'URL `/series/{id}/` et en mode édition à l'URL `/series/{id}/edit`. Évidemment, 
on reconstruit uniquement la zone de la fiche et non l'application entière (et donc ni l'en-tête ni la liste des séries).

### Routes imbriquées

Commençons par définir une nouvelle route `edit`, sous-route de `seriesItem` : 

```js
// /app/router.js
Router.map(function() {
  this.resource('series', function() {
    this.route('seriesItem', { path: '/:seriesItem_id' }, function () {
      this.route('edit');
    });
  });
});
```

Pour que notre nouvelle route affiche la fiche en mode édition, on doit - [rappelez-vous](/posts/js/debuter-avec-ember/#les-fondamentaux) - impérativement suivre les 
[conventions de nommage](http://emberjs.com/guides/concepts/naming-conventions/) et créer un gabarit `edit.hbs` dans le 
répertoire `/app/templates/series/series-item/` :

```html
<!-- /app/templates/series/series-item/edit.hbs` -->
<form class="series-details">
    <button type="submit" class="submit"></button>
    <button type="cancel" class="cancel"></button>
    <div class="title">{{input id="title" type="text" value=title}}</div>
    <img {{bind-attr src="coverUrl"}} alt="Series's first album cover" class="cover"/>

    <div class="description">
        <div class="scriptwriter">
            <label for="scriptwriter">Scriptwriter</label>
            <span class="control">{{input id="scriptwriter" type="text" value=scriptwriter required="required"}}</span>
        </div>
        <div class="illustrator">
            <label for="illustrator">Illustrator</label>
            <span class="control">{{input id="illustrator" type="text" value=illustrator}}</span>
        </div>
        <div class="publisher">
            <label for="publisher">Publisher</label>
            <span class="control">{{input id="publisher" type="text" value=publisher}}</span>
        </div>
    </div>

    <div class="summary">{{textarea value=summary rows="10"}}</div>
</form>
```  

À ce stade, naviguer sur `/series/{@id}/edit` ne lève pas d'erreur mais n'a aucun effet. En effet, on a
défini une route imbriquée mais conservé le gabarit `/app/templates/series/series-item.hbs` inchangé. L'activation de la route `series.seriesItem` 
affiche donc toujours ce gabarit, même dans le cas d'une sous-route telle que `series.seriesItem.edit`. 

### `outlets`

La solution est à aller chercher du côté du concept d'`{{outlet}}` défini dans l'[article précédent](/posts/js/premiere-app-ember/#-code-outlet-code-et-routes-imbriquees).
Un `{{outlet}}` est nécessaire **à chaque fois qu'on définit un niveau d'imbrication.** Mais comme on veut quand même continuer à afficher la série à 
l'URL `/series/{@id}/`, on va utiliser la **route implicite** `series.seriesItem.index` (cf. [article précédent](/posts/js/premiere-app-ember/#routes-et-controleurs-implicites)) 
et son gabarit, dans lequel on va copier l'ancien contenu de `series-item.hbs`.

```html
<!-- /app/templates/series/series-item/index.hbs -->
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

Le gabarit `series-item.hbs` est quant à lui modifié car il doit changer en fonction de la sous-route activée.
Et puisqu'on ne veut rien afficher de plus, son contenu se résume à un `{{outlet}}` :

```html
<!-- /app/templates/series-item.hbs -->
{{outlet}}
```

Et voilà ! L'affichage de l'URL `/series/{@id}/` est inchangé alors que l'URL `/series/{@id}/edit` 
affiche désormais le formulaire d'édition.

### Liens entre routes

Pour pouvoir plus facilement basculer en mode édition, on ajoute un lien vers la route correspondante grâce à `link-to` 
(cf. [doc officielle](http://emberjs.com/guides/templates/links/)).

```html
<!-- /app/templates/series/series-item/index.hbs -->
<div class="series-details">
    {{#link-to 'series.seriesItem.edit' id class="edit"}}edit{{/link-to}}
    <h3>{{title}}</h3>
    ...
```

On note que la route vers laquelle le lien pointe est préfixée par `series` parce qu'on a défini une route et non une resource.
En effet, une ressource réinitialise l'espace de nommage et permet donc des noms de routes plus courts. Pour pouvoir pointer vers `seriesItem.edit` on aurait donc dû
remplacer `this.route('seriesItem', ...` par `this.resource('seriesItem', ...`.

On peut désormais éditer notre série. On remarque au passage que la modification du titre de la série le met également à jour en temps réel dans la liste des séries grâce
au *binding* (cf. [article précédent](/posts/js/premiere-app-ember/#-em-bindings-em-et-mise-a-jour-des-gabarits)).

### Enregistrement des modifications

Nous allons maintenant rendre opérationnels nos deux boutons d'édition *annuler* et *valider*. Pour cela, on commence par associer des actions à nos boutons :

```html
<!-- /app/templates/series/series-item/edit.hbs` -->
<form class="series-details">
    <button type="submit" {{action "submit"}} class="submit"></button>
    <button type="reset" {{action "cancel"}} class="cancel"></button>
...
```

Comme il s'agit de manipulations sur le modèle et de transitions entre routes, les actions correspondantes seront traitées par la route.

```js
// app/routes/series/series-item/edit.js
import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return this.modelFor('series.seriesItem');
  },
  actions: {
    submit: function () {
      this.modelFor('series.seriesItem.edit').save().then(function () {
        this.transitionTo('series.seriesItem');
      }.bind(this));
    },

    cancel: function () {
      this.modelFor('series.seriesItem.edit').rollback();
      this.transitionTo('series.seriesItem');
    }
  }
});
```

Quelques mots sur ces quelques lignes : 

* Dans une `route`, le modèle courant est récupéré via `this.modelFor('nomRoute')`. Ici, on récupère explicitement le modèle chargé automatiquement 
  (par convention) par la route mère `seriesItem`. Notez qu'on aurait pu omettre la récupération du modèle complètement car la route mère s'en occupe pour nous.
* Une fois le modèle récupéré, on peut invoquer les méthodes apportées par [Ember Data][ember-data].
* Pour un `cancel`, on invoque `rollback()` : toutes les modifications effectuées sont annulées et le modèle est réinitialisé.
* Pour un `submit`, on invoque un `save()` qui enregistre les modifications apportées au modèle dans le *magasin* 
  ([Store](http://emberjs.com/api/data/classes/DS.Store.html)) d'[Ember Data][ember-data].
* Les opérations effectuées sur les modèles sont bien souvent asynchrones puisque, dans le cas nominal, elles font 
  intervenir des API REST pour enregistrer ou mettre à jour les données depuis un serveur. Dans le cas où l'on souhaite
  attendre la fin du traitement pour effectuer une action (comme ici dans le cas du `save`), il est nécessaire d'utiliser
  les *promesses* (`promises`) qu'[Ember Data][ember-data] renvoie (`.then(...)`). Dans le cas contraire, le code serait
  exécuté avant la fin du traitement et ne permettrait pas de proposer un retour utilisateur propre (gestion des cas d'erreurs notamment).
* Les transitions entre routes sont possibles via `this.transitionTo('nomRoute')`.

### Actions sur les transitions

Mais je voudrais encore ajouter une dernière petite cerise sur ce gâteau : annuler automatiquement toutes les modifications effectuées
sur la série dès que l'on quitte la route. [Ember][ember] prévoit en effet des mécanismes avancés pour travailler sur les transitions entre 
routes (cf. [doc officielle](http://emberjs.com/guides/routing/preventing-and-retrying-transitions/)). En particulier `willTransition` : 

```js
// app/routes/series/series-item/edit.js
  actions: {
    ...
    willTransition: function () {
      this.modelFor('series.seriesItem.edit').rollback();
      return true;
    }
  }
```

L'action est très simple ici mais on imagine facilement comment on pourrait ajouter une confirmation et déterminer, en fonction
de la réponse, si l'on doit continuer la transition ou l'abandonner.

## Relations avec [Ember Data][ember-data]

[Ember Data][ember-data] permet de définir des relations entre nos modèles. Ajoutons donc des albums à nos séries :

On définit d'abord une nouvelle entité `Album` et ses propriétés et on indique que cet album était associé à une série via la propriété `series` 
et à la méthode `DS.belongsTo` (cf. [doc officielle](http://emberjs.com/api/data/#method_belongsTo)). 
Ce qui se traduit plus loin, dans l'initialisation des données par `series: 1` où 1 est l'identifiant de la 
série en question.

```js
// /app/models/album.js
import DS from 'ember-data';

var Album = DS.Model.extend({
  title               : DS.attr('string'),
  publicationDate     : DS.attr('date'),
  number              : DS.attr('number'),
  coverName           : DS.attr('string', {defaultValue: 'default.jpg'}),
  series              : DS.belongsTo('seriesItem'),
  coverUrl: function() {
    return '/assets/images/albums/covers/' + this.get('coverName');
  }.property('coverName')
});

Album.reopenClass({
  FIXTURES: [{
    id: 1,
    title: 'Somewhere Within the Shadows',
    publicationDate: 'Nov 2000',
    number: 1,
    coverName: 'blacksad-1.jpg',
    series: 1
  }, {
    id: 2,
    title: 'Arctic-Nation',
    publicationDate: 'Mar 2003',
    number: 2,
    coverName: 'blacksad-2.jpg',
    series: 1
  }]
});

export default Album;
```

On modifie ensuite le modèle `SeriesItem` pour indiquer une relation inverse grâce à la propriété `albums` et à 
la méthode `DS.hasMany` (cf. [doc officielle](http://emberjs.com/api/data/#method_hasMany)) puis affecter la liste des 
identifiants des albums à la série via `albums: [1, 2]` : 

```js
// /app/models/series-item.js
import DS from 'ember-data';

var SeriesItem = DS.Model.extend({
    title               : DS.attr('string', {defaultValue: 'New Series'}),
    ...
    albums              : DS.hasMany('album', {async: true})
});

SeriesItem.reopenClass({
    FIXTURES: [{
    id: 1,
    ...
    albums: [1, 2]
    }, ...
]});

export default SeriesItem;
```

## Insertion d'un gabarit

Maintenant qu'on a des albums pour nos séries, on serait bien intéressé de les voir s'afficher. Seulement voilà, on veut juste les
afficher à côté de la visualisation d'une série. On ne veut rien proposer d'autre pour ces albums que le *binding* des propriétés et
leur affichage. Pas besoin de route ou de contrôleur. On va pour cela utiliser un outil particulier permettant simplement
d'insérer (d'afficher) un gabarit au sein d'une route existante via le *helper* : `render` (cf. 
[doc officielle](http://emberjs.com/guides/templates/rendering-with-helpers/#toc_the-code-view-code-helper)).

On modifie donc le gabarit `/series/series-item.hbs` pour qu'à côté de la fiche d'une série soit affichée la liste de ses albums : 

```html
<!-- /app/templates/series/series-item.hbs -->

{{outlet}}

<div class="series-albums">
    <ul>
        {{#each album in albums}}
            {{render 'partials/albumItem' album}}
        {{/each}}
    </ul>
</div>
```

```html
<!-- /app/templates/partials/album-item.hbs -->

<li class="album">
    <img {{bind-attr src="coverUrl"}} alt="Album cover" class="cover"/>

    <div class="description">
        <h4>{{title}}</h4>
        <dl>
            <dt>volume</dt><dd>{{number}}</dd>
            <dt>date</dt><dd>{{publicationDate}}</dd>
        </dl>
    </div>
</li>
```

## Création d'une nouvelle série

Histoire de terminer en beauté on va ajouter vite fait la création d'une série.

Comme on commence à avoir l'habitude, on fait ça en deux coups de cuillère à pot : 
 
```js
// /app/router.js
Router.map(function() {
  this.resource('series', function() {
    this.route('seriesItem', { path: '/:seriesItem_id' }, function () {
      this.route('edit');
    });
    this.route('create');
  });
});
```

```js
// /app/routes/series/create.js
import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return this.store.createRecord('seriesItem');
  },

  renderTemplate: function () {
    this.render('series.seriesItem.edit');
  },

  actions: {
    submit: function () {
      this.modelFor('series.create').save().then(function () {
        this.transitionTo('series.seriesItem', this.modelFor('series.create'));
      }.bind(this));
    },

    cancel: function () {
      this.modelFor('series.create').rollback();
      this.transitionTo('series');
    },

    willTransition: function () {
      this.modelFor('series.create').rollback();
      return true;
    }
  }
});
```

```html
<!-- /app/templates/series.hbs -->
    ...
      {{/each}}
        <li class="series-item">
          {{#link-to 'series.create' class="add"}}add{{/link-to}}
        </li>
    </ul>
    ...
```

Les points importants à noter : 

* Le modèle est, cette fois-ci, créé à l'activation de la route via `this.store.createRecord(...)`.
* Comme on ne souhaite pas proposer de gabarit propre pour cette route, on utilise `renderTemplate` pour indiquer à [Ember][ember] quel
  gabarit il doit utiliser. 
* Les actions `submit`, `cancel` et `willTransition` sont sensiblement les mêmes que pour l'édition mais travaillent sur un modèle différent et 
  renvoient vers d'autres routes.
* On note le passage du modèle lors de la transition en cas de `submit`.
* Il serait légitime de se poser la question de réutilisation de code entre ces deux routes, compte tenu des similarités. Ce n'est pas l'objet 
  de l'article mais pourrait être envisagé à l'aide d'un `mixin` partagé (cf. [doc officielle](http://emberjs.com/api/classes/Ember.Mixin.html)).  

## Conclusion

Au travers de cet article et des précédents, j'espère vous avoir donné un aperçu du modèle de développement que propose
[Ember][ember]. Vous avez compris, j'espère, qu'[Ember][ember] est un véritable framework avec des opinions fortes et qu'il doit être pris comme
tel ou laissé de côté pour une solution plus légère selon vos besoins.

Mais j'ai également essayé d'aller plus en profondeur sur certains aspects et de montrer des cas d'utilisation concrets. 
Ce dernier article montre qu'il est également possible de fournir à [Ember][ember] 
des configurations explicites afin d'aller plus loin que les conventions par défaut.

Maintenant, vous n'avez plus d'excuses... Vous ne pourrez pas dire que vous ne connaissiez pas. 


_Note: les sources de l'application exemple sont [disponibles sur github](https://github.com/bmeurant/ember-articles/tree/premiere-app-ember-suite)._

[ember]: http://emberjs.com
[ember-data]: https://github.com/emberjs/data
