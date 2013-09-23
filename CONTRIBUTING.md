 Comment contribuer ?

Ici, chez Putain de Code, dans notre building 8 étages vitres teintées avec
masseuses et coke à volonté et à n'importe quelle heure de la journée, on sait
qu'on va forcément t'aider à comprendre pas mal de trucs, mais on sait aussi
qu'on peut faire des fois des erreurs dans les articles (à cause de la coke) ou
tout simplement qu'il existe des types encore plus hipster
qu'[_mlb](http://putaindecode.fr/le-crew/#mlbli) et qui voudront profiter de
notre renomée inter~~nationale~~galactique pour se faire un peu de visibilité
en proposant un post. Du coup, on s'attend vraiment à ce que tu aides à faire
avancer le bouzin, que t'apportes ta pierre à l'édifice quoi (oui on t'apprend
des expressions aussi), ou ta PR au repo comme on dit dans le monde des
développeurs des internets.

## GitHub

* Déjà, si t'en as pas, crée toi un compte GitHub (avant qu'on te caillasse),
  et vu que tu commences à lire des ressources sur notre site, crois-moi que tu
  vas commencer à le faire chauffer plus vite que prévu.

* Ensuite il faut que tu installes tout le nécessaire pour bosser sur un *repo*
  GitHub (oui on va commencer à utiliser des anglicismes dès maintenant donc
  habitues-y toi, *repo* = dépôt de code, comme tu peux le constater, la
  francisation, c'est moche), on va te faire un post qui va regrouper tout ce
  qu'il te faut pour installer et configurer git pour bosser sur GitHub

* Après, il faut que tu crées ce qu'on appelle un *fork* du repo. Un fork c'est
  juste ta propre copie du repo. Bah ouais, tu vas pas directement travailler
  sur notre repo et nous le crader sans qu'on puisse pas bouger l'orteil. Non
  monsieur, sur GitHub on est des gens civilisés et on créé sa propre copie
  dans son coin avant de demande à papa si on a le droit d'apporter les modifs
  sur le repo principal.

* Pour ça, clique sur l'icone en haut à droite du repo, sur le bouton *Fork*.
  GitHub va créer une copie du repo sur ton propre compte GitHub, où tu pourras
  travailler tranquillement.

* Maintenant que t'as enfin notre magnifique repo dans ton compte, tu devrais
  te sentir honoré. Une fois que t'as appelé toute ta famille et les 3
  pèquenauds qui te servent d'amis, tu dois pouvoir y coder dessus sur ton pc.
  On va partir du principe que tu t'appelles Clint. Et que ton nom c'est
  Horris. T'as donc choisi comme pseudo GitHub `clinthorris` (oui t'aurais du
  réfléchir toi aussi). Donc tu te débrouilles pour aller dans un dossier vide
  et tu vas cloner notre repo. Cloner = faire une copie d'un repo distant (sur
  les serveurs de GitHub par exemple) en local (ton vieux pentium2 sous xp dans
  notre cas). Ensuite il faut que tu te rendes dans ce dossier en ligne de
  commande (sous windows tu y vas avec l'invite de commande mais on te prévient
  qu'on va pas être copains longtemps, trouve un os décent putain, sous mac osx
  tu utilises le terminal, et sous linux je pense qu'on a pas à t'expliquer).

    ```
    git clone https://GitHub.com/xxx/website.git putaindecode
    ```

* Ensuite tu dois ajouter ce qu'on appelle une remote. Une remote c'est une
  référence du repo principal, le beau, le grand, le nôtre. En gros, ça va te
  servir que si tu fais une modification ou une contribution sur notre site
  aujourd'hui, et que dans un mois tu veuilles encore en faire, tu pourras
  facilement rattraper tout ce qu'on aura fait entre temps. La remonte en
  rapport avec le repo principal, on l'appelle souvent *upstream*

    ```
    cd putaindecode
    git remote add upstream https://GitHub.com/putaindecode/website.git
    git fetch upstream
    ```

