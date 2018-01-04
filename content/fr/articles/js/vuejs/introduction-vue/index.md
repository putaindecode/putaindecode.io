---
date: "2018-01-05"
title: "Introduction à Vue.JS"
tags:
  - javascript
  - framework
authors:
  - sysmoh
header:
  image: logo.png
  linearGradient: #35495E, #41B883
---

Vue est un framework full stack javascript au même titre qu'Angular ou React.
Pourquoi encore un, parce qu'il en faut pour tous les goûts, et celui-ci est
du mien donc pourquoi pas. Il faut savoir qu'à l'origine Vue est issu de
l'initiative d'un développeur de chez Google qui travaillait alors avec
AngularJS. Mais celui-ci ne lui plaisait pas tant, il a donc pris tout ce qu'il
aimait des frameworks qu'il connaissait et créa Vue en Février 2014.

## Quelques points forts
* Vue est basé sur un arbre DOM virtuel afin de totalement séparer la vue de la
logique, la réactivité qui va avec un peu comme React
* Sépare clairement la logique primaire (interaction avec le DOM, affichage,
logique...) des compléments tels que le Routeur qui sont maintenus dans des
librairies annexes
* Une séparation concrète entre les directives
et les composants
* Offre un développement basé uniquement sur le HTML, JS et CSS sans nécessité
de connaître Typescript, JSX ou d'autres, très proche de Polymer dans la
simplicité

Personnellement, j'apprécie particulièrement la simplicité de l'API très
propre, sans fioriture, nous incitant à créer une myriade de composants et à
les faire travailler imbriqués très simplement, sans avoir besoin d'utiliser de
polyfills et offrant des performances vraiment excellentes (un poil meilleures
que React), tout en restant très légère (~21Kb gzip pour la version light de
Vue, ~30Kb quand on y ajoute le routeur et la gestion d'état de l'application).

## Comment ça marche
Vue peut être balancé dans une page HTML tout simplement et déjà faire des
miracles.

```html
<div id="app">
    <p>{{ message }}</p> <!-- hello -->
    <p>{{ 1 + 1 }}</p><!-- 2 -->
    <p>{{ isAdmin ? adminMsg : "Pas admin" }}</p><!-- Pas admin -->
</div>
```

```javascript
new Vue({
    el: '#app',
    data: function() {
        return {
            message: "hello",
            isAdmin: false,
            adminMsg: "Bonjour patron"
        }
    }
});
```

La notation moustache est utilisée pour afficher du contenu. En arrière plan,
Vue compile ses templates en DOM virtuel ce qui lui permet de faire le minimum
de boulot pour mettre à jour la vue, on aime. Ceci à l'avantage qu'on écrit du
HTML comme on le connaît en ajoutant la syntaxe moustache, et ne nécessite pas
l'utilisation de JSX ou une autre surcouche.

### Les directives
On en a une bonne quantité à disposition, ça va de l'affichage conditionnel aux
évènements en passant par les transitions.

```html
<div id="app">
    <div v-if="admin"> <!-- Affichage conditionnel si admin vaut true -->
        <span v-for="user in users"> <!-- v-for pour itérer sur des listes -->
            <div>{{ user.nom }} <!-- accès aux sous-éléments -->
        </span>
    </div>
    <!-- On peut aussi utiliser v-else-if="..." si on a d'autres cas -->
    <div v-else>Vous n'êtes point admin</div>
</div>
```

```javascript
var app = new Vue({
  el: '#app',
  data: function() {
    return {
        admin: true,
        users: [
          {nom: "marc"},
          {nom: "jean"},
        ]
    }
  }
});
```

Ca a l'avantage d'être très clair et simple à comprendre, on augmente un peu
le niveau. Il existe également des directives pour récupérer les valeurs des
champs de formulaire `v-model` et d'autres pour écouter tous les évènements qui
peuvent être attachés à du HTML.

