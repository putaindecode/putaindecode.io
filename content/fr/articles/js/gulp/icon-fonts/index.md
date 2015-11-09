---
date: "2014-05-14"
title: Créez vos iconfonts avec gulp-iconfont
tags:
  - gulp
  - nodejs
  - frontend
  - svg
  - fonts
  - glyphicons
authors:
  - kud
---

Après [notre introduction sur gulp](/posts/js/introduction-gulp/), je vous propose de créer vos propres fontes à partir d'icônes.

J'ai bien galéré lorsque j'ai dû passer de **grunt** à **gulp**. Non pas que gulp soit compliqué mais retrouver exactement le même _workflow_ qu'avant, sachant que gulp est jeune et que les _plugins_ sont bien moins nombreux que sur grunt, c'est pas si évident que ça.

M'enfin, il y a toujours une solution à un problème.

Justement, là, mon problème était de répliquer mon _process_ de **svg-to-font**.

Je me suis creusé les méninges et j'ai finalement trouvé. Cette solution, je vous la propose.

## gulp-iconfont

Tout d'abord, installez **gulp** (évident...) et faites ce que vous avez à faire avec gulp.

Maintenant, vous êtes prêt(e) ? Okay, go.

### Installez les _packages_ adéquats

Oui, deux packages, [gulp-iconfont](https://github.com/nfroidure/gulp-iconfont) et [gulp-iconfont-css](https://github.com/backflip/gulp-iconfont-css).

```console
$ npm install gulp-iconfont gulp-iconfont-css --save-dev
```

### Importez-les

```js
// import
var gulp = require('gulp')

var iconfont = require('gulp-iconfont')
var iconfontCss = require('gulp-iconfont-css')
```

### Créez votre propre tâche gulp

Je préconise d'appeler toute transformation d'une image vers une fonte "glyphicon".

```js
// glyphicons
gulp.task('glyphicons', function() {
 return gulp.src('src/glyphicons/**/*') // où sont vos svg
    .pipe(iconfontCss({
      fontName: 'icons', // nom de la fonte, doit être identique au nom du plugin iconfont
      targetPath: '../../styles/shared/icons.css', // emplacement de la css finale
      fontPath: '../fonts/' // emplacement des fontes finales
    }))
    .pipe(iconfont({
      fontName: 'icons' // identique au nom de iconfontCss
     }))
    .pipe( gulp.dest('src/assets/fonts') )
})
```


### Le final

Voilà l'écriture entière de la tâche :

```js
// import
var gulp = require('gulp')

var iconfont = require('gulp-iconfont')
var iconfontCss = require('gulp-iconfont-css')

gulp.task('glyphicons', function() {
 return gulp.src('src/glyphicons/**/*')
    .pipe(iconfontCss({
      fontName: 'icons', // nom de la fonte, doit être identique au nom du plugin iconfont
      targetPath: '../../styles/shared/icons.css', // emplacement de la css finale
      fontPath: '../fonts/' // emplacement des fontes finales
    }))
    .pipe(iconfont({
      fontName: 'icons' // identique au nom de iconfontCss
     }))
    .pipe( gulp.dest('src/assets/fonts') )
})
```

Et voilà, on est bon. On peut transformer nos _svg_ en _font_. \o/
