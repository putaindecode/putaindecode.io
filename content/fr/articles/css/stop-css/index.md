---
date: "2016-06-16"
title: Pourquoi j'ai arrêté d'utiliser CSS
tags:
  - css
  - style-inline
  - javascript
authors:
  - bloodyowl
---

CSS est un langage horriblement dangereux, parce qu'il mêle des concepts complètement pétés et une folle capacité à faire confondre facilité et simplicité aux gens qui l'utilisent.

## Qu'est-ce qui ne va pas ?

À l'origine, CSS a été conçu pour styler des documents, pas des applications. Du coup lorsqu'on doit *scale*, c'est rapidement douloureux.

### Les sélecteurs

Les sélecteurs sont des **variables globales mutables**. Lorsque vous faites :

```css
.selector {
  font-size: 1rem;
}
```

C'est comme si en JavaScript vous faisiez :

```javascript
window.selector = (window.selector || []).concat({
  fontSize: "1rem",
})
```

Ça veut dire que :

- La définition d'un style associé à un sélecteur peut être redéfinie ailleurs
- Si on associe plusieurs styles à un sélecteur, les derniers définis dans le CSS auront toujours la priorité
- Quelqu'un peut péter les styles d'un composant pour peu qu'il ne sache pas qu'un sélecteur est utilisé ailleurs

### La spécificité

Alors ça, c'est particulièrement drôle : la spécificité d'un sélecteur va définir la priorité d'application d'un style.

| Sélecteur | Spécificité |
| --- | --- |
| `*` | 0,0,0,0 |
| `li` | 0,0,0,1 |
| `li:first-line` | 0,0,0,2 |
| `ul li` | 0,0,0,2 |
| `ul ol+li` | 0,0,0,3 |
| `h1 + *[rel=up]` | 0,0,1,1 |
| `ul ol li.red` | 0,0,1,3 |
| `li.red.level` | 0,0,2,1 |
| `#x34y` | 0,1,0,0 |

Si le style est défini dans l'attribut `style`, la spécificité est de 1,0,0,0. Si une valeur associée à une propriété est suffixée d'un `!important`, elle prend quoi qu'il arrive l'ascendance.

Si on résume, on nage en plein délire, la priorité se définit dans l'ordre par : la présence de `!important`, la façon de définir le style, la spécificité du sélecteur utilisé puis par l'ordre de définition dans l'ensemble des CSS de la page. Évidemment, à l'époque où on n'avait qu'une pauvre petite feuille de style pour l'ensemble de son site, ça marchait ; plus maintenant.

### Les régressions

Prenons un exemple tout bête :

```css
.item {
  display: block;
  font-size: 1rem;
  color: blue;
}

.some-context .item {
  display: inline-block;
  color: red;
}
```

Quelqu'un de la team modifie `.item` :

```diff
 .item {
   display: block;
   font-size: 1rem;
   color: blue;
+  border: 1px solid red;
 }

 .some-context .item {
   display: inline-block;
   color: red;
}
```

Super, une regression dans `some-context`. Face à ça, deux possibilités :

- Vous vous foutez d'avoir des régressions qui pètent votre site
- À chaque changement minime du CSS vous vérifiez l'intégralité du site et testez tous les comportements dans tous les contextes.

### Le choix de priorisation des styles

Ce serait pas mal de décider quel `className` est appliqué en priorité :

```html
<div class="blue red">text</div>
<div class="red blue">text</div>
```

mais bien évidemment non, comme vu plus haut, c'est le foutu ordre de définition des sélecteurs qui décide. Je vous laisse imaginer le bordel si on charge les feuilles de style à la demande, selon les actions utilisateur.

```css
.blue { color: blue; }
.red { color: red; }
```

C'est pire si vous utilisez un préprocesseur tel que Sass et LESS. Lorsque vous faites un :

```css
.blue {
  color: blue;
}

.red {
  color: red;
}

.my-selector {
  @extend .red;
  @extend .blue;
}
```

Vous imaginez que `.blue` étant appliqué après dans `.my-selector`, il va prendre la priorité. EH BAH NON, c'est `.red`, parce que sa déclaration est située après `.blue`.

Si ce constat peut aussi permettre à ceux et celles qui utilisent des CSS atomiques d'arrêter immédiatement :

```css
.relative { position: relative; }
.absolute { position: absolute; }
.static { position: static; }
```

Dans le cas précédent, si vous ajoutez une classe `relative` à un élement ayant déjà la classe `static`, ça ne changera rien du tout, parce que `.static` est défini après `.relative`. Génial, non ?

### Le futur de CSS

Les variables sont une feature qui a été très demandée à CSS. Mais cette feature va débarquer avec son lot de souci :

```css
:root {
  --mainColor: blue;
}

body {
  color: var(--mainColor);
}
```

C'est super, mais si quelqu'un vient ajouter :

```css
:root {
  --mainColor: red;
}
```

quelque part, il y a deux cas :

