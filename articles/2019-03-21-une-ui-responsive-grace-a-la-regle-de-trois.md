---
date: 2019-03-21
title: "Une UI responsive grâce à la règle de trois"
author: zoontek
slug: une-ui-responsive-grace-a-la-regle-de-trois
---

Vous venez de coder un composant `TwitterButton` (avec React, Vue, en suivant une méthodo BEM, OOCSS, ou autre: c'est comme vous voulez) et franchement c'est du beau boulot: le rendu est vraiment très joli, kudos au designer.

Seulement très vite, ce dernier jette un coup d'oeil à la recette et vous fait un petit retour parce qu'il :

1. vous a fait parvenir des maquettes "mobile-first" et trouve le résultat "un peu petit sur son iMac 27 pouces"
2. vous a fait parvenir des maquettes "desktop-first" et trouve le résultat "un peu gros sur son iPhone XS"

Vous ajoutez donc quelques media queries pour adapter le style de ce bouton en fonction de la largeur du viewport. Ses dimensions changent maintenant lorsque la page fait plus de `768px` de large, puis lorsqu'elle fait plus de `968px` et enfin plus de `1200px`. Un chouia fastidieux.

Vous pestez un peu sur votre collègue qui aurait dû vous fournir toutes les maquettes (alors qu'il n'a pas forcément eu le temps) et lui peste car vous l'avez dérangé toutes les 2 minutes pour obtenir ces mesures intermédiaires.

Il vous reste 72 composants à coder. Super ambiance dans les bureaux 👏🏼

Plutôt que de demander à votre supérieur Jean-Michel de prendre parti pour résoudre ce problème, nous allons faire appel aux **MATHS**.

## L'interpolation linéaire entre 2 valeurs

Des termes foutrement complexes pour définir quelque chose de très simple: il s'agit de faire transiter une valeur **_γ_** de **_α_** à **_β_** de façon linéaire et dans notre cas borné dans un intervalle donnée.

![Explication schématisée de l'interpolation linéaire bornée](/images/articles/2019-03-21-une-ui-responsive-grace-a-la-regle-de-trois/linear-interpolation.png)

En partant de ça, nous allons définir une UI fluide à l'aide de 3 variables :

- `baseFontSize: number (px value)`
- `scaleRatio: number (abs value)`
- `fluidRange: [number (px value), number (px value)]`

Prenons l'exemple d'un site web où, en mobile-first, la taille de police par défaut (`baseFontSize`) est de `16px`. On souhaiterait que celle-ci soit de `20px` lorsque le viewport fait plus de `1600px` de large (donc que le coefficient d'agrandissement - `scaleRatio` - soit de `20 / 16 = 1.25`) et que la transition pour passer de 16 à 20 ne se déclenche pas avant que le viewport fasse **au moins** `480px` de large.

![Exemple d'interpolation linéaire bornée avec valeurs](/images/articles/2019-03-21-une-ui-responsive-grace-a-la-regle-de-trois/linear-interpolation-with-values.png)

La fonction suivante va nous permettre d'obtenir cette fameuse interpolation linéaire sous le forme d'une formule CSS avec `calc()` :

```js
// on utilise JS, puisqu'on ne peut pas déclarer de fonction en CSS

let getLinearInterpolation = (
  baseFontSize, // number
  scaleRatio, // number
  fluidRange, // [number, number]
) => {
  let maxFontSize = baseFontSize * scaleRatio;
  let [rangeStart, rangeEnd] = fluidRange;
  let multiplier = (baseFontSize - maxFontSize) / (rangeStart - rangeEnd);
  let fixed = maxFontSize - multiplier * rangeEnd;

  return `calc(${fixed}px + ${100 * multiplier}vw)`;
};
```

Si vous copiez-collez ça comme un sagouin dans la console devtools de votre navigateur web et tentez un essai avec les valeurs de notre exemple, vous obtiendrez normalement :

![Le résultat de notre appel de fonction](/images/articles/2019-03-21-une-ui-responsive-grace-a-la-regle-de-trois/devtools-result.png)

Voyons maintenant comment nous servir de ça.

## Un coefficient d'agrandissement global

L'intérêt de cette valeur, c'est qu'elle va nous permettre de modifier toutes les dimensions que l'on veut de façon progressive et **proportionnelle**.

Petit exemple, simple, basique :

```html
<html>
  <body>
    <h1 class="title">Hello world</h1>
    <div class="red-block"></div>
  </body>
</html>
```

```scss
// on utilise SCSS, puisqu'on ne peut pas déclarer de fonction en CSS

html {
  font-size: 16px; // baseFontSize
}

@media (min-width: 480px /* fluidRange start */) {
  html {
    // l'interpolation linéaire
    font-size: calc(14.285714285714285px + 0.35714285714285715vw);
  }
}

@media (min-width: 1600px /* fluidRange end */) {
  html {
    font-size: 20px; // baseFontSize * scaleRatio
  }
}

// fonction utilitaire pour nous éviter de diviser chaque valeur par 16
// car par défaut dans les navigateurs, 1rem = 16px
// si vous utilisez du CSS-in-JS, c'est facilement faisable également
@function fluid($value) {
  @return $value / 16 + rem;
}

.title {
  // si la page fait moins de 480px de large, la font-size sera de 24px
  // si la page fait plus de 1600px de large, la font-size sera de 24 * 1.25 = 30px
  // si la page fait entre 480px et 1600px de large, la font-size sera fluide entre 24px et 30px
  font-size: fluid(24);
}

.red-block {
  background-color: red;
  // pareil avec la hauteur et la largeur de notre div
  // avec au minimum 100px et au maximum 100 * 1.25 = 125px
  height: fluid(100);
  width: fluid(100);
}
```

<figure>
  <a href="/images/articles/2019-03-21-une-ui-responsive-grace-a-la-regle-de-trois/basic-example-result.gif">
    <img src="/images/articles/2019-03-21-une-ui-responsive-grace-a-la-regle-de-trois/basic-example-result.gif" alt="résultat quand on joue sur la largeur du viewport" />
  </a>
  <figcaption>(Cliquez sur le gif pour le voir en taille réelle)</figcaption>
</figure>

## Forcer une font-size par défaut, c'est MAL

_(On va se mentir et tenter d'ignorer le fait que tout le monde utilise le zoom)_

En effet, l'utilisateur peut toujours choisir d'avoir une taille de police plus petite ou plus grande que celle par défaut (`16px`), et c'est franchement pas très accessible de forcer.

On va donc modifier notre fonction JS et tenir compte de ça.

```js
let getCSSFluidConfig = (
  baseFontSize, // number
  scaleRatio, // number
  fluidRange, // [number, number]
) => {
  let toRem = value => value / 16;

  let maxFontSize = baseFontSize * scaleRatio;
  let baseRemFontSize = toRem(baseFontSize);
  let maxRemFontSize = toRem(maxFontSize);

  let [rangeStart, rangeEnd] = fluidRange;
  // on évite rem pour les media queries: merci Safari
  // pas de soucis pour utiliser toRem malgré tout:
  // les media queries sont à la racine du document
  let emRangeStart = toRem(rangeStart);
  let emRangeEnd = toRem(rangeEnd);

  let multiplier =
    (baseRemFontSize - maxRemFontSize) / (emRangeStart - emRangeEnd);
  let fixed = maxRemFontSize - multiplier * emRangeEnd;

  // on en profite également pour retourner l'intégralité du CSS généré
  return `html { font-size: ${baseRemFontSize}rem }

@media (min-width: ${emRangeStart}em) {
  html { font-size: calc(${fixed}rem + ${100 * multiplier}vw) }
}

@media (min-width: ${emRangeEnd}em) {
  html { font-size: ${maxRemFontSize}rem }
}`;
};
```

<!-- ![Le résultat de notre appel de fonction](/images/articles/2019-03-21-une-ui-responsive-grace-a-la-regle-de-trois/devtools-responsive-result.png) -->

Et voilà ! Ça continue de faire ce que l'on veut, mais en prenons en compte la taille de police par défaut définie par l'utilisateur.

## Un exemple un peu plus complexe

Vous vous êtes empressé d'embêter le designer à nouveau afin de déterminer ces 3 variables ensemble: ça sera donc une `font-size` comprise entre `16px` et `18px` (donc une UI qui scale jusqu'à `18 / 16` = `1.125` …vous êtes encore frileux à l'idée) entre `480px` et `1440px` !

Il est maintenant temps de modifier ce fameux bouton.

```js
getCSSFluidConfig(16, 1.125, [480, 1440]);

/* -> "html { font-size: 1rem }

@media (min-width: 30em) {
  html { font-size: calc(0.9375rem + 0.20833333333333334vw) }
}

@media (min-width: 90em) {
  html { font-size: 1.125rem }
}" */
```

```scss
// notre code généré

html {
  font-size: 1rem;
}

@media (min-width: 30em) {
  html {
    font-size: calc(0.9375rem + 0.20833333333333334vw);
  }
}

@media (min-width: 90em) {
  html {
    font-size: 1.125rem;
  }
}

// fonctions utilitaires

@function fluid($value) {
  @return $value / 16 + rem;
}

// le reste de notre CSS

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

.twitter-btn {
  align-items: center;
  display: flex;
  background-color: #1da1f3;
  border: 1px solid #218de4; // il ne serait pas logique que border-width soit fluide
  border-radius: 4px; // idem pour border-radius
  padding: fluid(4);
  padding-right: fluid(8);
  box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.25);
}

.twitter-btn svg {
  height: fluid(24);
  width: fluid(24);
}

.twitter-btn span {
  color: #fff;
  font-size: fluid(14);
  margin-left: fluid(4);
}
```

Ainsi,

- la `font-size` par défaut fera entre `1rem` et `1.125rem`<br/>(`16px` et `18px`si réglage navigateur par défaut)
- le `padding` de `.twitter-btn` fera entre `0.25rem` et `0.28125rem`<br/>(`4px` et `4.5px`)
- la `height` et la `width` du svg feront entre `1.5rem` et `1.6875rem`<br/>(`24px` et `27px`)
- etc… vous avez l'idée, tout reste proportionnel.

<figure>
  <a href="/images/articles/2019-03-21-une-ui-responsive-grace-a-la-regle-de-trois/twitter-button-result.gif">
    <img src="/images/articles/2019-03-21-une-ui-responsive-grace-a-la-regle-de-trois/twitter-button-result.gif" alt="résultat quand on joue sur la largeur du viewport" />
  </a>
  <figcaption>(Cliquez sur le gif pour le voir en taille réelle)</figcaption>
</figure>

La différence est **très subtile** (mais vous étiez frileux). L'avantage, c'est que si vous changez d'avis dans 3 semaines pour finalement passer sur un agrandissement de **x1.5** à `2560px` de large, il vous suffira générer un nouveau ce petit bout de code, de copier/coller les quelques lignes obtenues au début de votre fichier CSS …et c'est tout ! Inutile de revenir dans les composants ou de refaire un quelconque calcul.

Pour que ce soit plus simple, je vous ai concocté un petit générateur en ligne :

<iframe
  width="100%"
  height="520"
  style="border: 2px solid rgba(0,0,0,0.1); border-radius: 10px"
  src="/misc/articles/2019-03-21-une-ui-responsive-grace-a-la-regle-de-trois/generator.html">
</iframe>

Il ne vous qu'à profiter de toute ces heures gagnées en invitant votre (maintenant pote) graphiste à boire une bière ! 🍻
