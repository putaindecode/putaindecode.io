---
title: Garder ses dépôts Git synchronisés sur GitHub, GitLab & Bitbucket
tags:
  - git
  - github
  - gitlab
  - bitbucket
date: 2018-10-23
authors:
  - MoOx
original: https://moox.io/blog/keep-in-sync-git-repos-on-github-gitlab-bitbucket/
---

Partager du code en ligne est plutôt facile ces temps-ci.

Par contre garder synchronisés tous ses dépôts entre différents services, c'est
une autre histoire. Alors oui, vous trouverez des commandes et scripts assez
facilement pour importer/exporter vos dépôts. Idem pour mettre en place des
miroirs en lecture seule. Mais avoir un système transparent pour être à même de
pousser son code sur différentes plateformes, c'est un peu moins facile. Mais bon
c'est pas difficile pour autant.

Souvent on utilise GitHub, qui est la solution la plus répandue à ce jour, mais
en cas de grosse coupure (coucou les DDoS) ou juste car vous n'avez pas envie
d'être trop lié à GitHub (le rachat de GitHub par Microsoft vous rappelle le syndrome Skype ?)
vous aimeriez bien avoir des
miroirs accessibles en écriture.

**Voici donc une petite astuce pour garder vos dépôts synchro entre plusieurs
plateformes** comme GitLab et Bitbucket, où vous pourrez pousser et récupérer du
code sans effort particulier, après un petit coup d'init. Donc pas de miroir en
lecture seule hein. De vrais dépôts. Et ça **juste en utilisant les
fonctionnalités de git (push et pull)**.

_Rappel : pour rester sécurisé, mettez en place SSH et l'authentification à deux
facteurs (2FA) sur les plateformes que vous utilisez (sauf Bitbucket, car ça ne 
marche pas avec leur outil CLI)._

## Git Tooling

Pour rendre le tout facile, on va s'installer quelques outils vite fait.

### Github

