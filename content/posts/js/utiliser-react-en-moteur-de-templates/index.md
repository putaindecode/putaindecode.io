---
date: "2015-05-05"
route: "/posts/js/utiliser-react-en-moteur-de-templates/"
title: "Utiliser React en moteur de templates"
tags:
  - javascript
  - react
authors:
  - MoOx
---

Vous connaissez probablement tous des moteurs de templates.
En JavaScript nous avons Handlebars, Jade, EJS, Slim...
Tous ces projets partent de bonnes intentions mais à l'utilisation,
on peut sentir des limitations et donc de l'insatisfaction.

Utiliser Handlebars par exemple, c'est un peu devoir coder tout un tas de helpers
pour gérer une partie de votre affichage, ça peut vite devenir lourd.
Être restreint à une syntaxe limité par choix est un peu frustrant.
Quand c'est pas ça, c'est la syntaxe du moteur qui va être lourde.

On peut en regretter PHP. Faut avouer que ce language était plutôt simple
à utiliser en tant que moteur de template.
Efficace et pas de restrictions. On trouve même parfois des `mysql_query()`
dans des templates…

Blague à part, nous cherchions des langages pour refaire une partie de notre site
puisque nous n'étions pas vraiment satisfaits du processus actuel
(anciennement Handlebars, puis Jade).
Mais au final, pourquoi de pas rester avec du JavaScript purement et simplement ?

C'est ce que nous avons fait avec React qui est de plus en plus utilisé.
Sa syntaxe est plutôt libératrice.
Il faut dire que le XML a beau être verbeux, pour définir des
éléments ayant des propriétés et des enfants, on a pas vraiment fait plus
lisible et clair sur ce point. Le HTML est plutôt simple à prendre en main c'est
certain. Les méthodes de rendu de React (ce qui va nous intéresser) sont très proche
de l'HTML.

Ceux qui ont utilisé JSX (bien qu'ayant pu avoir des nausées au premier contact)
avouent souvent qu'ils ont fini par aimer cette petite syntaxe créée par Facebook qui
fonctionne très bien avec React.

Du coup, si on utilisait ça pour faire de simple templates et non pas des composants
d'interface utilisateur dynamiques ? Qui peut le plus peut le moins (quoi qu'en
fait, des templates, c'est un peu des composants d'interface).

## Exemple de template React/JSX

Si vous ne savez pas trop ce qu'est React, nous vous recommandons de lire
notre [introduction à React](/posts/js/introduction-a-reactjs/).

Dans notre cas, on ne va pas spécialement bénéficier de certaines de ses forces,
mais ça fera très bien le job pour notre besoin.

