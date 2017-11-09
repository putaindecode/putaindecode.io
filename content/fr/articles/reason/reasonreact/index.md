---
date: "2017-11-09"
title: "ReasonReact, pour une UI qu'elle est bien typée"
tags:
  - reasonml
  - ocaml
  - react
authors:
  - bloodyowl
header:
  image: index.png
  linearGradient: #DD4B39, #DD4B39
---

Si comme moi, depuis l’apparition de React, vous vous êtes de plus en intéressés au typage pour vos applications front (c'est ça de commencer avec JS…), vous avez certainement utilisé les `propTypes` au début en vous disant "putain c'est cool de vérifier les types, ça m'évite bien des problèmes". Puis c’était sympa mais bon, faut quand même exécuter le bout de code qui pète et il est peut-être super chiant d'y accéder dans l'app. Du coup, vous vous êtes sûrement tournés vers Flow ou TypeScript.

Dans cet article, on va découvrir la *next-step* dans ce cheminement : écrire nos composants React dans un langage statiquement et fortement typé: Reason 🚀. Reason, c'est OCaml, avec son type-system puissant et une syntaxe plus simple quand on vient du JS. Si vous n’avez pas lu [l’introduction à ce langage](/fr/articles/reason/introduction-reason/), c’est le moment.

Là, je vais vous présenter **ReasonReact**, des bindings API par dessus React supportés officiellement par l'équipe de Reason. Facebook *dogfood* la solution puisqu'elle est utilisée sur messenger.com pour la majeure partie de ses composants.

## Stateless

Commençons par le traditionnel HelloWorld™ :

```js
/* Un composant ReasonReact se crée en deux temps: d'abord on crée le `component`
   à partir d’un appel à `statelessComponent` ou `reducerComponent` (il existe d'autres
   cas plus avancés, mais on s'y attardera pas dans cet article d'introduction). */
let component = ReasonReact.statelessComponent("HelloWorld");

/* Ensuite, on déclare une fonction `make` qui prend des arguments nommés
   (qui équivalent aux `props` de React) et un dernier argument non-nommé,
   contenant les `children`. Cette fonction doit retourner un record, dans
   lequel on spread notre `component` et dans lequel on définit une propriété
   `render` qui prend comme paramètre `self` (équivalent du `this`) et qui retourne
   un élément React. Là-dessus ça devrait pas trop vous chambouler de ce que
   vous connaissez de React.
   On peut remarquer que les props sont les arguments de la fonction `make`,
   comme avec les composants fonctionnels de React.*/
let make = (~message, _children) => {
  ...component,
  render: (_self) =>
    <div>
      (ReasonReact.stringToElement message)
    </div>
};
```

Et pour monter le composant :

```js
ReactDOMRe.renderToElementWithId(<HelloWorld message="Helloworld" />, "root");
```

Un des gros avantages à utiliser Reason, c’est que le langage est capable d’inférer la grande majorité des types et sera en mesure de détecter dans toute l’app si quelque chose n’est pas passé correctement : pour le langage, il s‘agit simplement de fonctions qui appellent d’autres fonctions, et les langages fonctionnels statiquement et fortement typés sont plutôt pas dégueulasses pour ça.

## Stateful

La petite particularité de ReasonReact vis à vis des composants stateful, c’est que les mises à jour d'états doivent passer par un reducer, comme si chaque composant embarquait sa petite implémentation de redux.

Maintenant, comment qu'on fait pour créer un composant stateful ?

On commence par définir le type du state : contrairement à JS, il ne s'agit pas forcément d'un objet, ça peut être une chaîne de caractère, un entier, un variant, un boolean, un arbuste, une map, un jus de fruits frais, un tableau, whatever.

```js
type state = {
  counter: int
};
```

On va définir notre type action, sous la forme de variants: chaque variant représente un des type d’action possible. Pour bien se représenter ce qu'est une action, c’est un token, contenant possiblement des paramètres, qu’on va envoyer à notre fameux reducer qui, lui, retournera une réaction à cette action.

```js
type action =
  | Increment
  | Decrement;
```

Dans le composant retourné par `make`, on ajoute une fonction `initialState` qui retourne… l'état initial (c'est bien, vous suivez), et une fonction `reducer`, qui effectue un pattern-matching sur l’action et retourne une update.
Cette fonction prend deux paramètres: l'`action` à traiter et le `state` à jour (comme lorsque l'on passe un callback à `setState` dans l'équivalent JavaScript `setState(state => newState)`).

L’update retournée indique au component comment il doit se mettre à jour (ici sont listés les cas courants) :

- `NoUpdate`, pour ne rien faire
- `Update`, pour mettre à jour l’état et re-rendre le composant
- `SideEffect` pour lancer un effet de bord (e.g. une requête réseau)
- `UpdateWithSideEffect`, pour changer le state et lancer un effet de bord (e.g. afficher un loader et lancer une requête)

*Wrapping up* :

