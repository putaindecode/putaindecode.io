---
date: "2015-11-24"
title: Tester unitairement des composants React
tags:
  - js
  - react
  - tests
authors:
  - MoOx
header:
  image: https://farm6.staticflickr.com/5159/7112879347_9e0da289ca_z.jpg
  credit: https://www.flickr.com/photos/dvids/7112879347
  linearGradient: 160deg, rgba(0,0,0, .9), rgba(97, 218, 251, .7)
---

L'équipe de React a implémenté une fonctionnalité appelé
[shallow rendering](http://facebook.github.io/react/docs/test-utils.html#shallow-rendering)
(rendu peu profond),
qui permet de rendre un composant avec un seul niveau de profondeur de rendu.

Cela permet du coup de vérifier ce que le rendu retourne sans avoir à ce
soucier du comportement des composants enfants, qui ne sont pas instanciés ni
rendus. Cela ne nécessite pas de DOM.

Intéressant, n'est-ce pas ? Et d'ailleurs, le _shallow rendering_ est
actuellement
[la méthode recommandée pour tester vos composants React](https://discuss.reactjs.org/t/whats-the-prefered-way-to-test-react-js-components/26).

Comme vous pourrez le voir dans un article listé à la fin de celui-ci,
le code permettant de tester des composants avec cette technique n'est pas
forcément très concis, contrairement à ce qu'on pourrait attendre.

Heureusement, [quelqu'un](https://github.com/vvo) a codé un truc plutôt cool:
[react-element-to-jsx-string](https://github.com/algolia/react-element-to-jsx-string).
Comme le nom l'indique, cette librairie permet de rendre un composant React en
tant que chaîne JSX.

C'est maintenant les choses deviennent intéressantes :
avec ces concepts en tête (le shallow render et le rendu de composant en strings
JSX), on peut facilement ajouter de simple tests unitaires sur ses composants.

_Il y a d'autres techniques pour tester des composants React, et la plupart
implique le DOM. Vous devrez donc éxecuter vos tests dans un navigateur (ou
en utilisant jsdom) : vos tests seront plus lents que la technique qui va suivre
(qui pour le coup est plus du vrai test unitaire, dans le sens où vous utilisez
moins de code et ne nécessitez pas un gros environnement)._

## Tester facilement des composants React (sans DOM)

On va partir avec ce simple composant :

```js
// web_modules/Picture/index.js

import React from "react"
import { PropTypes } from "react"

const Component = ({
  img,
  title,
  Loader,
  Title,
}) => (
  <div>
    {
      (!img || !img.src) && Loader &&
      <Loader />
    }
    {
      img && img.src &&
      <img src={ img.src } alt={ img.alt }/>
    }
    {
      title && Title &&
      <Title text={ title } />
    }
  </div>
)

Component.propTypes = {
  img: PropTypes.object,
  title: PropTypes.string,
  Loader: PropTypes.func.isRequired,
  Title: PropTypes.func.isRequired,
}

Component.displayName = "Picture"

export default Component
```

Ce composant affiche une image avec un composant pour le titre.
Si les données de l'image ne sont pas prêtes, on peut afficher un composant pour
indiquer le chargement.

Écrivons maintenant un petit test. Pour notre exemple, on va utiliser
[tape](https://medium.com/javascript-scene/why-i-use-tape-instead-of-mocha-so-should-you-6aa105d8eaf4)
couplé avec [tape-jsx-equals](https://github.com/atabel/tape-jsx-equals),
mais vous n'aurez pas de mal à trouver un paquet à
[votre sauce sur npm](https://www.npmjs.com/search?q=expect+jsx).

```js
// web_modules/Picture/__tests__/index.js

import tape from "tape"
import addAssertions from "extend-tape"
import jsxEquals from "tape-jsx-equals"
const test = addAssertions(tape, { jsxEquals })

import React from "react"
import { createRenderer } from "react-addons-test-utils"

import Picture from ".."

// fixtures (empty and stateless react components)
const Loader = () => {}
const Title = () => {}

test("PageContainer is properly rendered", (t) => {
  const renderer = createRenderer()

  renderer.render(
    <Picture
      Loader={ Loader }
      Title={ Title }
    />
  )
  t.jsxEquals(
    renderer.getRenderOutput(),
    <div>
      <Loader />
    </div>,
    "can render a Loader component if no image data are passed"
  )

  renderer.render(
    <Picture
      Loader={ Loader }
      Title={ Title }
      img={ {
        src: "SRC",
        alt: "ALT",
      } }
    />
  )
  t.jsxEquals(
    renderer.getRenderOutput(),
    <div>
      <img src="SRC" alt="ALT" />
    </div>,
    "should render an image if data are passed"
  )

  renderer.render(
    <Picture
      Loader={ Loader }
      Title={ Title }
      img={ {
        src: "SRC",
        alt: "ALT",
      } }
      title={ "TITLE" }
    />
  )
  t.jsxEquals(
    renderer.getRenderOutput(),
    <div>
      <img src="SRC" alt="ALT" />
      <Title text="TITLE" />
    </div>,
    "can render a Title if data are passed"
  )

  t.end()
})
```

Ces tests sont une couverture minimal pour vous assurer que vous ne cassez rien
lorsque vous travaillez sur votre composant.

Comme vous pouvez le constater, les tests sont assez simple à écrire et vont
droit au but.
**Ce qui est intéressant ici, c'est que nous ne comparons pas à l'aide de
simples chaînes. Nous utilisons directement des composants React.**

Vous pouvez tranquillement éxecuter l'exemple complet et le récupérant depuis le
repository :

[github.com/MoOx/react-component-unit-testing-example](https://github.com/MoOx/react-component-unit-testing-example)

Cet exemple contient les commandes et dépendances
(définies dans le `package.json`)
dont vous aurez besoin.

# Et comment tester les évènements comme `onClick` ?

Vous n'avez pas à reproduire le clic complètement.

**Vos tests n'ont pas besoin de vérifier que la prop `onClick` va bien être
éxecutée lorsque vous cliquerez sur un élement du DOM.**
_React couvre probablement cela dans sa suite de tests._

Ce que vous avez besoin de tester, c'est que la valeur que vous passer au
`onClick` fait bien ce que vous voulez.
En gros, si vous avez un bout de code qui ressemble à
`onClick={ yourCallback }`, vous n'avez tout simplement qu'à appeler directement
`yourCallback()` dans vos tests juste avant votre comparaison.
C'est bien assez !

Si vous voulez aller un peu plus loin, vous pouvez continuer par lire :
- [_Unit testing React components without a DOM_](https://simonsmith.io/unit-testing-react-components-without-a-dom/),
par Simon Smith, qui couvre le même sujet, sans la simplicité de la comparaison
JSX,
- [_How we unit test React components using expect-jsx_](https://blog.algolia.com/how-we-unit-test-react-components-using-expect-jsx/)
sur le blog d'Algolia, qui explique pourquoi ils ont choisi et créé les outils
pour cette approche.

Avec ces exemples, nous espérons vraiment que vous n'aurez plus peur de tester
votre code et que vous n'hésiterez plus à couvrir tous vos composants React de
tests 😍.
