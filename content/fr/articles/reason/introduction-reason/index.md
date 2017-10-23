---
date: "2017-10-02"
title: "Introduction à ReasonML (ou pourquoi j'ai arrêté d'utiliser JavaScript)"
tags:
  - reasonml
  - ocaml
  - javascript
authors:
  - bloodyowl
header:
  image: index.png
  linearGradient: #DD4B39, #DD4B39
---

Les bugs c'est chiant, surtout quand on sait qu'on aurait pu les éviter. Avec
JavaScript, c'est plus facile d'en avoir que de les éviter.

JavaScript, on ne peut pas y échapper parce que c'est partout, parce que c'est
le langage de programmation le plus utilisé sur Terre, et parce que c'est le
seul truc qui (pour l'instant) tourne nativement dans le navigateur. Et puis
c'est pas si mal, c'est facile de l'apprendre en bidouillant un peu, c'est très
permissif et pas trop frustrant pour débuter.

Le problème c'est que c'est facile d'en faire, mais c'est très dur d'en faire
**bien** (moins que CSS, mais quand même). On s'est tous déjà retrouvé avec
`undefined is not a function`, `null is not an object` ou un bon gros `[object
Object]` qui traîne dans la console.

## Pourquoi est-ce que c'est comme ça ?

JavaScript est un langage dynamiquement et faiblement typé, ce qui veut dire :

* qu'une fonction ne sait pas ce qu'elle prend ou retourne comme type
  d'arguments, c'est à vous de gérer
* que le programme n'en a aucune idée non plus tant qu'il n'execute pas la
  portion de code

Tout ça fait qu'il est très difficile de faire confiance à du code JavaScript.

<figure>
<img src="./js.png" alt="js" />
<figcaption>Source: MIT</figcaption>
</figure>

Il existe Flow et TypeScript (dont on a parlé dans un [précédent
article](/fr/articles/js/flow/) et un [podcast](fr/articles/podcast/3/)), deux
projets qui permettent d'apporter du typage statique pour sécuriser son code.
Ils contraignent votre usage de JavaScript, mais devront toujours se battre
contre sa permissivité.

Ça revient au final à coller des rustines sur vos pneus avant d'aller rouler sur
des clous, ça va vous protéger un peu, mais ça reste de base pas bien malin
d'aller rouler sur des clous.

Il existe des langages qui ont la judicieuse idée de balayer la route pour virer
les clous avant d'y aller : les langages typés fortement et statiquement (10
points pour Gryffondor pour cette métaphore filée).

