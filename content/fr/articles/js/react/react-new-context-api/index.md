---
date: "2015-02-23"
title: React 16.3 et la nouvelle API Context, ou en finir avec les props sauvages
tags:
  - javascript
  - react
authors:
  - neovea
---

Depuis fin mars 2018, la version 16.3 de React est sortie, et elle vient avec son lot de nouveautés, dont celle dont nous allons parler dans cet article : l'Api Context. Alors ok, cette Api existait déjà par le passé mais il était déconseillé de l'utiliser car sujet à évolutions. Et évolution il y a eu.
La nouvelle Api Context est devenue beaucoup plus facile à utiliser, sa syntaxe s'est assouplie et s'est simplifiée. Ce qui fait d'elle un outil de premier ordre désormais.
## Petit rappel de l'utilisation des `props` React à l'usage des fronteux
Admettons que je souhaite créer un composant qui affiche le massage "Bienvenue " suivi du nom de la personnne qui affiche la page web, avec React, on écrirait quelque chose comme ceci :
```jsx
import React from 'react'

const Welcome = ({name}) => (
	<h1>Bienvenu {name} !</h1>
)

export default Welcome
```
qu'on implémenterait ensuite ainsi :
```jsx
<Welcome name={'Franck'} />
```
Ici la `prop` name est settée avec la valeur "Franck" et sera rendue dans notre code de la manière suivante :
```html
<h1>Bienvenue Franck !</h1>
```
Jusque là rien de fou, c'est un cas d'usage standard et assez banal.
Là où ça devient intéressant c'est que l'on peut faire hériter d'autres composant enfants de `Welcome` avec la même propriété. Dans ce cas là, `Welcome` se transformerait en parent et *setterait* ses composants enfants avec les propriétés de son choix.

Ce mécanisme est simple, clair et efficace. Son défaut malheureusement est lié à la taille de l'application. En effet, une application qui grossit est souvent une application avec beaucoup de composants qui héritent d'autres composants, et qui de surcroit peuvent être amenés à utiliser des parties identique du `JSON` consommé. Mieux (ou pire c'est au choix) l'exploitation du `JSON` peut être partielle en fonction des composants. Souvent, des composants intermédiaires ne consomment même pas je `JSON` à proprement parler mais se font simplement le relais de ces datas pour les composants enfants. Ce qui amène inévitablement à ce qu'on appelle le `prop drilling` ou comme j'aime le nommer, *l'héritage sauvage*. Et c'est un vrai fléau, et ce pour plusieurs raisons :

Pour commencer, il suffit qu'on décide de travailler avec des composants "smart" qui contiennent la logique de notre app, et des composants "dumb" destinés simplement à afficher des choses à l'écran



## Mais à quoi ça sert ?
Partons sur un cas d'usage standard de React : Vous souhaitez créer un composant qui affiche une message de bienvenue. Vous écrirez quelque chose qui ressemble à ceci :
```jsx
import React from 'react'

const App = () => (
	<h1>Bienvenu Franck !</h1>
)

export default App
```


