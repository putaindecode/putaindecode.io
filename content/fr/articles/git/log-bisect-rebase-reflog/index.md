---
date: "2014-02-27"
title: "Git, boutez les bugs, domptez votre historique!"
tags:
  - git
authors:
  - Erwyn
---

Vous viendez de lire l'[article de madx](/posts/git/versionner-avec-git/) sur le gestionnaire
de version Git et vous vous dites que vous aimeriez en découvrir plus! Vous l'utilisez déjà mais êtes
en quête de quelques nouvelles (ou pas) astuces à vous mettre sous la dent! Bienvenue!

Si vous désirez vous servir de cet article comme d'un tutoriel il est recommandé d'avoir quelques
bases concernant l'utilisation et le fonctionnement de Git (commits/branches/etc…).

Allez, je ne vous fais pas plus attendre, voici ma liste des fonctionnalités Git dont je ne
saurais plus me passer:


## git lg, l'alias qui vous parle d'Histoire

À l'aide, à l'aide je ne comprends plus rien à l'historique de mon dépôt Git!
J'ai créé un monstre… Pas de panique! J'ai pour vous l'alias qu'il vous faut,
honteusement pompé de [ce site](https://coderwall.com/p/euwpig), mais
comme j'ai pas d'honneur… Pour le mettre en place il suffit d'entrer la commande
suivante dans votre terminal préféré:

```console
$ git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
```

Au cas où vous ne seriez pas à l'aise avec ce genre de choses, sachez simplement que la commande
`git config --global alias.lg` permet d'inscrire à votre configuration générale un nouvel alias (
ici lg). Le reste est ce que doit faire cet alias, à savoir afficher un historique reformaté de votre
dépôt Git.

Allez, je vous met au défi d'oser taper un coup de `git lg` dans votre terminal
maintenant (dans un dépôt Git bien entendu banane). Pour l'exemple, je l'ai réalisé dans le dépôt
de Putain De Code:

<figure>
  ![capture historique](omagad-history.png)
  <figcaption>Le pouvoir de l'arc en ciel</figcaption>
</figure>

Eh oui, sous vos yeux ébahis se dessine maintenant l'historique de votre dépôt!
Tout y est: créations de branches, commits, merges, les miaouOnes… Voilà, vous ne pourrez plus
dire que vous n'y comprenez rien, vous seriez un fieffé menteur.

## git bisect, trouver et punir

S'il y a bien quelque chose d'agaçant dans l'activité de développement, c'est que bien
souvent on est amené à travailler en équipe, et évidemment, il y en a toujours
un pour introduire des Putain De Bugs. Alors c'est parti on sort le débugger pour
l'autre ingrat, on place les `console.log` et autres `var_dump()` pour trouver d'où
peut bien venir ce fichu problème, et on se coule un café parce qu'entre nous, ça peut
prendre du temps.

Heureusement pour nous, là aussi Git est au rendez-vous avec sa fonctionnalité de *bisecting*. Je vous vois déjà en
train de baver devant votre écran, mais non, Git ne va pas corriger vos bugs bien évidemment, il va vous aider
à trouver le changement dans le code qui l'a fait apparaître et ceci grâce à la commande `git bisect`.

Pour lancer une *bisection* par Git il suffit d'entrer `git bisect start` dans votre terminal préféré
et le tour est joué!

```console
$ git bisect start
$
```
<figure>
    <figcaption> Capitaine, regardez il n'y a rien </figcaption>
</figure>

Oui bon d'accord, il va falloir s'investir un peu plus pour parvenir à nos fins. Pour l'instant Git est
passé en mode *bisection*, maintenant il a besoin d'informations pour s'exécuter:

*   Un commit où le bug est présent
*   Un commit où le bug est absent

Imaginons que le commit sur lequel nous sommes comporte le bug, nous allons donc le signaler à Git avec
`git bisect bad`. Nous allons ensuite nous déplacer sur un commit plus ancien qui ne comporte pas le bug et
le signaler à son tour: `git bisect good`.

Git va alors se mettre en route et vous déplacer automatiquement de commit en commit. Pour chacun d'eux vous n'aurez
qu'à le déclarer bon ou mauvais comme expliqué au dessus, jusqu'à ce que Git vous fournisse le premier commit
comportant le bug, celui dont le changement a révélé le disfonctionnement.

