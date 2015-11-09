---
date: "2015-03-03"
title: "Il démarre Vim par erreur, ce qui se passe ensuite est tout simplement bluffant"
tags:
  - éditeur
  - vim
authors:
  - MoOx
---

> À première vue, vous allez éprouver de la tristesse, mais ce qui se passe ensuite est tout simplement incroyable...

> Alors qu’il était en train d'effectuer une mise en production,
ce développeur s'est confronté à une situation qui aurait pu complètement déraper.
Une intervention directement sur le serveur de production était obligatoire afin d'éditer la base de données au format .txt.

> Après avoir passé plusieurs heures pour se connecter à distance via une connexion sécurisée,
Maxime est tombé nez à nez avec une console d'administration en ligne de commande !
Il était complètement désemparé par l'absence de fenêtre.

> Ce qui s’est passé ensuite est tout simplement incroyable :
fort de sa persévérance, Maxime décide tout de même de se rapprocher du clavier !
Après une rapide recherche sur les Internets,
il tape la première commande qu'il trouve :

> ```console
> $ vim
> ```

> Alors qu'on pourrait imaginer un drame, comme il arrive souvent quand [une personne tombe dans ce piège](https://duckduckgo.com/?q=I+am+stuck+in+VIM),
Maxime ne s'est pas laissé abattre et a persisté dans sa démarche...

Bon, assez plaisanté.

## _Pourquoi j'essayerais Vim ?_

J'ai commencé par Eclipse. Qu'il fallait réinstaller assez souvent sans quoi on perdait 10 minutes de sa vie à chaque ouverture d'autocomplete.
Je suis passé par NetBeans, WebStorm... Sans être convaincu. Plus récemment, j'étais assez content sous Sublime Text avant d'essayer Atom
(car en gros Atom est quasiment la même chose, en technologie web, open source et fait par GitHub).
Mais j'ai toujours eu envie de me la péter devant 2 écrans tout noir,
en ligne de commande, comme dans les super productions américaines.

Plus sérieusement, je passe de plus en plus de temps devant ma console...
Enfin vous savez, le terminal, pas l'autre truc un peu plus fun (et encore que).

J'ai toujours eu envie de comprendre pourquoi autant de gens (car mine de rien il y en a un paquet) utilisaient Vim,
et se moquaient un bon coup à chaque sortie d'un nouvel éditeur.
Car bon faut avouer, se moquer c'est facile.
Du coup un jour, j'ai démarré Vim.

## _Pourquoi j'ai rien compris quand je me suis retrouvé dans Vim ?_

Le truc le plus déroutant dans Vim, c'est les modes.
Et quand on ouvre Vim, on ne se retrouve pas dans le mode le plus logique (à première vue).

En fait, ce qu'on dit pas trop, c'est que Vim est toujours utilisé aujourd'hui car on peut l'utiliser uniquement au clavier.
Vous allez me répondre qu'on peut en faire de même avec tous les éditeurs de texte.

Mais **Vim a clairement été développé pour minimiser les déplacements des mains**.

C'est pour moi la chose la plus importante à retenir. Et la chose la plus attractive.
Les bons développeurs ont tous une bonne flemme au fond d'eux, c'est bien connu.

Pour un peu plus sur l'histoire de Vim, direction [wikipedia.org/wiki/Vim](https://fr.wikipedia.org/wiki/Vim).

## Commencer avec Vim

Du coup, quand je suis dans Vim, comment ça se passe ?

Je passerai plus tard assez rapidement sur les différents points, vu que d'autres ressources,
dont notamment le livre [Vim pour les humains](https://vimebook.com/), le font très bien en douceur.

C'est d'ailleur grâce à ce livre que je me suis lancé.
Je tiens donc à remercier [Vincent Jousse](http://viserlalune.com/) pour avoir pris le temps d'écrire cet ouvrage.

Profitez de cet ouvrage, en plus [le prix est libre](http://ploum.net/le-prix-libre-une-impossible-utopie/).
Et puis quand on pense au prix des licences de certains IDE...

Ce livre est fait pour n'importe qui, débutant ou pas.
Vraiment, mangez-en si vous souhaitez essayer Vim (oui je sais, manger un e-book comme ça, ça paraît pas évident).

J'ai essayé plusieurs fois sans trop savoir où commencer, sans succès.
Ce livre m'a aidé et se dévore en quelques dizaines de minutes (deux ou trois heures grand max),
clavier sous les mains (bah oui rien de mieux pour se lancer).

J'ai essayé et me voilà conquis, une fois que j'ai compris sa valeur ajoutée.

Pour bien s'y prendre, forcez-vous à travailler avec Vim au moins une journée en suivant les conseils que vous trouverez dans cet ouvrage.
Cela a fonctionné pour moi : je gagne déjà du temps au bout de quelques semaines d'utilisation.

Pourquoi pas vous ?

## Pour apprendre Vim

Vous pouvez donc :

- lire l'e-book [Vim pour les humains](http://vimebook.com)
- lancer la commande `vimtutor`
- jouer à [Vim Adventures](http://vim-adventures.com/)
- vous entraîner sur des exemples concrets avec [VimGolf](http://vimgolf.com/)

Voici aussi un cheatsheet indispensable qui permet de bien mémoriser le pourquoi des touches
(b = begin, w = word, e = end, r = replace, i = insert, a = append, o = open, ctrl f = forward, ctrl b = backward, etc).

![cheatsheet VIM](../vim-cheatsheet.gif)

Vous remarquerez que souvent les commandes en majuscules font la même chose mais dans le sens inverse (f/F, o/O), ou de manière plus catégorique (d/D, y/Y).

## Passer à Vim est un investissement

Point important : il faut avoir envie.
Il ne s'agit pas de changer simplement d'éditeur, car on doit complètement changer ses habitudes.
Plus aucun raccourci clavier que vous avez l'habitude d'utiliser ne va fonctionner.
Je me répète mais il faut se forcer un minimum avant d'imaginer les possibilités de cet éditeur.

Cela dit, on peut rapidement voir la puissance de Vim après quelques heures d'utilisation
(même si on peut aussi un peu rager en cherchant des commandes simples qu'on arrive pas à faire).

Sachez aussi que beaucoup d'éditeurs ont des modes Vim (Sublime Text, Atom et d'autres). Il doit bien y avoir une raison, non ?
Notez aussi que Vim est installé par défaut sur beaucoup d'environnement de type Unix.

Vim est configurable à souhait (via le fichier `.vimrc`) et possède même son propre language de scripts (Vim Script ou viml)
ce qui permet de créer de nouvelles fonctionnalités simplement. Et même du coup d'en faire des "plugins".

Je vous prépare un prochain post pour vous faire un petit mémo condensé de ce qu'on peut faire avec, et surtout comment.

> :q^C:wq
