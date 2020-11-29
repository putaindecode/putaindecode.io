---
date: 2020-11-29
title: "Créer votre propre règle ESLint pour TypeScript: la magie des AST"
author: gomesalexandre
slug: creer-plugin-eslint-typescript-magie-ast
---
Aujourd'hui, découvrons comment créer un plugin ESLint pour écrire du code à notre place, et automatiser ce qui prendrait des semaines, voire des mois manuellement.


![Le résultat? Une règle TypeScript ESLint qui ajoutera automatiquement le génerique nécessaire à vos appels vers shallow(), pour ne pas avoir d'erreurs de typage.](/public/images/articles/2020-11-29-creer-plugin-eslint-typescript-magie-ast/result-gif.gif)*Le résultat? Une règle TypeScript ESLint qui ajoutera automatiquement le génerique nécessaire à vos appels vers shallow(), pour ne pas avoir d'erreurs de typage.*


Découvrez le monde merveilleux des "AST": ils ne sont pas si difficiles que ce que l'on pourrait croire!

# Pourquoi écrire vos propres règles ESLint ?

* C'est intéressant, et une bonne manière d'approfondir vos connaissances syntactiques à propos de JS/TS 

* Cela vous permet de définir des règles quant au style du code au sein de votre entreprise

* Ce sont potentiellement des semaines de travail "manuel" en moins 😃

Il existe déjà plein de règles, dictant [le style de vos accolades](https://eslint.org/docs/rules/brace-style), le fait [que vos fonctions async de ne doivent pas retourner d'expression await](https://eslint.org/docs/rules/no-return-await) ou encore [le fait que vous ne devez pas initialiser vos variables avec la valeur `undefined`](https://eslint.org/docs/rules/no-undef-init).

Le nombre de règles est virtuellement infini. De nouvelles apparaissent quasi chaque semaine, s'adaptant aux nouvelles librairies et "bonnes pratiques". Alors, pourquoi ne pas écrire notre propre règle?

# Le problème que nous allons résoudre avec une règle ESLint

Les tutorials utilisent souvent des examples comme `foo`, `bar` ou `baz`. Ça fait l'affaire, mais pourquoi ne pas résoudre une réelle problématique? 

Si vous avez déjà utilisé `enzyme` pour tester une codebase TypeScript et React, alors vous savez sûrement que les appels vers `shallow` acceptent un générique, qui est votre composant. ex. `shallow<User>(<User {...props})`.

![La definition de la fonction `shallow` sur DefinitelyTyped](/public/images/articles/2020-11-29-creer-plugin-eslint-typescript-magie-ast/definitely-typed-shallow-definition.png)*La definition de la fonction `shallow` sur DefinitelyTyped*

OK, mais si on ne passe pas le générique? Même si au premier abord ça n'a pas l'air de poser problème, vous allez rapidement remarquer des erreurs en voulant utiliser les méthodes, props, ou state de votre composant. C'est normal: `TypeScript` considère votre composant comme un "composant générique", sans signature, sans méthodes, rien! 

![](/public/images/articles/2020-11-29-creer-plugin-eslint-typescript-magie-ast/tsc-tests-error.png)

La solution est d'ajouter `VotreComposant` (ici, `User`) en tant que génerique: `shallow<User>(<User {...props />)`. Pas de souci s'il s'agit de l'écrire une fois et que vous êtes à l'aise avec TypeScript, par contre ça devient problématique si: 

* Vous venez de finir une migration JS -> TS, avec une codebase pas ou peu typée pour le moment

* Vous venez de finir une migration flow -> TS, avec des typages différents / manquants maintenant que vous aves du TS 

* Vous êtes un nouveau contributeur sur une codebase TS et/ou n'avez jamais touché à un générique

L'option 2, c'est celle que nous avons eu au sein de notre équipe, et une règle ESLint avec un autofix a permis de gagner plusieurs journées qui auraient été passées à ajouter les typings manuellement.

## Comment fonctionne ESLint? La magie des AST

Avant de commencer, il est impératif de comprendre le concept d'AST.

Les **ASTs** - Abstract Syntax Trees, ou Arbres Syntaxiques Abstraits (ASA) en français- sont une représentation de votre code sous forme d'arbre, qui peut être: 
- lu
- manipulé pour générer un nouvel AST
- transformé en code machine qui sera ensuite exécuté 
- retransformé en code

Voire même un mélange de tout ça!

Au quotidien, on écrit du code dans des langages faits pour les humains: JavaScript, Python, C, ReasonML, Elixir... Mais le langage est juste une "interface humain-machine". La machine, elle, ne comprend pas que `const` est le début d'une déclaration de variable, que `{}` est parfois une expression objet, parfois le corps d'une fonction… etc. 
C'est là que les ASTs rentrent en jeu: une étape nécessaire pour faire le lien entre l'humain et la machine!


Pour citer [Jason Williams](https://twitter.com/jason_williams), auteur du moteur JS `boa` écrit en rust:
> # On divise notre code en différents tokens en fonction de leur sens (analyse lexicale), puis on les envoie par groupes à un parseur qui va générer des expressions(analyse syntaxique), qui elles-même peuvent contenir d'autres expressions
> -- <cite> Jason Williams - [Let’s build a JavaScript Engine in Rust @ JSConf EU 2019](https://youtu.be/_uD2pijcSi4?t=356)</cite>

Ça vous rappelle quelque-chose? C'est plus ou moins la même idée que votre HTML transformé en noeux DOM, que vous pouvez lire, traverser, et manipuler à foison!

Assez de théorie, prenons un cas concret:
```js
    const user = {
      id: 'unique-id-1',
      name: 'Alex',
    }
```
Ce code peut être représenté de cette manière sous forme d'AST:

![Représentation AST de notre code avec www.astexplorer.net](/public/images/articles/2020-11-29-creer-plugin-eslint-typescript-magie-ast/example-ast.png)*Représentation AST de notre code avec www.astexplorer.net*

Cette capture vient de l'excellent outil [https://astexplorer.net](https://astexplorer.net/). Il permet de visualiser en détail les ASTs pour de nombreux langages. 
Essayez de poster différents bouts de code, JS, TS, ou même un autre langage supporté, vous allez voir c'est passionnant! 
> Attention: Sélectionnez le bon langage pour qu'il puisse être parsé! 

# Création d'un projet à linter
> **Si vous avez déjà un projet React + TS + enzyme, vous pouvez passez à l'étape suivante!**

Le but est ici de créer un projet tout simple React + TypeScript + Jest + Enzyme project, qui aura les erreurs TS que nous avons expliqué en intro.

Dans l'idée, parser du TS, c'est comme parser du JS, il nous faut juste le bon parseur. Pas de souci, le plugin `typescript-eslint` a son [propre parseur TS](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser). Alors, c'est parti! 

Créez un nouveau dossier `ast-learning` qui contiendra notre projet. Ajoutez-y un fichier `package.json` avec react, jest, enzyme, ESLint, etc:
```json
    {
      "name": "ast-learning",
      "version": "1.0.0",
      "description": "Learn ASTs by writing your first ESLint plugin",
      "main": "src/index.js",
      "dependencies": {
        "react": "17.0.0",
        "react-dom": "17.0.0",
        "react-scripts": "3.4.3"
      },
      "devDependencies": {
        "[@babel/preset-env](http://twitter.com/babel/preset-env)": "^7.12.1",
        "[@babel/preset-react](http://twitter.com/babel/preset-react)": "^7.12.5",
        "[@types/enzyme](http://twitter.com/types/enzyme)": "^3.10.8",
        "[@types/enzyme-adapter-react-16](http://twitter.com/types/enzyme-adapter-react-16)": "^1.0.6",
        "[@types/jest](http://twitter.com/types/jest)": "^26.0.15",
        "[@types/react](http://twitter.com/types/react)": "^16.9.56",
        "[@types/react-dom](http://twitter.com/types/react-dom)": "^16.9.9",
        "[@typescript](http://twitter.com/typescript)-eslint/eslint-plugin": "^4.8.1",
        "[@typescript](http://twitter.com/typescript)-eslint/parser": "^4.8.1",
        "babel-jest": "^26.6.3",
        "enzyme": "3.11.0",
        "enzyme-adapter-react-16": "1.15.5",
        "eslint": "^7.13.0",
        "jest": "^26.6.3",    
        "react-test-renderer": "^17.0.1",
        "ts-jest": "^26.4.4",
        "typescript": "3.8.3"
      },
      "scripts": {
        "lint": "eslint ./*.tsx",
        "test": "jest index.test.tsx",
        "tsc": "tsc index.tsx index.test.tsx --noEmit true --jsx react"
      }
    }
```

Créez aussi un fichier `tsconfig.json` file avec le strict minimum pour rendre le compilateur content:
```json

    {
      "compilerOptions": {
        "allowSyntheticDefaultImports": true,
        "module": "esnext",
        "lib": ["es6", "dom"],
        "jsx": "react",
        "moduleResolution": "node"
      },
      "exclude": [
        "node_modules"
      ]
    }
```

Enfin, créez un fichier `.eslintrc.js`, sans règle(s) pour le moment:
```js

    export default {
     "parser": "[@typescript](http://twitter.com/typescript)-eslint/parser",
     "parserOptions": {
      "ecmaVersion": 12,
      "sourceType": "module"
     },
     "plugins": [
      "[@typescript](http://twitter.com/typescript)-eslint",
      "ast-learning",
     ],
     "rules": {
     }
    }
```

Maintenant que notre projet est prêt, il est temps de créer notre premier composant `User`: 

```ts
    import * as React from "react";

    type Props = {};
    type State = { active: boolean };

    class User extends React.Component<Props, State> {
     constructor(props: Props) {
       super(props);
        this.state = { active: false };
      }
       toggleIsActive() {
        const { active } = this.state;
        this.setState({ active: !active });
      }

    render() {
        const { active } = this.state;
        return (
          <div className="user" onClick={() => this.toggleIsActive()}>
            User is {active ? "active" : "inactive"}
          </div>
        );
      }
    }

    export {User}

```
Et le test qui va bien, `index.test.tsx`:
```ts
    import * as React from 'react'
    import * as Adapter from "enzyme-adapter-react-16";
    import * as enzyme from "enzyme";
    import {User} from './index'

    const {configure, shallow} = enzyme

    configure({ adapter: new Adapter() });

    describe("User component", () => {
      it("should change state field on toggleIsActive call", () => {
        const wrapper = shallow(<User />);
     // @ts-ignore
        wrapper.instance().toggleIsActive();
     // @ts-ignore
        expect(wrapper.instance().state.active).toEqual(true);
      });

    it("should change state field on div click", () => {
        const wrapper = shallow(<User />);
        wrapper.find(".user").simulate("click");
     // @ts-ignore
        expect(wrapper.instance().state.active).toEqual(true);
      });
    });
```
Dans votre terminal, lancez `npm i && npx ts-jest config:init && npm run test`. Hein? Aucun souci de compilation? Et oui, les commentaires `// @ts-ignore` sont en fait des directives qui ordonnent au compilateur de fermer les yeux sur les erreurs à la ligne suivante.

Essayons de les enlever?

**❌ Les tests ne sont même plus éxécutés, vu que notre TS ne compile pas ❌**

Oh non 😞! Comme nous l'avons vu dans l'intro, il est **possible** de résoudre cette erreur manuellement:

```ts
    const wrapper = shallow<User>(<User />); // générique ajouté
```

Mais si vous êtes ici, c'est bien que vous voulez automatiser tout ça, non? 😉

Le processus pour résoudre le problême est ici simple: il faut prendre l'argument avec lequel `shallow` est appellé, le copier, puis le coller en tant que générique.

Passons aux choses sérieuses: c'est l'heure d'écrire le code qui va écrire du code à notre place 🤯.

# Si vous pouvez modeler le processus, vous pouvez l'automatiser

Prenez un instant pour penser au code que que vous écrivez au quotidien. Est-ce que certains processus peuvent être modelés de façon à ce qu'un programme pourrait techniquement générer ce code pour vous? Si oui, vous pouvez:

* Écrire une **règle ESLint**, soit: 
  - sans résolution automatique (autofix), pour simplement informer des erreurs en laissant le développeur la résoudre
  - avec autofix, pour qu'il puisse résoudre le problème automatiquement au sein de sa codebase

* Écrire un "**codemod**". Un concept relativement similaire sur le plan technique, qui ne fonctionne pas sous formes de règles. Ce sont un ensemble de modifications faites pour être appliquées au sein de toute votre codebase, pour par exemple transformer `React.createElement()` en JSX ou encore ajouter le préfixe `UNSAFE_` aux méthodes de cycle de vie obsolètes (codemods reacts officiels).

Les codemods ont une philosophie différente et sont plutôt lourds: ils ne sont pas faits pour réagir à chaque caractère que vous tapez.

C'est donc une règle eslint que nous allons écrire!

# Création d'un projet eslint

Créez le plugin qui contiendra nos règles en créant un nouveau dossier `eslint-plugin-ast-learning`, voisin de `ast-learning`:
```
Votre Dossier Parent/
├── ast-learning/
├── eslint-plugin-ast-learning/
```
> ⚠️ ️Les plugins eslint sont nommés selon la convention `eslint-plugin-your-plugin-name` !

Initialisez le projet avec un fichier `package.json` basique:
```json
    {
      "name": "eslint-plugin-ast-learning",
      "description": "Our first ESLint plugin",
      "version": "1.0.0",
      "main": "index.js"
    }
```
Et un unique fichier `index.js` avec toutes nos règles, dans notre cas juste une: `require-enzyme-generic`:
```js
    const rules = {
     'require-enzyme-generic': {
      meta: {
       fixable: 'code',
       type: 'problem',
       },
      create: function (context) {
       return {
       }
      },
     },
    }

    module.exports = {
     rules,
    }
```

Chaque règle contient 2 propriétés: `meta` et `create`. La doc est dispo [ici](https://eslint.org/docs/developer-guide/working-with-rules), mais en gros:

- `meta` est un object qui contient les infos sur votre règle et répond aux questions:

* Elle sert à quoi?

* Est-ce qu'elle peut être résolue automatiquement?

* Est-ce juste une règle stylistique, ou génère-t-elle des erreurs qui sont problématiques au bon fonctionnement de votre programme?

* Quel est le lien des docs pour que les devs puissent avoir plus d'infos sur cette règle à coté du message d'erreur?

- `create` est une fonction qui contient la *logique* de la règle. Elle est appelée avec un object qui contient des propriétés qui vous être utiles, listées [ici](https://eslint.org/docs/developer-guide/working-with-rules#the-context-object).

`create` a en valeur de retour un object où les clés peuvent être n'importe quel "token" qui existe pour l'AST qui a été parsé. Vous pourrez pour chacun de ces tokens écrire une logique différente.

Regardons quelques exemples de tokens ensemble: 

* **CallExpression**: une expression qui représente l'appel d'une fonction:

     `shallow()`

* **VariableDeclaration**: la déclaration d'une variable, mais sans le `const`/ `var`/ `let` qui la précède:
```js
    SomeComponent = () => (<div>Hey there</div>)
```

* **StringLiteral**: Une chaine de caractère, littérale: `'test'`

C'est assez abstrait, et le meilleur moyen de se faire une idée de ce que sont chacun des tokens dans votre code, les groupes qu'ils forment, c'est d'utiliser ASTExplorer avec différents bouts de code. En moins de temps qu'il vous en faut pour dire "TypeScript", vous penserez comme un parseur! 

## Définir quand une règle s'appliquera

![Notre code passé dans ASTExplorer](/public/images/articles/2020-11-29-creer-plugin-eslint-typescript-magie-ast/our-code-in-ast-explorer.png)*Notre code passé dans ASTExplorer*

Allez dans la partie de gauche sur www.astexplorer.net et sélectionnez l'appel vers `shadow()` (ou scrollez la partie de droite en survolant l'arbre jusqu'à trouver la partie qui mettra l'appel en surbrillance): vous verrez qu'il s'agit d'un type **CallExpression**.

L'expression trouvée, nous ajoutons donc la propriété `CallExpression` à l'objet retourné par la méthode `create`:
```js
    create: function (context) {
       return {
        CallExpression (node) {
         // TODO: Magic 🎉
        }
       }
      }
```
Toute méthode que vous déclarerez en tant que propriété de l'objet retourné par `create` sera appelée par eslint, une fois un noeu correspondant à cette méthode, ici à chaque `CallExpression` donc.
Un rapide coup d'oeil sur [les docs de Babel](https://babeljs.io/docs/en/babel-types#callexpression), et on peut voir que `CallExpression` contient une propriété `callee`. Cette propriété, c'est le nom de la fonction que vous appelez, ici, `shallow`. 
On peut donc ajouter une condition qui évaluera `true` si nous appelons une fonction `shadow`.

```js
    CallExpression (node) {
      if ((node.callee.name === 'shallow'))
    }
```
On veut aussi être sûr que notre règle s'applique uniquement s'il n'y a pas **de générique déjà présent**. Sur ASTExplorer on peut voir que les génériques sont appelés `typeArguments`.
Babel a 2 propriétés identiques, `typeArguments` et `typeParameters`(par souci de compatibilité) mais celui qui nous intéresse est `typeParameters`. 
C'est un tableau qui contient nos génériques, un tableau d'un seul élément dans notre cas donc. 
Une petite vérification pour être sûr qu'il n'y a soit pas de chevrons du tout (`typeParameters === undefined`) ou bien que les chevrons sont présents mais vides (`!node.typeParameters.length`). On peut utiliser la syntaxe courte pour les deux cas de figure: 
```js
    if (
          node.callee.name === 'shallow' &&
          !node.typeParameters
    )
```

Voilà! Nous avons la logique de notre erreur, il faut maintenant l'émettre 

# Émettre une erreur

Nous allons utiliser la méthode `context.report`. [La doc de ESLint](https://eslint.org/docs/developer-guide/working-with-rules#contextreport) nous indique que cette méthode sert à publier une erreur.
Elle est appelée avec un objet qui peut contenir plusieurs propriétés utile, dont 3 qui vous nous être nécessaires ici:

* `node` (le noeu actuel). Son utilité est double: D'abord, informer eslint **d'où** se trouve l'erreur pour pouvoir l'indiquer lorsque le développeur lancera `eslint` par ligne de commande ou dans son éditeur. / highlighted in his IDE with eslint plugin. Mais aussi **quel** est ce node (type, contenu, noeux descendants..) pour pouvoir le manipuler.

* `message` : Le message que les développeurs verront pour cette règle

* `fix` : Notre autofix
```js
    CallExpression (node) {
          if (
          node.callee.name === 'shallow' &&
          !(node.typeParameters && node.typeParameters.length)
          ) {
           context.report({
            node: node.callee, // shallow
            message: `enzyme.${node.callee.name} calls should be preceded by their component as generic. ` +
            "If this doesn't remove type errors, you can replace it with <any>, or any custom type.",
            fix: function (fixer) {
             // TODO
            },
           })
          }
        }

```
Voilà, l'erreur est émise 📡! 

## Écrire la méthode `fix` 

La première chose que notre règle fera, c'est insérer `<any>` si eslint ne détecte pas d'élément JSX comme argument avec lequel `shallow()` est appelé .

> On utilise  `insertTextAfter` method pour insérer du texte après le node actuel

```js
    const hasJsxArgument = node.arguments && node.arguments.find((argument, i) => i === 0 && argument.type === 'JSXElement')
    if (!hasJsxArgument) {fixer.insertTextAfter(node.callee, '<any>')}
```

Cette vérification passée, on sait que l'on a un `JSXElement` comme premier argument de `shallow()`. 
On peut donc récupérer le nom de cet élément et le passer comme générique à shallow.
```js
    const expressionName = node.arguments[0].openingElement.name.name
    return fixer.insertTextAfter(node.callee, `<${expressionName}>`)
```

![Félicitations! Le nom est capturé](/public/images/articles/2020-11-29-creer-plugin-eslint-typescript-magie-ast/pokemon-captured.webp)

*Félicitations! Le nom est capturé et inséré comme générique*

Il est maintenant temps de vérifier si notre règle fonctionne, en l'utilisant avec le projet créé dans l'étape précédente.


## Utiliser des plugins custom dans un projet

De retour dans notre projet `ast-learning`, il est temps d'installer le plugin que nous venons d'écrire:
```sh
    npm install ../eslint-plugin-ast-learning
```
Maintenant que le plugin est installé, nous allons ajouter la règle qu'il contient dans notre `.eslintrc.js`:

```js
    module.exports = {
     "parser": "[@typescript](http://twitter.com/typescript)-eslint/parser",
     "parserOptions": {
      "ecmaVersion": 12,
      "sourceType": "module"
     },
     "plugins": [
      "[@typescript](http://twitter.com/typescript)-eslint",
      "ast-learning", // eslint-plugin-ast-learning
     ],
     "rules": {
      "ast-learning/require-enzyme-generic": 'error'
     }
    }
```

> Si vous lancez `npm run lint` ou bien que vous ouvrez les tests de `User` dans votre IDE avec un plugin ESLint installé, vous allez voir les erreurs de lint en question:

```
    /Users/alexandre.gomes/Sites/ast-learning/index.test.tsx
      12:21  error  enzyme.shallow calls should be preceeded by their component as generic. If this doesn't remove type errors, you can replace it
     with <any>, or any custom type  ast-learning/require-enzyme-generic
      20:21  error  enzyme.shallow calls should be preceeded by their component as generic. If this doesn't remove type errors, you can replace it
     with <any>, or any custom type  ast-learning/require-enzyme-generic

    ✖ 2 problems (2 errors, 0 warnings)
      2 errors and 0 warnings potentially fixable with the `--fix` option.
```
Félicitations! Les erreurs contiennent le texte généré par ESLint, les lignes et caractères où l'erreur a été détectée... et un message qui nous indique qu'elles peuvent être corrigées automatiquement.
Intéréssant! Relancez le script de lint avec le drapeau `--fix`:
```
  npm run lint -- --fix
```
> ℹ️ `npm run <votreScript> -- <unDrapeau>` permet de passer un drapeau à votre script npm sans avoir à le modifier

![](/public/images/articles/2020-11-29-creer-plugin-eslint-typescript-magie-ast/example-ast.png)

Woohoo! Tous nos tests ont été modifiés avec le générique, et il n'y a plus d'erreurs TS. 🎉
Imaginez la même règle avec autofix sur 10, 100, 1000, 10000 fichiers... des journées de travail en moins 🤯

# Pour continuer avec ESLint et les AST

Bien que long, ce tutorial reste une introduction sur les AST et le fonctionnement d'ESLint et ses règles. Si vous souhaitez en savoir plus et créer vos propres règles, leurs docs sont très bien faites, elles seront votre référence. 

Il faudra aussi ajouter des tests *complets* pour chaque règle: d'éxperience, les corrections automatiques sont sournoises et ont leur lot de cas particuliers qui peuvent potentiellement casser votre codebase. 
Les tests ne sont pas juste une condition sine qua non quant à la qualité des règles que vous écrirez: ils sont la règle pour publier une règle officielle 😉 et il est vivement conseillé de suivre les mêmes standards de qualité. Et ça, que vous souhaitez la contribuer en tant que règle officiel, ou la garder pour votre team!