```console
$ git bisect bad
1082351d9157e98aed1bbee8b9ad6deedca1288f is the first bad commit
commit 1082351d9157e98aed1bbee8b9ad6deedca1288f
Author: Maxime Thirouin <m@***.io>
Date:   Fri Jan 17 08:19:46 2014 +0100

    ¯\_(ツ)_/¯ Fix shit bring in 34a44c98048f2b74fc2dd20f0be807c1e23e8b58

:040000 040000 7a5d5010f0aaa052ffdc0747b182dc6178a346db d3562872efd1b9d662a89825a3070d64f860cc34 M  src
```
<figure>
    <figcaption>1, 2, 3, Soleil!</figcaption>
</figure>

Et voilà, le tour est joué, en plus Git vous a positionné sur ce commit, il ne manque plus qu'un petit coup de
`git show` et vous savez tout. Pour revenir à votre travail, un simple `git bisect reset` fera l'affaire!
Il ne vous reste plus qu'à punir la personne fautive, mais pour ça je vous laisse avec votre imagination,
je suis sûr que vous trouverez.

Pour les fanatiques de l'efficacité et de l'automatisation, sachez que Git en a encore dans le ventre. Si vous
connaissez déjà un bon et un mauvais commit, vous pouvez tout simplement lancer la *bissection* à grand coup de
`git bisect start MAUVAIS_COMMIT BON_COMMIT` et si, cerise sur le gâteau, vous êtes en possession d'une suite de tests
unitaires (oui non je sais faut pas déconner), `git bisect run <votre_script>` vous permettra de la lancer et la
recherche du premier commit défectueux se fera alors toute seule!


## git rebase, du pur story-telling

Je ne sais pas s'il vous est déjà arrivé de naviguer dans les dépôts Git de projets libres, mais souvent on y trouve que très
peu de commits poubelles, ces commits avec comme message "step" ou autre "stuff". Chaque commit correspond à une fonctionnalité,
un bug fix, une unité logique cohérente. Je ne sais pas pour vous, mais personnellement un *git log* ne ressemble pas à
ça chez moi!

```
commit e739e7c0248b841b0250eb85d99a1b4ba149149d
Author: Martin GOYOT (Erwyn/Martinus) <martin@***.com>
Date:   Tue Feb 18 21:39:50 2014 +0100

    Now my new functionality finally works

commit 551b243525d826afcfece3e2c4c471ebd1e91779
Author: Martin GOYOT (Erwyn/Martinus) <martin@***.com>
Date:   Tue Feb 18 21:39:23 2014 +0100

    misc

commit 9db49a39fdb05a54adcfc2b46832818ef05b9c72
Author: Martin GOYOT (Erwyn/Martinus) <martin@***.com>
Date:   Tue Feb 18 21:38:43 2014 +0100

    stuff

commit ca4ff952310d6246216e83f49309b32b2d2fa010
Author: Martin GOYOT (Erwyn/Martinus) <martin@***.com>
Date:   Tue Feb 18 21:38:35 2014 +0100

    first commit

```
<figure>
    <figcaption>best git log, ever</figcaption>
</figure>

Bien que l'on essaye de nous faire croire que les logiciels libres sont codés par des rockstars, ce qui permet de justifier le
mythe du *1 commit = 1 fonctionnalité*, vous n'êtes pas dupes; l'historique Git de ces dépôts est bel et bien retravaillé, et ceci dans
le but de maintenir sa cohérence et de permettre à tous les contributeurs de le comprendre. Si cela s'applique particulièrement
dans le cadre des logiciels libres, il n'en est pas moins satisfaisant d'avoir également un historique clair sur ses propres dépôts.

Pour cela, l'arme de choix s'appelle `git rebase`. Cette fonctionnalité permet de réécrire l'historique de vos dépôts, de
réorganiser les commits, d'en supprimer, de changer leur message associé etc… La fonctionnalité est assez simple à utiliser, nous allons
prendre exemple sur l'historique présenté ci-dessus: je voudrais supprimer le commit dont le message est 'stuff' parce que finalement il
s'avère inutile. Je veux également fusionner le commit 'misc' avec le commit 'Now my new functionality finally works' et renommer ce dernier
pour qu'il soit plus explicite et fasse référence à ma User Story correspondante dans mon outil de tracking préféré.

Pour commencer, il faut dire jusqu'à quel commit on souhaite effectuer cette réécriture; pour cela, dans mon cas, deux solutions:

*   Faire référence à partir de HEAD (l'étiquette courante), ici: HEAD~3 (je veux réécrire jusqu'au commit avant 'stuff')
*   Fournir le SHA1 du commit avant 'stuff' (ici 2645b1cdbdd72bea6c392c011320556997327761)

