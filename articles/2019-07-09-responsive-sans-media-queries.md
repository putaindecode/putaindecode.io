---
date: 2019-07-09
title: Du responsive sans media queries
author: MoOx
slug: responsive-sans-media-queries
---

Disclaimer: Avant de commencer à rentrer dans la technique je vais tout d’abord
répondre à la question que beaucoup de monde doit déjà se poser: pourquoi ?

## Pourquoi voudrais-tu faire du responsive sans media queries ?

Il suffit que je me retrouve avec une abstraction où elles ne sont pas
facilement ou nativement accessible. Ce qui peut être le cas si vous utiliser un
framework ou une lib qui ne propose qu’un sous-ensemble de CSS.

Pour rentrer dans le concret on peut imaginer un scénario du type : je suis en
train de faire une application avec React Native, et je n’ai pas accès à toutes
les spécifications que propose CSS. Je dois me contenter d’un sous-ensemble
disponible (dans ce context: en gros flex-box et position absolute).

On peut aussi se retrouver à utiliser le même moteur que React Native sur
plusieurs plateformes directement avec [Yoga](http://yogalayout.com) ou
[Stretch](https://vislyhq.github.io/stretch/).

On pourrait aussi avoir la même envie si on se retrouve dans un contexte Web où
CSS serait utilisable, mais où l’on se retrouve avec une abstraction qui ne
permet pas de les intégrer simplement. Vous allez peut-être répondre : « mais il
est fou ? Il se fait du mal »

Peut-être un peu. À moins qu’une des contraintes choisi soit de partager du code
entre différentes plates-formes (cocou
[react-native-web](https://github.com/necolas/react-native-web),
[react-native-windows](https://github.com/microsoft/react-native-windows),
[react-native-macos](https://github.com/ptmt/react-native-macos)...) afin
d'éviter de faire une grosse app qui te bouffe bien la RAM car basé sur Electron
(coucou Slack).

Encore une fois [tout est question de compromis](/articles/tradeoffs).

## De toute façon les media queries c'est pas ouf

Il reste quelque chose de contre intuitif avec les MQs: elles permettent de
cibler une taille d’écran, et non pas de cibler la taille disponible pour un
élément donné.

On pourrait se dire que dans ce contexte, il serait plus pertinent d’utiliser
quelque chose comme `window.matchMedia`.

Mais si on veut en plus de tout ça faire du SSR... 🤯

Bref, il y a plusieurs raisons pour vouloir faire du responsive sans utiliser
les MQs.

## Comment faire du responsive sans media queries

Rentrons dans le vif du sujet pour ceux qui qui serait intéressé par cette
opportunité. Voici donc quelques astuces et pratiques que je vais vous livrer.

Première chose à bien visualiser nous allons partir du principe que nous voulons
nous contenter de Flex box. On peut faire donc des lignes et des colonnes.

Pour les colonnes, c’est très souvent moins problématique. Tout simplement par
ce que l’on scroll le plus souvent verticalement. Je ne vais donc pas
spécialement aborder cette axe là et me concentrer sur l’axe horizontal, mais en
changeant d’axe les pratiques seront toutes aussi pertinente selon votre besoin.

Alors que faire ? Par quoi on commence ?

On va prendre un exemple très simple où je me retrouve avec une ligne et trois
blocs intérieur. Dès que c’est possible je veux que ces trois blocs soient sur
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
    height="300" style="width: 100%;"
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
    height="300" style="width: 100%;"
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

Imaginons que ce rendu n’est pas forcément souhaitable dans notre contexte.
Formulé autrement: **c’est marges sont sacrément dégueulasse**.

Pour être précis, elles ne sont pas adaptés à nos contraintes et au rendu que
l’on souhaite avoir: on se retrouve avec un bout de marge perdu à un endroit où
l’on a pas vraiment envie qu’il se trouve.

Du coup comment qu’on fait ?

Petite technique facile à mettre en place et efficace : on va tout placer des
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
pouvoir vous utilisez plutôt `min-width` ou `flex-basis`. Je vous laisse jouer
un peu avec histoire de vous faire la main.

> [Codepen un peu plus lisible](https://codepen.io/MoOx/pen/bPjyVm?editors=1100)

En fait je n’ai que cette astuce.

Je ne plaisante à peine. Car si on ajoute à cela le côté malin de
`overflow: hidden` pour cacher de l'information optionel, on peut faire des
trucs assez puissant.

Regardons ça avec un exemple plus complexe: on va imaginer le header d'un site.

En appliquant cette technique à l’extrême, (ce qui n’est pas une quantité de
travail astronomique, et reste quelque chose de propre et tout à fait
maintenable, surtout avec une approche composant et non document) on peut se
retrouver avec un code très simple, sans MQs qui donnerait les rendus suivant:

<iframe
    allowtransparency="true" allowfullscreen="true" scrolling="no" frameborder="no"
    height="300" style="width: 100%;"
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
révéler extrêmement puissant. On peut très bien se contenter ça. Après comme
souvent lorsqu’on avoir des besoins plus complexe, il sera à vous de juger si
continuer à utiliser cette technique est pertinent, ou s’il est plus judicieux
d’utiliser des MQs afin d’éviter de vous défoncer le cerveau. Ou alors de faire
du rendu conditionnel avec `window.matchMedia` si votre platforme vous le
permet.

```reason
["Bisous", "À la prochaine"]
  ->Js.Array.joinWith(" et ")
  ->Js.log;
```
