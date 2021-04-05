---
title: Le web mérite de meilleures primitives
date: 2021-04-05
author: zoontek
slug: le-web-merite-de-meilleures-primitives
---

Il est souvent reproché aux développeurs front-end d'utiliser des abstractions
inutilement complexes sous couvert d'une volonté à "s'amuser" avec celles-ci
plutôt que de concevoir des sites simples, accessibles et performants.

Personnellement, j'apprécie énormément
[react-native-web](https://necolas.github.io/react-native-web/) et ai tendance à
m'en servir systématiquement et ce même si la plupart du temps il n'est même pas
question de partage de code avec une application mobile.

Ce qui veut dire que je suis régulièrement tenu d'écrire du code de la sorte:

```tsx
import { Pressable } from "react-native";

<Pressable
  accessibilityRole="button"
  style={({ hovered, focused, pressed }) => [
    { backgroundColor: "red" },
    hovered && { backgroundColor: "blue" },
    focused && { backgroundColor: "green" },
    pressed && { backgroundColor: "pink" },
  ]}
>
  Click me
</Pressable>;
```

Vous allez me dire que c'est horrible. J'utilise une `<div>` en lieu et place
d'un `<button>`, du CSS-in-JS pour styliser mon élément et je fais même
totalement l'impasse sur l'usage des pseudo-classes `:hover` et `:focus`!

Pourquoi diable s'acharner à réimplémenter ce qui existe de base sur la
plateforme web et qui fonctionne bien?

## Qui fonctionne bien, vous êtes sûrs?

Déconstruisons donc cet exemple. Je souhaite créer un bouton rouge qui sera bleu
au survol, vert quand il aura le focus et rose quand il sera pressé.

### Le cas du survol

Implémentons notre solution naïvement:

```html
<button>Click me</button>
```

```css
button {
  appearance: none;
  background-color: red;
}

button:hover {
  background-color: blue;
}
```

Cela ne suffira pas. En effet, mon bouton deviendra bleu lors d'un appui sur
smartphone ou autre appareil tactile.

![Bouton bleu](/public/images/articles/2021-04-05-le-web-merite-de-meilleures-primitives/BlueButton.png)

Heureusement, il existe une bride de solution: le media query
[`hover`](https://developer.mozilla.org/fr/docs/Web/CSS/@media/hover).

> hover est une caractéristique média CSS (cf. @media) qui permet de vérifier si
> le dispositif de saisie/d'entrée principal permet à l'utilisateur de survoler
> les éléments.

Il serait donc possible de corriger le problème de la sorte:

```css
button {
  appearance: none;
  background-color: red;
}

@media (hover: hover) {
  button:hover {
    background-color: blue;
  }
}
```

Sauf qu'encore une fois, tout cela reste imparfait. Depuis peu, il est devenu
possible d'utiliser un périphérique de pointage (type souris donc, avec son
curseur) sur iPad et, je vous le donne en mille, le dispositif d'entrée
principal restant l'écran tactile, les styles présents dans le media query en
question ne seront pas activés lors du survol du curseur.

L'affaire serait donc insoluble? Pas nécessairement, mais résoudre tous les
problèmes inhérents à chaque appareil et situation afin de normaliser le
comportement de cette interaction pourtant basique n'est au final pas mince
affaire, comme peuvent l'attester l'implémentation des abstractions offertes par
[`react-native-web`](https://github.com/necolas/react-native-web/blob/0.15.5/packages/react-native-web/src/modules/useHover/index.js)
ou
[`@react-aria`](https://github.com/adobe/react-spectrum/blob/react-aria%403.5.0/packages/@react-aria/interactions/src/useHover.ts).

### Le cas du focus

Rebelote, traitons le problème naïvement:

```css
button {
  appearance: none;
  background-color: red;
}

button:focus {
  background-color: green;
}
```

Tout comme pour le cas du survol, cette solution est loin d'être parfaite
puisque le style appliqué normalement au focus sera visible au clic.

<img alt="Bouton vert" src="/public/images/articles/2021-04-05-le-web-merite-de-meilleures-primitives/GreenButton.png" style="max-width: 180px">

Pire encore, l'apparition du **focus-ring**, pourtant indispensable à une bonne
navigation au clavier, poussera grand nombre de développeurs non sensibilisés au
sujet à appliquer le fameux `outline-style: none` et à anéantir une grande part
de l'accessibilité du site au passage.

Mais tout comme le cas du survol, il existe une bride de solution: la
pseudo-classe
[`:focus-visible`](https://developer.mozilla.org/fr/docs/Web/CSS/:focus-visible).

> La pseudo-classe :focus-visible s'applique lorsqu'un élément correspond à la
> pseudo-classe focus et que l'agent utilisateur détermine, via une heuristique,
> que le focus devrait être mis en évidence sur l'élément (la plupart des
> navigateurs affichent un contour en surbrillance par défaut).

Et tout comme le media query `hover`, cette solution reste imparfaite: si l'on
met de côté son support navigateur restreint à l'heure où je rédige cet article,
on peut également pointer du doigt le fait que le focus reste "cassé" en
JavaScript. En effet, il n'est pas encore question d'un événément
`focus-visible` et l'événement `focus` reste déclenché lors du clic sur certains
navigateurs.

Il vous sera donc très difficile de réagir à une réelle intention de focus, sauf
si, encore une fois, vous utilisez des abstractions offertes par
[`react-native-web`](https://github.com/necolas/react-native-web/blob/0.15.5/packages/react-native-web/src/modules/modality/index.js),
[`@react-aria`](https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/interactions/src/useFocusVisible.ts)
ou autre.

### Le cas du `<button>`

Reste un dernier point: l'usage d'une `<div>` à la place d'un `<button>`.
L'argument souvent avancé contre cela est le suivant:

> Utiliser une `<div>` pour réimplémenter un bouton en lieu et place d'un
> `<button>` peut ruiner l'accessibilité de celui-ci.

Je suis absolument d'accord avec ce point. Réimplémenter le comportement d'un
bouton en partant de zéro est complexe, vous ménera certainement à commettre un
tas d'erreurs et je vous le déconseille fortement.

Seulement ici ce n'est pas le cas: j'utilise une abstraction qui a correctement
été pensée et ne souffre d'aucun réel défaut d'accessibilité si on la compare à
un `<button>`. Sachant qu'en plus il y a encore très peu, les `<button>`
souffraient de
[problèmes de styling](https://bugs.chromium.org/p/chromium/issues/detail?id=700029#c24)
et que donc, il m'est nécessaire soit d'en tenir compte, soit de ne pas
supporter certaines versions de navigateurs pourtant récentes.

Si j'ai ce composant `<Pressable>` à ma disposition, qui a le bon goût de ne pas
souffrir des problèmes présentés plus tôt et réagit telle que la logique le
voudrait lors du survol, du focus ou encore de l'appui…Pourquoi devrais-js donc
m'en passer?

## Autres manques, en vrac

### Le focus-trapping

Afin de faciliter l'accessibilité clavier, il est important de "capturer" et de
borner le focus lors de l'apparition d'une modale, par exemple (ce qu'on appelle
communément le `focus-trapping`).

<figure>
  <img src="/public/images/articles/2021-04-05-le-web-merite-de-meilleures-primitives/FocusTrappingFail.png" />
  <figcaption>Exemple d'échec de focus trapping: il est possible de sélectionner le champ de recherche à l'aide de son clavier</figcaption>
</figure>

Il existe actuellement 2 potentielles solutions à ce problème. L'une, haut
niveau, est l'élément natif
[`<dialog>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/dialog),
l'autre, plus bas niveau (et plus intéressante selon moi) est l'attribut
[`inert`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/inert).
Ces solution ne sont malheureusement pour le moment pas très bien, voir pas du
tout, supportées par les navigateurs.

### Les popups

Tout comme les modales, elles sont présentes dans une majeure partie des
interfaces web actuelles et pourtant il n'existe actuellement aucune méthode
simple et sans abstraction qui nous permettent d'en créer une.

Dans un futur proche, peut-être (je l'espère) que
[la proposition de Microsoft](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/Popup/explainer.md)
sera retenue, mais en attendant, bon courage pour implémenter ça "à la main" si
vous souhaitez que celles-ci soient fonctionnelles sur tous les navigateurs,
tout type d'appareil et de surcroît parfaitement accessibles.

### Plus? Plus!

Qu'en est-il de tout ces besoins devenus quasiment primaires:

- Les masques sur les champs texte?
- Un élément `<switch>`?
- Les listes virtualisées (avec recherche fonctionnelle au sein de la page)?
- Le RTL (right-to-left) simplifié?
- Les containers queries en CSS?
- Le champ text `type=number`
  ([actuellement cassé](https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers/))?
- …la liste est potentiellement **infinie**

## Du coup, qu'est ce qu'on fait?

Avant tout, arrêtons de blâmer les développeurs qui découvrent aujourd'hui cette
complexité monstre et cessons de leur déconseiller d'utiliser des abstractions,
de leur dire de "juste apprendre HTML, CSS et JS" car ce comportement est
toxique et ne tiens pas compte d'une chose: si vous avez vu vécu l'évolution du
web et vu apparaitre des courants tels que le responsive design, de nouveaux
types d'appareils tels que les smartphones et eu le temps de vous adapter à ces
changements, ce n'est pas le cas de développeurs plus juniors qui se retrouvent
face à une quantité astronomique de problèmatiques.

L'accessibilité vous tiens à cœur? Parfait. Conseillez leur d'utiliser une
abstraction simple qui leur garantira un bon résultat, plutôt que de leur
conseiller de devenir un expert absolu sur le domaine afin de ne pas se tirer
une balle dans le pied. S'il sont intéressés par le sujet, ils se pencheront sur
la façon dont est conçue celle-ci, s'ils ne le sont pas, et bien, au moins les
utilisateurs de leurs sites bénéficieront d'une meilleure accessibilité. Et je
pense que c'est ce qui importe le plus: l'**objectif** est plus important que le
**moyen**.

Ensuite, posons nous réellement la question des ajouts continuels de solutions
de haut niveau dans la plateforme web, qui débarquent sans que jamais rien ne
semble êtré déprécié. En effet, les solutions données à chaque problème soulevé
précédemment viendront **en plus** de tout ce qui peut déjà exister. Une donnée
qui me semble par exemple, totalement absurde est le nombre de propriétés CSS
actuel:
[520 (+132 en attente)](https://css-tricks.com/how-many-css-properties-are-there/).
Outre le fait que cela rend extrêmement complexe l'apparition de nouveaux
navigateurs web, cela rend la charge mentale du développeur **incommensurable**.
Il en va de même avec l'évolution de la syntaxe JavaScript, l'augmentation du
nombre de sélecteurs CSS, l'apparition de
[nouvelles APIs](https://developer.mozilla.org/fr/docs/Web/API), etc.

Pour finir, imaginez que demain un nouveau paradigme d'utilisation apparaissait
(une interaction autre que le touch, par exemple) ou qu'un nouveau type de
pattern UI prenait de l'essort (comme a pu le faire le switch). Devrait-on
continuer à empiler…? Ou devrait-on accepter le fait que le web a plus que
jamais besoin d'abstractions au dessus de concepts bas niveau, que celles soient
des librairies éxécutées au runtime ou carrément des langages de plus haut
niveau qui compileront vers du HTML, CSS et JS en guise de bytecode?
