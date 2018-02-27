---
date: "2018-03-01"
title: "Écrire des high-order components réutilisables avec Recompose"
tags:
  - javascript
  - react
  - higher-order-component
  - recompose
authors:
  - scastiel
header:
  image: header.png
  linearGradient: rgba(0,0,0, 0.6), rgba(0,0,0, 0.5)
---

Écrire des composants réutilisables est (ou devrait être) l’un des objectifs de
tout développeur React. Que ce soit pour créer une boîte à outils de composants
stylés, pour mutualiser des comportements communs, etc.

Même en ayant fréquemment utilisé des _high-order components_ (avec
_React-Redux_ par exemple), ce n’est que récemment que j’ai entendu parler de
l’opportunité qu’ils offraient pour écrire des composants réutilisables, en
particulier grâce à une fantastique bibliothèque :
[Recompose](https://github.com/acdlite/recompose). Voyons comment avec un
exemple concret et complet.

Si vous n’avez jamais entendu parler de _high-order components_ (HOC) avant,
sachez simplement qu’un HOC n’est finalement rien d’autre qu’une fonction qui
prend en paramètre une définition de composant (classe ou fonction), et renvoie
une nouvelle définition de composant, qui ajoute du comportement à la première.
Il s’agit en fait du pattern
[_Décorateur_](https://en.wikipedia.org/wiki/Decorator_pattern) appliqué aux
composants React.

Sur le site de React vous trouverez une
[page très fournie](https://reactjs.org/docs/higher-order-components.html) si
vous souhaitez en savoir plus sur les HOC.

Un exemple très simple :

```js
const addBorder = borderWidth => Component => props => (
  <div style={{ borderColor: 'black', borderStyle: 'solid', borderWidth }}>
    <Component {...props} />
  </div>
)

const MyText = <p>Hello!</p>

const MyTextWithBorder = addBorder(5)(MyText)
```

Vous obtenez un composant `MyTextWithBorder` qui affiche le texte « Hello » avec
une bordure de 5 pixels. Ici, `addBorder` est ce que l’on appelle un _high-order
component_.

Quel est l’intérêt d’un HOC ? Et bien un pattern très utile est d’extraire un
comportement partagé par plusieurs composants dans des fonctions réutilisables.
Si vous avez utilisé React avec Redux et React-Redux, vous avez sans doute
utilisé le HOC `connect` pour faire le mapping de l’état et des actions avec les
propriétés.

Comme exemple complet pour cette article, nous allons utiliser le concept d’HOC
pour créer un champ de saisie de numéro de téléphone, qui :

* n’acceptera que les chiffres, parenthèses, tirets et espaces en entrée (à la
  frappe) ;
* mettra en forme le numéro de téléphone lorsque le focus sera perdu par le
  champ (évènement _blur_). (Seuls les numéros de téléphone Nord-Americains
  seront pris en compte : « (514) 555-0199 ».)

<center>![Phone number input result](./phoneNumberInput.gif)</center>

Notez que l’on supposera que notre champs sera contrôllé, c’est-à-dire que nous
utiliserons les propriétés `value` et `onChange` pour savoir quel texte afficher
et comment le mettre à jour. Nous souhaitons également que la valeur ne
contienne que les chiffres du numéro de téléphone (« 5145550199 »), sans se
soucier de la mise en forme, et donc que le `onChange` soit appelé avec les
chiffres uniquement (dans `event.target.value`).

Pour rendre notre HOC plus facile à écrire et maintenir, nous utiserons la
bibliothèque _Recompose_, qui propose un grand nombre de fonctions utilitaires
pour écrire des HOC. Nous en verrons quelques-unes dans cet article.

Pour développer notre composant nous créerons deux HOC réutilisables, un pour
chacun des points ci-dessus. Cela signifie que nous souhaitons que notre
composant final soit défini ainsi :

```js
const PhoneNumberInput = formatPhoneNumber(
  forbidNonPhoneNumberCharacters(props => <input {...props} />)
)
```

C’est le bon moment pour introduire la première fonction de _Recompose_ que nous
utiliserons : `compose`. Elle effectue la composition de plusieurs HOC pour les
fusionner en un seul, de sorte que nous pouvons écrire plus simplement :

```js
const PhoneNumberInput = compose(
  formatPhoneNumber,
  forbidNonPhoneNumberCharacters
)(props => <input {...props} />)
```

Et parce que nous souhaitons rendre nos HOC aussi réutilisable que possible
(pour mettre en forme autre chose que des numéros de téléphone par exemple),
rendons-les plus génériques :

```js
// Ne garde que les chiffres, espaces, tirets et parenthèses
const forbiddenCharactersInPhoneNumber = /[^\d\s\-()]/g

// '5145551234' => '(514) 555-1234'
const formatPhoneNumber = value =>
  value.replace(/^(\d{3})(\d{3})(\d{4})$/, '($1) $2-$3')

// '(514) 555-1234' => '5145551234'
const parsePhoneNumber = formattedPhoneNumber =>
  formattedPhoneNumber.replace(/[^\d]/g, '').slice(0, 10)

const PhoneNumberInput = compose(
  formatInputValue({
    formatValue: formatPhoneNumber,
    parseValue: parsePhoneNumber
  }),
  forbidCharacters(forbiddenCharactersInPhoneNumber)
)(props => <input {...props} />)
```

Ne trouvez-vous pas cela déjà génial si l’on peut réutiliser uniquement nos deux
HOC pour mettre en forme des montants, des numéros de sécurité sociale, tout et
n’importe quoi, juste en utilisant les bons paramètres ? 😉

Le point réellement intéressant est qu’ici j’utilise le composant `<input>` de
base, mais nous pourrions utiliser n’importe quel composant, tant qu’il utilise
les propriétés `value`, `onChange` et `onBlur`. Donc on peut imaginer utiliser
notre champs de saisie de numéros de téléphone avec React Native, Material-UI,
etc.

Ok, maintenant passons au plus important, écrire nos deux HOC en utilisant les
fonctions que Recompose nous met à disposition.

## Premier HOC : n’accepter que certains caractères

L’idée ici est que lorsque la valeur de l’input est changée (évènement
`onChange`), on intercepte cet évènement pour supprimer tout caractère interdit
de la valeur, puis on appelle la propriété `onChange` parente avec la valeur
propre.

Nous utiliserons ici la fonction `withHandlers` pour ajouter des nouveaux
_handlers_ d’évènement comme propriétés du composant encapsulé. Le bon point est
que nous avons accès aux propriétés de notre composant (ici nous utiliserons
`onChange`) pour créer notre nouveau handler :

```js
const forbidCharacters = forbiddenCharsRegexp =>
  withHandlers({
    onChange: props => event => {
      // N’oublions pas que `onChange` n’est pas une propriété requise
      // (même si rien ne se produira si elle est absente).
      if (props.onChange) {
        const value = event.target.value
        const cleanValue = value.replace(forbiddenCharsRegexp, '')
        // On ne modifie pas l’évènement original, mais on le clone
        // en y redéfinissant event.target.value avec la valeur propre.
        const newEvent = {
          ...event,
          target: { ...event.target, value: cleanValue }
        }
        // On réémet notre évènement au `onChange` parent.
        props.onChange(newEvent)
      }
    }
  })
```

Souvenez-vous qu’autant que possible le composant que nous créons à partir d’un
autre doit respecter l’interface de ce dernier. Il doit donc accepter les mêmes
propriétés avec le même type.

À présent si nous souhaitons par exemple créer un champ n’acceptant que les
chiffres, nous pouvons écrire :

```js
const NumericField = forbidCharacters(/[^\d]/g)(props => <input {...props} />)
```

Nous avons maintenant notre premier HOC pour interdire certains caractères;
écrivons à présent le deuxième, légèrement plus complexe, pour mettre en forme
la valeur entrée par l’utilisateur.

## Deuxième HOC : mettre en forme la valeur entrée

Pour notre deuxième HOC, nous devrons avoir dans notre composant un état local
pour stocker la valeur entrée dans le champs sans la passer au composant parent.
N’oubliez pas que nous souhaitons mettre en forme la valeur uniquement lorsque
le focus sort du champs (évènement _blur_).

Recompose définit une fonction très simple pour ajouter un état local à un
composant : `withState`. Elle prend en paramètre le nom de l’attribut dans
l’état (qui sera donné comme propriété au composant enfant), le nom de la
propriété contenant la fonction pour mettre à jour cet état (également donnée
comme propriété), et la valeur initiale (valeur statique, ou bien fonction
prenant en paramètre les propriétés et retournant la valeur initiale).

Pour ajouter notre état local nous écrirons :

```js
withState(
  'inputValue',
  'setInputValue',
  // `formatValue` est l’un des paramètres de notre HOC
  props => formatValue(props.value)
)
```

Facile, non ? 😉

Maintenant que l’on a notre état, nous devons le mettre à jour lorsque la valeur
de l’input est modifiée, donc nous définirons un handler `onChange` personnalisé
:

```js
withHandlers({
  onChange: props => event => {
    props.setInputValue(event.target.value)
  }
  // ...
```

Et à l’évènement _blur_, nous mettrons en forme la valeur, appelerons les
`onChange` et `onBlur` parents, puis mettrons en forme également la valeur
affichée :

```js
  // ...
  onBlur: props => event => {
    // parseValue est l’autre paramètre de notre HOC
    const parsedValue = parseValue(props.inputValue)
    const formattedValue = formatValue(parsedValue)
    props.setInputValue(formattedValue)
    // On ne modifie pas l’évènement original, mais on le clone
    // en y redéfinissant event.target.value avec la valeur propre.
    const newEvent = {
      ...event,
      target: { ...event.target, value: parsedValue }
    }
    if (props.onChange) {
      props.onChange(newEvent)
    }
    if (props.onBlur) {
      props.onBlur(newEvent)
    }
  }
)
```

La dernière étape pour notre HOC consiste à nous assurer que seules les
propriétés acceptées par `<input>` lui seront passées. Pour cela on utilisera la
fonction `mapProps` de Recompose pour créer un nouvel objet de propriétés à
partir des propriétés existantes, ainsi que la fonction `omit` de _lodash_ pour
exclure certaines propriétés d’un objet pour en créer un nouveau :

```js
mapProps(props => ({
  ...omit(props, ['inputValue', 'setInputValue']),
  value: props.inputValue
}))
```

En assemblant le tout avec `compose`, on obtient :

```js
const formatInputValue = ({ formatValue, parseValue }) =>
  compose(
    withState('inputValue', 'setInputValue', props => formatValue(props.value)),
    withHandlers({
      onChange: props => event => {
        props.setInputValue(event.target.value)
      },
      onBlur: props => event => {
        const parsedValue = parseValue(props.inputValue)
        const formattedValue = formatValue(parsedValue)
        props.setInputValue(formattedValue)
        const newEvent = {
          ...event,
          target: { ...event.target, value: parsedValue }
        }
        if (props.onChange) {
          props.onChange(newEvent)
        }
        if (props.onBlur) {
          props.onBlur(newEvent)
        }
      }
    }),
    mapProps(props => ({
      ...omit(props, ['inputValue', 'setInputValue']),
      value: props.inputValue
    }))
  )
```

Et voilà ! Nous avons deux _high-order components_, on peut les utiliser pour
créer notre champs de saisie de numéro de téléphone ! Ci-dessous vous trouverez
le JSFiddle content le code source complet de cet exemple, et vous permet de
tester le résultat. N’hésitez pas à forker le
[JSFiddle](https://jsfiddle.net/scastiel/prme4k6L/) pour jouer avec Recompose ou
créer vos propres HOC.

<iframe width="100%" height="300" src="//jsfiddle.net/scastiel/prme4k6L/8/embedded/js,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

J’espère que cet article vous a donné envie d’en savoir plus à propos de
Recompose et des _high-order components_ en général. Je suis convaincu que les
HOC créent une nouvelle manière d’écrire des composants réutilisables ; on en
entendra sans aucun doute parler de plus en plus dans le futur 😀.

Quelques ressources pour aller plus loin :

* La
  [documentation de l’API de Recompose](https://github.com/acdlite/recompose/blob/master/docs/API.md)
  est assez complète, bien que selon moi elle manque parfois d’exemples pour
  comprendre certaines fonctions complexes ;
* La
  [page de React à propos des HOC](https://reactjs.org/docs/higher-order-components.html)
  contient un grand nombre d’informations, par exemple ce que vous ne devriez
  pas faire avec les HOC 😉 ;
* [React Higher Order Components in depth](https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e)
  : une très bonne introduction aux HOC ;
* [Why The Hipsters Recompose Everything](https://medium.com/javascript-inside/why-the-hipsters-recompose-everything-23ac08748198)
  : une introduction sympa à Recompose (semble un peu datée…).

_Cet article est la traduction en français de mon article initialement en
anglais disponible sur mon blog :
[Create reusable high-order React components with Recompose](https://blog.castiel.me/posts/006-reusable-hoc-with-recompose.html)._
