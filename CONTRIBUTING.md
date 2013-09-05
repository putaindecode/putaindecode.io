# Comment contribuer ?

Chez Putain de Code, on sait qu'on va forcément t'aider, mais on sait aussi qu'on peut faire des erreurs dans les articles ou tout simplement qu'il existe des types encore plus histper qu'_mlb (mettre lien vers son profil). Du coup, on s'attend vraiment à ce que tu apportes ta pierre à l'édifice, ou ta PR au repo comme on dit.

## Github

* Déjà, si tu n'en as pas, crée toi un compte Github, vu que tu commences à lire des ressources sur notre site, crois-moi que ça va t'être utile et que tu vas commencer à le faire chauffer
* Ensuite il faut que tu installes tout le nécessaire pour bosser sur un dépot Github, on va te faire un post qui va regrouper tout ce qu'il te faut : installer Git, configurer Git pour bosser sur Github
* Après, il faut que tu crées ce qu'on appelle un `fork` du repo. C'est tout simplement une copie du repo qui vous appartiendra.
   * Pour ça, clique sur l'icone en haut à droite du repo. (mettre un screenshot / y'a't-il une étape de confirmation ? partie à étayer)
   * Une fois le repo forké, tu dois cloner ce repo sur ton poste de travail (xxx étant ton nom d'utilisateur Github)
   ````
   git clone https://github.com/xxx/website.git putaindecode
   ````
   * Ensuite tu dois ajouter ce qu'on appelle une remote, c'est une référence le dépot principal, le notre. Pour que tu puisses rattraper les modifications qu'on fera par la suite sur le site (on l'appelle communément upstream)
   ````
   cd putaindecode
   git remote add upstream https://github.com/putaindecode/website.git
   git fetch upstream
   ```
* Ajoute ton projet dans ton éditeur favori et prépare toi à faire les modifications que tu souhaites

## Correction de post existant

* Modifier dans src/_posts/nom-du-post.md
* happyplan build
* push
* PR

## Proposition de nouveau post

* happyplan new
* happyplan build
* push
* PR
