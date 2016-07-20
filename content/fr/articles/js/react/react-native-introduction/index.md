---
date: "2016-07-20"
title: Votre première app React Native
tags:
  - javascript
  - react-native
  - reactjs
authors:
  - zoontek
---

Cela fait déjà plus d'un an que Facebook a publié la première version React Native.
Longtemps considéré comme une expérimentation sympathique (après tout, il est né lors d'un hackathon), un cycle de release soutenu d'une version majeure toutes les 2 semaines a fait qu'aujourd'hui l'écosystème est suffisemment riche et stable pour déployer une app iOS et android en production.

## Quels problèmes avec les solutions hybrides ?

Des solutions pour développer une application mobile multiplateforme en JS existent déjà: je pense notamment à [Cordova](https://cordova.apache.org/) ou à son superset [Ionic](http://ionicframework.com/). Conçu autour d'une webview système (un navigateur embedded - Safari sur iOS, Chrome sur android) affiché en plein écran, vous utilisez des technologies web classiques: HTML, CSS, JS. Il est possible d'installer des plugins afin d'enrichir le moteur JavaScript avec de nouvelles APIs en plus des APIs navigateur.
Ainsi, `cordova-plugin-contacts` permet d'accéder au carnet d'adresses du smartphone, `cordova-plugin-vibration` permet de faire vibrer celui-ci, etc.

Le problème, c'est que si l'utilisation de plugins permet de faire pont avec le code natif (un message est envoyé de la partie JS à la partie Objective-C / Java, qui l'exécute de son côté et renvoit le résultat au JS), l'UI de l'application n'utilise elle pas du tout le layout natif des OS mobiles. Les performances et le look'n'feel de celle-ci seront donc équivalente à une app web, et non une app mobile.

Avec React Native, point de navigateur embedded, de HTML ou de CSS: vous devez composer vos interfaces à l'aide de components React qui font appel au layout natif de la plateforme. Un exemple simple: `<View>` (qui est l'équivalent d'une `<div>` HTML) communique via un pont JS <-> Objective-C / Java pour contrôler une UIView (sur iOS) ou une android.view. Les performances de l'UI sont donc quasi similaires aux performances natives.