* Alors là, normalement, t'as le dossier propre et frais, pêché du matin. Vu
  que notre site pète la classe, et qu'on l'a fait en utilisant quand même des
  technos ultra cool genre happyplan (un truc fait par
  [_kud](http://putaindecode.fr/le-crew/#_kud) et
  [MoOx](http://putaindecode.fr/le-crew/#MoOx), t'en profiteras pour aller
  jeter un oeil, fais pas ton rat, t'es pas pressé), node, bower, toussa, il va
  falloir que t'installes les dépendances, les requirements, et toute la
  ribambelle de fichiers qui vont bien. Pour faire ça, c'est pas compliqué, tu
  vas lire le Readme.md à la racine du repo. On fait exprès de pas te le dire
  ici parce que c'est un peu une convention pour tous les projets suceptibles
  d'être utilisés en open source, et que ça te fait pas de mal de commencer à
  apprendre à bien bosser.

* Une fois ton site tout installé, t'as plus qu'à aller dans ton dossier grâce
  à la ligne de commande, et à taper `happyplan`, tu verras tout un tas de
  trucs grunt s'exécuter, ne t'inquiètes pas. À la fin du processus, ça devrait
  te lancer le site en local dans ton browser.

* Maintenant que t'as tout, t'as plus qu'à lancer ~~notepad++~ ton éditeur
  favori et te préparer à modifier ou proposer les fichiers que tu veux.

## Correction d'un post existant

Bon ok, on a compris, t'es timide, tu te sens pas encore prêt  à nous écrire un
magnifique post sur ton tout dernier projet, tu préfères juste nous aider à
améliorer notre contenu. Bah on te remercie quand même tu vois, parce qu'on est
des types sympas.

* Alors déjà, on aime pas juste donner une liste d'ordres sans expliquer pour
  que tu puisses comprendre ce que tu fais. Donc notre site, il a été fait
  grâce à happyplan (un générateur de site statique bien pimpé, parce que oui,
  y'a pas que wordpress pour faire un site) qui lui même est basé sur jekyll
  (un générateur de site statique), grunt (un exécuteur de scripts javascript)
  et plein d'autres truc cools. Donc, faudrait que tu jettes un coup d'oeil à
  ces projets, histoire de savoir de quoi on cause, même si on va essayer de
  t'expliquer au mieux.

* Donc, comme on est basé sur jekyll, tous nos posts sont contenus dans
  src/_posts/. Si jamais c'est sur autre chose qu'un post, farfouille un peu et
  tu trouveras, le nom des dossiers est assez explicite et de toute façon les
  urls sur notre site ressemblent bizzaremment (en vrai c'est pas bizzare hein,
  t'avais compris) aux noms des dossiers.

* Donc, une fois le fichier trouvé, tu remarqueras que la syntaxe à
  l'intérieur, c'est pas du HTML. C'est un truc bizzare avec des dièses et des
  étoiles. On appelle ça du *markdown*. On va te laisser aller chercher en
  détail si tu veux connaitre plus en détail. Mais normalement en voyant le
  reste du post autour de toi, tu devrais comprendre assez vite.

* Fais les modifications que tu veux dans le fichier, là on peut pas t'aider,
  c'est à toi de jouer.

* Normalement si t'avais bien lancé le `happyplan`tout à l'heure, y'a un
  processus *watch* qui est lancé et qui détecte que t'as changé un fichier, du
  coup, grâce à un *livereload*, ton navigateur va se refraichir et tu devrais
  pouvoir aller voir en local si tes modifs sont ok.

* Une fois que tout est bon, tu peux passer à l'étape de validation de tes
  modifications (étape commune pour la modification d'un post existant ou la
  proposition d'un nouveau)

## Proposition d'un nouveau post

* `$ happyplan new`
* `$ happyplan build`
* push
* PR
