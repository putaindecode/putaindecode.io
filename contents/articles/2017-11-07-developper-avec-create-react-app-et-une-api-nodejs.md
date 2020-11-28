---
date: 2017-11-07
title: Développer avec Create React App et une API Node.js
author: tmaziere
oldSlug: js/react/create-react-app-et-api
slug: developper-avec-create-react-app-et-une-api-nodejs
---

## tl;dr

Dans un environnement de développement, pour lancer dans le même temps votre
application React et une API basée sur Node.js, vous pouvez imbriquer
judicieusement les deux dépôts Git, puis utiliser un script NPM et quelques
packages bien pratiques tels que _concurrently_ et _nodemon_ pour lancer les
deux serveurs d'une seule commande. Pratique ! D'autant que pour contourner les
restrictions d'accès liées à la
[_politique de même origine_](https://fr.wikipedia.org/wiki/Same-origin_policy),
**create-react-app** permet le paramétrage d'un _proxy_ pour vos requêtes API.

## Est-ce que ça me concerne ?

La généralisation des architectures dites "API first" répond à des impératifs
humains et techniques très divers. En ce qui concerne l'organisation du travail
des développeurs, c'est l'assurance de pouvoir scinder l'implémentation de
l'accès aux données -aux ressources- d'une part, et le travail sur l'UI/UX,
d'autre part. Un premier groupe peut concevoir une API robuste et proposer un
"contrat" clair à l'équipe _frontend_ qui accède aux données avec un référentiel
unique, que l'application soit web ou mobile.

De cette façon, la conception de l'interface utilisateur est libérée d'une
grande partie des contraintes qui régissent les architectures MVC
traditionnelles. Le développeur peut ainsi mieux se concentrer sur la qualité de
sa réponse aux spécifications fonctionnelles.

Si l'architecture de votre projet est de ce type, et que vous attaquez la
conception d'un frontend
[SPA](https://fr.wikipedia.org/wiki/Application_web_monopage) React avec
[create-react-app](https://github.com/facebookincubator/create-react-app)
(quelle bonne idée !), ce qui suit peut vous éclairer. Nous allons voir comment
il est possible d'accéder sans se compliquer la vie à une API RESTful basée sur
Node.js, en imbriquant correctement ses dépôts.

## Deux dépôts : le frontend, l’API

Le principe est le suivant : vous ne souhaitez pas forcément modifier l'API qui
est implémentée par une autre équipe, ou par un collègue, mais vous devez y
accéder facilement depuis votre application React.

Vous allez pour cela devoir travailler sur deux dépôts Git clonés : celui du
_frontend_ React contiendra par exemple celui de l'API, et un _script NPM_ se
chargera de lancer les deux applications, sur deux ports différents.

_Faut-il utiliser un framework en particulier pour le backend ?_  
Absolument pas ! Pour ma part je travaille plus volontiers avec [LoopBack](https://loopback.io/),
mais tout ce que qui s'appuie sur Node.js fait l'affaire.

## Organisation locale du code

Mettons que votre projet React s'appelle **my-react-frontend** et que l'API
qu'il consomme répond au doux nom de **my-node-api**.

**my-react-frontend** est cloné à la racine, c'est le projet parent. Il contient
au moins les répertoires `src/`, `public/` et `node_modules/` générés par
_create-react-app_.

`build/` peut également être présent si vous avez déjà lancé au moins une fois
la commande `npm run build`.

A la racine de **my-react-frontend**, clonez le dépôt **my-node-api**.

Vous devez obtenir :

```
my-react-frontend/
-- my-node-api/
-- node_modules/
-- public/
-- src/
...
```

Ne nous attardons pas trop sur `my-node-api`, qui peut être implémenté de très
nombreuses manières. Partons du principe qu'une fois lancé, le serveur expose
les ressources dont votre application a besoin sur `http://localhost:3001`. Et
disons juste que si l'équipe _backend_ vous signale une mise à jour, vous ferez
simplement :

```Shell
cd my-node-api/
git pull
```

_Faut-il forcément organiser les dépôts de cette façon ?_  
Pas du tout. Mais l'intérêt de cette configuration, c'est que le _backend_ est "dans
sa bulle" et que les développeurs qui le font évoluer n'ont pas à organiser le code
en fonction de ce _frontend_ en particulier.

Dernière chose importante : pensez à ajouter `my-node-api/` au fichier
`.gitignore` du projet React. Il ne faudrait évidemment pas qu'il versionne le
_backend_.

## Passez moi sur le CORS

En production, il est fréquent d'utiliser le même serveur pour servir
l'application React et l'API sous-jacente. Dans cette configuration, le
mécanisme de _Cross-origin resource sharing_
([CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)), basé sur
des headers HTTP, n'a pas à être implémenté.

En développement, par contre, il est plus pratique de dissocier les serveurs
pour bénéficier de toutes les fonctionnalités de l'écosystème React.

Pour répondre à cette contrainte, _create-react-app_ propose
[un mécanisme](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#proxying-api-requests-in-development)
qui permet de mettre en place un **proxy** d'API.

En partant du principe que votre frontend écoute sur le port 3000, et le serveur
API sur le port 3001, il suffit d'ajouter un paramètre au premier niveau du
`package.json` :

```json
{
  "proxy": "http://localhost:3001"
}
```

De cette façon, vous pourrez utiliser un chemin relatif pour accéder à vos
ressources. Si une requête ne concerne pas un _asset_ statique, elle sera
relayée vers votre _backend_. `fetch('/api/bananas')`, par exemple, requêtera
notre API sur `http://localhost:3001/api/bananas`.

## Tout lancer en une seule commande

Nous utiliserons pour cela un script NPM défini dans le `package.json` situé à
la racine du projet React.

Deux petits outils seront nécessaires pour créer le script _ad hoc_ :

- le package [`concurrently`](https://www.npmjs.com/package/concurrently) qui
  permet de lancer plusieurs scripts en une seule commande. Faites par exemple
  un `npm install --save-dev concurrently`.
- le package [`nodemon`](https://www.npmjs.com/package/nodemon) qui scrute votre
  _backend_ Node.js et relance le serveur automatiquement en cas de modification
  du code. Faites donc un `npm install --save-dev nodemon`, vous ne le
  regretterez pas.

Tout est prêt ! Ouvrez `package.json` et ajoutez dans les `scripts`:

```json
"start-with-api": "concurrently \"react-scripts start\" \"PORT=3001 nodemon ./my-node-api/server/server.js\""
```

Le chemin d'accès au script serveur est à adapter en fonction de vos propres
choix techniques ! Notez que dans ce cas précis, on passe une variable
d'environnement `PORT` que le script serveur utilise pour écraser son port
d'écoute par défaut.

Au final, le `package.json` doit ressembler à ceci :

```json
{
  "name": "my-react-frontend",
  "version": "0.1.0",
  "private": true,
  "proxy": "http://localhost:3001",
  "scripts": {
    "start": "react-scripts start",
    "start-with-api":
      "concurrently \"react-scripts start\" \"PORT=3001 nodemon ./my-node-api/server/server.js\"",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  },
  "devDependencies": {
    "react-scripts": "1.0.14",
    "concurrently": "3.5.0",
    "nodemon": "1.12.1"
  },
  "dependencies": {
    "react": "^16.0.0",
    "react-dom": "^16.0.0"
  }
}
```

Pour mémoire, nous n'avons ajouté que deux lignes : "proxy" et
"scripts/start-with-api".

## Une astuce pour les pressés

Si le backend ne joue pas un grand rôle dans votre application ou si -plus
probablement- vous souhaitez démarrer sans attendre que le véritable backend
soit disponible, je vous conseille de tester l'excellent
[`json-server`](https://github.com/typicode/json-server).

Cet élégant package offre la possibilité de créer un fichier JSON avec quelques
données factices (_data fixtures_) et de les mettre à disposition de votre
application à la façon d'une API RESTful, grâce à un simple
`json-server --watch db.json`.

Il va sans dire qu'en modifiant légèrement le script _start-with-api_, vous
disposerez en quelques secondes d'un _backend_ au poil pour votre nouvelle
application.