Nous n'aborderons pas dans le détail la syntaxe React/JSX, ni ES6, pour rester
focalisés sur la finalité (on a prévu des articles à ce propos, en attendant
  [voici de quoi vous occuper avec ES6](http://babeljs.io/docs/learn-es6/)).

_Attention, pour ceux qui sont encore sur des plugins jQuery, ça risque de vous
piquer les yeux._

```js
import React, {Component} from "react"

export default class PostTemplate extends Component {

  static displayName = "PostTemplate"

  render() {
    return (
      <html>
        <head>
          <title>{this.props.pageTitle}</title>
        </head>
        <body>
          <article className="org-Post">
            <header className="org-Post-header">
              <h1>{this.props.pageTitle}</h1>
            </header>
            <div
              className="org-Post-content"
              dangerouslySetInnerHTML={{__html: this.props.pageContent}}
            />
          </article>
        </body>
      </html>
    )
  }
}
```

Ce que vous voyez c'est bien du JavaScript. Un peu amélioré via JSX, on ne va
pas le nier (dans notre cas, on gère tout ça de manière transparente avec
[babel(-node)](http://babeljs.io/)).

Ça ressemble drôlement à de l'HTML et c'est ça qui est appréciable pour nous.
Vous noterez que l'attribut pour définir une classe HTML est `className` puisque
React est en JavaScript et que le mot `class` est réservé
(cf. la définition en ES6 de la classe).

En même temps ce qui est cool, c'est qu'on reste dans du JavaScript
(rappelez-vous que JSX est transformé en appel de fonctions JavaScript au final).

On peut donc utiliser toutes nos bibliothèques préférés via _npm_ pour l'affichage
(exemple : `momentjs`), ou simplement des boucles via les méthodes de parcours de
tableau tel que `forEach()` ou `map()` en appelant d'autres composants.

Ci-dessous vous trouverez un exemple plus complexe avec une page pour la liste
des posts et quelques composants.
Les balises qui ressemblent à de HTML et qui commencent par une majuscule sont liés à des
composants qui doivent être définis (dans notre cas importés).
C'est une particularité de React.

```js
import React, {Component} from "react"

import Html from "../Html"
import Head from "../Head"
import Body from "../Body"
import PostsList from "../PostsList"

export default class Posts extends Component {

  static displayName = "Posts"

  render() {
    return (
      <Html>
        <Head title={this.props.file.title} />
        <Body>
          <h1>{this.props.file.title}</h1>
          <PostsList
            posts={
              this.props.collections.posts
                .filter(function() {
                /* ce que vous voulez pour filtrer votre collection */
                }
              }
          />
        </Body>
      </Html>
    )
  }
}
```

Voici deux exemples de composants utilisés ci-dessus :

### Head

```js
import React, {Component} from "react"

export default class Head extends Component {

  static displayName = "Head"

  render() {
    return (
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=Edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimal-ui"
        />
        <title>{this.props.title}</title>
        <link
          rel="stylesheet"
          href="/index.css"
        />
        <link
          rel="alternate"
          href="/feed.xml"
          title={this.props.title}
          type="application/atom+xml"
        />
        {this.props.children}
      </head>
    )
  }
}
```

### Body

```js
import React, {Component, PropTypes} from "react"

import Header from "../Header"
import Footer from "../Footer"
import GoogleAnalytics from "../Analytics"

export default class Body extends Component {

  static displayName = "Body"

  render() {
    return (
      <body>

        <Header />

        <div className="Main">
          {this.props.children}
        </div>

        <Footer />

        <script src={"/index.js"}></script>

        <GoogleAnalytics />

      </body>
    )
  }
}
```

Bon c'est bien beau mais comment je gère l'affichage du composant initial
au final (le parent) ?

## Comment utiliser un template React/JSX ?

C'est bien simple. Dans notre cas, pas besoin de React côté client. On doit gérer
ça côté « serveur » (je met ça entre guillement puisque dans notre cas précis, c'est
pour générer un site statique, et c'est donc sur une machine quelconque que la
génération se fait).

Voilà de quoi effectuer le rendu de nos composants vers du bon vieux HTML (car c'est la finalité
d'un _moteur de template_).

```js
import react from "react"
import markdownify from "./markdown-parser"
// je vous conseille marked pour rendre du markdown
// c'est ce que nous utilisons pour rendre nos pages à l'heure où j'écris ce post

const reactClass = require("./template/PostTemplate")
const component = new (react.createFactory(reactClass))({
  // ici on passe nos "props" react
  pageTitle: "Test",
  pageContent: markdownify("Imaginons du **markdown** parsé"),
  // vous pouvez bien entendu rajouter d'autres choses
  collections: {
    posts: [
      //...
    ]
  }
})

let html
try {
  html = react.renderToStaticMarkup(component)
}
catch (err) {
  // Vous devrez gérer votre exception selon votre environnement
  // si c'est pour un test on peut simplement ne pas utiliser
  // try/catch, ça nous pètera à la gueule et c'est tant mieux
  throw err
}

// maintenant vous faites ce que vous voulez de votre string html !
// ex: require("fs").writeFile(...)
```

La méthode intéressante de React est dans notre cas `renderToStaticMarkup()` qui
va nous générer un HTML qui va bien.

Pour aller plus loin on pourrait décider d'utiliser `renderToString()` plutôt que
`renderToStaticMarkup()` afin de pouvoir faire prendre le relais à ReactJS côté client
mais là [le niveau de complexité est différent](/posts/js/reactjs-et-rendu-serverside/).

Pour la petit anecdote, notre site utilise actuellement [metalsmith](http://www.metalsmith.io/),
une petite bibliothèque simple mais qui permet par son API de faire des choses sympas.

J'ai donc codé [quelques plugins metalsmith](https://github.com/search?q=user%3AMoOx+metalsmith)
dont un [metalsmith-react](https://github.com/MoOx/metalsmith-react) à l'occassion.

N'hésitez pas à consulter
[le code source de notre site](https://github.com/putaindecode/putaindecode.fr)
pour faire des découvertes sympa.