OCaml est un de ces langages. Il est de la famille ML et a été créé en France
dans les années 90. Il est à peu près aussi âgé que JavaScript mais est beaucoup
plus sage. Il est certes fortement et statiquement typé, mais il infère la
plupart des types du programme (ce qui veut dire que vous n'avez pas à
renseigner les types partout, il va l'extrapoler dès qu'il le peut). En bonus,
il possède de [bonnes
data-structures](https://ocaml.org/learn/tutorials/comparison_of_standard_containers.html).

Seulement voilà, OCaml, comme beaucoup de langages fonctionnels n'a pas vraiment
mis l'accent sur l'accessibilité pour les débutants, et a une syntaxe qu'on peut
pour le moins qualifier de pas très friendly: elle n'a rien de bien mal, mais
mettez quelqu'un qui vient de JS/PHP/Java devant, ça va pas lui causer des
masses:

```ocaml
let rec qsort = fun value ->
  match value with
   | [] -> []
   | pivot :: rest ->
       let is_less x = x < pivot in
       let left, right = List.partition is_less rest in
       qsort left @ [pivot] @ qsort right;;
```

<figure>
<img src="./giphy.gif" alt="" />
<figcaption>fig. 1: dev JS devant du code OCaml</figcaption>
</figure>

C'est là qu'intervient Reason, un projet initié par [le créateur de
React](https://twitter.com/jordwalke). Les premières itérations de React étaient
d'ailleurs codées dans un langage cousin de OCaml, le SML.

C'est en gros:

* OCaml
* avec une syntaxe _beginner-friendly_
* avec un tooling le rendant plus simple à utiliser
* qui peut compiler vers JavaScript et de multiples plateformes

Avec son type system, OCaml propose un langage *safe-by-design*, chose que même
avec une palanquée d'outils, on ne peut pas atteindre avec JavaScript.

Le langage propose par défaut une approche fonctionnelle et immutable, mais
permet cependant de choisir d'utiliser des structures mutables et de l'orienté
objet au besoin.

## Le langage

Reason comporte plus de types de primitifs que JavaScript:

```reason
/* pas un gros "number" fourre tout, magique */
1 /* int */
1.0 /* float */
/* un caractère est d'un type différent de string */
"foo" /* string */
'a' /* char */
/* on trouve list ET array, chacun peut être utilisé pour différents cas */
[1, 2, 3] /* list */
[| 1, 2, 3 |] /* array */
/* pas de null, mais des valeurs de type `option` qui contiennent
  soit une valeur, soit rien */
Some 1 /* option int */
None /* option int */
```

Puisqu'il est fortement typé, il est impossible de mixer les types comme en
JavaScript, vous devrez obligatoirement les convertir:

```reason
1 + 1.0;
/* Error:
  This expression has type int but an expression was expected of type float */
1 + int_of_float 1.0;
/* - : int = 2 */
```

La plupart des opérations de transformations de type primitifs vers un autre
sont accessibles dans le module `Pervasives` qui contient plein de petits
utilitaires bien pratiques. Toutes les fonctions de ce module sont accessibles
directement dans n'importe quel de vos fichiers.

Les fonctions de Reason sont beaucoup plus puissantes qu'en JavaScript:

```reason
let add a b => a + b;
/* int => int => int */
add 1 2;
/* 3 */
add 1 2.0;
/* This expression has type float but an expression was expected of type int */

/* Les fonctions sont "auto-curried", ce qui signifie qu'une fonction
   qui n'a pas reçu tous ses paramètres retourne une nouvelle fonction
  qui va recevoir les paramètres manquants */
let addOne = add 1;
/* int => int */

/* Les fonctions peuvent avoir des paramètres nommés, optionnels et avec des valeurs par défaut */
let sayHi ::name ::punct="!" () => "Hello " ^ name ^ punct;
/* name::string => string */
sayHi name::"you" ();
/* "Hello you!" */
/* L'ordre des arguments nommés n'a pas d'importance*/
sayHi punct::"?" name::"you"  ();
/* "Hello you?" */
```

Pour définir l'équivalent d'un _plain-object_ JavaScript en Reason, on utilise
des records:

```reason
/* On doit typer les records */
type user = {
  username: string,
  age: int
};

/* Les records ont un nombre de clés fini, vous ne pouvez pas en
  ommettre une ou en mettre une en trop */
let user = { username: "Bob" };
/* Error: Some record fields are undefined: age */

let user = { username: "Bob", age: 20 };

/* Les records sont immutables par défaut */
let olderUser = {...user, age: user.age + 1 };
```

Reason possède un système de module très puissant: par défaut, chaque fichier de
votre codebase est un module, mais vous pouvez également déclarer des modules
_dans_ un module.

```reason
module User = {
  type t = {
    id: string,
    username: string,
    email: option string
  };
  let make ::id ::username ::email => {id, username, email};
  let sayHi user => "Hello " ^ user.username ^ "!";
};

/* Pour utiliser un module, tapez son nom, tout simplement */
User.make id::"0" username::"bloodyowl" email::None
  /* (ah oui, le pipe existe déjà ici, pas besoin d'attendre ES2050)*/
  |> User.sayHi
  |> print_endline;
/* "Hello bloodyowl" */

/* On peut également rendre toutes les valeurs d'un module accessibles localement */
User.(
  make id::"0" username::"bloodyowl" email::None
    |> sayHi
    |> print_endline
);

/* Carrément les rendre accessibles globalement dans le module */
open User;

make id::"0" username::"bloodyowl" email::None
  |> sayHi
  |> print_endline;

/* Ou même étendre un module statiquement et proprement,
  ça vous parle ça, Prototype et MooTools ?! */
module UserThatCanSayBye = {
  include User;
  let sayBye user => "Bye " ^ user.username ^ "!";
};
```

Il existe également des functors, qui sont des sortes de fonctions retournant
des modules à partir d'autres modules, mais on ne l'abordera pas dans cet
article.

Reason possède également des variants, il s'agit de types pouvant avoir
différents cas. Prenons l'exemple d'un message de chat:

```reason
type image = {url: string, width: int, height: int};

/* chaque cas du variant peut prendre des paramètres */
type message =
  | String string /* soit une chaîne de caractères */
  | Image image /* soit une image */
  | Emoji string; /* soit un gros emoji */

let stringMessage = String "Hello"; /* On crée la valeur avec son constructeur */
let imageMessage = Image {url: "https://fakeimg.pl/300x300", width: 300, height: 300};
let emojiMessage = Emoji {js|🐫|js}; /* Quand la string contient de caractères unicode,
  on doit utiliser {js|votre string|js} */
```

Ici, notre type `message` est bien délimité, et ses valeurs ne peuvent être que
celles que l'on a défini.

Pour utiliser les valeurs d'un variant, on peut les extraire à l'aide de
`switch`, qui va _pattern-matcher_ pour nous permettre d'identifier et
d'extraire les valeurs.

```reason
/* Petit bonus, l'exemple utilise ReasonReact, mais on détaillera ça dans un prochain article */
let component = ReasonReact.statelessComponent "ChatMessage";

let make ::message _children => {
  ...component,
  render: fun _ => {
    <div>
      (switch message {
        | String value => ReasonReact.stringToElement value
        | Image {url: src, width, height} => <img width height src />
        /* Si par mégarde j'oublie un cas possible dans un switch, je vais avoir un joli warning du
          compiler qui me dira:
            This pattern-matching is not exhaustive.
            Here is an example of a value that is not matched:
              Emoji
        */
        | Emoji value =>
          <div style=(ReactDOMRe.Style.make fontSize::"40px" ())>
            (ReasonReact.stringToElement value)
          </div>
      })
    </div>
  }
};
```

En Reason, les _let bindings_ ont automatiquement le block parent comme scope,
on peut du coup écrire des choses comme ceci :

```reason
let value = {
  let a = 1;
  let b = 2;
  a + b; /* la dernière expression est toujours retournée par défaut */
};
/* let value : int = 3 */
a
/* Error: Unbound value a */
```

Voilà pour l'introduction à ReasonML, pour en découvrir un peu plus je vous
invite à aller lire la [documentation officielle](https://reasonml.github.io/).
On verra dans les prochains articles comment fonctionne
[ReasonReact](https://reasonml.github.io/reason-react) (les bindings Reason vers
React, avec quelques petites features sympathiques en plus), et comment
l'adopter incrémentalement dans sa codebase pour avoir du code plus sûr, et
*(spoilers)*, plus rapide que si vous l'écriviez à la main.

Bisous bisous.
