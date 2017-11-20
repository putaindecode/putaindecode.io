---
date: "2017-11-19"
title: Flow avancé - Première partie
tags:
  - javascript
  - flow
  - type
authors:
  - zoontek
---

Ça y est: vos collègues ont enfin réussi à vous motiver à utiliser [flow](https://flow.org/en/), l'outil de Facebook vous permettant d'ajouter du typage fort au sein de vos fichiers JavaScript. Seulement voilà, vous avez utilisé des langages à typage dynamique faible toute votre vie (PHP, JavaScript, Ruby, Python…), et pour le moment vous vous contentez d'ajouter des annotations de types `Object`, `Function` ou encore `string`. Frustrés, vous ne pouvez vous empêcher de crier sur tous les toits que le typage, c'est quand même chiant et limite une perte de temps puisque flow continue de manquer un tas d'erreurs potentielles au sein de votre code. Cet article est là pour vous aider à comprendre de quoi le bouzin est réellement capable, et même si vous n'utilisez pas flow, il peut servir de chouette introduction un peu poussée à son utilisation.

Nous utiliserons la dernière version en date à l'heure où j'écris ces lignes, c'est à dire la 0.59.
Pour l'ajouter au sein de votre projet, petit rappel:

```sh
npm install --save-dev flow-bin
npm install --save-dev flow-remove-types # pour les besoin du tuto - vous pouvez également utiliser babel et le couple babel-plugin-syntax-flow / babel-plugin-transform-flow-strip-types
npx flow init # pour créer le fichier .flowconfig
```

## Rappels sur l'inférence de type

Flow est un outil intelligent: il est inutile de préciser quel type est utilisé si celui-ci est évident à l'usage.

```js
// @flow <- le pragma nécessaire pour indiquer à flow d'analyser votre fichier. À noter que si vous l'ajoutez sur un projet tout neuf, vous pouvez le configurer pour que celui-ci ne soit pas nécessaire

const quote = "Thirouin rouin rouin rouin";
Math.round(quote); // erreur! le type attendu est un number

const sayHello = name => `Hello ${name}`; // inféré en (name: any) => string
sayHello("Mathieu").toLowerCase(); // pas d'erreur
sayHello(["Mathieu", "zoontek"]).toLowerCase(); // pas d'erreur (?)
```

On voit ici très vite les limites de l'inférence de type en JavaScript: par défaut si flow n'est pas capable de deviner de quel type il s'agit, il utilisera le type "any", qui correspond à un bon gros "osef, ça peut être n'importe quoi" des familles.

Mais vous pouvez toujours faire pire: en annotant la fonction `sayHello` du type `Function`, vous perdez carrément l'inférence sur le type de retour. Comme quoi, parfois ne pas préciser le type d'une variable peut se montrer plus efficace que d'utiliser des types "génériques" tels que `Object` ou `Function` (d'ailleurs je vous encourage à ne jamais le faire).

```js
// @flow

const sayHello: Function = name => `Hello ${name}`; // inféré en (name: any) => any
```

La bonne façon de faire est bien sûr la suivante :

```js
// @flow
const sayHello = (name: string) => `Hello ${name}`; // (name: string) => string
sayHello("Mathieu"); // pas d'erreur
sayHello(["Mathieu", "zoontek"]).toLowerCase(); // erreur! le type attendu est une string
```

## Les types primitifs et litéraux

Le nombre de types primitifs existants en JavaScript est assez restreint. Vous avez le nombre (`number`), la chaine de caractères (`string`), les booléens (`boolean`), et bien évidemment les valeurs nulles (`null`) et inexistantes (`void`).
À noter que ES2015 a également apporté (`Symbol`), mais que ce dernier n'est pas encore supporté par flow.

```js
// @flow

const a: number = 42;
const b: string = "Je ne suis pas Coluche, certes";
const c: boolean = true;
const d: null = null;
const e: void = undefined;
```

Afin de vous montrer plus précis encore, vous pouvez également utiliser des valeurs litérales comme type. Après tout `string`, ça peut être tout et n'importe quoi. Si cela peut vous sembler stupide dans un premier temps, ceux-ci sont **extrêmement** utiles lorsque le système de typage est suffisamment perfectionné, commme vous le verrez par la suite.