- soit c'est chargé avant, et ça ne fait rien
- soit c'est chargé après, et ça override toutes les propriétés utilisant `--mainColor`. On est bien contents.

## Vous ne pouvez pas vous permettre de laisser tomber CSS ?

Dans ce cas, forcez vous à utiliser la [méthodologie BEM](/fr/articles/css/bem/). Ça ne réglera pas tout, mais au moins cela vous permettra d'éviter un maximum de conneries en vous forçant à découper en composants isolés, et à mieux maîtriser la priorisation, puisque le scope auquel vous devrez y veiller sera considérablement réduit :

```css
/* Header.css */
.Header {}

  .Header-nav {}

/* Nav.css */
.Nav {}

  .Nav-item {}

    .Nav-item--active {}
```

C'est quand même plus pratique à comprendre, non ?

Encore mieux, si vous avez du tooling à la webpack, vous pouvez utiliser les [CSS modules](/fr/articles/css/modules/), qui limiteront de même le scope d'application de vos feuilles de style.

## Vous pouvez vous permettre de laisser tomber CSS ?

JavaScript vous permet déjà de bénéficier d'un système de modules, de variables, de conditions, de fonctions réutilisables, et tout ça sans hack. En plus de ça, vous maitrisez la priorisation, parce c'est que c'est vous qui décidez ce qui s'applique :

```javascript
class MyComponent extends React.Component {
  render() {
    const { active, disabled } = this.props
    return (
      <div
        style={{
          ...styles.myComponent,
          ...active ? styles.active : null,
          ...disabled && !active ? styles.disabled : null,
        }}
      >
        tadaa
      </div>
    )
  }
}

const styles = {
  myComponent: {
    fontSize: 18,
  },
  active: {
    textDecoration: "underline",
  },
  disabled: {
    opacity: 0.5,
  },
}
```

Par ailleurs, avec certaines bibliothèques permettant naturellement l'usage d'inline-styles (comme React), cela vous donne la possibilité d'avoir le style et le markup dans le même fichier, sans avoir besoin de naviguer entre les onglets de votre éditeur (vous pouvez cependant séparer en plusieurs fichiers si ça vous fait plaisir).

En résumé, utiliser JS pour définir et appliquer les styles vous permet de prendre le contrôle sur le styling de vos composants, tout en apportant le confort d'un langage offrant naturellement de nombreux avantages. Si vous êtes bloqués avec CSS, partez sur les CSS modules ou la méthologie BEM selon vos possibilités. Le but, c'est d'éliminer les [7 maux de CSS](https://github.com/necolas/react-native-web/blob/master/docs/guides/style.md).

Bisous bisous.

## Edit

Afin de répondre aux diverses incompréhensions et commentaires en réponse à l’article, voilà un follow-up qui va tenter d’aller plus en profondeur dans la critique de CSS.

