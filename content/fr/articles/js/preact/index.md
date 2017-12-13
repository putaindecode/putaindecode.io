---
date: "2017-12-15"
title: "Découverte de Preact"
tags:
  - preact
  - react
authors:
  - drazik
---

Preact est une alternative à React. Plus précisément, voici sa description
officielle :

> Fast 3kB alternative to React with the same ES6 API.

Cette description semble alléchante au premier coup d'oeil. Si on peut avoir un
React de 3ko, banco, on switch !

Pas si vite. L'API est la même, mais rien n'indique que Preact est un React qui
tient dans 3 petits ko (bien que c'est ce qu'on peut parfois lire). Ça ferait
bien longtemps que les ingénieurs de Facebook auraient réagit s'il était
possible de faire en sorte que React soit si petit. Preact fait donc des
compromis, des choix, et présente donc des différences avec React qu'il faut
connaître et prendre en compte avant d'envisager de switcher.

*Cet article est destiné aux gens qui connaissent déjà au moins un petit peu
React. Tous les concepts liés à (P)React ne seront pas détaillés. Si vous ne
connaissez rien à React, je vous invite à lire [l'introduction à
React](/fr/articles/js/react/).*

## Quelles sont les différences en React et Preact ?

Les différences entre React et Preact peuvent être rangées dans deux catégories
: ce qu'il "manque" à Preact, et ce qui est là, mais différent.

### Ce qu'il "manque" 

