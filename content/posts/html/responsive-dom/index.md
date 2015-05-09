---
date: "2013-12-26"
title: Responsive webdesign et structure du DOM
tags:
  - responsive
  - html
  - javascript
authors:
  - neemzy
---

Bien, commençons par le commencement, si tu veux bien. Le **responsive
webdesign**, ça te dit quelque chose ? Oui ? Bon. Dans ce cas, tu as peut-être
comme moi déjà été confronté à un cas de figure plutôt ennuyeux. Que tu sois
adepte du *mobile-first* ou irréductible dégradateur progressiste, il est
forcément arrivé un moment où tu t'es dit cette chose toute bête :

> Ce serait quand même pas mal si cet élément était ici plutôt que là. Sauf que
> non.

Le cas typique est celui d'un menu un minimum complexe, dont on réordonnerait
volontiers les éléments un chouïa au-dessus ou en deçà d'une certaine taille
d'écran. Et là, il faut bien avouer qu'il n'existe pas vraiment de solution
miracle.

J'entends déjà les plus teigneux vociférer qu'avec une meilleure réflexion en
amont, le *markup* aurait été mieux conçu et on n'en serait pas là. Bien qu'un
peu facile, cette réponse peut s'avérer vraie dans un certain nombre de cas
(admire la phrase du mec qui ne se mouille pas). Mais quoi qu'il en soit, si tu
en es au stade de ce type de questionnement, c'est qu'il est de toute façon trop
tard pour faire machine arrière.

Au train où va l'innovation dans notre branche, surtout pour tout ce qui touche
au mobile en général et à la conception web en particulier, il n'est pas exclu
que les bouts de ficelle que je vais t'exposer ici soient obsolètes dans six
mois, et que cet article fasse un comeback incroyable sur Twitter, les RT
moquant gentiment les techniques précolombiennes auxquelles nous étions réduits
il n'y a encore pas si longtemps. Va savoir, je pourrais bien faire l'objet
d'une célébrité paradoxalement décadente, à la Rick Astley. En attendant, il
s'agit des seules solutions que je connais pour ce type de cas. Si tu as mieux à
proposer, je te recommande chaudement de l'ouvrir dans les commentaires pour
qu'on en bénéficie tous. C'est bon, on y va ? Je t'attends, moi !

## À l'ancienne : Do Repeat Yourself

