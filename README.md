# Putain de code

## Commencer

Installez [yarn](https://yarnpkg.com/en/docs/install) (et [un plugin éditeur pour ReasonML](https://reasonml.github.io/docs/en/editor-plugins) si vous voulez la meilleure experience de développement possible).

Ensuite, clonez ce _repo_:

```console
$ git clone git@github.com:putaindecode/putaindecode.io.git
```

Installez les dépendances:

```console
$ yarn
```

## Développement

Pour commencer à développer, utilisez **deux onglets dans votre terminal**, dans le premier, démarrez [BuckleScript](https://bucklescript.github.io):

```console
$ yarn start
```

Dans le second, exportez les articles et démarrez le serveur de développement.

```console
$ yarn blog
$ yarn server
```

## Prérendre le projet

Lancez la commande suivante et le projet sera généré dans `./build`:

```console
$ yarn prerender
```

## Liens utiles

- [ReasonML](https://reasonml.github.io/docs/en/quickstart-javascript): la langage
- [ReasonReact](https://reasonml.github.io/reason-react/docs/en/installation): La bibliothèque UI
- [BuckleScript](https://bucklescript.github.io/docs/en/installation): le _compiler_
- [Belt](https://bucklescript.github.io/bucklescript/api/Belt.html): la _standard library_