Premièrement, Preact se concentre uniquement sur le DOM. Cela signifie qu'il
n'existe pas d'équivalent à
[react-native](https://facebook.github.io/react-native/),
[react-vr](https://facebook.github.io/react-vr/) ou tout autre
[renderer](http://iamdustan.com/react-renderers/) du côté de Preact. Celui-ci a
pour but d'afficher du DOM le plus efficacement possible.

Cette spécialisation pour le DOM permet à Preact de ne pas avoir à implémenter
le système de Synthetic Events utilisé par React. Ainsi, Preact peut se
permettre d'utiliser simplement le système d'événements standard du navigateur.
Il faut bien avoir cela en tête lorsqu'on a l'habitude de travailler avec
React, car celui-ci corrige, ou du moins unifie certains comportements entre
les navigateurs (notamment sur `onChange`). Des différences dans le
comportement de votre app est donc à prévoir en cas de switch.

Enfin, Preact n'embarque pas de gestion de validation des PropTypes. Partant du
principe que celles-ci ne sont pas utilisées par tout le monde, la décision a
été prise de ne pas les inclure dans le coeur de la bibliothèque.

### Ce qui est différent

Preact utilise la bibliothèque
[hyperscript](https://github.com/hyperhype/hyperscript), qui est une version
générique de `React.createElement`. Le résultat est le même, la signature de la
fonction `h()` exposée par hyperscript étant la même que celle de
`React.createElement`. Il faudra quand même indiquer au compiler qu'il doit
utiliser cette fonction pour transpiler le JSX.

La méthode `render()` des composants reçoit toujours `this.props` et
`this.state` en paramètres, ce qui permet de les destructurer directement dans
les paramètres de la fonction, et ainsi de les traiter comme s'ils étaient
eux-mêmes des paramètres.

Preact gère l'API `context`, mais il n'existe pas de `contextTypes` ni de
`childContextTypes` (ce qui est raccord avec l'absence de `propTypes`). Tous
les enfants reçoivent le `context` définit dans la méthode `getChildContext()`
de leurs parents. Si plusieurs parents implémentent cette méthode, alors les
descendants recevront un agrégat.

Dans Preact, `props.children` est un `Array`. On peut donc utiliser toutes les
méthodes de `Array.prototype` dessus, sans avoir à passer par un équivalent de
`React.Children`.

Enfin, il est possible d'utiliser l'attribut `class` sur un noeud JSX.
`className` est aussi supporté, mais vous ne vous prendrez plus d'erreur
lorsque votre esprit se croira dans un fichier HTML et vous fera écrire
`class`.

## Comment démarrer un projet Preact ?

Pour démarrer sur de bonnes bases, le plus simple est d'utiliser
[`preact-cli`](https://github.com/developit/preact-cli). C'est un outil en
ligne de commande qui vous permet de créer toute la structure de base de votre
application. Si vous connaissez `create-react-app`, alors vous aurez deviné que
`preact-cli` est l'équivalent pour Preact.

Commençons par l'installer : 

```bash
npm install -g preact-cli
```

Nous avons maintenant accès à la commande `preact`. Celle-ci s'utilise de la
manière suivante :

```bash
preact create <template-name> <project-name>
```

Où `<template-name>` est le nom d'un template officiel (listé sur l'org GitHub
[`preactjs-template`](https://github.com/preactjs-templates)) ou un repository
GitHub contenant un dossier `template` (de la forme `<username>/<repository>`);
et `<project-name>` est le nom du dossier dans lequel la structure du projet
sera créée. Pour notre exemple, nous utiliserons le template `default`, et le
nom `test-preact` pour notre projet :

```bash
preact create default test-preact
```

En utilisant le template `default`, nous obtenons une application qui embarque
par défaut :

* Du code-splitting pour chaque route
* Votre page `index.html` prérendue pour un affichage le plus rapide possible
* Un ServiceWorker prêt à l'emploi (score Lighthouse 100/100)
* Des metas preload en fonction de vos URL
* Des polyfills chargés uniquement si nécessaire

Il ne vous reste plus qu'à écrire votre app sur ces bases solides ! Pour
information, le routing est géré par
[`preact-router`](https://github.com/developit/preact-router).

## J'utilise React, je peux switcher sur Preact ?

Oui, et pour ça il y a deux possibilités : ajouter une couche de compatibilité,
ou passer purement et simplement à Preact. 

### Rendre Preact totalement compatible avec React en utilisant `preact-compat`

Le plus rapide est d'utiliser
[`preact-compat`](https://github.com/developit/preact-compat). Ce module vient
s'ajouter à Preact pour y ajouter une couche de compatibilité le rendant
compatible avec n'importe quel module écrit pour React. Pour cela,
`preact-compat` expose l'ensemble de l'API de `react` et `react-dom`. Cela vous
permettra de continuer à utiliser sereinement tous vos composants écrits
spécifiquement pour React, ainsi que vous son écosystème.

Il faut donc l'installer, ainsi que Preact :

```bash
npm install --save preact preact-compat
```

Puis il faut ajouter des alias à votre système de build, afin que tous vos
imports de `react` et `react-dom` soient reroutés vers `preact-compat`. Par
exemple, pour webpack :

```javasscript
module.exports = {
    //... votre configuration webpack
    resolve: {
        alias: {
            "react": "preact-compat",
            "react-dom": "preact-compat"
        }
    }
}
```

Si vous n'utilisez pas webpack, votre système de build est très certainement
listé sur la
[documentation](https://github.com/developit/preact-compat#preact-compat).

Cette solution a l'avantage d'être très rapide à mettre en place. Toutefois, le
principal avantage de Preact est son poids de seulement 3ko. En ajoutant
`preact-compat`,vous ajouterez environ 2ko supplémentaires. Ce n'est pas
énorme, surtout si on prend en compte les avantages que ce module apporte, mais
il est possible de ne pas avoir à ajouter cette couche de compatibilité.

### Passer complètement à Preact

Cette solution est un peu plus longue à mettre en place, mais si votre code
n'est pas dépendant d'un module qui utilise des parties de l'API de React qui
ne sont pas prises en compte par Preact, alors elle vous permettra d'obtenir le
bundle le plus léger possible.

Premièrement, il faut installer Preact :

```bash
npm install --save preact
```

Puis il faut indiquer à votre compiler le pragma JSX qu'il doit utiliser. Pour
babel, vous pouvez installer le plugin `babel-plugin-transform-react-jsx` :

```bash
npm instal --save-dev babel-plugin-transform-react-jsx
```

Puis indiquer le pragma JSX dans les options de ce plugin dans votre fichier
`.babelrc` :

```js
{
    "plugins": [
        ["transform-react-jsx", { "pragma": "h" }]
    ]
}
```

*Même si vous connaissez React, cette histoire de pragma JSX pourrait ne pas
vous évoquer grand chose. Si vous souhaitez en savoir plus, je vous conseille
de lire l'article suivant : [WTF is JSX](https://jasonformat.com/wtf-is-jsx/).
Si vous utilisez React et n'avez jamais eu à configurer ce pragma, c'est parce
que la plupart des compilers utilisent le pragma `@jsx React.createElement` par
défaut.*

Si vous utilisez une version de React qui n'est pas à jour, il est possible que
votre codebase utilise l'ancienne syntaxe `React.createClass()`. Dans ce cas,
il faut que vous installiez
[`preact-classless-component`](https://github.com/laurencedorman/preact-classless-component),
ou que vous passiez votre codebase dans le
[`preact-codemod`](https://github.com/vutran/preact-codemod) qui transformera
vos composants en classes ES6. De même, il se peut que vous utilisiez des
références par chaîne de caractères, qui ne sont pas supportées par Preact.
Dans ce cas, il faudra les transformer en références fonctionnelles.

Il ne vous reste plus qu'à mettre à jour vos imports pour que ceux-ci pointent
vers Preact. Voici un petit exemple :

```javascript
import { h, Component, render } from "preact";

const Header = () => <header>Ma putain d'app</header>;

class App extends Component {
    render() {
        return (
            <div>
                <Header />
                <main>
                    Hello, world !
                </main>
            </div>
        ); 
    }
}

render(<App />, document.getElementById("app"));
```

Voilà, vous avez maintenant une aperçu de ce qu'est Preact et des moyens à
votre disposition pour l'utiliser. Facebook ne vous est plus d'aucune utilité,
vous pouvez fermer votre compte.