Imagine une page de blog, où apparaissent consécutivement le titre de l'article,
la photo l'illustrant, et enfin le texte. Comme une photo, selon la qualité de
ta connexion, ça peut être un peu galère à charger sur mobile (et que la
question des images en responsive design
[est encore un sacré bordel](http://css-tricks.com/responsive-images-hard/)), tu
prends la décision de passer la photo en dessous du contenu textuel pour que tes
visiteurs puissent lire leur article peinards même si la photo n'a pas fini de
charger - et tu vas même en profiter pour la remplacer par une version plus
light.

Dans un tel cas, la meilleure solution peut encore être de dupliquer ta balise
`img`, et de masquer l'une ou l'autre avec CSS en fonction de la taille d'écran,
grâce à une `media query`. Voilà un exemple rudimentaire :

```html
<article>
  <h1>Mon super article</h1>

  <img src="/mon/image/desktop.jpg" class="img-desktop" />

  <p>Lâche tes comm' !</p>

  <img src="/mon/image/mobile.jpg" class="img-mobile" />
</article>
```

```css
.img-desktop {
  /* Par défaut, l'image desktop est cachée */
  display: none;
}

@media screen and (min-width: 768px) {
  /* Si on est sur "grand" écran, on affiche l'image desktop... */
  .img-desktop {
    display: block;
  }

  /* ...et on masque l'image mobile */
  .img-mobile {
    display: none;
  }
}
```

Évidemment, le gros inconvénient de ce type de solution est que qui dit
duplication de contenu dit augmentation du poids total. Dans le cas d'un contenu
purement textuel, selon sa taille, cela peut être négligeable. J'ai ici
volontairement pris l'exemple le moins adapté : une image, qu'il ne faut
absolument pas faire charger deux fois à nos visiteurs. On va tricher un peu
avec JavaScript :

```html
<article>
  <h1>Mon super article</h1>

  <!-- Ces images ne seront pas chargées car elles n'ont pas d'attribut src -->
  <img data-src="/mon/image/desktop.jpg" class="img-desktop" />

  <p>Lâche tes comm' !</p>

  <img data-src="/mon/image/mobile.jpg" class="img-mobile" />

  <noscript>
    <!-- Cette image ne sera chargée que si le visiteur n'a pas activé le JS -->
    <img src="/mon/image/mobile.jpg" class="img-mobile img-noscript" />
  </noscript>
</article>
```

```css
.img-desktop {
  display: none;
}

@media screen and (min-width: 768px) {
  .img-desktop {
    display: block;
  }

  .img-mobile {
    display: none;
  }
}

.img-noscript {
  /* On surcharge le style desktop pour s'assurer
     que cette image s'affiche quelle que soit la taille de l'écran */

  display: block;
}
```

```javascript
var handleImages = function() {
  // On charge les images ayant l'attribut data-src,
  // non encore chargées (attribut src indéfini)
  // et non masquées par CSS

  [].forEach.call(document.querySelectorAll('img[data-src]:not([src])'), function(el) {
    if (window.getComputedStyle(el).display != 'none') {
      el.src = el.getAttribute('data-src');
    }
  });
};

window.addEventListener('load', handleImages);
window.addEventListener('resize', handleImages);
```

Ainsi, seules les images nécessaires seront chargées avec la page. J'applique
également le même traitement au `resize` ; c'est un peu bourrin, je te
l'accorde, on pourrait probablement faire plus fin avec `matchMedia`.

Dans le cas d'un visiteur naviguant sans JavaScript, seule l'image mobile est
chargée : je pars du principe qu'étant donné qu'on ne peut pas définir laquelle
des deux versions de l'image est la mieux adaptée pour lui, autant lui envoyer
la plus légère.

## JS powa : enquire.js

La seconde solution peut tout à fait être réalisée "à la main", mais je vais te
parler d'une petite librairie que j'aime beaucoup et que j'ai déjà utilisée dans
ce genre de cas. Elle se nomme [enquire.js](http://wicky.nillia.ms/enquire.js/)
et permet tout simplement d'affecter des callbacks à des media queries :

```javascript
enquire.register('screen and (min-width: 768px)', {
  match: function() {
    // L'écran fait 768px de large ou plus...
  },

  unmatch: function() {
    // ...et ici, 767px de large ou moins.
    // La librairie repose sur matchMedia et matchMedia.addListener
  }
});
```

Plutôt sympa, non ? Pour reprendre notre exemple de tout à l'heure (le CSS n'est
plus nécessaire) :

```html
<article>
  <h1>Mon super article</h1>

  <img data-src="/mon/image/desktop.jpg" data-mobile-src="/mon/image/mobile.jpg" />

  <p>Lâche tes comm' !</p>

  <noscript>
    <img src="/mon/image/mobile.jpg" />
  </noscript>
</article>
```

```javascript
var content = document.querySelector('p'),

  switchImage = function(isMobile) {
    var attr = isMobile ? 'data-mobile-src' : 'data-src';

    [].forEach.call(document.querySelectorAll('img[' + attr + ']'), function(el) {
      // On affecte l'une ou l'autre source à notre image,
      // entraînant son chargement si nécessaire.
      el.src = el.getAttribute(attr);

      // On en profite pour la bouger avant ou après le contenu
      content.parentNode.insertBefore(el, isMobile ? content.nextSibling : content);
    });
  };

enquire.register('screen and (min-width: 768px)', function() {
  switchImage(false);
});

enquire.register('screen and (max-width: 767px)', function() {
  switchImage(true);
});
```

On peut ainsi gérer facilement le chargement de l'image, ainsi que son
emplacement. J'utilise ici deux handlers distincts pour m'assurer qu'enquire
fait bien son boulot au chargement aussi, dans tous les cas (les callbacks
`unmatch` ne sont appelés qu'au redimensionnement, semble-t-il : avec un seul
handler, l'image n'arrive donc jamais si on charge la page avec un écran d'une
largeur inférieure à 768px).

## That's all you've got, bitch?

On peut également, puisque tu y tiens tant, évoquer d'autres solutions plus
marginales mais qui méritent d'être citées.

### Foundation

[Foundation](http://foundation.zurb.com/) propose, dans sa version 5 (et
peut-être même avant, j'ai pas vérifié) un peu de sucre syntaxique HTML
permettant de switcher (via JS, œuf corse) simplement entre différents contenus
pour l'élément sur lequel on l'utilise.

C'est pas mal. Ça donne ça (tiré de [la doc](http://foundation.zurb.com/docs/components/interchange.html)) :

> We use the data-interchange attribute on a markup container (probably a div)
> to do this. Here's an example which loads up a small, static map on mobile, a
> larger static map for medium-sized devices, and a full interactive Google map
> on large display devices.

```html
<div data-interchange="[../examples/interchange/default.html, (small)],
                       [../examples/interchange/medium.html, (medium)],
                       [../examples/interchange/large.html, (large)]">
  <div data-alert class="alert-box secondary radius">
    This is the default content.
    <a href="#" class="close">&times;</a>
  </div>
</div>
```

`small`, `medium` et `large` étant des raccourcis pour des media queries données
(c'est dans [la doc](http://foundation.zurb.com/docs/components/interchange.html),
toujours. J'insiste.)

### Flexbox (pas toi, David)

On peut également, comme l'a très justement souligné [lionelB](/#crew), se
pencher (mais pas trop) sur le cas de Flexbox, qui est un nouveau type de
positionnement introduit en CSS3. La [compatibilité](http://caniuse.com/#search=flexbox)
n'est pas encore au top (surtout grâce à IE, qui l'eût cru) mais autant se tenir
prêts ! Pour ceux qui ont dormi, en gros, tu définis un conteneur :

```css
.flex-container {
  display: flex;

  /* ou bien */

  display: inline-flex;
}
```

...et tu donnes des numéros à ses enfants, comme à Bangkok :

```css
.title {
  order: 1;
}

.content {
  order: 2;
}

.image {
  order: 3;
}

/*
Bien sûr, tu as été assez malin pour mettre ton image en dernier dans le DOM...
...n'est-ce pas ?
*/

@media screen and (min-width: 768px) {
  .content {
    order: 3;
  }

  .image {
    order: 2;
  }
}
```

Et voilà, pas besoin d'avoir fait Polly Pocket pour percevoir à quel point la
flexibilité et la propreté du code que cette technique nous permet d'écrire
résolvent notre problème en deux secondes douze. Ce n'est évidemment ici que la
partie émergée du flexberg ; il y a des tas de bonnes ressources qui vous
expliqueront ça en long, en large et en travers bien mieux que moi, notamment
[cet article](http://www.adobe.com/devnet/html5/articles/working-with-flexbox-the-new-spec.html)
sur lequel j'ai honteusement pompé les snippets de cette partie.

## Conclusion

Comme tu l'as vu, rien de ce que je t'ai montré n'est réellement satisfaisant :
pour pouvoir contrôler le positionnement d'un élément dans le DOM dans le cadre
d'un webdesign responsive, tu dois soit le dupliquer et jouer à cache-cache,
soit le déplacer avec JavaScript. Aussi, je serais ravi que tu partages ton
opinion, tes idées ou tes retours d'XP à ce sujet. Ça me fera de la lecture pour
passer le temps, et toi tu feras quelque chose de constructif !

Il est temps pour moi de te laisser reprendre le cours de ta vie. Peut-être nos
routes se croiseront-elles de nouveau. Dans l'intervalle, va, vis, et code !
