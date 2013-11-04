# Contribuez !

Chez Putain de Code, on te laisse l'opportunité d'apporter ta pierre à
l'édifice, comme on te l'explique [sur notre
site](http://putaindecode.fr/a-propos).

Tu trouveras ici un condensé des bonnes pratiques pour pouvoir participer.

## Crée ton fork

C'est l'étape la plus simple, utilise l'interface de GitHub pour ça.

![github-fork](https://f.cloud.github.com/assets/5723/1225077/ed6532e4-275c-11e3-9bd3-191eafa29d60.png)

## Soumettre un post

* Crée une branche avec un nom de la forme `post.<nom du post>` (ex.
  `post.contribuer-a-p`)
* Écris ton post dans `src/_posts/_drafts/` en respectant bien la convention du
  nom de fichier `titre.md` (genre `contribuer-a-p.md`)
* Une fois que tout est prêt, fais une demande de pull-request de ta branche
  vers notre branche `master` en mettant en titre `Post: Le titre de ton post`
  (évidemment tu remplaces ce qu'il y a après `Post:` par le vrai titre hein)
* On va passer ton post en revue, éventuellement te demander de corriger deux
  trois trucs, et au bout d'un moment l'accepter (sauf s'il est nul, évidemment)
* De notre côté on va lui mettre une date de publication et le passer dans
  `src/_posts/` pour le publier

## Apporter un correctif

Si tu remarques qu'il y a une grosse fôte dans un article, ou que certains
points peuvent être plus détaillés, libre à toi de nous proposer tes corrections
!

* Il faut que tu aies un fork comme on a expliqué plus haut
* Crée une branche `fix.<nom du post>` (genre `fix.contribuer-a-p`)
* Fais tes modifications sans nous pourrir l'article
* Fais une Pull-Request comme pour un nouveau post MAIS avec en titre
  `Fix: Le titre du post corrigé` (là aussi, remplace en conséquence)
* De notre côté on va passer en revue la modification, puis éventuellement on
  l'acceptera

## Pull-Requests

N'oublie pas de bien détailler et d'expliquer le contenu de tes Pull-Request,
y'a un champ exprès pour ça autant t'en servir !

Si jamais on trouve qu'une PR n'est pas complète, on va te la tagguer `[WIP]`
jusqu'à ce que tout soit bon, à ce moment là on enlèvera le tag et on mergera
dans notre `master`.
