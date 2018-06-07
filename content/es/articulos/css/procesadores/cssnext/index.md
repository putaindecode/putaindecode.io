---
date: "2015-06-02"
title: Introducción a cssnext
tags:
  - css
  - postcss
authors:
  - Macxim
header:
  credit: https://www.flickr.com/photos/frinky/620935482
---

Según la [página oficial](http://cssnext.io/):

> **cssnext** es un _transpiler_ que permite utilizar desde hoy la sintaxis CSS
> del mañana y transformar las especificaciones CSS que aún no están
> implementadas en los navegadores más populares en CSS compatible.

## ¿Qué significa esto exactamente?

Desde que apareció CSS3, quizás hayas escuchado que el CSS se divide en varios
documentos independientes llamados "módulos". Estos módulos pueden tener
diferentes niveles de estabilidad y
[estados](http://www.w3.org/Style/CSS/current-work#legend). A los navegadores
les puede requirir bastante tiempo poner en práctica dichos módulos y aún más al
W3C atribuirles el estado final de
[Recomendación](http://www.w3.org/2005/10/Process-20051014/tr#RecsW3C).

Con **cssnext** se puede usar la sintaxis de los
[módulos CSS Nivel 4](http://www.xanthir.com/b4Ko0), tales como _propiedades
personalizadas (custom properties)_ o _media queries personalizados_.
**cssnext** va a transformar esta nueva y curiosa sintaxis en algo que el
navegador será capaz de entender.

En resumen, se **adelanta al futuro**.

No sé vosotros, pero yo me considero alguien a quien le gusta experimentar con
las últimas technologías y me parece que ¡esto mola bastante!

No dejéis de echar un vistazo a la
[lista de funciones](http://cssnext.io/features/).

### ¿Y qué pasa con el preprocesador CSS que estoy utilizando ahora?

No os preocupéis más por los peligros de los mixins, @extend y el _nesting_
infinito, en gran parte causados por el uso indebido e innecesario de estas
herramientas.

¿Adivinad qué? No necesitáis nada de esto.

Deberiáis probar **cssnext** y volver al Vanilla CSS de toda la vida. Además,
con una buena pizca de
[metodología BEM](https://github.com/sturobson/BEM-resources), os sentiréis
[vivos otra vez](http://philipwalton.com/articles/side-effects-in-css/).

## Ejemplos

Echemos un vistazo a las funciones que **cssnext** nos ofrece por el momento.

Ante todo, es conveniente consultar el
[playground en la página oficial](http://cssnext.io/playground/).

### Prefijos de navegadores (vendor prefixes) automáticos

```css
.h1 {
  transform: skewX(25deg);
  transition: transform 1s;
}
```

Esto será transformado por **cssnext** gracias a Autoprefixer en:

```css
.h1 {
  -webkit-transform: skewX(25deg);
  -ms-transform: skewX(25deg);
  transform: skewX(25deg);
  -webkit-transition: -webkit-transform 1s;
  transition: transform 1s;
}
```

### Propiedades personalizadas y var() limitadas a `:root`

También conocidas como las tan esperadas
[variables CSS](http://www.w3.org/TR/css-variables/).

```css
:root {
  --primary-Color: #e86100;
  --secondary-Color: #2c3e50;
  --r-Grid-baseFontSize: 1rem;
}
```

Podéis usarlas de esta manera:

```css
.h1 {
  color: var(--primary-Color);
}
.h1:hover {
  color: var(--secondary-Color);
}
body {
  font-size: var(--r-Grid-baseFontSize);
}
```

### Media Queries personalizadas

Para crear alias semánticos, claros y sencillos
([aquí tenéis la documentación](http://dev.w3.org/csswg/mediaqueries/#custom-mq)).

```css
@custom-media --viewport-medium (width <= 40rem);
@custom-media --viewport-large (max-width: 50em);
```

Uso:

```css
@media (--viewport-medium) {
  body {
    font-size: calc(var(--fontSize) * 1.2);
  }
}
@media (--viewport-large) {
  body {
    font-size: calc(var(--fontSize) * 1.4);
  }
}
```

Por ejemplo, digamos que:

```css
:root {
  --fontSize: 1.2rem;
}
```

El código generado sera el siguiente:

```css
@media (max-width: 40rem) {
  body {
    font-size: 1.44rem;
  }
}
@media (max-width: 50em) {
  body {
    font-size: 1.68rem;
  }
}
```

### Selectores personalizados

Primero, podéis echar un ojo a las
[especificaciones](http://dev.w3.org/csswg/css-extensions/#custom-selectors).
Pongamos que queremos aplicar estilos a todos los títulos:

```css
@custom-selector :--heading h1, h2, h3, h4, h5, h6;

:--heading {
  margin-top: 0;
}
```

Esto va a generar el código siguiente:

```css
h1,
h2,
h3,
h4,
h5,
h6 { margin-top; 0; }
```

### `color()`

Una sencilla
[función color](http://dev.w3.org/csswg/css-color/#modifying-colors) para
aplicar unos _ajustes de color_ (tono, luminosidad, saturación, entre otros) a
un color base.

Ejemplos:

```css
.class {
  background-color: color(#2b88e6);
  color: color(#2b88e6 red(+30) green(-50) blue(6%) alpha(0.65));
  border-top-color: color(#2b88e6 saturation(-8%) whiteness(+50%));
  border-right-color: color(#2b88e6 lightness(5%) blackness(-25%));
  border-bottom-color: color(#2b88e6 tint(80%));
  border-left-color: color(#2b88e6 shade(75%));
}
```

Este código de arriba será transformado en:

```css
.class {
  background-color: rgb(43, 136, 230);
  color: rgba(73, 86, 15, 0.65);
  border-top-color: rgb(181, 201, 222);
  border-right-color: rgb(3, 45, 87);
  border-bottom-color: rgb(213, 231, 250);
  border-left-color: rgb(11, 34, 58);
}
```

**cssnext** también ofrece las siguientes funciones relacionadas con los
colores:

#### hwb()

Según las
[especificaciones](http://dev.w3.org/csswg/css-color/#the-hwb-notation), HWB
(Tono-Blancura-Negrura - _Hue-Whiteness-Blackness_) es similar a HSL, pero
resulta más fácil de uso para los humanos.

```css
.title {
  color: hwb(125, 32%, 47%);
}
```

Resultado:

```css
.title {
  color: rgb(33, 135, 42);
}
```

#### gray()

Los grises son tan [guays](http://dev.w3.org/csswg/css-color/#grays) que tienen
incluso una función dedicada.

```css
.section {
  background-color: gray(120, 50%);
  border-color: gray(17%, 25%);
}
```

Esto dará como resultado:

```css
.section {
  background-color: rgba(120, 120, 120, 0.5);
  border-color: rgba(43, 43, 43, 0.25);
}
```

#### #rrggbbaa

**cssnext** transforma la
[notación hexadecimal](http://dev.w3.org/csswg/css-color/#hex-notation)
#RRGGBBAA y #RGBA en rgba().

```css
body {
  color: #5c69;
  background-color: #c73d5c59;
}
```

Resultado:

```css
body {
  color: rgba(85, 204, 102, 0.6);
  background-color: rgba(199, 61, 92, 0.34902);
}
```

#### rebeccapurple

Transforma el color
[`rebeccapurple`](https://github.com/postcss/postcss-color-rebeccapurple#why-this-plugin-)
en `rgb(102, 51, 153)`.

### Propiedades de filtros

¡Un _nuevo_ mundo de
[modificaciones de imágenes](http://www.w3.org/TR/filter-effects/) se abre ante
vosotros!

```css
.awesome-Image {
  filter: sepia(0.7) hue-rotate(23deg);
}

.awesome-Picture {
  filter: blur(8px);
}
```

Lo anterior será transformado en:

```css
.awesome-Image {
  filter: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="filter"><feColorMatrix type="matrix" color-interpolation-filters="sRGB" values="0.5751000000000001 0.5383 0.1323 0 0 0.24429999999999996 0.7802000000000001 0.11760000000000001 0 0 0.1904 0.3738 0.39170000000000005 0 0 0 0 0 1 0" /><feColorMatrix type="hueRotate" color-interpolation-filters="sRGB" values="23" /></filter></svg>#filter');
  -webkit-filter: sepia(0.7) hue-rotate(23deg);
  filter: sepia(0.7) hue-rotate(23deg);
}

.awesome-Picture {
  filter: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="filter"><feGaussianBlur stdDeviation="8" /></filter></svg>#filter');
  -webkit-filter: blur(8px);
  filter: blur(8px);
}
```

### Unidades rem

Nada extraordinario aquí, se genera un **_fallback_ en píxeles para las unidades
en rem**. Oh, ¡por favor! ¿De verdad necesitáis un ejemplo para esto? Venga,
aquí tenéis.

```css
.section-Highlight {
  font-size: 2.5rem;
}
```

Resultado:

```css
.section-Highlight {
  font-size: 40px;
  font-size: 2.5rem;
}
```

## Funciones adicionales

Las dos siguientes funciones no tienen mucho que ver con las especificaciones
CSS. Sin embargo, merecen ser mencionadas en esta introducción.

### `import`

¿Y si pudiérais importar archivos locales y módulos (`node_modules` o
`web_modules`) para generar un solo y único archivo CSS que los contendría
todos? Sí,
[es a vosotros a quién estoy mirando, utilizadores de Sass](https://github.com/sass/sass/issues/193),
ejem. Bueno pues, con **cssnext** es possible.

### `compress`

Como ya habréis adivinado, se trata solo una opción para comprimir _o no_
vuestro archivo de salida. Y esto es gracias a
[cssnano](https://github.com/ben-eb/cssnano).

### Uso

Debajo os dejo un ejemplo básico de estas dos funciones. He usado
[gulp-cssnext](https://github.com/cssnext/gulp-cssnext), uno de los
[numerosos plugins](http://cssnext.io/setup/) que os puede ayudar a empezar con
**cssnext**.

```js
var gulp = require("gulp"),
  cssnext = require("gulp-cssnext");

gulp.task("styles", function() {
  gulp
    .src("css/index.css")
    .pipe(
      cssnext({
        compress: true, // false por defecto
      }),
    )
    .pipe(gulp.dest("./dist/"));
});
```

Después, en mi archivo `index.css`, obtendría lo siguiente:

```css
@import "normalize.css"; /* == @import "./node_modules/normalize.css/index.css"; */
@import "cssrecipes-defaults"; /* == @import "./node_modules/cssrecipes-defaults/index.css"; */
@import "project-modules/partner"; /* relativo a css/ */
@import "typo"; /* mismo nivel que mi index.css principal, situado en css/ */
@import "highlight" (min-width: 25em);
```

Y el resultado final es:

```css
/* contenido de ./node_modules/normalize.css/index.css */
/* contenido de ./node_modules/cssrecipes-defaults/index.css */
/* contenido de project-modules/partner.css */
/* contenido de typo.css */
@media (min-width: 25em) {
  /* contenido de highlight.css */
}
```

Conozco esa sensación. Vosotros también os habéis enamorado. :)

Bueno, para concluir, digamos que el propósito principal de **cssnext** es el de
poder codificar según las especificaciones del W3C, siempre teniendo en cuenta
que, teóricamente, será posible quitarlo (cuando ya no sea necesario).

Mientras tanto, sigue habiendo mucho trabajo. Aquí os dejo una
[lista de futuras funciones](https://github.com/cssnext/cssnext/issues?q=is%3Aopen+is%3Aissue+label%3Afeature+label%3Aready).

Ahora os toca jugar a vosotros. No os olvidáis de pasaros por el
[repository GitHub](https://github.com/cssnext/cssnext), seguir a
[@cssnext](https://twitter.com/cssnext) en Twitter para obtener las últimas
noticias al respecto y uniros a la
[room cssnext en Gitter](https://gitter.im/cssnext/cssnext) si tenéis cualquier
pregunta.

- [Página oficial](http://cssnext.io/)