```js
// @flow

const foo: "x" = "x"; // pas d'erreur
const bar: 2 = 3; // erreur! n'est pas égal à 2
```

## La différence entre `any`, `mixed` et `*`

Comme expliqué au dessus, utiliser `any` revient à dire à flow qu'une variable peut être de n'importe quel type et cela est bien sûr extrêmement dangereux. Heureusement, il existe 2 alternatives plus sûres à connaître :

- `mixed`, un type qui dit que peu importe le type de la variable, l'appel à une fonction devrait se faire correctement
- `*` qui laisse travailler l'inférence de type de flow

```js
// @flow

function foo(arg: mixed) {
  console.log(arg);
} // pas d'erreur: peu importe le type réel du paramètre arg, l'appel se fera correctement

function bar(arg: mixed) {
  console.log(arg.toUpperCase());
} // erreur! arg pourrait ne pas être une string

const baz: Array<*> = [1, 2, 3]; // inféré en Array<number>
baz.push("Hello"); // "foo" est maintenant inféré en Array<number | string> (tableau de string ou de numbers)
```

## Les types optionnels (ou maybe types)

Si vous avez déjà utilisé un langage qui essaye d'éviter [l'erreur à un milliard de dollars](https://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare), vous connaissez sûrement les types `Option` / `Maybe`. Ils représentent la possible absence d'une valeur et sont ici symbolisés à l'aide d'un point d'interrogation.

```js
// @flow

let foo: ?string; // peut-être une string, null ou undefined
foo = "foo"; // pas d'erreur
foo = undefined; // pas d'erreur
foo = null; // pas d'erreur
foo = 3; // erreur - number n'est ni une string, ni null, ni undefined

function wrongToUpperCase(str: ?string) {
  return str.toUpperCase(); // erreur, str est possiblement nul, vous devez traiter ce cas
}

function correctToUpperCase(str: ?string) {
  if (typeof str === "string") {
    return str.toUpperCase(); // pas d'erreur
  }
}
```

## Les types génériques (generics)

Vous souvenez vous de la syntaxe des tableaux (`Array<any>`) croisée plus tôt? Il s'agit de ce qu'on appelle un type générique: un type construit depuis un autre type. Ainsi, si `Array<any>` symbolise un tableau de tout et n'importe quoi, `Array<number>` symbolisera un tableau de numbers, etc.

```js
// @flow

// on crée un type Classement qui prend en "paramètre" un type générique qu'on nomme "T"
type Classement<T> = {
  first: T,
  second: T,
  third: T
};

const numberClassement: Classement<number> = {
  first: 42,
  second: 7,
  third: 1
};
```

Voici quelques exemples de types génériques disponibles out-of-the-box :

```js
// @flow

const foo: Array<number> = [];

const bar: Map<number, string> = new Map();
bar.set(1, "one");

const baz: Set<number> = new Set();
baz.add(1);

const p: Promise<number> = Promise.resolve(42);
```

## La manipulation d'objets

Avez vous remarqué que pour le moment, j'ai tenté de ne pas utiliser d'objets au sein de mes exemples (oui, c'était chiant)? C'est tout simplement car les possibilités de manipulation des types de ceux-ci sont très nombreuses. Je vous propose un exemple fleuve histoire d'y voir plus clair.

Un type objet se définit de la sorte :

```js
// @flow

type User = {
  name: string,
  pseudo: string
};

const user: User = {
  name: "Mathieu",
  pseudo: "zoontek"
};

// Ce qui n'exclut pas de faire
user.age = 26; // pas d'erreur
```

Pour sceller les propriétés de notre objet, on utilise la notation `{||}` :

```js
// @flow

type User = {|
  name: string,
  pseudo: string
|};

const user: User = {
  name: "Mathieu",
  pseudo: "zoontek"
};

user.age = 26; // erreur! la propriété age n'existe pas
```

Pour indiquer qu'une propriété de notre objet est immutable, on utilise la notation `+`. Un must-have pour vos reducers Redux.

```js
// @flow

type User = {
  +name: string,
  pseudo: string
};

const user: User = {
  name: "Mathieu",
  pseudo: "zoontek"
};

user.name = "Jean-Michel"; // erreur! la valeur de name ne peut-être modifiée

const newUser: User = {
  ...user,
  name: "Jean-Michel"
}; // pas d'erreur
```

> Le spreading c'est vraiment cool! Ça existe aussi pour les types?

Yep.

```js
// @flow

type Foo = {| a: number, b: string |};
type Bar = {| a: string |};
type Baz = {| ...Foo, ...Bar |}; // {| a: string, b: string |}
```

Un dernier petit trick sur les objets pour la route? Vous pouvez les utiliser comme maps :

```js
// @flow

const foo: { [key: string]: number } = {
  bar: 42,
  baz: "whatever" // erreur! les valeurs des propriétés de cet objet doivent être de type number
};
```

## Les unions et intersections de types

Si vous avez remarqué la notation avec `|` plus tôt, vous vous posez sûrement la question de ce que ça représente. Il s'agit d'une union de types : la variable aura une valeur à plusieurs types possibles. Petit conseil : utilisez toujours une union de types litéraux à la place du simple `string` lorsque vous connaissez à l'avance les possibles valeurs de celui-ci.

```js
// @flow

function sayHelloOrRound(arg: string | number) { // arg peut être une string ou un number
  return typeof arg === "string" ? `Hello ${arg}` : Math.round(arg);
} // pas d'erreur

type Color =
  | "red"
  | "green"
  | "blue"

function toHexadecimal(color: Color) {
  switch (color) {
    case "red":
      return "#FF0000";
    case "green":
      return "#00FF00";
    case "blue":
      return "#0000FF";
  }
}

toHexadecimal("red"); // pas d'erreur
toHexadecimal("green"); // pas d'erreur
toHexadecimal("blue"); // pas d'erreur
toHexadecimal("pink"); // erreur! "pink" n'est pas une des possibles valeurs
toHexadecimal("dog"); // erreur! "dog" n'est pas une des possibles valeurs
```

Parfois, une union de types se montre également bien plus efficace pour modéliser ce que vous souhaitez, à contrario d'un tas de maybe types.

```js
// @flow

type ApiResponseBadlyTyped = {
  success: boolean,
  value?: string, // value peut être présent
  error?: Error // error peut être présent
};

const foo: ApiResponseBadlyTyped = { success: true }; // pas d'erreur alors que j'attends une value
const bar: ApiResponseBadlyTyped = { success: true, error: new Error("oups!") }; // pas d'erreur non plus

type ApiResponseCorrectlyTyped =
  | { success: true, value: string }
  | { success: false, error: Error };

const foo: ApiResponseCorrectlyTyped = { success: true }; // erreur! il manque value
const bar: ApiResponseCorrectlyTyped = { success: true, error: new Error("oups!") }; // erreur! si success est à true, on ne doit pas trouver d'error dans notre objet
const baz: ApiResponseCorrectlyTyped = { success: false, error: new Error("oups!") }; // pas d'erreur
```

Si les unions de types sont le **OU** logique du système de typage, les intersections de types en sont le **ET**. On les symbolise à l'aide d'un `&`.

```js
// @flow

type Foo = { a: number };
type Bar = { b: string };
type Baz = { c: boolean };

const test: Foo & Bar & Baz = {
  a: 42,
  b: "whatever",
  c: true
}; // pas d'erreur

let impossible: number & string; // sera forcément impossible à initialiser : une valeur ne pourra jamais être un number ET une string
```

C'est tout pour le moment! Vous vous doutez que l'on égratigne à peine la surface de ce qui nous est offert par flow et les systèmes de typage fort en général. Si vous êtes vraiment impatients de découvrir la suite, je vous renvoie vers la [documentation de flow](https://flow.org/en/docs/), très bien foutue. Pour les autres, d'autres articles devraient sortir très prochainement sur P! sur le même sujet (on y parlera classes, interfaces et peut être même types opaques si vous êtes sages).

Stay tuned! La bise.
