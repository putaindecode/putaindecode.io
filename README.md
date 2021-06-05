# Putain de code

## Commencer

Installez [yarn](https://yarnpkg.com/en/docs/install) (et [un plugin éditeur pour ReScript](https://rescript-lang.org/docs/manual/latest/editor-plugins) si vous voulez la meilleure experience de développement possible).

Ensuite, clonez ce _repo_:

```console
$ git clone git@github.com:putaindecode/putaindecode.io.git
```

Installez les dépendances:

```console
$ yarn
```

## Développement

Pour commencer à développer, utilisez **deux onglets dans votre terminal**, dans le premier, démarrez [ReScript](https://rescript-lang.org/docs/manual/latest/build-overview):

```console
$ yarn start
```

Dans le second, exportez les articles et démarrez le serveur de développement.

```console
$ yarn server
```

## Prérendre le projet

Lancez la commande suivante et le projet sera généré dans `./build`:

```console
$ yarn prerender
```

## Liens utiles

- [ReScript](https://rescript-lang.org): le langage
- [ReScript React](https://rescript-lang.org/docs/react/latest/introduction): La bibliothèque UI
- [ReScript Pages](https://bloodyowl.github.io/rescript-pages/): l'outil servant à générer le blog au build