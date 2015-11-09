---
date: "2014-06-04"
title: Introduction à ReactJS
tags:
  - javascript
  - reactjs
authors:
  - bloodyowl
---

Cela fait maintenant un an que ReactJS est open-sourced.
C'est l'occasion de présenter le petit dernier de la vague MV*.

## Les différentes approches d'UI

### Backbone

[Backbone](http://backbonejs.org) apporte une simplification dans la
déclaration d'évenements,
il reste cependant très peu impliqué dans le rendering.
Le choix de laisser l'utilisateur décider de tout concernant
`Backbone.View` est positif pour de nombreux projets, mais rend
la gestion du DOM pénible.

Pour faire du data-binding, `Backbone` ne propose naturellement rien,
et l'on doit faire appel à des mixins supplémentaires pour le mettre
en place sans s'arracher les cheveux.

De plus, c'est souvent un moteur de templating comme
Handlebars ou Jade qui génére la vue originale. On se retrouve donc avec
un joli `this.$el.html(this.template(data))` dans la méthode `render()`
qui va provoquer des jolies horreurs visuelles
(ie. les images se rechargent, les videos sont réinitialisées).

En somme, Backbone est très sympathique pour structurer
son code proprement, mais concernant l'UI, n'aide absolument pas à réduire
la compléxité liée aux états du DOM.

### Angular

[Angular](https://angularjs.org) propose une approche beaucoup plus travaillée,
en imposant un moteur de templating HTML (on peut utiliser du preprocessing)
et on déclare ses bindings très simplement avec une syntaxe `{{mustache}}`.

On déclare les évenements à l'aide d'attributs `ng-{eventName}`.

Sur le papier, angular est donc très sympathique (je ne prendrais pas parti sur le dirty checking).

### Ember

[Ember](http://emberjs.com) est un framework très bien pensé et très travaillé.
Il intègre très bien les concepts de `data-binding` à l'aide de [DOM Ranges](https://developer.mozilla.org/en-US/docs/Web/API/range).
Il propose des conventions fortes, et contrairement à la plupart des _a priori_,
est très simple à prendre en main.
Les subviews sont très simples à utiliser à l'aide d'`{{outlet}}`.

Pour résumer, ember et angular proposent de vraies solutions pour la gestion
de l'UI. Cependant les deux conservent cette démarche :

- on _render_ (génère et insère le bout de DOM) une fois
- on update les bindings

### React

[React](http://facebook.github.io/react/) change complètement d'approche.
Il part d'un constat simple :
le fait que le DOM ait constamment un état différent, c'est chiant à gérer.

Du coup, et si on appelait `.render()` à chaque modification ?
Ça a l'air stupide, hein ? Pas tant que ça en fait.

React implémente un __DOM virtuel__, une représentation interne du DOM
extrêmement rapide. Il inclut par ailleurs son propre système d'événements,
ce qui permet à React de faire bénéficier de la phase de capturing aux navigateurs
n'implémentant pas `EventTarget` (oui, IE8, c'est toi que je regarde).

La méthode `render` retourne des objets correspondant à la représentation
interne du DOM virtuel.

Les classes React se définissent par leur `state`.
Lorsque l'on crée une classe, on définit une méthode `getInitialState` qui
retournera un état initial.

Après cela, le seul moyen de changer l'état est d'indiquer à `this.setState`
quelles valeurs de l'état ont changé afin de mettre à jour le DOM.

Une classe React se voit passer des propriétés au moment d'être instanciée : les
`props`. À ne pas confondre avec le `state`, son contenu ne doit être
manipulé que par l'extérieur de la classe (bien que celle-ci puisse obtenir
des valeurs par défaut en définissant une méthode `getDefaultProps` qui les
retourne).

Le `state`, en revanche, ne doit être modifié qu'au sein des méthodes propres
à la classe.

Le principal avantage est que l'on est certain, du fait de l'appel systématique
à `render`, que notre composant React aura la représentation attendue pour un état donné.

Un des autres avantages de React est son algorithme de diff interne.
Le DOM virtuel va être comparé avec la version visible, et React effectue
à l'aide d'opérations simples les seuls changements nécessaires.

Cela résoud des problématiques comme la position du curseur dans un champ texte
qui effectue du two-way data-binding; puisque l'algorithme n'y voit pas de
changement nécessaire, le champ texte n'est pas modifié et l'on garde donc le focus.
Du même fait, si vous avez un gif qui boucle, il ne se relancera pas
inopinément.

React est idéalement utilisé avec jsx, un pré-processeur js qui permet
d'écrire les templates avec une syntaxe xml (voir l'exemple plus bas),
ce qui permet à des novices de le prendre en main très rapidement.

## Créons un component react :


```javascript
var View = React.createClass({
  getInitialState : function(){
    // état initial
    return {
      checked : false
    }
  },
  getDefaultProps : function(){
    // si `this.props.label` n'est pas présent, ce sera `"?"`
    return {
      label : "?"
    }
  },
  toggle : function(){
    // on crée un nouvel état (les états de react sont immutable)
    // et on déclenche le render
    this.setState({
      checked : !this.state.checked
    })
  },
  render : function(){
    // petit addon pour se simplifier la vie
    var classes = React.addons.classSet({
      "list-item" : true,
      "list-item--valid" : this.state.checked
    })
    return (
      <div className={classes}>
        {/* notre binding tout simple */}
        <input checked={this.state.checked} type="checkbox" onChange={this.toggle} />
        {this.props.label}
      </div>
    )
  }
})

// on mount le component, et l'on passe le label
var view = React.render(<View label="helloworld" />, document.getElementById("id"))
// et hop
view.toggle()
```

## Sum up des avantages de React

React a bien compris ces points :

- le DOM est lent, du moins en écriture, et limiter les interactions avec
ce dernier est essentiel ;
- devoir continuellement penser à l'état du DOM à l'instant `n` n'est pas
une préoccupation que nous devrions avoir en développant l'UI de nos
composants ;
- les concepts d'immutabilité (un objet ne change pas, on en crée un nouveau à
chaque changement) et de composition (composer une classe de différentes
fonctionnalités sans devoir créer des chaînes d'héritage complexes) ont de
grands intérêts, trop peu utilisés en front-end.

En bonus, React, même s'il n'impose pas de bibliothèque pour les
data et la communication des modules, offre une approche nommée
[flux](http://facebook.github.io/flux/docs/overview.html) très
intéressante et vous offrant des clés pour concevoir une app avec en
tête les paradigmes pensés pour React.

Last but not least, vous pouvez render vos composants React depuis le serveur
et la lib sera assez intelligente pour reconnaitre les composants déjà générés
pour ne pas les render systématiquement, c'est pas beau, ça ?
