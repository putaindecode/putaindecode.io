---
date: "2014-02-26"
title: Twitter comme lecteur de flux
tags:
  - twitter
  - rss
  - atom
authors:
  - kud
---

_(Note : dans cet article, j'ai volontairement pris comme exemple la version Web afin que tout le monde puisse profiter de l'expérience mais il est évident que vous puissiez le faire avec votre application twitter favorite)._

Bien avant la fin de Google Reader, je me posais déjà la question de l'intérêt d'un lecteur de flux {rss|atom}. En effet, il m'était pénible d'organiser les flux que je souhaitais lire : les ranger par catégorie, supprimer les sites morts ou ceux qui ne m'intéressaient plus; de plus, je n'ai jamais réellement utilisé les fonctionnalités d'un lecteur de flux comme le système de marquage, savoir si le flux a été lu ou non, lire l'article dans le lecteur (je le lis toujours sur le site, jamais dans l'application). Et puis c'est parfois pénible de trouver un lecteur de flux simple, multi-OS et gratuit.

J'ai été un grand fan à l'époque de Netvibes puis je l'ai délaissé pour Google Reader et nous voilà quelques temps après, sans réelle solution à mon sens pour lire agréablement des flux tel que je le concois.

J'expérimente pourtant une solution depuis quelques mois qui me sied bien. J'utilise en effet Twitter en tant que lecteur de flux. Oui, car cela a plusieurs avantages :

- Il existe une application pour [Android](https://play.google.com/store/apps/details?id=com.twitter.android&hl=fr), [iOS](https://about.twitter.com/products/iphone) ainsi que [Mac](https://itunes.apple.com/fr/app/twitter/id409789998?mt=12); mais aussi la [version Web](https://twitter.com/) et [Tweetdeck](https://tweetdeck.twitter.com/) est disponible sur tous les environnements.

- Je fais ma veille majoritairement via Twitter; j'écrème au fil de la journée ce qui m'intéresse ou non. Si c'est rapide à lire alors je le lis, sinon je _bookmark_ l'article en "Read later" sur mon navigateur. Cela permet de trier rapidement l'information et de lire plus paisiblement cela au moment opportun.
De plus, étant donné que l'information est donnée par mes _following_ et que je suis les personnes qui m'intéressent vraiment, l'information est alors souvent pertinente. Encore faut-il avoir la bonne TL.
Et  si j'ai besoin d'aller chercher une information précise, j'irai la trouver à travers un moteur de recherche... donc aucune problématique de "neutralité" de l'information.

- De plus, étant donné que je fais justement cette veille via Twitter, cela me permet d'avoir qu'un seul outil. Cela m'ennuie au plus haut point de collectionner les outils. Je suis certes partisant d'utiliser le bon outil pour chaque tâche plutôt qu'un couteau-suisse, mais finalement Twitter et un lecteur de flux ne sont pas si éloignés.

- Enfin, la majorité des blogs / sites que j'apprécie ont leur propre compte twitter qui postent l'url de leurs articles, il suffit alors de les suivre. Et si ce n'est pas le cas, je vous montrerai une petite astuce pour que ça le soit.

Vous vous sentez chaud(e) pour commencer ? Très bien, c'est parti !

## Créer une liste Twitter

Pour créer une liste, aucun problème, vous allez dans "Me" dans le _header_ puis "List" dans la colonne de gauche pour vous retrouver ici :

![](twitter-list.jpg)

Puis vous cliquez sur `Create list` et vous rentrez les informations que vous souhaitez :

![](create-list.png)

Nous voilà avec notre belle liste. Il n'y a plus qu'à la remplir de jolis _following_.

Prenons par exemple `@nodenpm`, un beau _bot_ tweetant les nouveaux packages node.js ou/et les updates de ces packages.

![](nodenpm.jpg)

Ajoutons-le à notre liste.

![](add-in-list.png)

Nous voilà maintenant avec notre liste comprenant un _following_. Ce qui en ayant ajouté quelques comptes donnera quelque chose comme ceci :

![](twitter-list-read.jpg)

Vous pouvez maintenant apprécier votre lecteur de flux.

Oh mais ! C'est là que vous constatez qu'un de vos sites préférés n'a pas de compte Twitter ! Que faire ? Haha, et si on utilisait la puissance de IFTTT pour se créer un bot twitter qui tweet chaque nouvel article d'un des sites que vous appréciez ?! Mais ouais !

## IFTTT, la solution pour parfaire notre lecteur

Mais avant tout, créons notre compte twitter "bot" qui va tweeter ce qu'on souhaite.

### Compte twitter "bot"

- Déconnectez-vous
- Inscrivez-vous à nouveau sur Twitter (le mien s'appelle [@kud_feeds](https://twitter.com/kud_feeds) par exemple)
- Mettez-lui une belle bio, un bel avatar
- Déconnectez-vous à nouveau
- Connectez-vous avec votre vrai compte
- Ajoutez votre "bot" à la liste que vous venez de créer précédemment

... et voilà !

### IFTTT

![](ifttt.png)

Maintenant, IFTTT.

> IFTTT ("If This Then That") est un service qui permet aux utilisateurs de connecter différentes applications ensemble à travers de simples conditions nommées "recettes".

IFTTT va vous permettre d'aller pomper les flux {rss|atom} de vos sites préférés puis ayant accès à votre _bot_ va permettre de tweeter le contenu des flux ! C'est pas beau ça hein ?! =)

- Allez sur [ifttt.com](https://ifttt.com)
- Créez-vous un compte (je vous conseille de créer un compte spécialement pour le _bot_ car IFTTT ne propose de relier qu'un seul compte twitter. Du coup, si comme moi vous appréciez IFTTT et que vous souhaitez autant utiliser IFTTT pour votre compte twitter principal que votre compte _bot_, je vous conseille de vous créer deux comptes IFTTT)
- Créez une nouvelle recette en cliquant sur `Create`
- Cliquez sur `this`
- Puis `feed`
- Choissisez le _trigger_ ("déclencheur") que vous souhaitez, moi je prends plutôt le premier `New feed item` (le plus simple)
- Indiquez l'url du flux de votre site, par exemple `http://dribbble.com/_kud/shots/following.rss`
- Puis `then`
- Twitter
- `Post a tweet`
- Laissez tel quel le _template_ de base pour le moment (vous pourrez le changer quand vous serez à l'aise avec IFTTT)
- Mettez la description qui va bien

Et on est bon.

Vous avez maintenant une nouvelle recette qui dès qu'un article sortira, un tweet de votre _bot_ apparaitra. Vous pouvez d'ailleurs vérifier que tout marche bien en cliquant sur la flèche _Check Recipe Now_.

Vous n'aurez plus qu'à créer une nouvelle recette en dupliquant cette recette à chaque fois que vous voudrez suivre un nouveau flux. Certes éventuellement plus contraignant qu'un vrai lecteur de flux mais vous y gagnerez largement par la suite ;)


Et voilà, nous avons maintenant une belle liste Twitter qui représentre votre lecteur de flux. Voici la mienne : https://twitter.com/_kud/lists/feeds

Vous pouvez même pousser le vice en créant plusieurs listes par catégorie mais ça sous-entend aussi de créer des _bots_ et donc des comptes IFTTT par catégorie. Heureusement que j'en ai qu'une. ;)

Enjoy!
