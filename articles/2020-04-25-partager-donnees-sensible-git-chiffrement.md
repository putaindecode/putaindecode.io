---
date: 2020-04-25
title: Partager des données sensibles de façon sécurisé grâce à Git et au chiffrement
author: Aschen
slug: partager-donnees-sensibles-securise-git-chiffrement
---

_[English version available on Kuzzle blog](https://blog.kuzzle.io/share-sensitive-data-with-git-and-cryptography)_

Tous les projets ont besoin d’un certain nombre de données qui doivent **rester secrètes et privées**.

On parle ici des **clé d’API externes**, des **identifiants à des services tiers**, de **certificats** ou encore de **clés privés SSH**.

Le vrai problème c'est que plus un projet évolue et plus le nombre de secrets à partager pour le bon fonctionnement de l'application augmente

**TLDR;**
 - N’utilisez **pas de variables d’environnement** pour partager vos clés d’API et autres secrets, à la place utilisez un **fichier JSON chiffré**.
 - Utilisez [Kourou](https://github.com/kuzzleio/kourou) pour **chiffrer/déchiffrer** les fichiers contenant vos secrets 
 - Utilisez [Kuzzle Vault](https://github.com/kuzzleio/kuzzle-vault) pour **utiliser les secrets déchiffrés** dans votre application

## Avant on avait des variables d’environnement

La manière la plus simple et la plus répandue de partager des secrets est via les **variables d’environnement**.

On peut rapidement se trouver avec **une dizaine de clés d’API différentes**. Multiplié par le nombre d’environnement de déploiement cible on se retrouve rapidement avec beaucoup trop de variables d’environnements à gérer.

Le problème c’est qu’il est nécessaire de **fournir l’ensemble des variables à chaque personne** qui va devoir travailler sur le projet. 

```bash
$ SENTRY_DSN=********** AWS_S3_KEY_ID=******** AWS_S3_SECRET_KEY=********* \
SENDGRID_API_KEY=******** TWILIO_API_KEY=******** KUZZLE_VAULT_KEY=******** \
ABEEWAY_TOKEN=********* WIREPAS_PASSWORD=******* CLOUDINARY_API_KEY=********* \
STRIPE_TOKEN=******* node server.js
```

Et on ne parle même pas du boulot nécessaire à nos cher Devops pour maintenir l’ensemble de ces variables pour plusieurs environnements de déploiement (production, staging, development, etc)

## Adoptez le chiffrement

Une solution est de conserver l’ensemble de ces secrets dans **un fichier que l’on va ajouté au dépôt et versionner** comme n’importe quel autre fichier.

La seule différence c’est qu’on va le **chiffrer avec AES 256** pour être certain que personne ne pourra mettre la main sur les secrets.

Ainsi il n’y a plus qu’**un seul secret** que vous devez partager avec vos équipes: **la clé de chiffrement**. 

## Chiffrer avec Kourou, la CLI de Kuzzle

Chez Kuzzle on a décidé de prendre le choses en main et de développer notre **système de partage sécurisé des secrets**.

Nous allons donc commencer par renseigner tous nos secrets dans un fichier JSON. 
**Ce fichier ne sera bien sur JAMAIS comité dans le dépôt vu qu’il contient les secrets en clair.**

```json
{
  "sentryDsn": "sentry dsn here",
  "aws": {
    "keyId": "access key id",
    "secretKey": "secret key id"
  },
  "sendgridApiKey": "sendgrid api key",
  "twillioApiKey": "twillio api key",
  "abeewayToken": "abeeway token",
  "wirepasToken": "wirepas token",
  "cloudinaryApiKey": "cloudinary api key",
  "stripeToken": "strip token"
}
```

Ensuite nous allons donc chiffrer ce fichier. Cependant nous allons **chiffrer uniquement les clés** afin de pouvoir toujours lire son contenu.

C’est ce fichier chiffré que nous allons sauvegarder et partager dans le dépôt du projet.

Pour chiffrer les valeurs du fichier, vous pouvez utiliser [Kourou](https://github.com/kuzzleio/kuzzle):

```bash
$ npm i kourou

$ kourou vault:encrypt secrets.json --vault-key my-secret-password
 
 🚀 Kourou - Encrypts an entire file.
 
 [✔] Secrets were successfully encrypted into the file secrets.enc.json
```

Le fichier généré est semblable au fichier JSON original sauf que **toutes les valeurs ont été chiffrées avec AES 256**.

```json
{
  "sentryDsn": "d7a909787d18f2770d2844e7fe87d8cf.7a0bfad57e75c31d507a5c24aa1c95b7",
  "aws": {
    "keyId": "a9de2d8b425bf16cd2fa6bf8cdb4d3c9.b24aa1cc24c8e6249451aaf3f277a46a",
    "secretKey": "659ac90b460f9dd8e6c58ae2dd1b7cc4.892dfa8083c983e37501ed0489f64955"
  },
  "sendgridApiKey": "6ff4edb98a7fc74f98c0779c097db151bc462d51a190c3043b1fc8af4b1facfb.da38762a2cf31bcc9bc6fab04affa14b",
  "twillioApiKey": "6a97379c4fd5f421c538af6b3b80c016.87d3dd3d483608751e9c4a0ef82f2b99",
  "abeewayToken": "63947d7df667089533bd022989515467.ff002b2c0910d600d1502db9443c8f8e",
  "wirepasToken": "32b8002023a6005812c79f08fa1a78f0.d093b40744f56be06af71fe9fed68064",
  "cloudinaryApiKey": "f145b52b7f2376839766d789e81d9d817503e6dc04184e82ce4167cbb6f5cef1.227483c5614a9629e9efffe5b7fdae6f",
  "stripeToken": "a19cb45d7185b58a3e9f589c55c59c14.0c2c1253c3e0b98cfb07b6bf4cd10dc6"
}
```

## Déchiffrer dans son application avec Kuzzle Vault

_Cet exemple utilise l'implémentation Node.js de Kuzzle Vault, une implémentation PHP est disponible sur la branch [php](https://github.com/kuzzleio/kuzzle-vault/blob/php/README.md)_

Une fois que l’on a son fichier contenant les secrets chiffrés, nous allons pouvoir **l’utiliser dans notre application** en utilisant [Kuzzle Vault](https://github.com/kuzzleio/kuzzle-vault).


Kuzzle Vault est un simple paquet NPM sans aucune dépendance permettant **de déchiffrer et d’utiliser des secrets dans une application**.

```js
import { Vault } from 'kuzzle-vault';

const vault = new Vault('my-secret-password');
vault.decrypt('config/prod/secrets.enc.json');

// decrypted secrets are now loaded in memory
vault.secrets.aws.keyId
```

Ainsi nous pouvons maintenant partager puis **charger l’ensemble des secrets nécessaire au fonctionnement** de l’application directement et de façon sécurisé depuis le système de fichier.

Si vous avez des **secrets différents en fonction de vos environnements de déploiement**, c’est le moment de tous les sauvegarder dans des fichiers différents afin qu’ils puissent être **utilisés automatiquement par la CI** au moment du déploiement.

```
config
├── local
│   └── secrets.enc.json
├── production
│   └── secrets.enc.json
└── staging
    └── secrets.enc.json
```

## Pour aller plus loin
Kourou possède de nombreuses méthodes pour gérer des fichiers de secrets chiffrés.

Par exemple il est possible d’**ajouter un nouveau secret à un fichier existant** ou d’**afficher le contenu d’un secret**:

```bash
$ kourou vault:add config/secrets.enc.json aws.s3 aws-secret-key

$ kourou vault:show config/secrets.enc.json aws.s3
```


Si vous avez besoin de **chiffrer le contenu d’un fichier**, vous pouvez aussi utiliser Kourou:

```bash
$ kourou file:encrypt id_rsa -o id_rsa.enc
```

Vous pouvez aussi **développer vos propres outils en utilisant les mêmes primitives cryptographiques**. Si cela vous intéresse, vous pouvez jeter un oeil à la classe [Cryptonomicon](https://github.com/kuzzleio/kuzzle-vault/blob/master/src/Cryptonomicon.ts) du paquet kuzzle-vault.

## Et les autres outils alors?

Il existe de nombreux outils de gestion de secrets, on peut notamment citer:
  - [Mozilla SOPS](https://github.com/mozilla/sops): fonctionne sur le même principe que Kuzzle Vault en plus complet avec notamment des connecteurs pour GCP, AWS ou Azure
  - [Hashicorp Vault](https://www.vaultproject.io/): gestion d'identité très complète avec téléchargement sécurisé des secrets, révocation, rotation, etc.

Ces deux outils sont beaucoup plus complets que Kuzzle Vault et ce projet n'a pas l'ambition de les remplacer.  
Le coût et la complexité d'intégration est beaucoup plus elevé en utilisant un de ces outils et Kuzzle Vault se veut être une alternative ultra-simple pour mettre la sécurité à la portée de tous :-)

## Le mot de la fin

Le chiffrement c’est compliqué, et c’est encore plus compliqué à mettre en place de façon sécurisé dans un environnement de développement en équipe avec de l’intégration continue.

Cependant si celui ci est géré correctement et facilement, c’est un **avantage indéniable** pour faciliter l’ensemble des processus de développement et de déploiement.

Les outils décrit dans cet article sont comme Kuzzle et nos autres projets: **open source et librement utilisables avec la licence Apache 2**. 

L'Open Source est encore plus important lorsqu’on aborde le sujet de la cryptographie. 

Vous pouvez nous faire confiance sur parole ou encore mieux, vous pouvez aller regarder le code vous même ;-)

---

_Si vous avez des questions ou que vous voulez juste discuter, venez nous parler sur le [Discord de Kuzzle](http://join.discord.kuzzle.io)_
