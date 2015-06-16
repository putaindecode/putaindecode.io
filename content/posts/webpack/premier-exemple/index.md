---
date: "2015-07-07"
title: Premier exemple d'utilisation de Webpack
tags:
  - javascript
  - task-runner
authors:
  - MoOx
header:
  image: ../index.jpg
  linearGradient: 160deg, rgb(204, 51, 51), rgba(204, 51, 51, .6)
---

Si vous êtes intéressé par
[les problématiques que peut résoudre Webpack](/posts/webpack),
vous serez surement intéressé par cette petite configuration détaillée, qui vous
permettra de faire vos premiers pas avec cet outil.

Nous allons mettre en place une configuration assez basique qui
va permettre:

- d'avoir une partie JavaScript pour votre application/site web,
- de consommer vos CSS en tant que modules,
- de consommer les assets de vos CSS en tant que module (images, fonts...).

La configuration de webpack se fait via un fichier JavaScript.
Par défaut il doit être nommé `webpack.config.js`.
Ne tournons pas autour du pot et voyons un fichier de configuration
correspondant à ce que nous avons décrit juste avant.

```js
var path = require("path")
var webpack = require("webpack")
var ExtractTextPlugin = require("extract-text-webpack-plugin")

// on peut passer à notre commande de build l'option --production
// on récupère sa valeur ici en tant que booléen
var production = process.argv.indexOf("--production") > -1

module.exports = {
  // nos points d'entrée, par clé
  // (on peut en définir plusieurs)
  entry: {
    index: [
      "./src/index.js",
    ],
  },

  // description de nos sorties
  output: {
    // ./dist
    path: path.join(__dirname, "dist"),
    // nous aurons (vu notre point d'entrée)
    // - dist/index.js
    filename: "[name].js",
    // notre base url
    publicPath: "/",
  },

  resolve: {
    // ici on peut ajouter nos extensions à résoudre lors d'un require()
    // on va rester simple en autorisant rien, ou .js(on) (comme en nodejs et
    // browserify)
    extensions: [
      "",
      ".js",
      ".json",
    ],
  },

  module: {
    // liste de nos loaders
    // ! \\ à noter que les loaders sont exécuté en ordre inverse
    // les premiers en derniers, en utilisant la sortie du suivant
    loaders: [
      {
        // pour tous les fichiers qui finissent par .js
        test: /\.js$/,
        // ... en prenant bien le soin d'exclure les node_modules
        exclude: /node_modules/,

        // on ajoute les loaders babel et eslint
        // à vous de voir ce que vous aurez besoin
        // ("rien" est une option tout à fait valable si vous codez en ES5
        // sans linter)
        loaders: [
          "babel",
          "eslint",
        ],

        // à noter que l'on peut définir les loaders de cette façon
        // loader: "babel!eslint",

        // à noter aussi, webpack va tenter de loader des modules ayant dans
        // leur nom "-loader". Si ce n'était pas le cas, ou que votre loader
        // ne comporte pas -loader, vous pouvez spécifier le nom entier:
        // loader: "babel-loader!eslint-loader",
      },
      // à l'inverse de node et browserify, webpack ne gère pas les json
      // nativement, il faut donc un loader pour que cela soit transparent
      {
        test: /\.json$/,
        loaders: [
          "json",
        ],
      },
      {
        // pour nos CSS, on va utiliser un plugin un peu particulier
        // qui va nous permettre de require() nos css comme un module
        // mais qui va tout de même permettre de sortir tout cela dans un seul
        // fichier .css pour la production
        // (selon un paramètre qu'on définira ci-dessous)
        test: /\.css$/,
        // cette méthode possède 2 paramètres:
        // + loaders à utiliser si ce module est désactivé
        // + loaders à utiliser dans tous les cas en amont
        loader: ExtractTextPlugin.extract(
          // si on extract pas, on utilisera le loader suivant
          // (ce module chargera les styles dans des tags <style>, suffisant
          // en mode dév)
          // en production vous devrez vous charger d'utiliser un
          // <link rel="stylesheet" ...
          "style",
          // dans tous les cas, on utilisera cssnext ainsi que le loader css
          // de base (celui ci permet de gérer les ressources dans le css
          // en temps que modules: images, font etc)
          "css!cssnext"
        ),
      },
      // pour la suite, on va rester simple:
      // un require() en utilisant le file-loader retournera une string avec
      // le nom du fichier et (le plus important) copiera le fichier suivant
      // le paramètre "name" dans le l'output.path que nous avons défini tout
      // au début de notre configuration.
      {
        // on chargera tous les formats d'images qui nous intéresse en tant
        // que fichiers.
        test: /\.(ico|jpe?g|png|gif)$/,
        loaders: [
          "file?name=[path][name].[ext]&context=./src",
          // Vous remarquerez ici la façon qu'on peut utiliser pour définir
          // des options pour les loaders. Il en existe d'autres avec les
          // versions les plus récentes en utilisant la clé "query"
        ],
      },
      {
        // idem pour les fonts
        test: /\.(woff|ttf|otf|eot\?#.+|svg#.+)$/,
        loaders: [
          "file?name=[path][name].[ext]&context=./src",
        ],
      },
      {
        // ici on se permet de loader des fichiers html et txt tel quel
        test: /\.(html|txt)$/,
        loaders: [
          "file?name=[path][name].[ext]&context=./src",
        ],
      },
    ],
  },

  // en plus des loaders, qui premettent eux de modifier et/ou d'exploiter le
  // contenu des modules, nous avons des plugins, plus globaux au processus
  plugins: (
    [
      // une partie importante dans notre cas: on active l'extraction css (en
      // production seulement)
      new ExtractTextPlugin("[name].css", {disable: !production}),

      // ce plugin permet de transformer les clés passés en dur dans les
      // modules ainsi vous pourrez faire dans votre code js
      // if (__PROD__) { ... }
      new webpack.DefinePlugin({
        __PROD__: production
      }),
    ]
    // en production, on peut rajouter des plugins pour optimiser
    .concat(
      production
      ? [
        // ici on rajoute uglify.js pour compresser nos sorties
        // (vous remarquerez que certain plugins sont directement livré dans
        // le package webpack).
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false,
          },
        }),
      ]
      : []
    )
  ),

  // certains modules permettent de définir des options en dehors de la
  // définition des loaders
  cssnext: {
    sourcemap: !production,
    compress: production,
  },
}
```

