---
date: "2015-10-20"
title: Gérer son thème WordPress avec Webpack
tags:
  - wordpress
  - webpack
  - javascript
  - task-runner
authors:
  - MoOx
header:
  credit: https://www.flickr.com/photos/4everyoung/2505890793/
  linearGradient: 160deg, rgb(204, 51, 51), rgba(204, 51, 51, .6)
---

# Pourquoi Webpack pour gérer son thème WordPress ?

La réponse est la même qu'à la simple question
["pourquoi Webpack ?"](/posts/webpack/).
L'intérêt principal est d'obtenir des rapports d'erreurs liés à
la gestion des assets (images, fonts, etc).

Qu'y a-t-il de si particulier à savoir pour utiliser Webpack pour gérer un thème
WordPress ? Pas grand chose, mais voici de quoi vous faire gagner (peut-être)
un peu de temps.

Il y a certainement plusieurs façons de gérer son thème WordPress
avec Webpack. Celle que je vous propose va se limiter à des choses
simples en concentrant le code dans le répertoire du thème pour plus de
modularité.

Pour commencer, deux choses importantes à savoir :

- Ne mettez pas de CSS dans le fameux `style.css` à la racine de votre thème,
laissez juste le cartouche en commentaire (sans lequel WordPress ne détectera
pas votre thème...) ;
- créez un dossier `src` dans votre thème, où nous
mettrons nos "sources", la partie du thème "compilé" sera dans un dossier
`dist` et n'aura donc pas besoin d'être versionnée.

La seule petite chose à laquelle il faut faire attention finalement, c'est de
bien configurer le `publicPath` de Webpack afin que les fichiers qu'il génère
soient bien dans le bon chemin, et que les ressources liées (dans les fichiers CSS
par exemple) comportent les bons chemins relatifs (à la racine du site).

Avec l'arborescence suivante, nous n'aurons pas de difficulté à faire une
configuration portable :

```
- htdocs
  - wp-content
    - themes
      - putaindetheme
        - node_modules
        - src
          - index.js
          - index.css
          - images/*
          - fonts/*
        - style.css
        - webpack.config.babel.json
        - package.json
- package.json
```

En plus de cela, nous pouvons ajouter une sorte de raccourci via un
`package.json` supplémentaire à la racine de notre projet :

```json
{
  "private": true,
  "scripts": {
    "start": "cd htdocs/wp-content/themes/putaindetheme && npm start",
    "build": "cd htdocs/wp-content/themes/putaindetheme && npm run build"
  }
}
```

Ce petit raccourci nous évitera de devoir nous taper en CLI tout le chemin du
thème et nous pourrions même, pourquoi pas, rajouter un
`"prestart": "open http://yourlocalhost.tld"` afin d'ouvrir automatiquement
le projet dans le navigateur lorsque nous démarrerons notre développement via
`$ npm start`.

Voyons rapidement donc le `package.json` du thème ainsi que la config Webpack.

`package.json`

```json
{
  "private": true,
  "scripts": {
    "start": "webpack --config=webpack.config.babel.js --watch",
    "build": "webpack --config=webpack.config.babel.js -p"
  },
  "devDependencies": {
    "babel": "^5.8.12",
    "babel-core": "^5.8.12",
    "babel-loader": "^5.3.2",
    "css-loader": "^0.15.6",
    "eslint": "^0.24.1",
    "eslint-loader": "^0.14.2",
    "extract-text-webpack-plugin": "^0.8.2",
    "file-loader": "^0.8.4",
    "json-loader": "^0.5.2",
    "postcss-cssnext": "^2.1.0",
    "postcss-import": "^7.0.0",
    "postcss-loader": "^0.6.0",
    "postcss-url": "^5.0.2",
    "style-loader": "^0.12.3",
    "webpack": "^1.10.5"
  },
  "dependencies": {
    "normalize.css": "^3.0.3"
  }
}
```

Quelques petites notes sur ce contenu :

- `private` sert à éviter la publication de votre "paquet" sur npm, ainsi qu'à
devoir remplir certains champs tels que `name` et compagnie ;
- nous mettrons dans `devDependencies` les dépendances pour le développement et
dans `dependencies` les dépendances qui seront dans le build final. Ici, j'ai
simplement mis `normalize.css` pour exemple, mais vous pourriez très bien avoir
aussi jQuery (:trollface:) ou React ;
- les scripts utilisent `webpack.config.babel.js` afin de pouvoir définir la
configuration en es6/7 via _babel_.

Voyons maintenant la config `webpack.config.babel.js` :


