---
date: "2017-11-28"
title: "Stop aux `npm install -g` sauvages (ou pourquoi vous ne devriez pas installer en global de packages et outils CLI)"
tags:
  - npm
  - yarn
authors:
  - MoOx
header:
  linearGradient: 160deg, rgba(204, 51, 51, .8), rgba(204, 51, 51, .4)
  image: https://farm9.staticflickr.com/8176/8071576461_077d371de8_z.jpg
  credit: https://www.flickr.com/photos/twicepix/8071576461
---

À chaque fois qu’un développeur installe un outil globalement, une discussion
tabs vs spaces commence. Et Dieu sait que c’est inutile. Les espaces c’est
mieux. Fin de la discussion.

À chaque fois qu’un développeur utilise un outil de développement global, un
chaton meurt. Et Dieu sait que nous aimons les chats.

Plus sérieusement, c’est une vraie question. Et une bonne question.

## Pourquoi installer un outil de manière globale sur sa machine est une mauvaise idée?

On va tenter de répondre ici de manière constructive.

La raison est simple et c’est la même raison pour laquelle aujourd’hui il y a
Yarn et npm 5 qui utilisent des fichiers `lock` : parce que vous voulez avoir
l'assurance d'avoir la même version que vos collègues.

Très souvent, dans le fond un outil CLI n’est rien de plus qu’une dépendance à
un projet. Il est tout à fait (voire hautement) probable que sur deux projets
différents développés à deux instants différents dans le temps vous ayez utilisé
deux versions différentes d’un outil.

Le premier exemple de ma vie qui me vient en tête c’est les pré-processeurs CSS.
À l’époque où j’utilisais Sass, il était courant que pour une raison X ou Y (par
exemple une nouvelle fonctionnalité disponible dans une version majeure) que je
dois mettre à jour la version pour le projet en cours. Mais que se passe-t-il
alors pour tous mes anciens projets ? Vont-ils être compatible ? Vont-ils avoir
des problèmes ? Vais-je devoir mettre mes autres projets à jour ? Cela va-t-il
me faire chier d’une manière hors du commun ?

Vous avez ici des vraies questions d'ordre pratique. Ça dû arriver à tout le
monde d’avoir ce cas de figure.

Et je vais ajouter à ceci un autre problème.

## « mais puisse ke je te di ke sa marche cez moi ! »

On a tous travaillé à plus de deux développeurs sur un projet (et encore ça peut
nous arriver tout seul au changement de machine)

Le fameux « ça marche sur ma machine ». Celui-là qui prend grâve la tête.
Celui-là qui peut nous faire perdre des heures à comprendre pourquoi ça marche
pas sur le PC des collègues.

Celui-là qui énerve les personnes chez qui ça marche et ceux chez qui cela ne
marche pas. Oui ça fait clairement chier tout le monde.

Du coup pour éviter ce problème, il y a une méthode simple.

## Ne jamais (ô grand jamais) installer un outil de développeur globalement sur sa machine.

De rien. Voilà c’était un conseil gratuit.

(Je détaillerai à la fin de cet article les seules raisons valables pour
utiliser et installer globalement un package ou un outil CLI)

Bon du coup pour éviter ce problème on a une solution extrêmement simple :
installer localement à chaque projet TOUTES les dépendances.

Il y a deux choses que peu de gens savent : la première est que npm et yarn vont
automatiquement ajouter tous les bin disponibles vu tous les node_modules locaux
dans le PATH utilisé via les scripts définis dans votre package.json.

Du coup dans la pratique il vous suffit de vous faire un petit alias pour chaque
outils CLI et le tour est joué.

```js
{
  "scripts": {
    "cmd": "cmd" // on assume qu'on a un outil qui offre le bin `cmd`
  }
}
```

```console
npm run cmd
```

À savoir avec npm il faudra rajouter des — à la fin d’une commande pour que cela
fonctionne correctement si vous passez des arguments.

```console
npm run cmd -- arg
```

Avec Yarn, cela n’est pas nécessaire. C’est bien plus bref (et pratique)

```console
yarn cmd arg
```

Il faut savoir que pour les développeurs de ce type d’outil c’est aussi un petit
cauchemar à gérer.

Lorsqu’un outil à une package offrant une interface CLI, comment savoir si la
version de la bibliothèque fonctionnera avec ?

De cette problématique est né une solution récurrente : les package qui
ont une CLI et une bibliothèque en parallèle vont très souvent avoir une CLI
très light qui va en général consister à aller chercher dans le dossier de la
bibliothèque où vous vous trouvez le vrai code à exécuter.

Je dirais même que c’est plutôt cool dans un sens.

Mais on voit bien ici qu’on a un petit problème car cela demande du travail
supplémentaire aux développeurs des projets qui sont déjà trop souvent à flirter
avec le burnout.

## Petite astuce bien stylé

Vous pouvez ajouter tous les binaires de `node_modules/.bin` localement à votre
PATH histoire de pouvoir les utiliser en CLI.

```sh
# to avoid npm install -g / yarn global add
export PATH=$PATH:./node_modules/.bin
```

Une fois cette astuce réalisé, déposez dans votre `.bashrc` (ou`.zshrc`…), vous
pourrez utiliser des bin locaux à votre projet comme si ils avaient été
installés globalement. Sans passer par alias. Mais ça ne marchera bien entendu
qu’à la racine du projet. Ça reste bien pratique n’est-ce pas?

(Et non, si vous faites ça dans l'ordre décrit plus haut, il n'y a pas de soucis
de sécurité genre _"un package remplace `rm` et fait ce qu'il veut avec mes
données"_ puisque la priorité sera donné à la première partie du `PATH`.)

## Alternative bien stylée

Si vous n'êtes pas fan de modifier votre `PATH`,
[`npx`](https://www.npmjs.com/package/npx) est un outil qui va justement
permettre d'appeler les `node_modules/.bin` locaux sans le modifier.

Au mais comment on l'installe? Avec `-g` pardis ! Je plaisante. Il est inclus
avec `npm`. Faites un petit `which npx` pour vérifier!

Dans tous les cas, `npx` fait parti des rares outils qui méritent d'être
installés en global, ceux qui sont pour l'environnement du développeur,
pas pour un projet.

D'ailleurs parlons en de ces cas où `-g` est valide.

## Les seuls cas valides où les outils globaux ont du sens

Les seuls cas valides sont pour des outils qui ne sont pas des outils liés à un
projet. C’est pas plus compliqué!

Répétez avec moi: _"Installer avec -g c'est pour mon environnement de
développeur, rien qu'à moi. Pas pour un projet"._

En plus de `npx`, un très bon exemple serait
[`trash(-cli)`](https://www.npmjs.com/package/trash), que je vous conseille
d’utiliser en place de `rm -rf` (il va plus vite (déplace dans votre corbeille),
et permet donc la récupération, sait-on jamais). Et encore si vous l’utilisez
sur un projet, pensez à l’ajouter aux dépendances (--dev)!

Il en existera d'autres, mais rappelez-vous que `npm install -g` est clairement
trop souvent recommandé alors qu'il ne devrait pas l'être!

N’hésitez pas à réagir à ces conseils.

Bisous à tous 😘