Je vais utiliser la première méthode (le choix n'influe en rien sur la suite), et donc lancer la réécriture en invoquant la commande: `git rebase -i HEAD~3`
( -i voulant dire de lancer un *rebase* en mode intéractif). Voici ce qui m'est alors présenté:

```
pick 9db49a3 stuff
pick 551b243 misc
pick e739e7c Now my new functionality finally works

# Rebase ca4ff95..e739e7c onto ca4ff95
#
# Commands:
#  p, pick = use commit
#  r, reword = use commit, but edit the commit message
#  e, edit = use commit, but stop for amending
#  s, squash = use commit, but meld into previous commit
#  f, fixup = like "squash", but discard this commit's log message
#  x, exec = run command (the rest of the line) using shell
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
# Note that empty commits are commented out
```

Git m'affiche tous les commits concernés par l'opération (en ordre inverse), devant chacun d'eux, la mention *pick*, et une légende en bas.
*pick*, comme l'indique la légende, signifie que ce commit sera conservé, mais je peux remplacer cette mention par les suivantes:

*   reword : modifier le message de commit.
*   edit : utiliser le commit mais me laisser le modifier avec un `git commit --amend` qui permet de commiter l'état courant de la copie de travail en
l'incorporant au commit précédent.
*   squash : utiliser le commit en le fusionnant avec le commit précédent.
*   fixup : utiliser le commit en le fusionnant avec le commit précédent et ne pas utiliser son message associé.
*   exec : exécuter une commande sur ce commit.

En plus de ces différentes mentions, je peux également effectuer deux autres actions:

*   déplacer un commit, ce qui aura pour effet final de le déplacer dans l'historique.
*   supprimer un commit, ce qui aura comme résultat de le faire disparaître de l'historique.

Pour ma part, je vais:

*   supprimer la première ligne parce que j'ai décidé que le commit 'stuff' ne me servait à rien.
*   mettre la mention reword devant le commit 'misc', car je vais fusionner le dernier commit avec celui-ci et mettre un nouveau message.
*   mettre la mention fixup devant le commit 'Now my new functionality finally works' car je vais le fusionner au précédent et abandonner son message.

Ce qui nous donne le résultat suivant:

```
reword 551b243 misc
fixup e739e7c Now my new functionality finally works

# Rebase ca4ff95..e739e7c onto ca4ff95
#
# Commands:
#  p, pick = use commit
#  r, reword = use commit, but edit the commit message
#  e, edit = use commit, but stop for amending
#  s, squash = use commit, but meld into previous commit
#  f, fixup = like "squash", but discard this commit's log message
#  x, exec = run command (the rest of the line) using shell
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
# Note that empty commits are commented out
```
<figure>
    <figcaption>Attention chérie, ça va trancher</figcaption>
</figure>

Il n'y a plus qu'à sauvegarder et quitter (:x dans vim) pour que la machine se mette en route. Si certaines actions que vous avez effectuées, notamment
le déplacement de commits, provoquent des conflits, Git va vous demander de les résoudre au fur et à mesure; il suffit pour cela d'éditer vos fichiers, puis
de les marquer comme résolus au moyen de la commande `git add <lefichier>` avant de reprendre avec la commande `git rebase --continue`. Comme convenu,
Git vous demande d'éditer le message du commit marqué en *reword*:

```
Story #34 - Poker cards now have a real back picture

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
# HEAD detached at ca4ff95
# You are currently rebasing branch 'master' on 'ca4ff95'.
#   (all conflicts fixed: run "git rebase --continue")
#
# Changes to be committed:
#   (use "git reset HEAD <file>..." to unstage)
#
# modified:   README.txt
#
```
<figure>
    <figcaption>Un commit qu'il est mieux pour le relire</figcaption>
</figure>

L'opération va continuer puis Git va vous rendre la main. Il vous suffit alors de faire un `git log` pour apprécier le résultat:

```
commit 481b4dccf4fedf4ed9d7f4e83ae5c19a07f7e12e
Author: Martin GOYOT (Erwyn/Martinus) <martin@***.com>
Date:   Tue Feb 18 21:39:23 2014 +0100

    Story #34 - Poker cards now have a real back picture
```
<figure>
    <figcaption>Et c'est le succèèèèèèès</figcaption>
</figure>

Vous n'avez plus qu'un seul commit tout beau tout propre! Vous pouvez maintenant le pousser sur votre dépôt et vous vanter d'avoir un bel historique, parce
que vous aussi, vous êtes une rockstar :).

Pour ceux qui désirent aller encore plus loin dans l'automatisation de ce processus de rebase, je vous conseille d'aller jeter un œil à l'utilisation
de l'option [--autosquash](http://madx.me/articles/git_rebase_autosquash.html).


