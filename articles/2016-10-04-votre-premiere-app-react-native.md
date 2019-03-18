---
date: 2016-10-04
title: Votre première app React Native
author: zoontek
oldSlug: js/react/native/introduction
slug: votre-premiere-app-react-native
---

Cela fait déjà plus d'un an que Facebook a publié la première version de React
Native. Longtemps considéré comme une expérimentation sympathique (après tout,
il est né lors d'un hackathon), un cycle de release soutenu d'une version
majeure toutes les 2 semaines a fait qu'aujourd'hui l'écosystème est
suffisamment riche et stable pour déployer une app iOS et Android en production.

## Quels problèmes avec les solutions hybrides ?

Des solutions pour développer une application mobile multiplateforme en JS
existent déjà : je pense notamment à [Cordova](https://cordova.apache.org/) ou à
son superset [Ionic](http://ionicframework.com/). Conçu autour d'une webview
système (un navigateur embedded - Safari sur iOS, Chrome sur Android) affichée
en plein écran, vous utilisez des technologies web classiques : HTML, CSS et JS.
Il est possible d'installer des plugins afin d'enrichir le moteur JavaScript
avec de nouvelles APIs en plus des APIs navigateur. Ainsi,
`cordova-plugin-contacts` permet d'accéder au carnet d'adresses du smartphone,
`cordova-plugin-vibration` permet de faire vibrer celui-ci, etc.

Le problème, c'est que si l'utilisation de plugins permet de faire le pont avec
le code natif (un message est envoyé de la partie JS à la partie Objective-C /
Java, qui l'exécute de son côté et renvoie le résultat au JS), l'UI de
l'application n'utilise elle pas du tout le layout natif des OS mobiles. Les
performances et le look'n'feel de celle-ci seront donc équivalente à une app
web, et non une app mobile.

Avec React Native, point de navigateur embedded, de HTML ou de CSS : vous devez
composer vos interfaces à l'aide de composants React qui font appel au layout
natif de la plateforme. Un exemple simple : `<View>` (qui est l'équivalent d'une
`<div>` HTML) communique via un pont JS <-> Objective-C / Java pour contrôler
une UIView (sur iOS) ou une android.view. Les performances de l'UI sont donc
quasi similaires aux performances natives.

## Découverte de l'environnement de dev

Fatigués par JavaScript et son tooling un peu trop fourni ? Rassurez-vous : vous
n'avez strictement rien à configurer pour commencer à utiliser React Native.
Vous disposez out-of-the-box d'un packager Babel et d'un
[preset custom](https://github.com/facebook/react-native/tree/master/babel-preset)
qui intègre les fonctionnalités de ES2015, mais également le support de React /
JSX (encore heureux), de [Flow](https://flowtype.org/) et d'autres helpers
bienvenus tels que `async / await`.

En bons passionnés de bière, nous allons réaliser ensemble une app qui requête
la [PunkAPI](https://punkapi.com/) (faites la demande d'une clé API via le
formulaire prévu à cet effet).

Je vous renvoie à la
[documentation officielle](https://facebook.github.io/react-native/docs/getting-started.html)
pour ce qui est de l'installation des dépendances (celles-ci variant selon votre
OS et l'OS cible). Xcode / Android Studio, node et watchman étant installés,
ouvrez un terminal et initiez le projet :

```
npm install -g react-native-cli
react-native init PutainDeBiere
```

Une fois le projet initialisé, le CLI vous informe de la façon dont lancer votre
application : faites-le dans la foulée. En ce qui me concerne, je développe pour
iOS.

```bash
react-native run-ios
```

Selon votre plateforme cible, ouvrez `index.ios.js` ou `index.android.js` dans
votre éditeur préféré. Modifiez quelque peu le texte et rafraichissez votre app
via `Command⌘ + R`, deux pressions sur la touche `R` (émulateur Android).

```javascript
/* @flow */

import React, { Component } from "react";
import { AppRegistry, StyleSheet, Text, View } from "react-native";

class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to PutainDeBiere!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
});

AppRegistry.registerComponent("PutainDeBiere", () => App);
```

<figure>
  <img src="/images/articles/2016-10-04-votre-premiere-app-react-native/welcome.png" alt="welcome PutainDeBiere preview" />
  <figcaption>Une bien jolie première étape</figcaption>
</figure>

## Récupération des données

Afin de requêter notre API, React Native nous offre plusieurs plusieurs
solutions: `fetch()` ou `XMLHttpRequest`. Tenez vous en **uniquement** à
l'utilisation de la première, la deuxième n'étant présente que pour assurer une
compatibilité avec des librairies tierces.

_/!\ Notre clé API doit être encodée en base64. La function `btoa()` n'étant pas
disponible en React Native, il est nécessaire d'installer une dépendance._

```bash
npm install --save base-64
```

Histoire de séparer notre logique API de nos composants React, nous allons créer
un fichier nommé `punkapi.js` à la racine de notre projet.

```javascript
import base64 from "base-64"; // importez la dépendance tout juste installée

const rootEndpoint = "https://punkapi.com/api/v1";
// pour simplifier la compréhension de ce tuto, nous renseignons la clé API "en dur"
// ne faites jamais cela au sein de vos projets (voir http://12factor.net/fr/config)
const punkApiKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
const password = ""; // la punk API n'utilise aucun mot de passe
const authBase64 = base64.encode(`${punkApiKey}:${password}`);

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Basic ${authBase64}`, // HTTP basic auth
};

// retourne une recette de bière au hasard
export const getRandomBrewdog = () =>
  fetch(`${rootEndpoint}/beers/random`, { headers }).then(
    ({ status, json }) => {
      if (status !== 200)
        throw new Error(`API answered with status code ${status}`);
      // gestion du status code HTTP
      else return json(); // on parse la réponse en JSON
    },
  );
```

Nous allons maintenant modifier notre composant `<App>` afin de faire une
requête simple d'une bière au hasard juste avant le montage de celui-ci.

```javascript
import { getRandomBrewdog } from './punkapi'

class App extends Component {
  componentWillMount() {
    getRandomBrewdog() // fetch() retourne une Promise
      .then(json => console.log(json))
      .catch(error => console.error(error))
  }

  …
}
```

Vous apercevez la présence d'un appel à `console.log()`. Pour y accéder, rien de
plus simple: pressez `Command⌘ + D` au sein de l'émulateur iOS, ou appuyez sur
le bouton `Menu` de l'émulateur Android. Celui-ci contient de multiples choses
avec lesquelles je vous laisserai expérimenter par la suite; ce qui nous
intéresse ici c'est le bouton `Debug JS Remotely`, qui va ouvrir un nouvel
onglet dans Chrome où sera exécuté notre code JS.

Il devient donc possible d'ouvrir les Chrome Devtools (dont la console) afin de
débuguer notre app.

<figure>
  <img src="/images/articles/2016-10-04-votre-premiere-app-react-native/devmenu.png" alt="devmenu + chrome devtools" />
  <figcaption>Jusqu'ici tout va bien</figcaption>
</figure>

## Présentation des données

Afin d'afficher les informations que nous venons de récupérer, nous allons avoir
besoin de plusieurs éléments (heureusement fournis), à savoir de quoi encapsuler
d'autres composants (une `<View>` ~= une `<div>` HTML), de quoi rendre du texte
(`<Text>` ~= `<span>`), un bouton (nous allons utiliser `<TouchableOpacity>`,
une zone dont l'opacité est modifiée lors d'un `onTouch`) et enfin d'un spinner
pour indiquer qu'une requête est en cours (`<ActivityIndicator>`).

Nous allons également rendre notre unique composant stateful afin de stocker
quelques informations retournées par l'API.

```javascript
import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  ActivityIndicator, // import des composants
  TouchableOpacity,
  Text,
  View,
} from 'react-native'

import { getRandomBrewdog } from './punkapi'

class App extends Component {
  constructor(props) {
    super(props)

    // la state de notre composant est utilisé pour
    // stocker quelques infos renvoyées par l'API
    this.state = {
      name: '', // nom de la bière
      description: '', // sa description
      isLoading: false // la requête API est-elle en cours ?
    }
  }

  // nous externalisons cette fonction afin de
  // pouvoir l'appeler lorsqu'on le souhaite
  _getRandomBrewdogWithFeedback = () => {
    this.setState({ isLoading: true })

    getRandomBrewdog()
      .then(json => this.setState({
        name: json.name,
        description: json.description,
        isLoading: false // la requête est terminée
      }))
      .catch(error => console.error(error))
  }

  componentWillMount() {
    this._getRandomBrewdogWithFeedback()
  }

  render() {
    const content = this.state.isLoading
      ? <ActivityIndicator /> // si requête en cours, on affiche un spinner
      : <Text style={styles.welcome}>
          Welcome to PutainDeBiere!
        </Text>

    return (
      <View style={styles.container}>
        {content}
      </View>
    )
  }
}

…
```

Votre application affiche dorénavant un spinner quelques secondes avant de
rendre le fameux "Welcome to PutainDeBiere!" le temps que la requête à la
punkAPI se fasse. Continuons de customiser ce render afin d'afficher les
informations retournées (et maintenant présentes dans le state de notre app).

```javascript
class App extends Component {
  …

  render() {
    const content = this.state.isLoading
      ? <ActivityIndicator /> // si requête en cours, on affiche un spinner
      : <View style={styles.infosContainer}>
          <Text style={styles.name}>
            {this.state.name} // sinon on affiche le nom de la bière
          </Text>

          <Text style={styles.description}>
            {this.state.description} // sa description
          </Text>

          <TouchableOpacity // on ajoute un "bouton" qui requête une autre bière aléatoire
            onPress={this._getRandomBrewdogWithFeedback}
            style={styles.button}
          >
            <Text>Grab a new beer!</Text>
          </TouchableOpacity>
        </View>

    return (
      <View style={styles.container}>
        {content}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  // ajout de styles divers
  infosContainer: {
    margin: 30,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  description: {
    marginBottom: 10,
  },
  button: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 3,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
```

<figure>
  <img src="/images/articles/2016-10-04-votre-premiere-app-react-native/final_result.png" alt="devmenu + chrome devtools" />
  <figcaption>Le rendu "final"</figcaption>
</figure>

## Et maintenant ?

Si vous connaissez déjà React, vous pouvez:

- améliorer le code de l'app avec l'ajout de redux (par exemple) afin de
  supprimer le state de notre composant
- créer un composant stateless "\<Button\>"
- styliser davantage l'app à l'aide
  d'[images](https://facebook.github.io/react-native/docs/image.html) ou
  d'[animations](https://facebook.github.io/react-native/docs/animations.html)
- désactiver et modifier le style du bouton lors d'une requête API
- gérer les erreurs de requêtage de façon un poil plus élégante que de balancer
  une erreur à la tête de l'utilisateur

Si ce n'est pas le cas, n'hésitez pas à lire ces deux articles pour vous
familiariser avec ces librairies avant de continuer sur votre lancée:

- [Introduction à React](/fr/articles/js/react/)
- [Redux, comment ça marche ?](/fr/articles/js/redux/)

Bonne découverte !
