---
layout: post title: Comment contribuer ? tags: ['putaindecode', ' contribuer']
---

# Comment contribuer ?

Ici, chez Putain de Code, dans notre building 8 étages vitres teintées avec
masseuses et coke à volonté et à n'importe quelle heure de la journée, on sait
qu'on va forcément t'aider à comprendre pas mal de trucs, mais on sait aussi
qu'on peut faire des fois des erreurs dans les articles (à cause de la coke)
ou tout simplement qu'il existe des types encore plus hipster
qu'[\_mlb](http://putaindecode.fr/le-crew/#mlbli) et qui voudront profiter de
notre renomée inter~~nationale~~galactique pour se faire un peu de visibilité
en proposant un post. Du coup, on s'attend vraiment à ce que tu aides à faire
avancer le bouzin, que t'apportes ta pierre à l'édifice quoi (oui on t'apprend
des expressions aussi), ou ta PR au repo comme on dit dans le monde des
développeurs des internets.

## GitHub

* Déjà, si t'en as pas, crée toi un compte GitHub (avant qu'on te caillasse),
  et vu que tu commences à lire des ressources sur notre site, crois moi que
  tu vas commencer à le faire chauffer plus vite que prévu.

* Ensuite il faut que tu installes tout le nécessaire pour bosser sur un
  *repo* GitHub (oui on va commencer à utiliser des anglicismes dès maintenant
  donc habitues toi y, *repo* = dépôt de code, comme tu peux le constater, la
  francisation, c'est moche), on va te faire un post qui va regrouper tout ce
  qu'il te faut pour installer et configurer Git pour bosser sur GitHub.

* Après, il faut que tu crées ce qu'on appelle un *fork* du repo. Un fork
  c'est juste ta propre copie du repo. Bah ouais, tu vas pas directement
  travailler sur notre repo et nous le crader sans qu'on puisse pas bouger
  l'orteil. Non monsieur, sur GitHub on est des gens civilisés et on créé sa
  propre copie dans son coin avant de demander à papa si on a le droit
  d'apporter les modifs sur le repo principal.

* Pour ça, clique sur le bouton *Fork* en haut à droite du repo. GitHub va
  créer une copie du repo sur ton propre compte GitHub, où tu pourras
  travailler tranquillement.

* Maintenant que t'as enfin notre magnifique repo dans ton compte, tu devrais
  te sentir honoré. Une fois que t'as appelé toute ta famille et les 3
  pèquenauds qui te servent d'amis, tu dois pouvoir y coder dessus sur ton PC.
  On va partir du principe que tu t'appelles Clint. Et que ton nom c'est
  Horris. T'as donc choisi comme pseudo GitHub `clinthorris` (oui t'aurais du
  réfléchir toi aussi). Donc tu te débrouilles pour aller dans un dossier vide
  et tu vas cloner notre repo. Cloner = faire une copie d'un repo distant (sur
  les serveurs de GitHub par exemple) en local (ton vieux Pentium II sous XP
  dans notre cas). Ensuite il faut que tu te rendes dans ce dossier en ligne
  de commande (sous Windows tu y vas avec l'invite de commande mais on te
  prévient qu'on va pas être copains longtemps, trouve un OS décent putain,
  sous Mac OS X tu utilises le terminal, et sous Linux je pense qu'on a pas à
  t'expliquer).

    ```
    $ git clone https://github.com/clinthorris/website.git putaindecode
    ```

* Ensuite tu dois ajouter ce qu'on appelle une remote. Une remote c'est une
  référence du repo principal, le beau, le grand, le nôtre. En gros, ça va te
  servir que si tu fais une modification ou une contribution sur notre site
  aujourd'hui, et que dans un mois tu veuilles encore en faire, tu pourras
  facilement rattraper tout ce qu'on aura fait entre temps. La remote en
  rapport avec le repo principal, on l'appelle souvent *upstream*

    ```
    $ cd putaindecode $ git remote add upstream
    https://github.com/putaindecode/website.git $ git fetch upstream
    ```

* Alors là, normalement, t'as le dossier propre et frais, pêché du matin. Vu
  que notre site pète la classe, et qu'on l'a fait en utilisant quand même des
  technos ultra cool genre [HappyPlan](https://github.com/happyplan/happyplan)
  (un truc fait par @_kud et @MoOx, t'en profiteras pour aller jeter un oeil,
  fais pas ton rat, t'es pas pressé), node, bower, toussa, il va falloir que
  t'installes les dépendances, les requirements, et toute la ribambelle de
  fichiers qui vont bien. Pour faire ça, c'est pas compliqué, tu vas lire le
  README.md à la racine du repo. On fait exprès de pas te le dire ici parce
  que c'est un peu une convention pour tous les projets susceptibles d'être
  utilisés en Open Source, et que ça te fait pas de mal de commencer à
  apprendre à bien bosser.

* Une fois ton site tout installé, t'as plus qu'à aller dans ton dossier grâce
  à la ligne de commande, et à taper `$ happyplan`, tu verras tout un tas de
  trucs grunt s'exécuter, ne t'inquiètes pas. À la fin du processus, ça
  devrait te lancer le site en local dans le browser. Là j'espère que tu te
  rends compte qu'avec une seule ligne de commande on t'a fait tourner un site
  complet. Et là on te voit déjà en train de baver et te rappeler tes longues
  soirées en train d'installer php, mysql, un wordpress, la bonne version des
  plugins, de la conf à n'en plus finir... ah qu'est-ce que tu pouvais être
  niais. Ca a quand même bien plus la classe notre solution, non ?

* Maintenant que t'as tout, t'as plus qu'à lancer ~~notepad++~ ton éditeur
  favori et te préparer à modifier ou proposer les fichiers que tu veux. Ce
  que t'as à retenir, c'est que tu vas surtout bosser dans le dossier `/src`

## Correction d'un post existant

Bon ok, on a compris, t'es timide, tu te sens pas encore prêt à nous écrire un
magnifique post sur ton tout dernier projet, tu préfères juste nous aider à
améliorer notre contenu. Bah on te remercie quand même tu vois, parce qu'on
est des types sympas.

* Alors déjà, on aime pas juste donner une liste d'ordres sans expliquer pour
  que tu puisses comprendre ce que tu fais. Donc notre site, il a été fait
  grâce à HappyPlan (un générateur de site statique bien pimpé, parce que oui,
  y'a pas que Wordpress pour faire un site) qui lui même est basé sur grunt
  (un esclave qui te permet d'éxécuter des tâches répétitives en JavaScript)
  et plein d'autres truc cools. Donc, faudrait que tu jettes un coup d'œil à
  ces projets, histoire de savoir de quoi on cause, même si on va essayer de
  t'expliquer au mieux.

* Donc, tous nos posts sont contenus dans `src/_posts/`. Si jamais c'est sur
  autre chose qu'un post, farfouille un peu et tu trouveras, le nom des
  dossiers est assez explicite et de toute façon les URLs sur notre site
  ressemblent bizarrement (en vrai c'est pas bizarre hein, t'avais compris)
  aux noms des dossiers.

* Donc, une fois le fichier trouvé, tu remarqueras que la syntaxe à
  l'intérieur, c'est pas du HTML. C'est un truc bizzare avec des dièses et des
  étoiles. On appelle ça du
  [*Markdown*](http://fr.wikipedia.org/wiki/Markdown). On va te laisser aller
  chercher si tu veux connaitre plus en détail. Mais normalement en voyant le
  reste du post autour de toi, tu devrais comprendre assez vite. Tu peux
  toujours faire du HTML, mais franchement, le Markdown a été créé pour ce
  genre de tâches, c'est un bon moment pour l'apprendre.

* Avant de faire les modifications direct dans le fichier, on va te demander
  de faire une branche, c'est une bonne pratique et ça nous permettra de voir
  exactement ce que t'auras modifié, c'est beaucoup plus simple. Du coup tu
  fais simplement un :

  ```
  $ git checkout -b fix.nom-du-post
  ```

* Fais les modifications que tu veux dans le fichier, là on peut pas t'aider,
  c'est à toi de jouer.

* Normalement si t'avais bien lancé le `happyplan` tout à l'heure, y'a un
  processus *watch* (en gros un truc qui surveilles ton projet) qui est lancé
  et qui détecte que t'as changé un fichier, du coup, grâce au watch couplé à
  un processus appelé *livereload* ton navigateur va rafraichir les fichiers
  nécessaires en direct. T'as rien à faire c'est magique. Enfin si tu juste
  retourner dans ton browser ça devrait déjà être à jour.

* Une fois que tout est bon, tu peux passer à l'étape de validation de tes
  modifications (étape commune pour la modification d'un post existant ou la
  proposition d'un nouveau)

## Proposition d'un nouveau post

* Alors pour proposer un nouveau post déjà, il te faut une idée. Et on te
  prévient que si tu nous sort un post sur la liste des plugins jQuery les
  plus en vogue cette semaine, on va te trouver. On va chercher ton ip, on va
  tracer ton adresse, et on va te trouver. Et tu vas comprendre que parmis
  nous, y'a des types qui sont pas du tout copains avec jQuery et qui sont pas
  tendres du tout.

* Il faut aussi que tu fasses attention à ne pas bosser sur le même post que
  quelqu'un d'autre et pour ça tu dois aller jeter un coup d'oeil du côté des
  issues en cours avec le label `post`. Allez, on est sympa, t'as [le
  lien](https://github.com/putaindecode/website/issues?labels=post&page=1&state=open).

* Bref, une fois ton idée trouvée, il faut que tu crées le post pour pouvoir
  commencer à écrire dans le fichier. Tout d'abord tu vas devoir créer une
  nouvelle branche. C'est une pratique qu'on demande à tout le monde, même
  nous en interne on bosse sur des branches. Donc tout d'abord :

  ```
  $ git checkout -b post.titre-court-du-post
  ```

  Ensuite il va falloir que tu crées le fichier nécessaire pour le brouillon
  du post.

  ```
  $ happyplan newpost --name="Nom du post" --tags="tags, separes, virgules"
  ```

  Ca va te créer un fichier dans /src/_posts/_drafts avec le nom qui va bien.
  Si tout se passe bien, tu auras un fichier avec pour nom `annee-mois-date-
  titre.md`

* Tu peux maintenant éditer ton fichier en Markdown, tout en faisant attention
  à ne pas toucher l'entête créé automatiquement (celui où il y a layout,
  title et tags). Amuse toi, créé ton contenu, rédige bien tout comme tu veux.
  Techniquement, dans ce dossier `_drafts` tu peux faire autant de brouillons
  que tu veux.

* Une fois que tu as assez fignolé ton post, tu peux le passer dans le dossier
  `_posts`. Avec la tâche `$ happyplan` lancée, normalement tout se
  rafraichira automatiquement. Si ce n'est pas le cas, lance la tâche `$
  happyplan`.

* Tu pourras ainsi voir sur le site lancé localement ton post, voir s'il sort
  correctement et s'il est présentable à ton goût. Tu pourras le consulter sur
  une URL du type `http://localhost:4242/titre-du-post/`

* Une fois que tout est bon, tu peux passer à l'étape de validation de tes
  modifications (étape commune pour la modification d'un post existant ou la
  proposition d'un nouveau)

## Validation de tes modifications

* Il faut tout d'abord pousser tes modifications sur ton `fork`. Pour ça on va
  d'abord ajouter les fichier que tu as modifié à l'index de fichiers à
  commit. Tu peux faire ça tout simplement avec un :

  ```
  $ git add src/_posts/titre-du-post.md
  ```

  Ensuite on va dire à git de valider ces modifications de code :

  ```
  $ git commit -m "Un petit message sympa expliquant le correctif/post"
  ```

  Et on va finir en disant qu'on veut envoyer tout ça sur ton fork qui est
  situé sur GitHub :

  ```
  $ git push origin master
  ```

* Voila ! Si tu vas voir ton `fork` sur GitHub tu verras ton commit et les
  modifications que tu as apportées normalement. Il ne te reste plus qu'à nous
  soumettre ces modifications. Pour ça on va faire ce qu'on appelle une Pull
  Request (PR)

* Il te suffit de cliquer sur le bouton vert qui représente 2 flêches en sens
  inverse à côté du nom de ta branche en dessous du nombre de commits /
  branches / etc.

* Sélectionnes les bonnes branches et ajoutes nous un beau titre et une belle
  description de Pull Request en essayant au moins de commencer par `Post:
  Titre du post` ou `Fix: Titre du post

* Et voila ! Tu n'as qu'à attendre de nos nouvelles maintenant. D'ailleurs au
  passage, si tu veux, tu peux en profiter pour nous suivre [sur
  twitter](http://twitter.com/putaindecode), et tu pourras nous lacher un
  message avec ta PR ou ton issue en lien, histoire de nous mettre la pression.

