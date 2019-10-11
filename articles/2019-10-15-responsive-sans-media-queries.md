---
date: 2019-10-15
title: Du responsive sans media queries
author: MoOx
slug: responsive-sans-media-queries
---

Aujourd'hui, il est assez difficile d'imaginer faire des designs web responsive
sans avoir recours aux media queries. Cette idée vieille de 1994, devenue
recommendation du W3C en 2012 (une fois supportée par tous les navigateurs) a
pris son temps et a su s'imposer comme l'outil de référence pour faire du design
adaptatif.

À tel point qu'il parait impossible de faire du responsive sans media queries
dans l'imaginaire collectif.

## Pourquoi voudrais-tu faire du responsive sans media queries ?

Il faut pas se le cacher: travailler avec les media queries n'est pas toujours
évident. Cela implique pour chaque "morceau" de votre site ou appli qui va
devoir s'adapter de prévoir un ou plusieurs breakpoints lié à la taille
disponible de votre viewport. Ecrire du code lié au viewport pour un "composant"
bas niveau peut paraître clairement étrange.

Ce côté contre intuitif des MQs m'a toujours dérangé: on se retrouve à cibler
une taille d’écran, et non pas de cibler la taille disponible pour un élément
donné.

Lorsque l'on creuse un peu, on tombe souvent sur le concept de "element
queries". Le rêve de tout intégrateur web : ce serait la solution a tous les
problèmes posés par les media queries.

Franchement, écrire du code qui permet à un même composant de se retrouver sur
une même page a 2 endroits mais avec des dimensions différentes ça serait pas
cool? Pas qu'un peu.