## git reflog, la commande de celui qui a fait n'importe quoi

Voici venu le temps ~~des rires et des chants~~ de la denière commande que je souhaitais vous présenter, j'ai nommé `git reflog`. Cette commande
c'est votre *joker*, elle assure votre survie, notamment si vous avez été assez zinzins pour suivre les exemples donnés dans cet article, parce
que honnêtement…

<figure>
    ![I have no idea what I'm doing](http://i1.kym-cdn.com/photos/images/newsfeed/000/305/224/3e1.jpg)
</figure>

Vous ne le savez peut être pas, mais Git, dans sa grande bonté, garde une référence de toutes vos actions, de tous les endroits où vous vous êtes déplacez.
Ce registre, c'est le *references log*, et en plus on peut y accéder simplement grâce à la commande `git reflog` (sans déconner). Faisons un petit tour
dans le miens:

```
481b4dc HEAD@{0}: rebase -i (finish): returning to refs/heads/master
481b4dc HEAD@{1}: rebase -i (fixup): Story #34 - Poker cards now have a real back picture
8fd5835 HEAD@{2}: rebase -i (continue): Story #34 - Poker cards now have a real back picture
ca4ff95 HEAD@{3}: checkout: moving from master to ca4ff952310d6246216e83f49309b32b2d2fa010
e739e7c HEAD@{4}: rebase -i (finish): returning to refs/heads/master
e739e7c HEAD@{5}: checkout: moving from master to e739e7c
e739e7c HEAD@{6}: rebase -i (finish): returning to refs/heads/master
e739e7c HEAD@{7}: checkout: moving from master to e739e7c
e739e7c HEAD@{8}: rebase -i (finish): returning to refs/heads/master
e739e7c HEAD@{9}: checkout: moving from master to e739e7c
e739e7c HEAD@{10}: rebase -i (finish): returning to refs/heads/master
e739e7c HEAD@{11}: checkout: moving from master to e739e7c
e739e7c HEAD@{12}: commit: Now my new functionality finally works
551b243 HEAD@{13}: commit: misc
9db49a3 HEAD@{14}: commit (amend): stuff
af7fc36 HEAD@{15}: commit: misc
ca4ff95 HEAD@{16}: commit (initial): first commit
```
<figure>
    <figcaption>Il est beau mon reflog, il est frais</figcaption>
</figure>

On voit ici l'ensemble de mes opérations apparaître comme le *rebase* effectué précédemment (bon d'accord il apparaît plusieurs fois parce que j'ai
fait quelques tests avant d'écrire cette partie de l'article). Chaque opération possède un SHA1 qui est en fait une référence vers le commit concerné, dans l'état
dans lequel il était au moment de l'opération. Bien, imaginons que j'ai fait n'importe quoi avec le rebase et que je veuille retrouver mon état précédent, et bien
il me suffira ici de faire un `git checkout e739e7c` (dans votre cas la ligne sera probablement plus simple à trouver). Et là si je refais un `git log`, miracle:

```
commit e739e7c0248b841b0250eb85d99a1b4ba149149d
Author: Martin GOYOT (Erwyn/Martinus) <martin@***.com>
Date:   Tue Feb 18 21:39:50 2014 +0100

    Now my new functionality finally works

commit 551b243525d826afcfece3e2c4c471ebd1e91779
Author: Martin GOYOT (Erwyn/Martinus) <martin@***.com>
Date:   Tue Feb 18 21:39:23 2014 +0100

    misc

commit 9db49a39fdb05a54adcfc2b46832818ef05b9c72
Author: Martin GOYOT (Erwyn/Martinus) <martin@***.com>
Date:   Tue Feb 18 21:38:43 2014 +0100

    stuff

commit ca4ff952310d6246216e83f49309b32b2d2fa010
Author: Martin GOYOT (Erwyn/Martinus) <martin@***.com>
Date:   Tue Feb 18 21:38:35 2014 +0100

    first commit
```

Vous voilà retombés sur vos pieds! Vous n'avez plus qu'à reconnecter votre branche à ce commit si jamais vous en aviez une et vous êtes reparti pour de nouvelles
aventures.

Sachez tout de même que ce *references log* peut être effacé, et il est même conseillé de le faire régulièrement pour des problématiques de performance de Git sur
votre dépôt; conserver tous ces commits peut devenir coûteux à la longue. La commande `git gc` pour *garbage collector* s'occupera de faire le ménage
pour vous.

Voilà, on arrive au bout de notre aventure, j'espère que vous avez appris quelque chose et que Git vous fait maintenant moins peur.

Amike,
