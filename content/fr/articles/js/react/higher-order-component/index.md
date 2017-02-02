---
date: "2016-06-14"
title: Les patterns Provider & Higher-Order Component avec React
tags:
  - javascript
  - react
  - higher-order-component
authors:
  - bloodyowl
---

## Le pattern provider

Beaucoup de bibliotèques React ont besoin de faire passer des data au travers de tout l'arbre de composants de votre app. Par exemple Redux a besoin de passer son *store* et React Router doit passer l'objet *location*. Tout ça pourrait possiblement passer par du *shared mutable state* (état global mutable, ce qui est rarement une bonne idée). Le *shared mutable state* rend impossible une application à plus d'un contexte. En d'autres mots, ça ne marcherait que sur le client, où l'état global correspond à celui de l'utilisateur. Si vous décidez de rendre la page côté serveur, c'est impossible de reposer sur une telle implémentation : cet état ne doit pas dépasser le scope de la requête courante au serveur.

Coup de bol, l'API de React nous offre une solution à ce problème: le [`context`](http://facebook.github.io/react/docs/context.html). Si l'on résume sa nature, c'est comme l'objet global de votre arbre de composants.

Le `context` fonctionne de la façon suivante:

- On définit haut dans notre app un `context` que l'on donne aux composants descendants de l'app
- On récupère ce contexte dans les composants descendants.

Du coup, pour *donner* ce `context`, on doit avoir un `Provider`. Son rôle est simplement de fournir un `context` pour que les composants enfants y aient accès.

On va illustrer ce pattern avec un use-case très simple : dans notre app, les utilisateurs peuvent customiser le thème.

```javascript
import React, { Component, PropTypes, Children } from "react"

class ThemeProvider extends Component {
  // la méthode getChildContext est appelée pour fournir le `context`
  // dans notre cas, on le récupère des `props`
  getChildContext() {
    return {
      theme: this.props.theme,
    }
  }
  // on render l'enfant
  render() {
    return Children.only(this.props.children)
  }
}

ThemeProvider.propTypes = {
  theme: PropTypes.object.isRequired,
}

// pour que React prenne en compte le context fourni,
// on doit définir les types des propriétés que l'on passe
ThemeProvider.childContextTypes = {
  theme: PropTypes.object.isRequired,
}

export default ThemeProvider
```

Pour utiliser le provider, il suffit de wrapper notre app avec:

```javascript
import React from "react"
import ReactDOM from "react-dom"

import ThemeProvider from "ThemeProvider"
import App from "App"

const theme = {
  color: "#cc3300",
  fontFamily: "Georgia",
}

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.querySelector("#App")
)
```

Maintenant que notre `theme` est bien ajouté au `context`, on a besoin d'un moyen simple pour que nos composants dans l'app puissent le consommer. Ça nous amène au second pattern.

## Le pattern Higher-Order Component

Afin de consommer le `context`, un component doit définir une propriété statique `contextTypes` stipulant quelles propriétés le composant souhaite récupérer. On pourrait le définir sur chaque composant, mais cela serait une mauvaise idée pour deux raisons :

- **La maintenabilité** : si à un moment, on a besoin de refacto, avoir tous ces `contextTypes` éparpillés dans notre repository peut faire bien mal.
- **La complexité**: L'API des `context` étant encore obscure pour beaucoup, il est préférable de faire une abstraction pour la masquer.

Une autre solution serait d'utiliser l'héritage d'une sous-classe de `ReactComponent`. Ça ne marche pas pour deux raisons:

- Plus d'un niveau d'héritage est en général une idée de merde. Cela mène souvent à des conflits entre méthodes, et force à vérifier toute la chaîne d'héritage à chaque fois que l'on souhaite modifier quelque chose. L'API des `mixins` de `React.createClass` réglait ce souci en définissant des comportements de merge selon les méthodes, mais cela rend encore plus obscure la compréhension du fonctionnement de nos composants.
- Si l'on veut des APIs **interopérables**, on ne peut pas partir de l'héritage. React offre trois moyens de définir un composant: `class extends React.Component {}`, `React.createClass({})` et `(props) => ReactElement`. Les deux derniers ne peuvent pas bénéficier de l'héritage.

La meilleure façon de créer une fonctionnalité réutilisable est d'utiliser le pattern du **Higher Order Component** (ou *HOC*). Ce que ça veut dire, c'est qu'on va simplement wrapper un composant dans un autre, lequel a pour unique rôle d'injecter la fonctionnalité et de la passer via les `props`. Il s'agit tout bêtement du principe de composition : au lieu d'exporter `A`, vous exportez `Wrapped(A)`, et ce dernier retourne un composant React qui va appeler `A` dans sa méthode `render`.

Pour le voir simplement, il s'agit d'un point intermédiaire dans l'arbre de vos composants, qui injecte quelques `props`. Il existe beaucoup d'avantages apportés par ce pattern :

- **Isolation** : Il n'y a pas de risque de collision de propriétés au sein du composant.
- **Interopérabilité** : Ce principe s'adapte à tout composant React, peu importe la façon dont il a été défini.
- **Maintenabilité** : Le wrapper n'aura qu'une seule fonctionnalité, ce qui le rend plus simple à comprendre. De plus, si l'on utilise le `context`, on ne trouvera le mapping `contextTypes` qu'à un seul endroit dans l'app.

```javascript
import React, { Component, PropTypes } from "react"

const themed = (ComponentToWrap) => {
  class ThemeComponent extends Component {
    render() {
      const { theme } = this.context
      // le component va render `ComponentToWrap`
      // mais il va y ajouter la prop `theme`, qu'il récupère du `context`
      return (
        <ComponentToWrap {…this.props} theme={theme} />
      )
    }
  }
  // on définit ce qu'on veut consommer du `context`
  ThemeComponent.contextTypes = {
    theme: PropTypes.object.isRequired,
  }

  // on retourne notre wrapper
  return ThemeComponent
}
export default themed
```

Pour utiliser notre HOC, il suffira d'exporter nos composants wrappés :

```javascript
import React from "React"
import themed from "themed"

const MyStatelessComponent = ({ text, theme }) => (
  <div style={{ color: theme.color }}>
    {text}
  </div>
)

export default themed(MyStatelessComponent)
```

Puisqu'il s'agit simplement d'une fonction, on peut y passer des options à l'aide d'une simple closure.

```javascript
const defaultMergeProps = (ownProps, themeProps) => ({  ...ownProps, ...themeProps })

const theme = (mergeProps = defaultMergeProps) =>
  (ComponentToWrap) => {
    // …
    render() {
      const { theme } = this.context
      const props = mergeProps(this.props, { theme })
      return (
        <ComponentToWrap {…props} />
      )
    }
    // …
  }
```

et l'utiliser de cette façon :

```javascript
const mergeProps = (ownProps, themeProps) => ({ ...themeProps, color: themeProps.theme.color })
export default theme(mergeProps)(MyComponent)
```

Une astuce sympathique lorsque vous utilisez plusieurs HOC, c'est de les composer, puisque `compose(A, B, C)(props)` vaudra `A(B(C(props)))`, par exemple :

```javascript
const composed = compose(
  connect(mapStateToProps),
  theme()
)

export default composed(MyComponent)
```

Bisous bisous.