```js
type state = {counter: int};

type action =
  | Increment
  | Decrement;

/* Il faut bien définir le `component` **après** les types `state` et `action`, pour qu'il puisse les lire */
let component = ReasonReact.reducerComponent("Count");

let make = (~initialCounter=0, _) => {
  ...component,
  initialState: () => {counter: initialCounter},
  reducer: (action, state) =>
    /* Toutes mes updates passent par là, bien pratique pour qu'une
      personne puisse aborder rapidement le composant */
    switch action {
    | Increment => ReasonReact.Update({counter: state.counter + 1})
    | Decrement => ReasonReact.Update({counter: max(0, state.counter - 1)})
    },
  render: ({state, reduce}) =>
    <div>
      (ReasonReact.stringToElement(state.counter |> string_of_int))
      /* La fonction reduce prend une fonction qui retourne l'action.
           Il s'agit d'une fonction pour lire les propriétés des
           events (qui sont pooled dans React) de manière synchrone, alors
           que le reducer est appelé de manière asynchrone.
         */
      <button onClick=(reduce((_event) => Decrement))> (ReasonReact.stringToElement("-")) </button>
      <button onClick=(reduce((_event) => Increment))> (ReasonReact.stringToElement("+")) </button>
    </div>
};
```

et hop:

```js
ReactDOM.renderToElementWithId(<Count initialCount=0 />, "App");
```

## With side-effects

Bien que ça puisse paraître un peu lourd de devoir faire un `reducer` pour gérer ses updates, ça apporte quand même:

- Un seul endroit par composant où toutes les updates passent
- La possibilité pour le compiler de détecter si l'on oublie de gérer des actions
- De gérer lisiblement et uniformément les effets de bord

<img src="./terminal.png" alt="" />

Exemple ici avec un composant où on va faire comme si on récupérait l'utilisateur connecté sur une API.

```js
let resolveAfter = (ms) =>
  Js.Promise.make(
    (~resolve, ~reject as _) => ignore(Js.Global.setTimeout(() => [@bs] resolve(ms), ms))
  );

module User = {
  type t = {username: string};
  /* faisons comme si on avait un appel serveur
     (je le fais comme ça pour que vous puissiez copier/coller le code
     pour essayer chez vous) */
  let getUser = (_) =>
    resolveAfter(1000)
    |> Js.Promise.then_(
         (_) =>
           Js.Promise.resolve({
             username: "MyUsername" ++ string_of_int(Js.Math.random_int(0, 9999))
           })
       );
};

/* Le "user" distant peut avoir 4 états possibles ici */
type resource('a) =
  | Inactive
  | Loading
  | Idle('a)
  | Errored;

type action =
  | Load
  | Receive(resource(User.t));

type state = {user: resource(User.t)};

let component = ReasonReact.reducerComponent("User");

let getUser = (credentials, {ReasonReact.reduce}) =>
  ignore(
    User.getUser(credentials)
    /* Si tout s'est bien passé */
    |> Js.Promise.then_(
         /* On peut utiliser les actions en dehors du `make`: c'est juste des variants */
         (payload) => Js.Promise.resolve(reduce((payload) => Receive(Idle(payload)), payload))
       )
    /* Si ça a merdé */
    |> Js.Promise.catch((_) => Js.Promise.resolve(reduce(() => Receive(Errored), ())))
  );

let make = (~credentials, _) => {
  ...component,
  initialState: () => {user: Inactive},
  reducer: (action, _state) =>
    switch action {
    /* UpdateWithSideEffects met à jour l'état, puis lance l'effet de bord,
       très pratique pour ce genre de cas */
    | Load => ReasonReact.UpdateWithSideEffects({user: Loading}, getUser(credentials))
    | Receive(user) => ReasonReact.Update({user: user})
    },
  didMount: ({reduce}) => {
    reduce(() => Load, ());
    ReasonReact.NoUpdate
  },
  render: ({state, reduce}) =>
    <div>
      (
        ReasonReact.stringToElement(
          switch state.user {
          | Inactive
          | Loading => "Loading ..."
          | Idle(user) => "Hello " ++ user.username
          | Errored => "An error occured"
          }
        )
      )
      <div>
        <button
          disabled=(
            switch state.user {
            | Idle(_) => Js.false_
            | _ => Js.true_
            }
          )
          onClick=(reduce((_) => Load))>
          (ReasonReact.stringToElement("Reload"))
        </button>
      </div>
    </div>
};
```

## Oui mais est-ce que je peux l'utiliser aujourd'hui alors que j'ai déjà une grosse codebase React ?

<img src="./tenor.gif" alt="" />

Pour utiliser des composants ReasonReact avec React

```js
let jsComponent =
  ReasonReact.wrapReasonForJs(
    ~component,
    (jsProps) =>
      make(
        ~credentials=jsProps##credentials,
        [||]
      )
  );
```

et

```js
const MyComponent = require("path/to/reason/output").jsComponent;
```

À l'inverse, pour utiliser des composants React avec ReasonReact

```js
[@bs.module "path/to/good/old/reactjs/component"] external myJsComponent : ReasonReact.reactClass = "default";

let make = (~message: string, _children) =>
  ReasonReact.wrapJsForReason(
    ~reactClass=myJsComponent,
    ~props={"message": message},
    [||]
  );
```

Voilà pour les *basics* de ReasonReact. Pour en savoir plus, y a [la petite doc qui va bien](https://reasonml.github.io/reason-react/), et on vous préparera un petit article sur les aspects un peu plus avancés de l'usage.

Bisous bisous.