_Ce fichier est à peu près ce que nous utilisons pour notre site à l'heure où
est écrit cette article._

Une fois webpack mis en place, vous aurez bien moins l'impression de bricoler
surtout quand il s'agit de consommer des assets de modules tiers (par exemple
font awesome).

Sachez que vous pouvez très facilement écrire vos propres loaders pour wrapper
l'utilisation d'un outil qui n'aurait pas encore de loader.
[Exemple du loader cssnext](https://github.com/cssnext/cssnext-loader/blob/master/index.js).

## Utilisation

Il y a plusieurs façon d'utiliser maintenant notre configuration, la plus simple
étant surement la CLI:

```console
$ webpack
```

Cela devrait suffire à s'occuper de notre configuration. Cette commande comporte
bien entendu tout un tas d'options qui correspondent souvent à ce que nous
avons défini juste avant.
Cela étant dit, il parait plus maintenable de gérer une fichier plutôt qu'une
ligne de commande de 3km.

Vous devriez avoir ainsi tout le résultat dans `dist/`.

Il y a tout un tas de façon d'utiliser webpack via une tripoté de plugins
(gulp, grunt etc) mais nous allons voir justement ici comment ne pas avoir
recours à ces solutions, ce qui nous permettra ainsi de s'alléger.

### Utilisation en développment

Webpack CLI possède une option `--watch` qui va surveiller les sources et mettre
à jour tout le nécessaire à la moindre modification.
À la différence de browserify, cette fonctionnalité est dans le core et très
bien intégré.
De plus le cache de webpack est plutôt bien foutu. La première compilation peut
paraître un peu lente, mais la suite est vraiment au top.

A côté de cette option, webpack va plus loin.

En développement, nous avons besoin de servir toutes les ressources que notre
processus va gérer.
Plutôt que d'utiliser le système de fichier classique, abusé par Grunt et tout
de même utilisé par Gulp & co, webpack fournit un `webpack-dev-server`.

Ce petit serveur local permettra de servir tout ce dont nous avons besoin
(nos js, css, images etc) sans avoir recours au système de fichier.

Comme pour la commande `webpack`, le serveur de développement propose aussi
une CLI basé sur l'option `--watch` mais sans l'incovénient de l'écriture sur
disque:

```console
$ webpack-dev-server --content-base dist/
```

_Source: http://webpack.github.io/docs/webpack-dev-server.html_

Une fois que votre serveur est démarré, pourrez tester que votre point d'entrée
marche avec `http://localhost:8080/index.js`.

Il existe bien entendu une API, que nous utilisons à l'heure actuelle sur notre
site, afin d'ajuster notre configuration webpack en développement, pour
d'ajouter des fonctionnalités comme le "hot loading".

Vous avez à votre disposition
[notre script dev-server](https://github.com/putaindecode/putaindecode.fr/blob/2c1a8f23ec05768960617625f592ea30ed6e2062/scripts/webpack-dev-server.js)
(écrit en ES6/7), ainsi que son utilisation
[dans notre build](https://github.com/putaindecode/putaindecode.fr/blob/2c1a8f23ec05768960617625f592ea30ed6e2062/scripts/build.js#L154-L159).

_Note: pour avoir une éventuelle version plus à jour, regardez l'historique de
ces fichiers au cas où nous ayons poussé des ajustements (ou remplacer le hash
par "master" dans l'url et priez)._

#### Hot (re)loading

Ce serveur possède bien entendu des fonctionnalités de similaire au classique
"livereload", appelé _hot mode_ (ou hot loading).

Tout comme pour le livereload, il faut intégrer dans sa page un script
particulier. Il y a plusieurs façons de faire:

- intégrer `http://localhost:8080/webpack-dev-server.js` via un tag script
- ajouter `webpack/hot/dev-server` dans les tableaux des points d'entrées

_Source: http://webpack.github.io/docs/webpack-dev-server.html#hot-mode_

Notre script dev-server référencé juste avant d'occupe d'ajouter la ressource
automatiquement en mode dev.

À la différence d'un simple livereload, ce hot loading permet des choses qu'on
aurait jusqu'alors pas vraiment imaginé, comme du hot reload de JavaScript de
composant React (sans rafraichissment complet de page, donc sans perte d'état).

**Vous êtes invité à regarder la vidéo que vous trouverez sur la page du
[react-hot-loader](https://github.com/gaearon/react-hot-loader).**

Nous n'irons pas plus loin sur ce hot mode, car il nécessiterait un articlé dédié
(non pas que ce soit compliqué mais plus parce que c'est un sujet à part).

### Utilisation en production

```console
$ webpack --production
```

Notre configuration détecte l'option `--production` et ajuste déjà en
conséquence.
Il faut éventuellement utiliser la variable prévue pour ajuster vos loaders s'il
propose des options d'optimisation.

Maintenant, il n'y aura plus qu'à voir tout le résultat dans `dist/`.

---

Nous avons vu ici un exemple assez simple qui peut être utilisé pour un site web
ou une appplication simple.

Une question se pose alors:

> À la vue de ce que peut gérer webpack et ses loaders, est-il pertinent de
continuer à utiliser des task runners pour nos assets et compagnies ?

**La réponse est non.** 😱

Vous verrez assez rapidement que vous devriez pourvoir tout jeter à la poubelle.
Sans trop de regrets.

Nous l'avons fait pour notre site, pourquoi pas vous ?

Et notre interface n'as pas changé d'un poil puisque nous utilisons toujours les
mêmes commandes via les
[npm scripts](https://docs.npmjs.com/misc/scripts):

- `npm start` pour dév
- `npm run build --production` avant de déployer en production.

Il existe encore beaucoup de leviers à toucher dans le cas
d'application full JavaScript afin d'améliorer bien des points.

Vous trouverez facilement tout un tas de
[webpack boilerplate](https://duckduckgo.com/?q=webpack+boilerplate)
avec des amélirorations diverses et variés selon vos besoins.

Soyez curieux !
