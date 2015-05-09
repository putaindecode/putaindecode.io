---
date: "2013-11-06"
title: Versionner avec Git
tags:
  - git
authors:
  - madx
---

Chez _Putain de code !_, on aime se servir de [Git][git:website] (et de GitHub, mais
c'est une autre histoire), même si certains d'entre nous (comme Lionel) ne s'en
servent pas forcément bien.

Pour éviter ce genre de mésaventures, on s'est dit qu'on allait consacrer une
série d'articles à ce merveilleux gestionnaire de versions, et de vous en faire
profiter par la même occasion.

Et si Git permet de faire à peu près ce qu'on veut sur un dépôt, vous verrez
qu'on peut assez facilement réparer ses erreurs (et même celles des autres
parfois !).


## C'est quoi Git ?

Si vous êtes un développeur un tant soit peu consciencieux, vous utilisez un
gestionnaire de versions pour suivre l'évolution de votre code. Non,
[CPOLD][cpold] n'est pas un gestionnaire de versions.

Git, c'est un gestionnaire de versions décentralisé, aussi connu sous le terme
de DVCS (pour Distributed Version Control System) pour les amateurs.

Le terme *distribué* est très important car c'est ce qui le différencie d'autres
gestionnaires historiquement plus connus comme Subversion (SVN) ou le vénérable
CVS.

Ça veut dire que chaque développeur possède sa propre copie du dépôt, chez lui,
localement, contrairement à un gestionnaire centralisé ou tout est… centralisé
sur un même serveur (merci Captain Obvious).

Git est principalement utilisable en ligne de commande, mais il existe des
interfaces graphiques sous les principaux OS du marché (OS X, Linux, Windows).
Ici, on va traiter de la ligne de commande, car c'est l'arme de base du bon
développeur.

Je vous passe l'installation, référez-vous à la documentation officielle pour
cette partie. (Ça se résume souvent à un `nom-du-package-manager install git`)

## Comment ça marche ?

Avant d'attaquer la partie pratique, on va s'attarder un peu sur comment Git
fonctionne, parce qu'à mon sens c'est essentiel pour comprendre rapidement ce
qu'il est possible de faire et pour se construire un modèle mental des
opérations.

Dans Git, les commits sont tous reliés avec leur(s) parent(s) comme les maillons
d'une chaîne qui pourrait avoir des bifurcations. Chaque commit stocke des
informations sur l'état du dépôt à un instant donné (l'état complet, pas
uniquement un diff).

On construit cette chaîne et ses bifurcations en créant des commits, en
branchant et en fusionnant une branche dans une autre.

Enfin, une dernière chose que vous devez garder en tête c'est qu'un commit est
définitif dans le sens ou on ne pourra jamais modifier son contenu (on pourra
par contre le remplacer par un autre). Comme il est unique, il a un numéro qui
est un haché `SHA1` de diverses informations.

Ces `SHA1` sont utilisés à foison, habituez-y vous !

Voilà, maintenant sortons nous les doigts et regardons comment ça marche
concrètement.

## Créer ou récupérer un dépôt

Il y a deux manières de créer un dépôt Git : soit on en veut un tout neuf et on
utilise `git init`, soit on veut cloner un dépôt déjà existant et on utilise le
bien nommé `git clone`.

Appelé sans argument, `git init` initialise un dépôt dans le dossier courant,
on peut lui passer un nom de dépôt en argument pour le créer dans un
sous-dossier spécifique du dossier courant.

Du côté de `git clone`, on va passer l'adresse d'un dépôt, et optionnellement un
nom local pour le dépôt. Il va récupérer le dépôt à l'adresse spécifiée (c'est
bien foutu hein ?) puis le mettre soit dans un dossier du même nom soit dans un
dossier du nom spécifié en dernier argument.

Par exemple, si je veux cloner le dépôt du site :

```console
$ git clone https://github.com/putaindecode/putaindecode.fr.git
```

Ça va créer un dossier `putaindecode.fr` avec le contenu du dépôt.

`clone` accepte plusieurs types d'adresses : HTTP(S), SSH, protocole Git dédié et
même des chemins locaux pour cloner un dépôt situé ailleurs sur le système de
fichiers.

Pour la suite, il va falloir se placer dans un dépôt avec le petit `cd` qui va
bien pour lancer les vraies commandes intéressantes de Git.

## Premiers commits

Pour commencer à s'amuser, écrivez un bout de code dans un fichier et
sauvegardez le :

```console
$ cat > putain_de_hello_world.rb
puts "Hello, putain de codeur !"
^D
```

On va tout se suite introduire l'un des concepts déroutants de Git, *l'Index*.
Git utilise trois zones distinctes pour les fichiers : le dossier de travail
(*Working Dir*) qui contient les fichiers dans leur version actuelle, *l'Index*
qui permet de stocker les modifications et `HEAD` qui pointe vers le dernier
commit.

