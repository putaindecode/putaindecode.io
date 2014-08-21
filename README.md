# Putain de Code !

[![Build Status](http://img.shields.io/travis/putaindecode/website.svg?style=flat)](https://travis-ci.org/putaindecode/website)
[![Code Climate](http://img.shields.io/codeclimate/github/putaindecode/website.svg?style=flat)](https://codeclimate.com/github/putaindecode/website)
[![Gemnasium](http://img.shields.io/gemnasium/putaindecode/website.svg?style=flat)](https://gemnasium.com/putaindecode/website)

[![Testling](https://ci.testling.com/putaindecode/website.png)](https://ci.testling.com/putaindecode/website)

<img align="right" alt="" src="https://raw.github.com/putaindecode/website/master/images/p!-logo--no-bubble-512--trim.png" width="128">

Code source du site [Putain de Code](http://putaindecode.fr/).
Contient tout le nécessaire pour faire fonctionner le site.
Pas de base de données à installer, pas de serveurs à configurer.

## tl;dr;

    $ git clone https://github.com/putaindecode/website.git
    $ cd website
    $ npm run init
    $ npm install
    $ npm start

## Contributions

Les articles peuvent être postés ici sous forme de PR une fois qu'on est OK dans une
issue du repo de [proposition de posts](https://github.com/putaindecode/propositions-de-posts)
(afin de pas polluer les issues techniques du site).
Si vous souhaitez voir un post écrit, ou même en écrire un, faites un tour là bas ;)

Pour contribuer au site, n'hésitez pas, en plus de lire la partie technique ci-dessous,
à lire le fichier spécifique [CONTRIBUTING.md](CONTRIBUTING.md)

---

## Développement

__Notice: Faites attention à la configuration de vos éditeurs de texte et IDE.  
Nous utilisons [`.editorconfig`](.editorconfig) pour garder une cohérence.
Respectez cela (il vous suffit d'aller sur le site [editorconfig.org/](http://editorconfig.org/)
pour télécharger le plugin adéquat pour votre éditeur.__

Ce site utilise [gulp](https://github.com/gulpjs/gulp),
il vous est donc conseillé de jeter un coup d'oeil au [README de gulp](https://github.com/gulpjs/gulp#readme)
avant d'intervenir sur le projet ;).

## Récupérer les sources du site

    $ git clone https://github.com/putaindecode/website.git
    $ cd website
    $ npm run init
    $ npm install

## Mettre à jour les sources

Lorsque vous n'avez pas travaillé sur le site depuis un petit moment, on vous conseille
d'exécuter les commandes suivantes :

    $ git pull
    $ npm install

Si vous rencontrez des erreurs lors du `git pull` (par ex. pour une histoire de
fichiers modifiés non commités), vous pouvez juste avant faire
un petit

    $ git reset --hard

__Note: cela supprimera toutes vos modifications locales sans avertissement, à
faire avec précaution.
Préférez `git stash` si vous souhaitez conserver vos modifications__.

## Lancer le site web localement

    $ npm start

Oui oui, c'est tout, vous devriez avoir le site web qui s'ouvre tout seul dans votre navigateur.
Si ce n'est pas le cas, et que vous n'avez pas d'erreurs dans votre console,
rendez-vous à l'adresse suivante: [http://localhost:4242](http://localhost:4242).


## Mise en production

La commande suivante (lorsque vous avez les droits nécessaires) va construire le site
en version optimisée, et le publier (mise à jour de la branche  `gh-pages`, qui,
grâce à GitHub, suffit à mettre en ligne le site).

    $ npm run publish

Cela dit (toujours si vous avez les droits nécessaires), vous pouvez enregistrer un token
encrypté par Travis afin d'automatiser le publish de vos commits dans la branch master.

_Note: pour commiter sans provoquer un publish, il suffit d'ajouter `[ci skip]` dans votre message de commit._

### Ajouter son token

Vous pouvez soit passer par l'interface GitHub pour [ajouter un token](https://github.com/settings/tokens/new),
soit faire les commandes suivantes (remplacez YOUR_GITHUB_USERNAME)

    $ GH_USERNAME=YOUR_GITHUB_USERNAME
    $ GH_BRANCH=gh-pages

    $ curl -u $GH_USERNAME -d "{\"scopes\":[\"public_repo\"],\"note\":\"push to $GH_BRANCH from travis\"}" https://api.github.com/authorizations

Si la création ne fonctionne pas, vous avez peut-être déjà un token. Si vous ne vous en rappelez pas, regénérez le depuis l'interface GitHub (et cette fois ci, sauvegardez le).

Votre mot de passe GitHub va vous être demandé.
Ensuite vous aurez un résultat du genre

    {
      "id": 123456,
      "url": "https://api.github.com/authorizations/8955171",
      "app": {
        "name": "push to gh-pages from travis (API)",
        "url": "https://developer.github.com/v3/oauth_authorizations/",
        "client_id": "00000000000000000000"
      },
      "token": "YOUR_AWESOME_TOKEN",
      "note": "push to gh-pages from travis",
      "note_url": null,
      "created_at": "2014-05-29T03:55:28Z",
      "updated_at": "2014-05-29T03:55:28Z",
      "scopes": [
        "public_repo"
      ]
    }

Ensuite (remplacez YOUR_AWESOME_TOKEN par celui présent dans le résultat ci-dessus)

    $ GH_REPOSITORY="putaindecode/website"
    $ GH_TOKEN=YOUR_AWESOME_TOKEN

#### Encryption du token

Maintenant il reste à encrypter ce token. Vous avez 2 possibilités:
- soit installer la gem ruby `travis` (qui embarque la commande `encrypt`)
- soit installer le paquet node `travis-encrypt`

##### Via la gem Ruby `travis`

    $ gem install travis
    $ travis encrypt -r $GH_REPOSITORY GH_TOKEN=$GH_TOKEN

##### Via le paquet Node `travis-encrypt`

    $ npm i -g travis-encrypt
    $ travis-encrypt -r $GH_REPOSITORY -k GH_TOKEN -v $GH_TOKEN

Vous n'avez plus qu'à incorporer votre token après les autes dans la section
`env.global` du `.travis.yml` (mettez votre pseudo avant éventuellement,
  plus pratique si maj du token nécessaire).

---

## Mise à jour spécifiques

### Générer le favicon

Installez [icoutils](http://www.nongnu.org/icoutils/). Par exemple sur OS X :

    $ brew install icoutils

ou

    $ npm run init-osx

Ensuite utilisez la commande suivante

    $ npm run favicon

---

## Crédits

### Auteurs et contributeurs

* [Membres de l'organisation](https://github.com/putaindecode?tab=members)
* [Liste des contributeurs](https://github.com/putaindecode/website/graphs/contributors)

### Logo & Avatar

Remerciements à toutes les personnes impliquées dans cette discussion [putaindecode/organisation/issues/4](https://github.com/putaindecode/organisation/issues/4).
Remerciement spécial à [@bloodyowl](https://github.com/bloodyowl) pour le [logo initial](https://github.com/putaindecode/website/blob/3324cbe7637dacd1f42a412c1085431a2d551928/src/assets/_images/p!-logos.png).