```html
<div id="app">
    <!-- v-model va dans les deux sens, du HTML au JS et inversement -->
    <!-- aussi connu comme le two-ways data binding -->
    <input v-model="username" />
    <button v-on:click="alert(username)">Yell</button>
</div>
```

```javascript
var app = new Vue({
  el: '#app',
  data: function() {
    return { username: "John Cena" }
  }
});
```

> Pourquoi `data` est une fonction qui retourne un objet? On peut pas
directement déclarer l'objet?

Le fonctionnement de Vue et la manière dont il rend vos variables réactives
nécessite que l'objet soit la valeur de retour d'une fonction. On pourrait
simplement déclarer l'objet, mais ça ne marcherait que dans ce cas précis où
l'on travaille directement avec l'instance de Vue, ça balancera une erreur dès
qu'on travaillera avec des composants. C'est une bonne habitude à prendre.

### D'autres directives
Il existe beaucoup d'autres directives, voici un exemple qui illustre les plus
utilisées

```html
<div id="app">
    <!-- Ajout dynamique de classe et style -->
    <div v-bind:class="{active: isActive}"
         v-bind:style="{color: activeColor}">Je suis bleu et actif!</div>

    <div v-once>Compilé une seule fois, {{ index }} reste 1</div>
    <button v-on:click="index++">Même en cliquant ici</button>
    <div v-pre>{{ Pas compilé }}</div> <!-- s'il y a rien de dynamique -->
    <div v-show="isActive">Très actif!</div>
</div>
```

```javascript
var app = new Vue({
  el: '#app',
  data: {
    isActive: true,
    activeColor: "blue",
    index: 1
  }
});
```