On va utiliser [hub](https://github.com/github/hub).

Pour macOS

```console
brew install hub
```

Voir
[les instructions d'installation hub](https://github.com/github/hub#installation)
pour les autres OS.

Il vous faudra un [token GitHub](https://github.com/settings/tokens/new).

Mettez-le dans votre dossier home (~) dans un fichier `.github_token`, et
chargez-le dans votre `.bash/zshrc` comme ça :

```sh
if [[ -f $HOME/.github_token ]]
then
  export GITHUB_TOKEN=$(cat $HOME/.github_token)
fi
```

### GitLab

[GitLab CLI](http://narkoz.github.io/gitlab/cli) est disponible en
[rubygem](https://rubygems.org/) :

```console
gem install gitlab
```

(Vous aurez peut-être besoin de `sudo gem install` si vous utilisez la version
macOS de ruby.)

#### `Please set an endpoint to API`

GitLab nécessite un token ainsi qu'un endpoint (car GitLab peut être déployé
n'importe où).

Pour le token, [récupérez le votre](https://gitlab.com/profile/account) et
faites comme pour GitHub. Voici un example avec l'instance GitLab.com que vous
pouvez placer dans votre `.bash/zshrc`:

```sh
if [[ -f $HOME/.gitlab_token ]]
then
  export GITLAB_API_PRIVATE_TOKEN=$(cat $HOME/.gitlab_token)
fi
export GITLAB_API_ENDPOINT="https://gitlab.com/api/v3"
```

### Bitbucket

Le [CLI Bitbucket](https://bitbucket.org/zhemao/bitbucket-cli) est disponible
via [pip](https://pip.pypa.io/en/stable/) :

```sh
pip install bitbucket-cli
```

(Vous aurez peut-être besoin de `sudo pip install` si vous utilisez la version
macOS de Python.)

BitBucket ne fonctionne pas bien avec un token et la 2FA n'est pas pratique (et
accessoirement
[est impossible à utiliser en ssh](https://bitbucket.org/zhemao/bitbucket-cli/issues/25/create-issue-ssh-not-taken-in)).
Il faudra faire avec login/mot de passe à chaque fois, à moins que
[vous mettiez en clair votre mot de passe dans un fichier](https://bitbucket.org/zhemao/bitbucket-cli#markdown-header-configuration).

---

Maintenant qu'on a les outils, on va créér des dépôts sur chaque plateforme.

## Créér des dépôts sur GitHub, GitLab & Bitbucket en CLI

Les commandes ci-dessous assument que votre nom d'utilisateur est le même sur
chaque service. Si ce n'est pas le cas, pensez à ajuster les commandes.

Nous allons créer/réutiliser un dossier, initialiser un dépôt si ce n'est pas
le cas, et le mettre en ligne sur chaque service.

### Votre dépôt git existe

On va partir du principe que le nom du dossier est le nom du projet.

Ouvrez un terminal et faites :

```console
export GIT_USER_NAME=$USER
export GIT_REPO_NAME=$(basename $(pwd))
```

Ajustez les variables si cela ne correspond pas à ce que nous assumons ici.

### Vous n'avez pas encore de dépôt

```console
export GIT_USER_NAME=$USER
export GIT_REPO_NAME="your-repo"
mkdir $GIT_REPO_NAME && cd $GIT_REPO_NAME
git init
```

### Créer un dépôt sur GitHub en ligne de commande

```console
hub create
```

Cette commande va créer le dépôt et initialiser les remotes.

### Créer un dépôt sur GitLab en ligne de commande

```console
gitlab create_project $GIT_REPO_NAME "{visibility_level: 20}"
```

(Visibilité publique). [Source](http://stackoverflow.com/a/31338095/988941)

Nous ajouterons la remote plus tard, cela fait partie de l'astuce. ;)

### Créer un dépôt sur Bitbucket en ligne de commande

```console
bb create --protocol=ssh --scm=git --public $GIT_REPO_NAME
```

[Source](http://stackoverflow.com/a/12795747/988941)

## Configurer les remotes

En fonction de ce que vous voulez, vous pouvez configurer votre dépôt de
plusieurs manières.

Pour un dépôt principal et des miroirs, vous pouvez commencer par

```console
git remote set-url origin --add https://gitlab.com/${GIT_USER_NAME}/${GIT_REPO_NAME}.git
git remote set-url origin --add https://bitbucket.org/${GIT_USER_NAME}/${GIT_REPO_NAME}.git
```

Vérifiez que les commandes sont bonnes en faisant :

```console
git remote -v
```

Ça devrait vous donner un truc du genre :

```
origin	https://github.com/YOU/YOUR-REPO.git (fetch)
origin	https://github.com/YOU/YOUR-REPO.git (push)
origin	https://gitlab.com/YOU/YOUR-REPO.git (push)
origin	https://bitbucket.org/YOU/YOUR-REPO.git (push)
```

Et maintenant vous pouvez faire `git push` et ça poussera sur tous les dépôts
🙂.

---

⚠️ **Note : pour forcer SSH à la place de HTTPS, petite astuce :**

```console
git config --global url.ssh://git@github.com/.insteadOf https://github.com/
git config --global url.ssh://git@gitlab.com/.insteadOf https://gitlab.com/
git config --global url.ssh://git@bitbucket.org/.insteadOf https://bitbucket.org/
```

### Petit souci, `git pull` ne va prendre que les commits sur la first remote.

Il y a même une incohérence entre `git push --all` (pousser toutes les branches
sur toutes les remotes) et `git pull --all` (récupérer toutes les branches
depuis la première remote).

[Vous trouverez plus d'infos sur comment configurer votre dépôt pour pouvoir push/pull depuis toutes les sources](https://astrofloyd.wordpress.com/2015/05/05/git-pushing-to-and-pulling-from-multiple-remote-locations-remote-url-and-pushurl/).

_en gros : on va ajouter d'autres remotes pour pouvoir pull facilement._

```console
git remote add origin-gitlab https://gitlab.com/${GIT_USER_NAME}/${GIT_REPO_NAME}.git
git remote add origin-bitbucket https://bitbucket.org/${GIT_USER_NAME}/${GIT_REPO_NAME}.git
```

Vérifiez que les commandes sont bonnes en faisant :

```console
git remote -v
```

Cela devrait vous donner un truc du genre :

```
origin	ssh://git@github.com/YOU/YOUR-REPO.git (fetch)
origin	ssh://git@github.com/YOU/YOUR-REPO.git (push)
origin	ssh://git@gitlab.com/YOU/YOUR-REPO.git (push)
origin	ssh://git@bitbucket.org/YOU/YOUR-REPO.git (push)
origin-gitlab	ssh://git@gitlab.com/YOU/YOUR-REPO.git (fetch)
origin-gitlab	ssh://git@gitlab.com/YOU/YOUR-REPO.git (push)
origin-bitbucket	ssh://git@bitbucket.org/YOU/YOUR-REPO.git (fetch)
origin-bitbucket	ssh://git@bitbucket.org/YOU/YOUR-REPO.git (push)
```

Maintenant vous pourrez `git push` pour pousser sur toutes les remotes, puis
faire `git pull --all` pour récupérer de toutes les remotes.

**L'astuce à 2 centimes : faites un alias pour `pull --all`.**

Si vous n'avez qu'une remote sur un projet, ça ne changera rien, mais
ça fonctionnera si vous en avez plus d'une.

Dans votre `.gitconfig` :

```ini
g = pull --all
p = push
```

Et maintenant vous pouvez utiliser `git g` pour pull et `git p` pour push.

### Pull depuis plusieurs remotes avec des commits différents

Un petit edge case peut se révéler problématique : une PR mergée sur GitHub et une
sur GitLab, à peu près en même temps. Vous allez pouvoir récupérer tout ça
facilement (pour peu que vous utilisiez
[`pull --rebase` par défaut](https://github.com/MoOx/setup/blob/60ec182707168e4cf9ffcb2d0351dc0ce2eac7ed/dotfiles/.gitconfig#L30-L31))
mais quand vous allez vouloir pousser, sans force push, ça va avoir du mal.

C'est le seul petit cas problématique. Si vous faites attention quand vous
acceptez des PR/MR, vous ne devriez pas le rencontrer souvent.

#### Note à propos des force push

Si vous rencontrez ce cas et que vous voulez force push pour arranger le tout,
faites attention que votre branche (coucou master) ne soit pas protégée durant
cette manipulation.

###### GitHub

```
https://github.com/${GIT_USER_NAME}/${GIT_REPO_NAME}/settings/branches
```

##### GitLab

```
https://gitlab.com/${GIT_USER_NAME}/${GIT_REPO_NAME}/protected_branches
```

GitLab protège la branche master **par défaut**. Donc si vous ne changez rien, vous
ne pourrez pas force push.

Souvent quand je commence un projet j'ai tendance à faire un petit force push
sur le premier commit, le temps de faire passer la CI par exemple. Ne me jugez
pas. **Vous voilà prévenus**.

## Pour les dépôts GitHub existant

Je n'ai pas trouvé de moyen automatisé d'appliquer cette technique pour tous mes
dêpots d'un coup. Du coup je fais ça petit à petit quand je bosse sur un projet
qui n'est pas encore "redondé". J'utilise cette article en guise de mémo.

Vous pourrez éventuellement être intéressés par ces posts

- https://pypi.python.org/pypi/github2gitlab
- https://github.com/xuhdev/backup-on-the-go

## FAQ

### Gérer les issues et PR/MR

Je n'ai pas de silver-bullet pour ça. Pour l'instant j'utilise un dépôt, souvent
GitHub en principal, et les autres ne sont que des copies sans issues… Mais
bon, en cas de licorne rose (GitHub down), j'ai l'air moins con ! C'est toute l'idée de cette
approche, même si elle est perfectible : ne pas être bloqué par un service.

### Faire un commit depuis l'UI Web

Pas un soucis, faut juste y penser. Et la prochaine fois que vous avez votre CLI
en main, pull + push et tout sera en ordre.

---

## tl;dr

**La première fois** installez quelques dépendances :

```console
brew install hub
gem install gitlab
pip install bitbucket-cli
```

Note : soyez sûrs d'avoir les bons tokens en tant que variable d'environnement ;
voir au début de ce post pour les détails.

(Pensez aussi à configurer un alias git pour `pull --all` si vous voulez pull
toutes les remotes par défaut.)

### Pour chaque dépôt :

1.  exportez votre nom d'utilisateur (j'assume que vous ayez le même sur chaque
    plateforme)

```console
export GIT_USER_NAME=$USER
```

2.  Pour les nouveaux dépôts (si votre dépôt existe déjà sur GitHub, sautez
    cette étape)

```console
export GIT_REPO_NAME=your-repo
mkdir $GIT_REPO_NAME && cd $GIT_REPO_NAME
git init
hub create
```

3.  Pour les dépôts existants sur GitHub

```console
export GIT_REPO_NAME=$(basename $(pwd))
gitlab create_project $GIT_REPO_NAME "{visibility_level: 20}"
bb create --protocol=ssh --scm=git --public $GIT_REPO_NAME
```

Ensuite, on ajoute les remotes

```
git remote set-url origin --add https://gitlab.com/${GIT_USER_NAME}/${GIT_REPO_NAME}.git
git remote set-url origin --add https://bitbucket.org/${GIT_USER_NAME}/${GIT_REPO_NAME}.git
git remote add origin-gitlab https://gitlab.com/${GIT_USER_NAME}/${GIT_REPO_NAME}.git
git remote add origin-bitbucket https://bitbucket.org/${GIT_USER_NAME}/${GIT_REPO_NAME}.git
```

4.  Puis on check que tout va bien

```console
git remote -v
```

Vous devriez avoir un truc du genre

```
origin	ssh://git@github.com/YOU/YOUR-REPO.git (fetch)
origin	ssh://git@github.com/YOU/YOUR-REPO.git (push)
origin	ssh://git@gitlab.com/YOU/YOUR-REPO.git (push)
origin	ssh://git@bitbucket.org/YOU/YOUR-REPO.git (push)
origin-bitbucket	ssh://git@bitbucket.org/YOU/YOUR-REPO.git (push)
origin-bitbucket	ssh://git@bitbucket.org/YOU/YOUR-REPO.git (fetch)
origin-gitlab	ssh://git@gitlab.com/YOU/YOUR-REPO.git (fetch)
origin-gitlab	ssh://git@gitlab.com/YOU/YOUR-REPO.git (push)
```

😇 Maintenant vous n'avez plus qu'à `git push` et `git pull --all` !

## Bonus : badges

Vous pouvez ajouter des petits badges pour exposer la redondance sur la
documentation de votre projet.

```markdown
[![Repo on GitHub](https://img.shields.io/badge/repo-GitHub-3D76C2.svg)](https://github.com/YOU/YOUR-REPO)
[![Repo on GitLab](https://img.shields.io/badge/repo-GitLab-6C488A.svg)](https://gitlab.com/YOU/YOUR-REPO)
[![Repo on Bitbucket](https://img.shields.io/badge/repo-BitBucket-1F5081.svg)](https://bitbucket.org/YOU/YOUR-REPO)
```

**Ajustez `YOU/YOUR-REPO` à votre besoin**.

Ça ressemblera à ça

[![Repo on GitHub](https://img.shields.io/badge/repo-GitHub-3D76C2.svg)](https://github.com/YOU/YOUR-REPO)
[![Repo on GitLab](https://img.shields.io/badge/repo-GitLab-6C488A.svg)](https://gitlab.com/YOU/YOUR-REPO)
[![Repo on Bitbucket](https://img.shields.io/badge/repo-BitBucket-1F5081.svg)](https://bitbucket.org/YOU/YOUR-REPO)

J'ai mis en ligne
[ces instructions résumées sur un dépôt](https://github.com/MoOx/git-init), peut-être
en ferais-je un script, qui sait… 😄. Enfin trois dépôts !

- https://github.com/MoOx/git-init
- https://gitlab.com/MoOx/git-init
- https://bitbucket.org/MoOx/git-init