```js
// Note: le code ci-dessous est mal rendu
// Une issue est ouverte à ce propos
// https://github.com/isagalaev/highlight.js/issues/958

import "babel/polyfill"
import path from "path"
import ExtractTextPlugin from "extract-text-webpack-plugin"
import postcssImport from "postcss-import"
import postcssUrl from "postcss-url"
import postcssCssnext from "postcss-cssnext"

const production = process.argv.includes(`-p`)

const theme = path.basename(__dirname)
const src = path.join(__dirname, `src`)

export default {
  entry: {
    index: [`${ src }/index.js`],
  },

  output: {
    path: path.join(__dirname, `dist`),
    filename: `[name].js`,
    publicPath: `wp-content/themes/${ theme }/dist/`,
  },
  resolve: {
    extensions: [
      ``,
      `.js`,
      `.json`,
    ],
  },

  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: `json-loader`,
      },
      {
        test: /\.js$/,
        loaders: [
          `babel-loader`,
          `eslint-loader`,
        ],
        include: src,
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          `style-loader`,
          [
            `css-loader`,
            `postcss-loader`,
          ].join(`!`)
        ),
      },
      {
        test: /\.(ico|jpe?g|png|gif)$/,
        loader: `file-loader?name=[path][name].[ext]&context=${ src }/`,
      },
    ],
  },

  plugins: [
    new ExtractTextPlugin(`[name].css`, {disable: !production}),
  ],

  postcss: function() {
    // https://github.com/postcss/postcss-loader/issues/31
    const webpack = this

    return [
      postcssImport({
        onImport: (files) => files.forEach(webpack.addDependency),
      }),
      postcssUrl(),
      postcssCssnext({
        browsers: `last 2 versions`,
      }),
    ]
  },
}
```

_Bien entendu, libre à vous d'adapter les loaders Webpack à utiliser, ainsi que
la configuration PostCSS par exemple._ Faites un tour sur notre article de
[premier exemple de configuration Webpack](/posts/webpack/premier-exemple/) afin
d'y voir plus clair.

Il nous reste maintenant à ajouter dans notre thème WordPress les
références à nos points d'entrées CSS et JavaScript que sont `index.css` et
`index.js`.

Pour faire simplement, dans votre fichier `functions.php` (oui, le fichier qui a un nom
qui n'indique pas du tout ce pour quoi tout le monde se sert du fichier, c'est à
dire la configuration du thème au runtime...), on va ajouter une petite constante
qui servira à adapter votre thème en fonction de l'environnement :

```php
// ENV est à définir dans votre configuration Apache par exemple.
// Si vous ne voulez pas y toucher, vous pouvez plutôt définir d'une autre façon
// en testant le SERVER_NAME par exemple
define('ENV', getenv('ENV'));

// en local, on pourrait définir ENV à "development"
```

*Nous pourrions dans ce fichier utiliser l'API de Wordpress pour enregister nos
`index.css` et `index.js` via les méthodes `wp_(de)register_`, mais nous
resterons simples pour l'exemple.*

Vu qu'on utilise le `style-loader` de Webpack en développement, on ne va ajouter
notre feuille de style qu'en production (dans le `<head>`).

```php
<?php if (ENV != "development"): ?>
  <link rel="stylesheet" href="<?php echo get_bloginfo('template_directory') ?>/dist/index.css" />
<?php endif; ?>
```

Pensez aussi à supprimer la référence à `style.css` dans `header.php`.

Dans la même idée mais en plus simple, on va ajouter dans notre `footer.php`.

```php
<script src="<?php echo get_bloginfo('template_directory') ?>/dist/index.js"></script>
```

Rien de bien compliqué finalement.

*Attention si votre thème hérite d'un autre,
`get_bloginfo('template_directory')` ne pointera pas vers votre thème mais le
thème parent. Il vous faudra donc ajuster le code 😑.*

---

Pour le test vous pouvez mettre dans les CSS et JS :

`index.css`

```css
@import "normalize.css";
body {
  background: red;
}
```

Notez ici que par la façon dont nous avons défini Webpack ci-dessus, vous
devriez placer et référencer vos assets (images & co), depuis `src`. Exemple :

```css
html {
  background: url(./images/background.jpg)
  /* => wp-content/themes/putaindetheme/src/images/background.jpg */
}
```


Ensuite, dans `index.js`, je vous laisse vous débrouiller :)

```js
console.log("Hey !")
```

Libre à vous maintenant d'ajouter vos dépendances favorites et de remplir vos
`index.css` et `index.js` avec une gestion d'erreurs autre que des requêtes HTTP 
en 404 !