Je vais donc répondre à [l’article de Daniel Glazman](http://www.glazman.org/weblog/dotclear/index.php?post/2016/06/18/Pourquoi-il-n-aurait-pas-du-arrêter-d-utiliser-CSS), ancien co-chairman du CSS Working Group.

Le premier point n’a rien à voir avec le sujet, mais l’auteur fait un parallèle entre la réassignation dans JS et la mutabilité et absence de scope des sélecteurs CSS. La comparaison n’a pas lieu d’être, parce que JS est un langage de programmation. De plus, en JS, les variables ont une portée, et l’opérateur `const` existe pour prévenir la réassignation. `</digression>`

Le grand problème de l’état actuel des sélecteurs CSS, c’est qu’ils n’offrent naturellement aucune API (hors *Shadow DOM*) permettant de limiter le scope d’un sélecteur sans augmenter sa spécificité. Si je veux ajouter des propriétés de style à un élément comportant un certain sélecteur dans un certain contexte, je suis obligé d’avoir connaissance de tous les sélecteurs correspondant potentiellement à cet éléments, de vérifier leur spécificité, et possiblement d’adapter le sélecteur simple que j’envisageais à l’origine pour pallier le manque de spécificité. Super, ma codebase contient maintenant des sélecteurs différents de leur sens original dans le simple but de les appliquer.

Lorsque je lis la réaction épidermique de l’auteur face à BEM, une méthodologie ajoutant un namespace pour simuler ce scope côté utilisateur qui apporte un minimum de sécurité lorsque l’on travaille sur un projet à grande échelle, j’avoue un peu flipper quant à la conception des spécifications CSS.

BEM est une réponse de la communauté d’utilisateurs à plusieurs soucis qu’ils ont rencontrés dans leurs utilisations variées de CSS. On dirait même dans sa réponse qu’il n’a pas pris le temps de se renseigner sur la nature de la méthodologie, qui ne consiste selon lui qu’à ajouter des indentations dont on se fout parce que CSSOM les ignore. WTF.

Ignorer le feedback que constitue l’apparition de cette méthodologie et dénigrer les utilisateurs pour qui elle règle des problèmes posés par le laxisme du langage, ça ne fait pas avancer le langage, et ça ne donnera certainement pas envie de retourner à CSS.

Concernant la spécificité des sélecteurs, évidemment qu’une quantité astronomique de sites utilise les sélecteurs CSS, simplement parce qu’ils n’ont pas eu d’alternative viable. Ça n’en fait pas une fonctionnalité bien conçue pour autant.

Sur les régressions, l’idée à comprendre, c’est que l’absence de scope et de namespace dans le langage peut créer des régressions potentiellement partout dans un large site, parce qu’un sélecteur est global. Il n’y a pas moyen de sécuriser un rayon d’action pour travailler, à moins de gérer le namespace soi-même, dans le sélecteur.

Concernant le choix de priorisation des styles, c'est un fait que l'ordre de la `DOMTokenList` n’a pas d'importance actuellement, et je ne fais que déplorer qu’en utilisant des sélecteurs, le choix de l’application des styles ne puisse pas se faire à l’endroit où l’élément est utilisé, avec la connaissance précise de son contexte.

Sur le futur de CSS, le reproche que je dresse n'est pas comme ce qui est interprété dans le post de l'auteur, disant que je râle parce que si l'on fait un parallèle avec JS, on aurait :

```javascript
var a = 1
var a = 2
alert(a)
// alerts 2
```

C’est un comportement parfaitement attendu. Et ce n’est pas ce que j’ai dit, je reproche à CSS de faire en sorte que, si l’on fait encore le parallèle :

```javascript
// coucou c'est CSS
var a = 1
alert(a)
var a = 2
// alerts 2
```

Sur ma proposition alternative, outre être *“une horreur non-maintenable, verbeuse et error-prone”*, on va regarder ce que ça donne sur un cas plus simple :

```javascript
import React, { Component } from "react"
// un système de modules analysable statiquement
import { mainBlue, mainRed } from "../utils/Colors"

export default (props) => {
  return (
    // on peut appliquer un style dont le rayon d'action est par définition
    // limité à l’élément sur lequel on le place
    <div style={styles.container}>
      {list.map((item, index) =>
        <div style={styles.item}>
          <span
            style={{
              ...styles.text,
              // appliquer un style conditionné par le contexte est très simple
              // et permet de prioriser à la définition du markup
              ...index % 2 === 0 && styles.oddText,
            }}
          >
            {item.text}
          </span>
        </div>
      )}
    </div>
  )
}

// la feuille de style est limitée au module
const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
  },
  item: {
    flexBasis: 200,
  },
  text: {
    // peut utiliser des variables qui ne seront pas écrasées si j'en définis
    // une avec le même nom ailleurs dans l'app
    color: mainBlue,
  },
  oddText: {
    color: mainRed,
  },
}
```

C’est juste une application d’une approche centrée sur les composants. L’important, c’est d’isoler ces composants pour les rendre facilement réutilisables, prévenir les effets de bord, et passer moins de temps à essayer de travailler avec des propriétés du langage qui nous gênent dans notre travail de tous les jours. Réduire la liberté d’utilisation permet ici d’apporter des propriétés (immutabilité des styles, application déterministe des styles, scope) qui nous permettent de raisonner notre code de manière beaucoup plus simple.

Si l’on regarde du côté des CSS modules, qu’est-ce que ça fait exactement ? La même chose. Le tooling va limiter le scope d’une feuille de style en rendant opaques et globalement uniques les sélecteurs. Le CSS peut être utilisé en target de compilation sans problème, et la plupart des solutions rendant son utilisation confortable font une chose simple : contraindre à une utilisation plus stricte en masquant des parties trop laxistes du langage. C’est ce que le tooling JS a connu depuis quelques années, et on ne s’en porte que mieux.

Le dernier argument utilisé est que « si le monde entier a adopté CSS (y compris le monde de l'édition qui vient pourtant de solutions assez radicalement différentes du Web), c'est bien parce que c'est bien et que ça marche ». Qu’est-ce qu’on peut répondre sinon que CSS a été adopté avant que les besoins du web n'aient suffisamment évolué pour que CSS dans son état actuel ait un énorme potentiel de fragilisation d’une codebase. Ne pas remettre en question le langage parce que ses utilisateurs n’ont pas d’alternative, c’est condamner le langage. C’est comme si la SNCF disait « BOARF ça sert à rien de faire arriver les trains à l’heure, vu que tout le monde le prend déjà c’est que c’est nickel ». Du coup, faut pas venir s’étonner que certains de ces utilisateurs aillent chercher des alternatives ailleurs.

En conclusion, je déplore vraiment l'absence d'intérêt apparent de l'auteur pour écouter le feedback des utilisateurs sur les problèmes d'un langage. Il faut regarder ailleurs, et ne pas ignorer ou mépriser ce que les utilisateurs font de leur côté pour travailler plus sainement, ça pourrait même donner des idées pour améliorer ce qui fait perdre du temps aux utilisateurs.
