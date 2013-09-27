---
permalink: /posts/git-reparer-un-push-foireux
---

## Résolution d'un push foireux

### DISCLAIMER

Cette manip n'est pas DU TOUT recommandé pour annuler une modification ancienne, depuis laquelle des branches/commits ont été faits. Préférez `revert` pour ça (un simple `git revert SHA_DU_COMMIT` suffit)

Ici il n'y a pas eu de commit sur `master` depuis, et tout le monde dort, donc je peux y aller comme un bourrin.

### État du dépôt

![État du dépôt](http://drop.madx.me/93f2yp0n7crl7dbulg869k27gm6ydqv.png)

### Objectifs

1. Créer une branche origin/post.vagrant placée sur "[Post] Vagrant, enlarge your VM" (`a1e379d8e3625f62010db8c3b5930f4f703cd9dd`)
2. Remettre `master` à l'état "Add logo into README" (`85da8017dab38440fcfed3017307e8ca9cf5fe66`)

### Résolution

``` console
# 1. Publication de la branche

# On se place sur le commit du post
$ git checkout a1e379d

# On crée une branche à cet endroit
$ git branch post.vagrant

# On pousse la branche
$ git push origin post.vagrant
Total 0 (delta 0), reused 0 (delta 0)
To git@github.com:putaindecode/website.git
 * [new branch]      post.vagrant -> post.vagrant

# 2. Reset de master

# On se place sur la branche master
$ git checkout master
Lo position précédente de HEAD était  a1e379d... [Post] Vagrant, enlarge your VM
Basculement sur la branche 'master'

# On fait un reset hard au commit voulu
$ git reset --hard 85da801
HEAD is now at 85da801 Add logo into README

# On pousse sur le dépôt distant, avec -f car on écrase l'historique
$ git push -f
Total 0 (delta 0), reused 0 (delta 0)
To git@github.com:putaindecode/website.git
 + e9c848c...85da801 master -> master (forced update)
```

**IMPORTANT** : après avoir fait ça on prévient les utilisateurs qu'on a fait un push forcé et qu'ils doivent faire attention quand il vont récupérer les changements du dépôt. S'ils font un `pull -f` en ayant l'option `pull.rebase` activée, ça ne doit généralement pas poser de problème, mais ils peuvent avoir des modifications non poussées !

### État du dépôt, après

![État du dépôt après](http://drop.madx.me/k1zritao83g6lvg4jmmb4ifkve79ewx.png)
