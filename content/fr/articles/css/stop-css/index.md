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

CSS est un langage horriblement dangereux, parce qu'il mèle des concepts complètement pétés et une folle capacité à faire confondre facilité et simplicité aux gens qui l'utilisent.

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
- Si associe plusieurs styles à un sélecteur, les derniers définis dans le CSS auront toujours la priorité
- Quelqu'un peut péter les styles d'un composants pour peu qu'il ne sache pas qu'un sélecteur est utilisé ailleurs

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

Si le style est défini dans l'attribut `style`, la spécificité est de 1,0,0,0. Si une valeur associée à une propriété est suffixée d'un `!important`, elle prend quoiqu'il arrive l'ascendance.

Si on résume, on nage en plein délire, la priorité se définit dans l'ordre par : la présence de `!important`, la façon de définir le style, la spécificité du sélecteur utilisé puis par l'ordre de définition dans l'ensemble des CSS de la page. Évidemment, à l'époque où avait qu'une pauvre petite feuille de style pour l'ensemble de son site, ça marchait ; plus maintenant.

### Les regressions

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

- Vous vous foutez d'avoir des regressions qui pètent votre site
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

Si ce constat peut aussi permettre à ceux et celles qui utilisent des CSS atomiques d'arrêter immédiatement:

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

quelque part, il y a deux cas:

- soit c'est chargé avant, et ça ne fait rien
- soit c'est chargé après, et ça override toutes les propriétés utilisant `--mainColor`. On est bien contents.

## Vous ne pouvez pas vous permettre de laisser tomber CSS ?

Dans ce cas, forcez vous à utiliser la [méthodologie BEM](/fr/articles/css/bem/). Ça ne réglera pas tout, mais au moins cela vous permettra d'éviter un maximum de conneries en vous forçant à découper en composants isolés, et à mieux maîtriser la priorisation, puisque le scope auquel vous devrez y veiller sera considérablement réduit:

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

JavaScript vous permet déjà de bénéficier d'un système de modules, de variables, de conditions, de fonctions réutilisables, et tout ça sans hack. En plus de ça, vous maitrisez la priorisation, parce c'est que c'est vous qui décidez ce qui s'applique:

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