L'idée, c'est qu'on peut modifier les fichiers comme on le souhaite, et
constuire le commit avec seulement les modifications que l'on souhaite voir
apparaître.

Cette possibilité permet d'avoir des commits atomiques, c'est à dire qui
introduisent une modification simple. Ça évite de se retrouver avec un commit
mammouth qui change tout le programme d'un coup et qui est un enfer pour le
futur développeur qui revient sur le code et qui cherche à comprendre la logique
de sa construction. Ce développeur, c'est vous dans 1 ou 2 semaines.

Pour info, vous verrez parfois *l'Index* appellé *Staging Area*, ou encore
*Cache*.

Git fournit des commandes pour passer les fichiers d'un état à l'autre. Elles
sont certes parfois un peu obscures, mais dans l'ensemble c'est pas si
difficile.

Dans notre cas, notre fichier n'est même pas encore suivi par Git ! Vous pouvez
vérifier ça en utilisant `git status`, dont vous ne pourrez bientôt plus vous
passer :

```console
$ git status
# Sur la branche master
#
# Validation initiale.
#
# Fichiers non suivis:
#   (utilisez "git add <fichier>..." pour inclure dans ce qui sera validé)
#
#	putain_de_hello_world.rb
Aucune modification indexée mais des fichiers non suivis sont présents (utilisez "git add" pour les suivre)
```

Pour pallier cela, on utilise `git add` pour l'ajouter direct à l'index.

Dans notre cas, ça donne `git add putain_de_hello_world.rb`

On peut utiliser `git add` pour ajouter des dossiers entiers, des motifs, … Mais
soyez vigilants, c'est une bonne source d'erreurs souvent chiantes.

Vous pouvez vérifier que `git add` a bien marché avec la commande `git status`,

```console
$ git status
# Sur la branche master
#
# Validation initiale.
#
# Modifications qui seront validées :
#   (utilisez "git rm --cached <fichier>..." pour désindexer)
#
#	nouveau : putain_de_hello_world.rb
#
```

Ok c'est prêt ! On lance maintenant `git commit` pour créer notre premier commit
(pas con le *naming* de la commande hein ?). Si tout se passe bien vous devriez
avoir un éditeur qui s'ouvre pour écrire un message de commit. Prenez l'habitude
de décrire votre changement sur la première ligne succintement et, si vous avez
besoin de détails, sautez une ligne et détaillez les modifications.

Un petit `git status` nous confirme qu'on s'est pas foiré (la preuve, tout est
propre) :

```console
$ git status
# Sur la branche master
rien à valider, la copie de travail est propre
```

## Inspecter

Bon, c'est bien beau de commiter, mais à un moment on arrive sur un projet en
cours et on aimerait bien savoir où on en est. Pour ça, vous pouvez utiliser un
outil graphique (il y en a pour [Linux][gitg], [OS X][gitx] et même sûrement
Windows) ou retrousser vos poils de barbe et sortir le bon vieux `git log`.

C'est un vrai couteau suisse qui va vous permettre d'inspecter tout l'historique
de votre dépôt, avec des options en veux-tu en voilà pour personnaliser
l'affichage.

Un `git log` basique ça ressemble à ça :

```console
$ git log
commit 8120de7b7139e46b9cbc1c3ee89a02962dbc198e
Author: madx <madx+github@yapok.org>
Date:   Mon Nov 4 23:28:11 2013 +0100

    Premier commit
```

