---
date: "2017-12-26"
title: "Flow avancé - Seconde partie: les types opaques"
tags:
  - javascript
  - flow
  - type
authors:
  - zoontek
---

Vous avez digéré le premier article, peut-être même débuté avec [flow](https://flow.org/) depuis, mais vous mourez d'envie de découvrir ce que vous pouvez faire de plus avec votre nouvel outil préféré ? Tant mieux, puisque nous sommes là pour parler d'une fonctionnalité assez avancée, apparue avec la version 0.51 et, à l'heure où j'écris ces lignes, indisponible dans TypeScript: les types opaques.

Si vous n'avez pas installé flow au sein de votre projet, je vous renvoie au [premier article](http://putaindecode.io/fr/articles/js/flow/advanced-part-1/) qui vous expliquera très bien comment faire.

## Transparence de types

Si on parle de types opaques, c'est bien parce que les types transparents existent. D'ailleurs par défaut, tout alias de type défini l'est. Mais que sont-ils ? Simple: ce sont des types compatibles entre eux et donc interchangeables.

```js
// @flow

type FirstName = string;
type LastName = string;

function yellFirstName(firstName: FirstName) {
  console.log(firstName.toUpperCase());
}

const name: LastName = "Acthernoene";
yellFirstName(name);
```

Dans cet exemple, les types `FirstName` et `LastName` étant tout deux des alias de `string`, on peut sans problème utiliser la variable `name` de type `LastName` là où la function `yellFirstName` attend un paramètre de type `FirstName`. Pas cool.

## Rendons tout cela opaque

Nous allons donc modifier l'exemple précédent et…

```js
// @flow

opaque type FirstName = string;
opaque type LastName = string;

function yellFirstName(firstName: FirstName) {
  console.log(firstName.toUpperCase());
}

const name: LastName = "Acthernoene";
yellFirstName(name);
```

…toujours pas d'erreur ? Du calme, c'est normal. Les types `FirstName` et `LastName` étant accessibles car dans le même module JS, flow sait que ceux-ci sont des alias de type `string`. Modifions l'exemple et créons un deuxième module.

```js
// @flow
// module.js

opaque type FirstName = string;
opaque type LastName = string;

type User = {
  firstName: FirstName,
  lastName: LastName
};

export function createUser(firstName: string, lastName: string): User {
  return { firstName, lastName };
}

export function yellFirstName(firstName: FirstName) {
  console.log(firstName.toUpperCase());
}
```

```js
// @flow
// usage.js

import { createUser, yellFirstName } from "./module";

yellFirstName("Mathieu"); // ⚠️ Erreur: "string. Ce type est incompatible avec le type de paramètre attendu FirstName"

const user = createUser("Acthernoene", "Mathieu");
yellFirstName(user.firstName); // Pas d'erreur
```

On voit ici qu'il n'est en fait possible d'utiliser le type `FirstName` qu'après son assignation au sein du module où celui-ci est défini. Un autre exemple: si l'on venait à rendre le type `User` opaque, alors nous ne pourrions pas accéder à `user.firstName`, la propriété étant inaccessible autrement que par une fonction qui manipulera le type `User`.

```js
// @flow
// module.js

opaque type FirstName = string;
opaque type LastName = string;

opaque type User = {
  firstName: FirstName,
  lastName: LastName
};

export function createUser(firstName: string, lastName: string): User {
  return { firstName, lastName };
}

export function yellFirstName(firstName: FirstName) {
  console.log(firstName.toUpperCase());
}

export function yellUserFirstName(user: User) {
  console.log(user.firstName.toUpperCase());
}
```

```js
// @flow
// usage.js

import { createUser, yellFirstName, yellUserFirstName } from "./module";

const user = createUser("Acthernoene", "Mathieu");
yellFirstName(user.firstName); // ⚠️ Erreur: "Propriété `firstName`. La propriété n'est pas accessible sur le type User"
yellUserFirstName(user); // Pas d'erreur
```

## Tu n'aurais pas un exemple plus concret ?

Bien sûr que si ! Nous pouvons utiliser les types opaques pour implémenter un type `UUID` très basique:

```js
// @flow
// uuid.js

// @flow

import uuidv4 from "uuid/v4"; // On installe 2 packages
import validator from "validator";

export opaque type UUID = string;

export function create(): UUID {
  return uuidv4();
}

export function check(uuid: UUID): boolean {
  return validator.isUUID(uuid);
}
```

```js
// @flow
// usage.js

import * as UUID from "./uuid";

UUID.check("a duck"); // ⚠️ Erreur: "string. Ce type est incompatible avec le type de paramètre attendu UUID"
UUID.check("df7cca36-3d7a-40f4-8f06-ae03cc22f045"); // ⚠️ Erreur: "string. Ce type est incompatible avec le type de paramètre attendu UUID"

const uuid = UUID.create();
UUID.check(uuid); // Pas d'erreur

uuid.toUpperCase(); // ⚠️ Erreur: "Appel de méthode `toUpperCase`. La méthode ne peut pas être appelée sur un type UUID"
```

# C'est tout de même assez restrictif…je voudrais ne pas devoir tout réimplémenter

Ne vous inquiétez pas, les développeurs à l'origine de flow ont tout prévu et pour remédier à cela il existe ce qu'on appelle le sous-typage (ou _SubTyping_ dans la langue de Shakespeare). Ainsi, nous allons dire à flow que chaque `UUID` est un `string` mais que la réciproque ce sera pas vraie pour autant.

Reprenons l'exemple précédent.

```js
// @flow

import uuidv4 from "uuid/v4";
import validator from "validator";

export opaque type UUID: string = string; // Seul cette ligne change, on y ajoute un sous-type number

export function create(): UUID {
  return uuidv4();
}

export function check(uuid: UUID): boolean {
  return validator.isUUID(uuid);
}
```

```js
// @flow
// usage.js

import * as UUID from "./uuid";

const uuid = UUID.create();
UUID.check(uuid); // Pas d'erreur

uuid.toUpperCase(); // Pas d'erreur: même si uuid est un UUID, il est utilisable comme un type string
```

## Que retenir de tout ça ?

Comme on a pu le voir, les types opaques élèvent clairement le niveau du type-game dans le milieu du JavaScript. Forcément utiles pour imposer l'utilisation de fonctions pour créer / manipuler certaines données, ils s'avéreront assez vite indispensables pour structurer davantage votre JS et améliorer sa maintenabilité.

Je vous encourage d'ailleurs à vous en servir quasiment partout (ça sera assez chiant au début, mais vous me remercierez plus tard) !

La bise, et rendez-vous pour une troisième partie 😘
