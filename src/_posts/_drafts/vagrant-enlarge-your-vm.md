---
layout: post
title: Vagrant, enlarge your VM
tags: ['virtualbox', ' tools', ' vagrant']
---

# Vagrant, enlarge your VM
Vagrant, au cas ou tu ne connaîtrais pas encore, permet de fournir des
environnements de développements reproductibles, facilement configurables et
qui se partagent entre les membres de l’équipe. En gros tu vas pouvoir décrire
et configurer des machines virtuelles (VM) depuis un seul fichier texte,
le `Vagrantfile`.  Plutôt pratique pour avoir un environnement de dev
équivalent à celui de la prod. Et tout cela avec un processus simplifié
à l'extrême.

# Et c’est pour qui le beau joujou ?
Vagrant s’adresse principalement à toi, mais aussi à un public
de **développeurs** qui souhaitent pouvoir mettre en place rapidement
un environnement de dev avec une machine virtuelle (genre apache-php-*sql)
sans y passer trop de temps.
Vagrant, c’est aussi pour des **devops** qui voudrait tester la mise en
place et le provisionning de leur infra.
Dans la doc, ils disent même que ça s’adresse aux designers
(pour dire si c’est simple) mais faut pas déconner non plus,
on a jamais vu un designer dégainer une console :)

Globalement le workflow vagrant se résume à 2-3 commandes,
  1. `vagrant init` au début du projet
Puis
  2. `vagrant up` pour lancer la VM.
  1. `vagrant halt`pour l’arrêter.

# Etape 1 - vagrant init
Vagrant fournit un support pour les principales plateformes de virtualisation,
appelées Provider dans la langue de Justin Bieber et avec par défaut celui
pour virtualbox.  Et  cerise sur le clafoutis, tu as aussi la possibilité
de configurer / provisionner tes box avec des scripts Chef ou Puppet
(ou juste un script shell si t’es old-school \o/ ).

Bon, je suppose que c’est encore un peu flou, alors voilà comme ça se présente.
Une fois installé ( http://downloads.vagrantup.com/ ), tu devrais avoir
une nouvelle commande de dispo.
Alors dégaine ton terminal et envoie un `vagrant init`. Ça devrait créer
un fichier `Vagrantfile`  qui va décrire ta machine virtuelle
(ne t’inquiète pas, c’est juste écrit en Ruby).
En gros de quelle box de base tu pars, comment tu la configures (réseaux,
dossier partagé entre la VM et le Host, ta machine réelle) et comment tu
l’approvisionnes (via un shell, avec un script Puppet...)

## La config de la box
Ensuite voilà les quelques points à paramétrer.
- `config.vm.box = "base"`pour spécifier le nom d’une box préalablement
téléchargée.
- `config.vm.box_url = "http://domain.com/path/to/above.box"` Tu remplaces
par l’url de la box de tes rêves. Tu peux trouver une liste assez complètes
de box plus ou moins configurées sur le site http://www.vagrantbox.es/
( ProTip™: Choisis bien le provider correspondant à ton gestionnaire de VM)
- `config.vm.network :forwarded_port, guest: 80, host: 8080` Pratique
pour accéder au serveur qui tourne sur la VM. Après tu retrouve un peu
les même options de config réseaux qu’avec virtualbox
(réseaux privés, connexion par pont...)
- `# config.vm.synced_folder "../data", "/vagrant_data"` Avec ça,
tu vas pouvoir ajouter un répertoire qui sera partagé
avec ta machine virtuelle.
Par défaut, Vagrant te permet d’accéder au répertoire courant
depuis `/home/vagrant` dans la VM.

## le provisionning de box
Alors attention, c'est un des trucs cools avec vagrant. Avant, quand tu
voulais te monter une VM pour travailler, il fallait aussi la configurer,
installer les bonnes versions de chaque brique que le projet utilisé. Ça‎
pouvait être long, pénible, et surtout prendre du temps.
Avec Vagrant, tu peux automatiser cette partie, soit en utilisant simplement
un script, soit avec un moyen moderne comme Chef ou Puppet. Et si jamais t'as
besoin d'un truc particulier, une config que tu utilises souvent, tu peux
toujours packager la box que t'as configuré avec amour pour pouvoir la
réutiliser dès que l'occasion se présente. Sinon tu peux déjà trouver pas mal
de box déjà prêtes à l'emploi, avec ou sans support pour puppet, chef...

La suite du fichier contient des exemples de type de provisionning
(Puppet, Chef solo ou Chef server)
Et si jamais tu souhaites lancer un script d’approvisionnement :

```ruby
Vagrant.configure("2") do |config|
  config.vm.provision "shell", path: "provision.sh"
end
```

> Vagrant te permet aussi de créer tes propres box déjà approvisionnées via
la commande vagrant package. C’est assez pratique quand tu dois
télécharger-compiler-installer tout l’internet

# Etape 2 - vagrant up
Bon, la première fois risque de prendre du temps, parce que vagrant
va télécharger ta box, puis lancer l’approvisionnement. Profites en pour faire
un tour sur http://vim-adventures.com/ et jouer un peu en attendant.

Une fois terminé, tu as maintenant une box dispo avec laquelle travailler.

# Etape 3 - Joie \o/.
Je pensais faire une troisième partie sur comment arrêter la VM mais
ça présente pas vraiment d’intérêt car ça tient en une ligne de commande.

Bref, le point important de tout ça, c’est que les autres relous de ton équipe
ne pourront plus dire que pourtant ça marche bien chez eux, et qu’ils
comprennent pas, c’est vraiment étrange... enfin sauf si ils sont
de mauvaise foi :)
- L’intégrateur n’aura plus à se taper 14 installations de trucs en
ligne de commande qu’il ne retient jamais, pour rajouter un bout de css
ou de js.
(ProTip™: là, ça rentre sur un post-it !)
- Le dev backend n’aura plus à pleurer quand on lui demande de remettre le nez
dans une projet vieux de 2 ans avec que des versions de php / ruby ou mysql
dépassées qui vont casser la superbe config qu’il a mis 1 semaine à fignoler
avec les dernières techno à la mode.
- l’admin sys pourra packager les box de chaque projets, approvisionnées
et configurées et pour éviter d’avoir à configurer les postes des autres
dev à chaque changement de projet.

# Quelques commande pratiques
> `vagrant ssh` te permet de te connecter en mode terminal
> `vagrant status` pour les têtes ~~à claques~~ en l’air

# Quelques liens
* [la documentation officielle de ~~viagra~~ vagrant](http://docs.vagrantup.com/v2/)
* [Virtualisation sur OSx et accès à localhost](https://github.com/putaindecode/propositions-de-posts/issues/4)
* [Cuisinez vos serveurs comme un Chef – Première partie](http://jolicode.com/blog/cuisinez-vos-serveurs-comme-un-chef-premiere-partie)
