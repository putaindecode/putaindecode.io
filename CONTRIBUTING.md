# Contribuez !

Chez _Putain de code !_, on te laisse l'opportunité d'apporter ta pierre à
l'édifice, comme on te l'explique en détails [sur un article dédié sur le
site](http://putaindecode.fr/posts/comment-contribuer/).

Tu trouveras ici les bonnes pratiques minimales pour pouvoir participer.

## Crée ton fork

C'est l'étape la plus simple, utilise l'interface de GitHub pour ça.

![github-fork](src/pages/posts/comment-contribuer/fork-button.jpg)

## Soumettre un post

* Crée une branche avec un nom de la forme `post.<nom du post>` (ex.
  `post.contribuer-a-p`)
* Écris ton post dans `content/posts/` en respectant bien la convention du
  nom de fichier `titre/index.md` (genre `contribuer-a-p/index.md`)
  en t'inspirant des autres posts que tu devrais trouver sans mal.  
  Voici quelques points à respecter:
  - Pour la date choisir le prochain mardi ou jeudi à venir (à voir avec les
  pull requests déjà en cours)
  - Penser à ajouter son fichier d'auteur dans `content/authors/`.
  Utiliser la troisième personne du singulier.
  - Pour les images
    - S'assurer de prendre des images libres de droits (par exemple
    [via une recherche spécifique sur flickr](https://www.flickr.com/search/?license=2%2C3%2C4%2C5%2C6%2C9&tags=delorean&advanced=1))
    - Largeur maximum de 2048 pixels
    - Prendre le soin de toutes les compresser au préalable (sans perte,
  avec logiciel du type [JPEGMini](http://www.jpegmini.com/) ou
  [ImageOptim](https://imageoptim.com/)
    - Indiquer via un lien dans la meta `header.credit` l'URL de l'origine
    - Si tes images rendent difficile la lecture du titre, tu peux spécifier
    un dégradé ([exemple de dégradé sur un header](https://github.com/putaindecode/putaindecode.fr/blob/master/content/posts/entreprendre/auto-entrepreneuriat-retour-experiences/index.md))
    - Tu peux aussi spécifier la clé `header.light` si ton fond est clair
    (cf. exemple ci-dessus)
  - Respecter 80 chars par ligne pour faciliter les diff lors de corrections
  - Pour le choix de l'URL, merci de consulter l'équipe en cas de doute
  (via une issue/proposition ou via le chat)
  - Une fois ton premier commit réalisé, si tu rebuildes le site, tu
  devrais avoir une modification dans le fichier `contributors.json`. N'hésite pas à
  commit via [`--amend`](http://www.git-scm.com/docs/git-commit) sur ton
  précédent commit.
  C'est un mal nécessaire pour afficher correctement les contributeurs lorsque
  le site est généré (l'API GitHub ayant des limites lorsque nous l'utilisons de
  manière non authentifié).
* Une fois que tout est prêt, fais une demande de pull-request de ta branche
  vers notre branche `master` en mettant en titre `Post: Le titre de ton post`
  (évidemment tu remplaces ce qu'il y a après `Post:` par le vrai titre hein)
* On va passer ton post en revue, éventuellement te demander de corriger deux
  trois trucs, et au bout d'un moment l'accepter (sauf s'il est nul, évidemment)

## Apporter un correctif

Si tu remarques qu'il y a une grosse *fôte* dans un article, ou que certains
points peuvent être plus détaillés, libre à toi de nous proposer tes corrections
!

* Il faut que tu aies un fork comme on a expliqué plus haut
* Crée une branche `fix.<nom du post>` (genre `fix.contribuer-a-p`)
* Fais tes modifications sans pourrir l'article
* Fais une *Pull Request* comme pour un nouveau post MAIS avec en titre
  `Fix: Le titre du post corrigé` (là aussi, remplace en conséquence)
* De notre côté on va passer en revue la modification, puis éventuellement on
  l'acceptera

**Tu peux aussi faire beaucoup plus simple en utilisant l'interface de
GitHub pour éditer un fichier (qui reproduira les étapes précédentes).**

## Pull-Requests

N'oublie pas de bien détailler et d'expliquer le contenu de tes *Pull Request*,
y'a un champ exprès pour ça, autant t'en servir !

Si jamais on trouve qu'une PR n'est pas complète, on va te la tagguer via un
label jusqu'à ce que tout soit bon. À ce moment là, on enlèvera le tag et on
*mergera* dans notre branche `master` afin que la ou les modifications soient
déployées.