Alors il y a bien quelques techniques à ce jour notamment
["les fab four"](https://emails.hteumeuleu.fr/2016/02/fab-four-emails-responsive-sans-media-queries/)
ou encore des tricks à base de floats ou d'autres trucs plus exotiques, mais
malheureusement ce n'est pas toujours maintenable ou intuitif.

Dans notre monde "moderne" (j'en vois déjà certain cracher sur leur écran),
pourquoi ne pas utiliser JavaScript? (Voilà vous pouvez essuyer votre écran).
Sérieusement, on pourrait se dire que dans notre contexte, il pourrait être
pertinent de simuler des elements queries à coup de `getBoundingClientRect`
accompagné d'un observeur.

Certain dirons que encore une fois
[tout est question de compromis](/articles/tradeoffs).

Mais si on veut faire du rendu côté serveur... Le JavaScript ne sera pas une
bonne solution (oui ça m'arrive de penser à ce concept).

## Comment faire du responsive sans media queries

Rentrons dans le vif du sujet pour celles et ceux qui seraient intéressé·e·s par
cette opportunité. Voici donc quelques astuces et pratiques que je vais vous
livrer.

Première chose à bien visualiser : nous allons partir du principe que nous
voulons nous contenter de flexbox. Aujourd'hui supporté par tous les
navigateurs, flexbox est le candidat idéal à ce jour pour faire du code propre
et maintenable.

Avec flexbox on peut "juste" faire donc des lignes et des colonnes.

Pour les colonnes, c’est très souvent peu problématique. Tout simplement par ce
que l’on scroll le plus souvent verticalement. Je ne vais donc pas spécialement
aborder cette axe là et me concentrer sur l’axe horizontal, mais en changeant
d’axe ces pratiques seront toutes aussi pertinentes selon votre besoin.

Alors que faire ? On commence par quoi ?

On va prendre un exemple très simple où je me retrouve avec une ligne et trois
blocs intérieurs. Dès que c’est possible je veux que ces trois blocs soient sur
une ligne. Par exemple sur un ordinateur de bureau. Ou un iPad. Ou un smartphone
sacrément gros. Ou un smartphone en paysage.

```html
<section style="display: flex;">
  <article style="flex: 1; height: 50px; background: #fbb;">1</div>
  <article style="flex: 1; height: 50px; background: #bfb;">2</div>
  <article style="flex: 1; height: 50px; background: #bbf;">3</div>
</section>
```

<iframe
    allowtransparency="true" allowfullscreen="true" scrolling="no" frameborder="no"
    height="300" style="width: 100%; min-width: 600px;"
    title="Responsive without MQs, step 1"
    src="//codepen.io/MoOx/embed/gNjRQr/?height=300&theme-id=light&default-tab=result"  >
</iframe>

Si on réduit notre exemple on va donc se retrouver avec ceci. Pas ouf.

<iframe
    allowtransparency="true" allowfullscreen="true" scrolling="no" frameborder="no"
    height="300" style="width: 100%; max-width: 300px"
    title="Responsive without MQs, step 1"
    src="//codepen.io/MoOx/embed/gNjRQr/?height=300&theme-id=light&default-tab=result"  >
</iframe>

Partant de ceci ça va être assez simple de faire la première étape. On va
rajouter flex-wrap.

```html
<section style="display: flex; flex-wrap: wrap;">
  <article style="flex: 1; height: 50px; background: #fbb;">1</div>
  <article style="flex: 1; height: 50px; background: #bfb;">2</div>
  <article style="flex: 1; height: 50px; background: #bbf;">3</div>
</section>
```

<iframe
    allowtransparency="true" allowfullscreen="true" scrolling="no" frameborder="no"
    height="300" style="width: 100%; max-width: 300px"
    title="Responsive without MQs, step 1.1"
    src="//codepen.io/MoOx/embed/GbBvdv/?height=300&theme-id=light&default-tab=result"  >
</iframe>

C’est plutôt moche et pas très réaliste. Ajoutons donc un petit peu de contenu,
et un peu d’espace.

Avant qu'on me crache dessus car j'ai mis des div en guise de gouttière, je
souligne que c'est pour le cas d'école.

```html
<section style="display: flex; flex-wrap: wrap;">
  <div style="width: 10px;"></div>

  <article style="flex: 1; background: #fbb;">
    <h2 style="margin: 0; padding: 20px; font: 900 64px monospace;">Red</h2>
  </article>

  <div style="width: 20px;"></div>

  <article style="flex: 1; background: #bfb;">
    <h2 style="margin: 0; padding: 20px; font: 900 64px monospace;">Green</h2>
  </article>

  <div style="width: 20px;"></div>

  <article style="flex: 1; background: #bbf;">
    <h2 style="margin: 0; padding: 20px; font: 900 64px monospace;">Blue</h2>
  </article>

  <div style="width: 10px;"></div>
</section>
```

<iframe
    allowtransparency="true" allowfullscreen="true" scrolling="no" frameborder="no"
    height="300" style="width: 100%; min-width: 600px;"
    title="Responsive without MQs, step 2"
    src="//codepen.io/MoOx/embed/pXZrrx/?height=300&theme-id=light&default-tab=result"  >
</iframe>

Si on rétrécit l’espace disponible on aura un rendu qui va tenter de s’adapter
comme il peut.

<iframe
    allowtransparency="true" allowfullscreen="true" scrolling="no" frameborder="no"
    height="300" style="width: 100%; max-width: 300px;"
    title="Responsive without MQs, step 2"
    src="//codepen.io/MoOx/embed/pXZrrx/?height=300&theme-id=light&default-tab=result"  >
</iframe>

Imaginons que ce rendu ne soit pas forcément souhaitable dans notre contexte.
Formulé autrement: **ces marges sont sacrément dégueulasses**.

Pour être précis, elles ne sont pas adaptées à nos contraintes et au rendu que
l’on souhaite avoir: on se retrouve avec un bout de marge perdu à un endroit où
l’on a pas vraiment envie qu’il se trouve.

Du coup comment qu’on fait ?

Petite technique facile à mettre en place et efficace : on va placer des
demi-marges sur le bloc plutôt qu’utiliser le concept de gouttière. Comme ceci :

```html
<section style="display: flex; flex-wrap: wrap;">
  <div style="flex: 1; padding: 0 10px;">
    <article style="background: #fbb;">
      <h2 style="margin: 0; padding: 20px; font: 900 64px monospace;">Red</h2>
    </article>
  </div>

  <div style="flex: 1; padding: 0 10px;">
    <article style="background: #bfb;">
      <h2 style="margin: 0; padding: 20px; font: 900 64px monospace;">Green</h2>
    </article>
  </div>

  <div style="flex: 1; padding: 0 10px;">
    <article style="background: #bbf;">
      <h2 style="margin: 0; padding: 20px; font: 900 64px monospace;">Blue</h2>
    </article>
  </div>
</section>
```

Ce changement n’a aucun impact sur le rendu grand format, mais cela va nous
permettre en petit format d’obtenir le rendu suivant :

<iframe
    allowtransparency="true" allowfullscreen="true" scrolling="no" frameborder="no"
    height="300" style="width: 100%; max-width: 300px;"
    title="Responsive without MQs, step 3"
    src="//codepen.io/MoOx/embed/NZBvLB/?height=300&theme-id=light&default-tab=result"  >
</iframe>

En fonction du contenu intérieur des blocs que vous allez avoir, vous allez
pouvoir utiliser plutôt `min-width` ou `flex-basis`. Je vous laisse jouer un peu
avec histoire de vous faire la main.

> [Codepen un peu plus lisible](https://codepen.io/MoOx/pen/bPjyVm?editors=1100)

En fait je n’ai que cette astuce.

Je plaisante à peine. Car si on ajoute à cela le côté malin de
`overflow: hidden` pour cacher de l'information optionnelle, on peut faire des
trucs assez puissant.

Regardons ça avec un exemple plus complexe: on va imaginer le header d'un site.

En appliquant cette technique à l’extrême, (ce qui n’est pas une quantité de
travail astronomique, et reste quelque chose de propre et tout à fait
maintenable, surtout avec une approche composant et non document) on peut se
retrouver avec un code très simple, sans MQs qui donnerait les rendus suivant:

<iframe
    allowtransparency="true" allowfullscreen="true" scrolling="no" frameborder="no"
    height="300" style="width: 1000px; margin: auto;"
    title="Responsive without MQs, real world example"
    src="//codepen.io/MoOx/embed/WqKBGm/?height=300&theme-id=light&default-tab=result"  >
</iframe>

<iframe
    allowtransparency="true" allowfullscreen="true" scrolling="no" frameborder="no"
    height="300" style="width: 100%; max-width: 300px;"
    title="Responsive without MQs, real world example"
    src="//codepen.io/MoOx/embed/WqKBGm/?height=300&theme-id=light&default-tab=result"  >
</iframe>

```html
<todo />
```

> [Code de cette example sur Codepen](https://codepen.io/MoOx/pen/WqKBGm)

Des exemples de ce type là, surtout en exploitant bien flex-basis, peuvent se
révéler extrêmement puissants. On peut très bien se contenter ça. Après comme
souvent lorsqu’on avoir des besoins plus complexes, il sera à vous de juger si
continuer à utiliser cette technique est pertinent, ou s’il est plus judicieux
d’utiliser des MQs afin d’éviter de vous défoncer le cerveau. Ou alors de faire
du rendu conditionnel avec JavaScript si votre platforme vous le permet.

Cette technique est aussi intéressante dans un contexte où les media queries ne
sont pas accessibles. Ce peut être le cas si vous utilisez un framework ou une
lib qui ne propose qu’un sous-ensemble de CSS, comme React Native, qui vous
limitera dans l'ensemble à flex-box et position absolute pour gérer votre
layout.

On peut aussi se retrouver à utiliser le même moteur que React Native sur
plusieurs plateformes directement avec [Yoga](http://yogalayout.com) ou
[Stretch](https://vislyhq.github.io/stretch/).

On pourrait aussi avoir la même envie si on se retrouve dans un contexte Web où
CSS serait utilisable, mais où l’on se retrouve avec une abstraction qui ne
permet pas de les intégrer simplement. Vous allez peut-être répondre : « mais il
est fou ? Il se fait du mal »

Peut-être un peu. À moins qu’une des contraintes choisies soit de partager du
code entre différentes plates-formes (coucou
[react-native-web](https://github.com/necolas/react-native-web),
[react-native-windows](https://github.com/microsoft/react-native-windows),
[react-native-macos](https://github.com/ptmt/react-native-macos)...) afin
d'éviter de faire une grosse app qui te bouffe bien la RAM car basé sur Electron
(coucou Slack).

Dans tous les cas, media queries disponibles ou pas, cette astuce est pour moi
bien plus que ça puisque c'est devenu ma principale méthode pour faire du
responsive, faisant beaucoup d'appli React Native et/ou React Native Web.

Rien que pouvoir avoir le même composant produisant différents rendus sur un
même écran (en fonction de la taille disponible par son parent), ça devrait vous
donner envie!

```reason
[|"Bisous", "À la prochaine"|]
|> Js.Array.joinWith(" et ")
|> Js.log;
```
