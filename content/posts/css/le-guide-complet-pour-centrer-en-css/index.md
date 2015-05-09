---
date: "2014-09-23"
title: Le guide complet pour centrer en css
tags:
  - css
authors:
  - Nyalab
---

Centrer en css, c'est la base, et parfois, ce n'est pas si simple. Ce guide vous servira donc pour vous lister les techniques les plus connues pour réaliser ce fameux effet centré.

Les principales techniques de centrage en css seront expliquées pendant les premières déclarations, et réutilisées par la suite dans tout le guide, vous pouvez donc avoir un intérêt à lire le guide dans le sens normal de la lecture.

Cependant, si vous souhaitez juste avoir le code correspondant à votre problème, vous pouvez utiliser le menu composé d'ancres ci-dessous.

## Sommaire

* [tl;dr - mes techniques préférées](#tl-dr-mes-techniques-preferees)
* [Techniques tradtionnelles](#techniques-traditionnelles)
  * [Un bloc dans un bloc](#un-bloc-dans-un-bloc)
  * [Des blocs dans un bloc](#des-blocs-dans-un-bloc)
  * [Des éléments inlines dans un bloc](#des-elements-inlines-dans-un-bloc)
* [Techniques avancées : flexbox (ie11+)](#techniques-avancees-flexbox-ie11-)
* [Conclusion](#conclusion)

## tl;dr - mes techniques préférées

### Un bloc dans un bloc

```css
.parent {
  position: relative;

  /* facultatif : résoud un bug non systématique de blur sur IE */
  transform-style: preserve-3d; 
}

.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* compatibilité : ie9+ */
}
```
_Note : le détail de la technique est expliqué plus loin dans le post_

### Des blocs dans un bloc

```css
.parent {
  text-align: center;
}
 
.parent:before {
  content: '';
  display: inline-block;
  height: 100%;
  vertical-align: middle;
  margin-right: -0.25em; /* space width */
}

.child {
  display: inline-block;
  vertical-align: middle;
}
```
_Note : le détail de la technique est expliqué plus loin dans le post_


### Des éléments inline dans un bloc

```css
.parent {
  text-align: center;
}

.child {
  vertical-align: middle;
}
```
_Note : le détail de la technique est expliqué plus loin dans le post_

## Techniques traditionnelles

### Un bloc dans un bloc

#### Centrage horizontal

La technique du `margin: 0 auto;` consiste à dire au browser que les marges de gauche et droite seront identiques et que leur valeur sera `auto`. Le browser calcule donc des marges de même taille de chaque côté et centre le bloc naturellement.

```css
.parent {}

.child {
  margin: 0 auto;
}
```

La technique du `left: 50%; + margin négative en unités` est à utiliser sur les blocs dont vous connaissez la taille à l'avance. Le principe consiste à expliquer au navigateur qu'on place un bloc en `position: absolute;`. Celui-ci va donc chercher à se placer par rapport à son élément parent le plus proche qui est en `position: relative;`. Il faut donc ne pas oublier d'attribuer cette propriété sur le `.parent`. Il suffit ensuite d'indiquer qu'on place le bloc à `left: 50%;`. Le bloc se place donc à 50% vers la gauche par rapport à la taille totale du bloc conteneur. Il ne nous reste plus qu'à décaler vers la droite le bloc `.child` en lui donnant une valeur de margin négative vers la gauche. Celle-ci doit être égale à la moitié de la `width`(en pixels, em, rems, pourcentages, ...).

```css
.parent {
  position: relative;
}

.child {
  width: {X}em; /* remplacer {X} par votre valeur */
  position: absolute;
  left: 50%;
  margin-left: -{X/2}em; /* remplacer {X/2} par la moitié de votre width */
}
```

En combinant la technique précédente et des propriétés css modernes, on arrive à la technique du `transform: translate; négatif`. Même principe que la technique précédente, sauf qu'à la fin, on indique au bloc enfant d'effectuer une translation sur lui-même, en suivant l'axe X (l'axe horizontal) de -50%, donc 50% vers la droite. Sauf que ce 50% s'applique sur le bloc enfant directement. Vous n'avez donc pas besoin de connaitre la `width` de l'élément enfant à l'avance. Le `transform-style: preserve-3d;` sur le bloc `.parent` est là pour régler des problèmes de flou sur certains navigateurs lors de transitions.

```css
.parent {
  position: relative;

  /* facultatif : résoud un bug non systématique de blur sur IE */
  transform-style: preserve-3d;
}

.child {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
```

#### Centrage vertical

Même principe que la technique `left: 50%; + margin négative en unités`, sauf qu'on applique le principe aux propriétés css relatives à la hauteur. Vous avez donc besoin de connaitre à l'avance la hauteur de votre bloc.

```css
.parent {
  position: relative;
}

.child {
  height: {Y}em; /* remplacer {Y} par votre valeur */
  position: absolute;
  top: 50%;
  margin-top: -{Y/2}em; /* remplacer {Y/2} par la moitié de votre height */
}
```

Ici on réutilise le principe expliqué dans la technique `transform: translate; négatif`, mais appliqué à la hauteur. Notez que le nom de la [valeur de la propriété](http://apps.workflower.fi/vocabs/css/fr) css passe de `translateX` à `translateY`.

```css
.parent {
  position: relative;

  /* facultatif : résoud un bug non systématique de blur sur IE */
  transform-style: preserve-3d;
}

.child {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
```

#### Les deux

En réutilisant toutes les techniques expliquées précédemment, on peut arriver à plusieurs solutions, à choisir selon votre contexte et vos préférences.

Méthode à base de `display: inline-block`

```css
.parent {
  text-align: center;
}
 
.parent:before {
  content: '';
  display: inline-block;
  height: 100%;
  vertical-align: middle;
  margin-right: -0.25em;
}

.child {
  display: inline-block;
  vertical-align: middle;
}
```


Technique des `position: absolute; + marges négatives` avec tailles connues à l'avance

```css
.parent {
  position: relative;
}

.child {
  width: {X}em; /* remplacer {X} par votre valeur */
  height: {Y}em; /* remplacer {Y} par votre valeur */
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -{X/2}em; /* remplacer {X/2} par la moitié de votre height */
  margin-top: -{Y/2}em; /* remplacer {Y/2} par la moitié de votre height */
}
```

Technique des `position: absolute; + marges négatives` avec tailles inconnues

```css
.parent {
  position: relative;
  transform-style: preserve-3d;
}

.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

### Des blocs dans un bloc

#### Centrage horizontal

On utilise la propriété `display: inline-block;` qui permet d'avoir des propriétés d'affichage relatives aux éléments de type `block` et de type `inline`. Le côté `inline` nous permet d'utiliser tout simplement un `text-align: center;`

```css
.parent {
  text-align: center;
}

.child {
  display: inline-block;  
}
```

#### Centrage vertical

De la même façon que pour le centrage horizontal, on utilise le côté `inline` de la propriété `display: inline-block;` pour aligner verticalement les éléments enfants par rapport à leur conteneur parent.

```css
.parent {}

.child {
  display: inline-block;
  vertical-align: middle; 
}
```

Une autre technique consiste à utiliser les propriétés css de `mise en tableaux`. On est obligé de créer un [pseudo-élément](https://developer.mozilla.org/fr/docs/Web/CSS/Pseudo-%C3%A9l%C3%A9ments) pour gérer la mise en page par tableau. On créée tout simplement un tableau, puis une cellule de tableau, qu'on positionne grâce à un `vertical-align: middle;`. Les éléments `.child` s'alignent automatiquement dans leur conteneur.

```css
.parent:before {
  display: table;
  width: 100%;
}

.parent {
  display: table-cell;
  vertical-align: middle;
}

.child {
  display: inline-block; /* à enlever si vous ne souhaitez pas avoir vos blocs enfants alignés sur la même ligne, mais juste centrés verticalement sur la hauteur */
}
```

#### Les deux

On peut combiner les deux solutions basées sur le `display: inline-block;` pour avoir le résultat souhaité.

```css
.parent {
  text-align: center;
}

.child {
  display: inline-block;
  vertical-align: middle;
}
```

On peut aussir réutiliser la méthode à base de `display: table-cell` et l'adapter pour qu'elle centre horizontalement et verticalement.

```css
.parent:before {
  display: table;
  width: 100%;
}

.parent {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}

.child {
  display: inline-block;
  text-align: left;
}
```

On peut réutiliser la technique précédente en étant un peu imaginatif pour fonctionner avec des `display: inline-block;`. Pour détailler, on crée un pseudo-élément, qui aura un `content: '';` pour faire qu'il existe et soit affiché, puis on annule son affichage via un `margin-right négatif` qui a pour valeur magique `-0.25em` ce qui correspond à la largeur d'un espace. On lui applique ensuite un `display: inline-block + height: 100% + vertical-align: middle` pour créer le conteneur à la taille souhaitée et on termine en calant l'élément enfant `.child` avec un centrage vertical.

```css
.parent {
  text-align: center;
}
 
.parent:before {
  content: '';
  display: inline-block;
  height: 100%;
  vertical-align: middle;
  margin-right: -0.25em;
}

.child {
  display: inline-block;
  vertical-align: middle;
}
```

### Des éléments inlines dans un bloc

Ces éléments `inline` peuvent être par exemple des liens `<a>` ou des `<span>` tout simples. Ces techniques sont souvent très connues et ne devraient pas vous poser beaucoup de problèmes, elles ne seront pas commentées. Veuillez vous référer [text-align](https://developer.mozilla.org/fr/docs/Web/CSS/text-align) et [vertical-align](https://developer.mozilla.org/fr/docs/Web/CSS/vertical-align) si vous souhaitez plus d'informations.

#### Centrage horizontal

```css
.parent {
  text-align: center;
}

.child {}
```

#### Centrage vertical

```css
.parent {}

.child {
  vertical-align: middle;
}
```

#### Les deux

```css
.parent {
  text-align: center;
}

.child {
  vertical-align: middle;
}
```

## Techniques avancées : flexbox ([ie11+](http://caniuse.com/#feat=flexbox))

Flexbox est un outil très puissant quand il s'agit de gérer le position de blocs flex. Son seul défaut consiste en son faible support navigateur, mais il vous faudra maitriser ces techniques si vous comptez faire du développement web dans les années à venir, d'autant plus qu'elles sont très simples à rédiger et comprendre.

### Centrage horizontal

On déclare le conteneur en bloc flex, et on lui applique la propriété [justify-content](https://developer.mozilla.org/fr/docs/Web/CSS/justify-content).

```css
.parent {
  display: flex;
  justify-content: center;
}

.child {}

```

### Centrage vertical

Idem, on déclare le conteneur en bloc flex, et cette fois, on lui applique la propriété [align-items](https://developer.mozilla.org/fr/docs/Web/CSS/align-items).

```css
.parent {
  display: flex;
  align-items: center;
}

.child {}
```

### Les deux

On combine le tout pour un résultat génial et simpliste.

```css
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}

.child {}
```

## Conclusion

Essayez de toujours utiliser la solution la plus avancée techniquement par rapport à votre scope navigateur : si vous devez ne supporter que les IE récents, utilisez flexbox ; si vous devez ne supporter que IE9+, utilisez les transform: translate() ; sinon utilisez des techniques de plus en plus _anciennes_.

Ce guide n'a volontairement pas parlé des préfixes navigateurs, car ce genre de chose doit être pris en charge automatiquement dans votre workflow par un autoprefixer ([gulp-autoprefixer](https://www.npmjs.org/package/gulp-autoprefixer), [grunt-autoprefixer](https://www.npmjs.org/package/grunt-autoprefixer), [inclus dans myth](http://www.myth.io/), ...). Pour apprendre à l'installer ou à en apprendre plus sur le sujet, je vous renvoie [à l'article de MoOx](http://localhost:4242/posts/css/mise-en-place-autoprefixer/). Si vous souhaitez quand même vous passez d'autoprefixer, vous pourrez vérifier la compatibilité des propriétés sur [caniuse](http://caniuse.com/).