Vous noterez la présence de `v-show` qui fait également de l'affichage
conditionnel. Cependant, là où `v-if` retire du DOM (en retirant également
les écouteurs d'évènements et tout ce qui va avec), `v-show` réalise un simple
switch d'affichage basé sur le CSS.

#### Les actions par défaut
On a en javascript la possibilité de faire des trucs comme `preventDefault`
ou `stopPropagation` qui sont très importants, et ça les développeurs de Vue
l'ont bien compris. On a donc la possibilité d'écrire des choses comme
`v-on:click.stop` ou `v-on:submit.prevent` pour répondre à ça et qui font
exactement ce qu'on attend d'eux.

#### Une syntaxe simplifiée
Les développeurs étant de grosses flaques, on a également à notre disposition
une notation simplifiée. On peut remplacer `b-bind:truc` par `:truc="..."` et
`v-on:machin="..."` par `@machin="..."`. Personnellement j'aime bien tout écrire
je m'y retrouve mieux et j'aime bien quand c'est tout joli, mais ça existe
alors le voici.

### Faire quelque chose de ces évènements
C'est cool on peut modifier nos variables et faire joujou avec, mais si on
pouvait en faire quelque chose de concret, par exemple avec des méthodes, ce
serait mieux! Et ça tombe plutôt bien, parce qu'on peut. Dans Vue, on range nos
fonctions dans l'attribut `methods` au même titre que nos variables vont dans
`data`.

```html
<div id="app">
  <!-- simple appel à une méthode -->
  <button v-on:click="increment">{{ counter }}</button>

  <!-- l'objet event lié est automatiquement transmis -->
  <div style="width:500px; height: 200px; overflow:auto;" v-on:scroll.passive="wowOnScroll">
    <div style="width:100%; height:500px; background:blue;"></div>
  </div>

  <!-- en passant des paramètres -->
  <div v-for="id in [1,2,3]">
    <span v-on:click="clicked(id)">{{ id }}</span>
  </div>
</div>
```

```javascript
var app = new Vue({
  el: '#app',
  data: function() { return {
    counter = 0;
  }},
  methods: {
    increment: function() { this.counter++; },
    wowOnScroll: function(e) { console.log(e.target.scrollTop); },
    clicked: function(id) { console.log(id); }
  }
});
```

Vous remarquerez la présence du `this` dans la méthode `increment`. Honnêtement
je suis pas un guru du javascript, je sais pas comment ça marche, mais en gros
l'instance de `this` donne accès à l'objet Vue tel qu'on en a besoin, il permet
d'accéder directement aux variables de `data` et aux autres méthodes de `methods`,
ce qui nous facilite grandement la vie.

### Les propriétés calculées
Autement dit les *computed properties* dans la langue de Shakespeare.
Concrètement, ça permet d'utiliser les données de `data`, de réaliser des
opérations simple dessus et d'afficher le résultat. On va illustrer tout ça.

```html
<div id="app">
  <input v-model="part1" /> <input v-model="part2" />
  Résultat: {{ message }}
</div>
```

```javascript
var app = new Vue({
  el: '#app',
  data: function() {
    return {
      part1: "truc de ",
      part2: "ouf"
    }
  },
  computed: {
    message: function() {
      return this.part1 + this.part2;
    }
  }
});
```

Toutes les fonctions déclarées dans `computed` peuvent être directement
utilisées dans nos moustaches. Elles sont de plus directement réactives, si
vous modifiez `part1` ou `part2` (comme ici avec `v-model`), `message` sera
directement réévalué et la vue sera recompilée la mettant à jour.

### Les observateurs
Une autre facette intéressante de Vue est de permettre de suivre l'évolution
des modifications de nos variables déclarées dans `data`.

```html
<div id="app">
  <input v-model="password" type="password" />
  <div v-if="isAdmin">Code nucléaires</div>
</div>
```

```javascript
var app = new Vue({
  el: '#app',
  data: function() {
    return {
      password: "",
      isAdmin: false
    }
  },
  watch: {
    password: function(newVal, oldVal) {
      if(newVal === "pass")
        this.isAdmin = true;
    }
  }
});
```

Attention cependant, les méthodes de `watch` sont mise à jour à chaque changement
des valeurs qu'elles observent, entraînant à chaque fois une recompilation des
parties de vue concernées (notamment lors de réactions en chaîne), il se prête
donc beaucoup plus à de petites opérations pas trop coûteuses, comme des
modifications de style ou des transitions/animations.

### La vie de vos composants
Chacun d'eux passe par plusieurs états, dans lesquels on peu réaliser des actions.
Il en existe 11, voici les 4 plus utilisés:
* created, appelé juste après que votre composant aie installé ses listeners,
propriétés, méthodes etc. C'est cependant juste avant que la propriété `$el`
(accessible en faisant `this.$el`) ne soit disponible. `$el` pointe sur le noeud
racine du DOM de votre composant, dans tous les exemples, la div `#app`.
* mounted, est appelé dès que la propriété `$el` est disponible
* updated, appelé dès qu'un rendu a eu lieu entraînant une modification du DOM
virtuel, donc un peu tout le temps
* destroyed, appelé dès que votre composant est détruit, c'est-à-dire que son DOM,
ses propriétés, ses listeners etc. ont été supprimés

```javascript
var app = new Vue({
  el: '#app',
  data: function() {
    return {
        superInformation: null
    }
  },
  mounted: function() {
    var $this = this; //On doit maintenir une référence à this
    $.get("/mon/api/de/ouf").then(function(response) { //petit jquery sans peine
        $this.superInformation = response.superInformation;
    });
  }
});
```

## Les outils de bundling
C'est bien joli de s'amuser vite fait sur une page HTML, mais c'est plus cool
si on peut développer des trucs plus complexe et poussés. Pour ceci, les devs
de Vue mettent à disposition [vue-cli](https://github.com/vuejs/vue-cli) qui
permet de rapidement bootstraper un projet vide
## En conclusion
On a fait un petit tour d'horizon de ce que Vue peut faire tout simplement, mais
c'est vraiment seulement la pointe de l'iceberg. Si le coeur vous en dit je vous
invite vraiment à lire [la documentation](https://fr.vuejs.org/v2/guide/index.html)
qui est vraiment agréable à lire, pas comme cet article, et qui est traduite en
français. Sur ce, la bise!
