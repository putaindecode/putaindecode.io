# Putain de code !

[![Travis Build Status](https://img.shields.io/travis/putaindecode/putaindecode.io.svg?label=unix%20build)](https://travis-ci.org/putaindecode/putaindecode.io)
[![AppVeyor Build Status](https://img.shields.io/appveyor/ci/MoOx/putaindecode-io.svg?label=windows%20build)](https://ci.appveyor.com/project/MoOx/putaindecode-io)

<img align="right" alt="" src="https://github.com/putaindecode/putaindecode.io/blob//master/src/images/putaindecode-logo--no-bubble-512--trim.png" width="128">

Code source du site [_Putain de code !_](http://putaindecode.io/). Contient tout
le nécessaire pour faire fonctionner le site. Pas de base de données à
installer, pas de serveurs à configurer.

## tl;dr;

```console
$ git clone https://github.com/putaindecode/putaindecode.io.git
$ cd putaindecode.io
$ npm install
$ npm start
```

**Note : Si vous rencontrez une erreur concernant le token GitHub, vous
trouverez réponse dans la section de démarrage plus bas.**

## Contributions

Les articles peuvent être postés ici sous forme de PR une fois qu'on est OK dans
[une issue du repo](https://github.com/putaindecode/putaindecode.io/issues). Si
vous souhaitez voir un post écrit, ou même en écrire un, faites un tour là-bas
;)

Pour contribuer au site, n'hésitez pas, en plus de lire la partie technique
ci-dessous, à lire le fichier spécifique [CONTRIBUTING.md](CONTRIBUTING.md).

- - -

## Développement

**Notice: Faites attention à la configuration de vos éditeurs de texte et IDE.\
Nous utilisons [`.editorconfig`](.editorconfig) pour garder une cohérence. Respectez
cela (il vous suffit d'aller sur le site [editorconfig.org/](http://editorconfig.org/)
pour télécharger le plugin adéquat pour votre éditeur.**

## Récupérer les sources du site

```console
$ git clone https://github.com/putaindecode/putaindecode.io.git
$ cd putaindecode.io
$ npm install
```

## Mettre à jour les sources

Lorsque vous n'avez pas travaillé sur le site depuis un petit moment, on vous
conseille d'exécuter les commandes suivantes :

```console
$ git pull
$ npm install
```

Si vous rencontrez des erreurs lors du `git pull` (par ex. pour une histoire de
fichiers modifiés non commités), vous pouvez juste avant faire un petit

```console
$ git reset --hard
```

**Note: cela supprimera toutes vos modifications locales sans avertissement, à
faire avec précaution. Préférez `git stash` si vous souhaitez conserver vos
modifications**.

## Lancer le site web localement

```console
$ npm start
```

Oui oui, c'est tout, vous devriez avoir le site web qui s'ouvre tout seul dans
votre navigateur.

**Note : vous aurez besoin d'un token GitHub disponible en variable
d'environnement (dans `GITHUB_TOKEN` ou `GH_TOKEN`) afin de pouvoir construire
l'index des contributions pour avoir accès à toutes les fonctionnalités du site.
Autrement, le site fonctionnera en mode dégradé.**

## Mise en production

La commande suivante (lorsque vous avez les droits nécessaires) va construire le
site en version optimisée, et le publier (mise à jour de la branche `gh-pages`,
qui, grâce à GitHub, suffit à mettre en ligne le site).

```console
$ npm run deploy
```

**Cela dit, tous les commits dans la branche `master` provoqueront une mise en
production automatique via [Travis-CI](https://travis-ci.org/).**

_Note : pour commiter sans provoquer un `deploy`, il suffit d'ajouter `[ci
skip]` dans votre message de commit._

- - -

## Crédits

### Auteurs et contributeurs

* [Membres de l'organisation](https://github.com/putaindecode?tab=members)
* [Liste des
  contributeurs](https://github.com/putaindecode/putaindecode.io/graphs/contributors)

### Logo & Avatar

Remerciements à toutes les personnes impliquées dans cette discussion
[putaindecode/organisation/issues/4](https://github.com/putaindecode/organisation/issues/4).
Remerciement spécial à [@bloodyowl](https://github.com/bloodyowl) pour le [logo
initial](https://github.com/putaindecode/putaindecode.io/blob/3324cbe7637dacd1f42a412c1085431a2d551928/src/assets/_images/p!-logos.png).