Oui, c'est le commit que je viens de faire dans la partie précédente. Comment
j'en suis sûr ? Car je peux utiliser `git show` pour afficher les détails d'un
objet Git (il n'y a pas que des commits, mais on verra ça une prochaine fois).

`git show` prend en argument le fameux `SHA1` du commit :

```console
$ git show 8120de7b7139e46b9cbc1c3ee89a02962dbc198e
commit 8120de7b7139e46b9cbc1c3ee89a02962dbc198e
Author: madx <madx+github@yapok.org>
Date:   Mon Nov 4 23:28:11 2013 +0100

    Premier commit

diff --git a/putain_de_hello_world.rb b/putain_de_hello_world.rb
new file mode 100644
index 0000000..ded37dc
--- /dev/null
+++ b/putain_de_hello_world.rb
@@ -0,0 +1 @@
+puts "Hello, putain de codeur !!!"
```

Dit comme ça, ça a pas l'air de casser trois pattes à un canard, mais c'est la
base de la base de la praticité. Je vous fais pas l'insulte de vous expliquer les
détails, vous êtes sans doute assez malins pour comprendre ce que Git raconte
sur la sortie de ces deux commandes.

Remarquez que `git show` affiche en bonus les différences introduites par un
fichier. Ces différences on peut aussi les voir avant de commiter avec `git
diff`, ce qui est bien pratique.

Entraînez-vous maintenant à faire des commits, à inspecter et à farfouiller les
pages de `man`, c'est la meilleure façon d'apprendre. Après, on va attaquer le
gros morceau, celui qui fait la force de Git.

<figure>
  ![Mind blown](mind_blown.gif)
</figure>

## Branchement et fusions

Créer une branche, ça permet de travailler sur une fonctionnalité ou un bug
précis, sans encombrer la ligne de conduite principale, qui peut évoluer sous
d'autres contraintes.

Dans Git, les branches sont une partie essentielle de quasiment tout *workflow*,
et leur manipulation est très rapide et très légère.

Pour en revenir à mon histoire de maillon, créer une branche revient à créer un
point à partir duquel deux chaînes vont être possibles.

C'est aussi simple qu'un `git branch le-nom-de-ma-branche`. Cette commande se
contente de créer la branche, pour se positionner dessus on utilise `git
checkout` qui permet de naviguer de branche en branche tel Tarzan sur ses
lianes.

Comme c'est super chiant à écrire, il existe un raccourci bien pratique : `git
checkout -b`, auquel on passe un nom de branche comme pour `git branch`.

Une fois qu'on est bien sur la branche, tous les commits suivants seront liés à
cette branche.

On peut utiliser `git branch` sans argument pour lister les branches, celle avec
un petit asterisque devant c'est la branche courante.

Essayons ça avec notre petit dépôt :

```console
$ git branch
* master
$ git checkout -b add-shebang
Basculement sur la nouvelle branche 'add-shebang'
$ vim putain_de_hello_world.rb
$ git status
# Sur la branche add-shebang
# Modifications qui ne seront pas validées :
#   (utilisez "git add <fichier>..." pour mettre à jour ce qui sera validé)
#   (utilisez "git checkout -- <fichier>..." pour annuler les modifications dans la copie de travail)
#
#	modifié : putain_de_hello_world.rb
#
aucune modification n'a été ajoutée au commit (utilisez "git add" ou "git commit -a")
$ git add putain_de_hello_world.rb
$ git commit
[add-shebang 5d48735] Add shebang
 1 file changed, 1 insertion(+)
$ git log --pretty=oneline --decorate
5d48735fcc805d51e2e294df5d9d22d481250789 (HEAD, add-shebang) Add shebang
8120de7b7139e46b9cbc1c3ee89a02962dbc198e (master) Premier commit
```

Comme vous le voyez grâce à l'option `--decorate--` de `git log`, on a bien
notre branche qui pointe sur le dernier commit fait, alors que la branche de
base fournie par Git, `master`, reste au commit précédent.

Dernière étape avant la fin de cette article : le redouté et redoutable
`merge` !

Pour fusionner nos deux branches, on va utiliser cette commande en se plaçant sur
la branche dans laquelle on va fusionner et en passant en argument la branche à
fusionner.

Si vous avez bien suivi, on va donc faire les choses suivantes :

```console
$ git checkout master
Basculement sur la branche 'master'
$ git merge add-shebang
Updating 8120de7..5d48735
Fast-forward
 putain_de_hello_world.rb | 1 +
 1 file changed, 1 insertion(+)
```

Vous remarquez que Git signale *Fast-forward*. Comme le commit pointé par
`add-shebang` est un fils direct de celui de `master`, Git se contente de faire
pointer `master` sur celui-ci, ce qui est beaucoup plus rapide.

Dans le cas où on a eu des modifications sur `master` entre temps, on aurait eu
une vraie fusion des contenus des commits, avec éventuellement une résolution de
conflits, mais on verra ça dans un prochain article !

## La suite

On a vu les bases, et très bientôt on va approfondir le sujet, en voyant
notamment comment collaborer, comment résoudre des conflits ou des problèmes
d'utilisation de Git, tout ça dans la joie et la bonne humeur.

## Références

Si vous voulez en savoir plus sur Git, la [documentation officielle][git:doc] est plutôt
bien foutue.

Si vous aimez les petites références rapides et illustrées, le [Git
Guide][git-guide] de Roger Dudler est une bonne manière d'apprendre.

## Hey ! Tu veux appliquer ça pour contribuer ?

Pas de problème, on a écrit un post exprès :
[Comment contribuer](/posts/comment-contribuer/) !

[git:website]: http://git-scm.com/
[git:doc]: http://git-scm.com/documentation
[git-guide]: http://rogerdudler.github.io/git-guide/
[cpold]: http://roland.entierement.nu/blog/2008/01/22/cpold-la-poudre-verte-du-suivi-de-versions.html
[gitx]: http://gitx.frim.nl/
[gitg]: https://wiki.gnome.org/Apps/Gitg
