---
date: "2015-02-23"
title: Quelques retours sur React et le rendu serveur
tags:
  - javascript
  - react
authors:
  - lionelB
---

On entend souvent parler d'applications JavaScript isomorphiques, et même si le 
nom ne [fait](https://news.ycombinator.com/item?id=8237449) [pas](https://twitter.com/wycats/status/566857009836724224) 
[l'unanimité](https://medium.com/the-thinkmill/making-the-case-for-progressive-javascript-a98dfa82b9d7), 
ce qu'il y a derrière, le concept de _server side rendered JavaScript_ est en 
passe de devenir  un sujet plutôt tendance pour 2015 grâce à la monté en puissance 
de [Reactjs](http://facebook.github.io/react/).  Faire du rendu d'application 
JavaScript coté serveur permet de réconcilier enfin le développeur de 
*Single Page App* (SPA) avec l’amélioration progressive, l'accessibilité et le 
SEO&nbsp;; quoique Google comme les lecteurs d'écran ont plutôt bien évolué sur
ce point. L'autre avantage non négligeable à mon sens, est qu'on améliore les 
performances perçues par rapport
 à une SPA classique puisque&nbsp;:

 - On supprime une requête *ajax* au démarrage pour récupérer le contenu
   initial. 
 - On améliore la vitesse de rendu initial de page. 
 - On bénéficie de la fluidité de navigation d'une SPA.

Pour plus d'info sur les avantages, il y a [cet article](http://tech.m6web.fr/isomorphic-single-page-app-parfaite-react-flux/) sur le blog de M6Tech.

Afin de me familiariser avec React et son écosystème, rien de mieux que mettre 
les mains dedans&nbsp;! C'est un peu pour toutes ces raisons que j'ai décidé de 
l'utiliser pour mon site web (un site statique). 

**Inutile et donc totalement justifié pour le développeur que je suis**. 
Une des premières briques que j'ai mises en place a été le routeur.

##react-router
Pour une fois dans la communauté JavaScript, il y a une bibliothèque de référence 
et c'est celle là : [react-router](https://github.com/rackt/react-router). 
Le routeur est fortement inspiré par celui d'Ember au sens où les URL et leurs routes 
sont au cœur du dispositif. Le routeur se présente sous forme de composant React 
et ça donne ça.

```jsx
//routes.js

var React = require("react");
var Router = require("react-router");

var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;

var App = require("./app");
var Home = require("./home/homePage");
var Project = require("./project/projectPage");
var NotFound = require("./notFound");

var routes = (
  <Route path="/" handler={App}>
    <DefaultRoute name="index" handler={Home} />
    <Route name="project" path="/projects/:url" handler={Project} />
    <NotFoundRoute name="404" handler={NotFound} />
  </Route>
);

module.exports = routes;
```

À mon sens, l'aspect déclaratif apporte de la clarté et améliore la compréhension 
du système. On voit rapidement quel composant est utilisé en fonction de l'URL. 
L'autre avantage du déclaratif, c'est qu'il permet de manière assez simple, 
d'imbriquer les routes en imbriquant les nœuds `<Route>`.

En plus des composants, on a aussi à disposition des *mixins* pour naviguer 
programmatiquement ou accéder aux infos du routeur (chemin, paramètres, ...)

Et le gros plus de cette bibliothèque : elle peut aussi s'utiliser coté serveur, 
pour la génération des vues et éviter ainsi de dupliquer du code puisqu'on va 
pouvoir carrément utiliser tel quel le fichier précédent. Plutôt cool&nbsp;!
Voici un exemple de *middleware* pour faire marcher ça dans Express&nbsp;:

```javascript
var React = require("react");
var Router = require("react-router");

// notre fichier routes.js
var routes = require("./src/routes");
// notre template de page html
var Html = require("./src/html");

function reactView(req, res, next) {
  Router.run(routes, req.url, function (Handler, state) {
    // on récupère les données pour cette vue en fonction de la requête.
    var data = getViewData(req);
    
    // on génère la soupe au tag avec nos données dedans
    var markup = React.renderToString(React.createElement(Handler), data);
   
    // on utilise React comme moteur de template
    var HtmlElement = React.createElement(Html, {markup: markup});  
    res.send("<!DOCTYPE html>" +  React.renderToStaticMarkup(HtmlElement));
  });
}
```
Et voici le composant `Html.jsx` que l'on utilise comme *template* pour notre page principale.

```jsx 
var React = require('react');

var Html = React.createClass({
  render: function() {
    return (
      <html>
        <head>
          <meta charSet="utf-8"></meta>
          <title>Mon site perso</title>
          <script src="/js/app.js" />
        </head>
        <body>
          <div id="react-app" dangerouslySetInnerHTML={{__html: this.props.markup}} />
        </body>
      </html>
    );
  }

});

module.exports = Html;
```
Une fois que le code HTML a été généré via`React.renderToString(React.createElement(Handler), data);`, 
on pourrait utiliser n'importe quel moteur de template (lodash.template, handlebars, ejs, jade, PHP...) 
pour générer le HTML de la page à renvoyer. Dans un souci de rationalisation des outils, 
j'ai préféré utiliser React. 

Vous avez dû vous apercevoir qu'on utilise 2 méthodes différentes pour générer 
du HTML avec React&nbsp;:
- `React.renderToString(React.createElement(Handler), data);`
- `React.renderToStaticMarkup(React.createElement(Handler), data);`

La différence entre les deux méthodes est simple. Dans la première, React annote 
les nœuds HTML avec des `data-reactid` dans le but de pouvoir ensuite reprendre 
la main lorsque votre l'application s'exécutera dans le navigateur. De cette manière, 
React sait que vous l'initialisez avec un contenu généré depuis le serveur. 
Et si il détecte une différence entre le code existant et celui qu'il génère, 
vous aurez droit à un [petit warning](https://github.com/facebook/react/blob/2aeb8a2a6beb00617a4217f7f8284924fa2ad819/src/browser/ui/__tests__/ReactRenderDocument-test.js#L205-L215). 
La deuxième méthode permet de générer du code HTML sans annotations, 
comme n'importe quel moteur de *template*.

Les plus attentifs auront remarqué qu'on passe les données initiales lors de 
la création de l'application via des *props* React. Quid de l'utilisation 
de flux dans tout ça ?

## Flux et le rendu serveur
Avec [Flux](http://facebook.github.io/flux/), ce sont les stores qui maintiennent 
l'état de notre application. Si l'on ne veut pas afficher notre application 
sans aucune données, nous allons devoir préalablement peupler nos stores 
avant d'appeler `React.renderToString()`. 

Là où ça se corse un peu, c'est qu'il va falloir remplir nos stores avant de démarrer 
notre application sous peine de voir le message d'alerte dont je parlais plus haut. 
Le plus simple alors est de passer ces données au moteur de template, 
en plus du markup (par exemple sous la forme d'un nœud `<script type="application/json">JSON DATA</script>`.
Il ne reste plus qu'a récupérer ces données avant d’appeler `React.render( Application, document.getElementById("react-app"))`

Par exemple&nbsp;: 

```javascript
document.addEventListener("DOMContentLoaded", function(event) {
  // getData() va récuperer et parser le contenu du tag script 
  // qui contient nos données
  var storeData= getData(); 

  // on déclenche une actions
  actions.init( storeData);

  // on lance le rendu
  React.render(<App />, document.getElementById("react-app"));
});
```

## Le mot de la fin
Penser son application React pour qu'elle puisse être rendue coté serveur 
introduit de nouvelles problématiques, notamment avec l'ajout du *pattern* Flux. 
En fonction des pages que l'on souhaite afficher, on devra initialiser différents *stores*. 
À nous de déterminer, en fonction de l'URL et du composant à afficher, 
lequel initialiser, et cela, que l'on soit sur le client ou le serveur. 
De la même manière, il faudra être capable de charger nos données, indépendamment 
de l'environnement d’exécution (coucou XHR).

Un début de réponse se trouve dans les exemples fournis avec react-router. 
L'idée est de passer par une propriété `statics` lors de la création des composants React 
qui seront associés à une `<Route/>`.

```jsx

var ProjectPage = React.createClass({ 
  statics: {
    fetchData: function(params){
      return api.getPageData(params.url)
        .then( actions.initProject)
        .catch( actions.loadProjectError);
    }
  }
 ...
 }); 
```

Dans ce bloc `statics`, on définit une fonction qui servira à récupérer les données 
pour ce composant mais on pourrait très bien imaginer retourner la liste d'actions 
à lancer ou encore les *stores* à initialiser voire même un descripteur des données nécessaires 
à la vue ([cf Relay / GraphQL](https://www.youtube.com/watch?v=9sc8Pyc51uU)) 

Ensuite, lorsque le callback fourni à `Router.run()` est appelé, il suffit de parcourir 
les *Handler* pour récupérer les informations contenues dans les blocs `statics`, 
les traiter et enfin faire `React.render()`.

```Javascript
// On renvoie une promesse qui sera résolue lorsque que toutes les données démandées via fetchData seront reçues.
Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  var p = Promise.all(state.routes
    .filter(route => route.handler.fetchData)  // définit fetchData
    .map(route => {
      return route.handler.fetchData(state.params);
    })
  );
  p.then( x => {
    React.render(<Handler {...state} />, document.getElementById("react-app"))
  });
});
```
Le principe est simple et peut être facilement encapsulé dans un module pour 
être partagé entre le client et le serveur.  J'espère que cet article vous a permis 
d'appréhender un peu mieux le rendu coté serveur d'une application React. 
N'hésitez pas à laisser des commentaires si vous avez des questions où 
si vous souhaitez partager vos expériences dans ce domaine. 

Et quelques liens vidéo des sessions de la #reactjsconf :
- [React.js Conf 2015 - react-router increases your productivity ](https://www.youtube.com/watch?v=XZfvW1a8Xac) 
- [React.js Conf 2015 - Hype!](https://www.youtube.com/watch?v=z5e7kWSHWTg) : un aperçu des possibilités de react-router
