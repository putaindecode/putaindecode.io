---
date: "2015-07-07"
title: Webpack
tags:
  - javascript
  - task-runner
authors:
  - MoOx
header:
  credit: http://webpack.github.io/
  linearGradient: 160deg, rgb(204, 51, 51), rgba(204, 51, 51, .6)
---

# Pourquoi webpack ?

Avant webpack, nous avions beau avoir des super task-runners comme
[grunt](/posts/js/premiers-pas-avec-grunt)
ou
[gulp](/posts/js/introduction-gulp),
il faut avouer qu'on bricolait quand même pas mal.

Pourquoi ? Devoir ajuster des configurations/définitions de tâches pour ajuster
les copies d'images ou de fonts… Ou encore ajuster les urls de générations…
Il y avait avec ces solutions une grande partie de rafistolage, où l’on se
devait de faire très attention à la moindre réorganisation de code, sous peine
de casser une partie du rendu.

Prenons par exemple une image de fond déclaré en CSS. Qui vous préviendra qu'une
référence n'est pas bonne (à part peut-être vos logs de serveur web en
recherchant les pages d'erreurs 404) ?

Vous avez la responsabilité de gérer vos tâches et leurs résultats tout en vous
assurant du bon fonctionnement car vous êtes la glu entre tous ces morceaux.

# Webpack: faire un pack prêt pour le web

Pas besoin de s'appeler Enstein pour comprendre les intentions de webpack en
interprétant le nom: webpack.

Nativement, webpack s'occupe uniquement de ressources JavaScript.
Les *loaders* permettent de transformer tout et n'importe quoi en JavaScript
(mais pas que). Ainsi, tout est consommable en tant que module.

C'est cette partie qui est aujourd'hui la plus intéressante et la plus flexible.

<figure>
  ![](index.jpg)
  <figcaption>
    webpack transforme une multitude de fichier en lots par responsabilité
  </figcaption>
</figure>

Webpack, bien que principalement orienté vers les modules JavaScript, va
donc pouvoir s'occuper de toutes les ressources dont vous pourrez avoir besoin.
Il est assez flexible pour consommer tous types de fichiers et en faire ce que
vous voulez.

En plus de cela, il a été pensé afin de permettre la séparation de votre pack
en plusieurs morceaux, selon vos besoins: vous pourrez ainsi ajuster la balance
entre performances et lazy loading.

Avec les solutions existantes, il n'est actuellement pas possible d'arriver
facilement à ce que propose Webpack, pour ne pas dire difficilement.

Il est possible d'avoir une équivalence avec
[browserify](/posts/js/browserify-all-the-things) comme l'a indiqué son auteur
dans un post
[browserify for webpack users](https://gist.github.com/substack/68f8d502be42d5cd4942)
(qui est une réponse à la ressource
[webpack for browserify users](https://github.com/webpack/docs/wiki/webpack-for-browserify-users)
).

Il est clair que cela n'est pas aussi simple qu'avec Webpack qui est beaucoup
plus flexible de part sa conception et ses objectifs initaux.

browserify ne va par exemple pouvoir appliquer des éventuelles transformations
qu'au code local (donc pas dans `node_modules/*`).
Cela peut être problématique et nous conduirait forcément à finir par du
bricolage si on veut consommer des assets de modules de manière transparente.

Ne parlons pas du
[hot loading](http://webpack.github.io/docs/hot-module-replacement-with-webpack.html)
qui n'est pas encore du tout facile à mettre en place avec autre chose que
Webpack.

Pour résumer, Webpack permet:

- d'avoir toutes les ressources statiques en temps que module,
- d'intégrer des bibliothèques tierces en tant que module,
- de séparer votre "build" en plusieurs morceaux, chargé à la demande,
- de garder un chargement initial rapide si besoin,
- de personnaliser la plupart des étapes du processus,
- de s'adapter aux gros projets.

[Webpack possède une documentation](http://webpack.github.io/docs)
assez fournie, mais pas vraiment facile à aborder lorsqu'on découvre le projet.

---
Vous trouverez ci dessous les ressources que nous vous proposont pour découvrir
ou approfondir webpack:

- [Premier exemple détaillé de configuration et d'utilisation](/posts/webpack/premier-exemple)
- [Tutorial officiel (anglais)](http://webpack.github.io/docs/tutorials/getting-started/)
