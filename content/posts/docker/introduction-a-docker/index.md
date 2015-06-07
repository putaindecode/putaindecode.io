---
date: "2015-05-29"
title: Introduction à docker
tags:
  - docker
authors:
  - bloodyowl
---

Avant de vous parler de Docker je vais vous racontez une histoire que tout développeur à vécu au moins une fois.

Il était une fois un jeune développeur qui codais tranquillement sur son ordinateur siglé d'une pomme. Il était pressé car comme tout étudiant qui se respect il devait présenter son travail le lendemain matin. Après des heures de travail l'application était là, et elle fontionnait à merveille ! Le lendemain notre codeur arrive tout fier à la présentation avec son projet sur une clé usb, il le transfère sur l'ordinateur manchot de son pote et la ça ne fonctionne pas !

##Quel est le problème ?

L'application de notre jeune developpeur ne fonctionne pas sur l'ordinateur manchot de son ami à cause d'un problème d'environnement, entre deux systèmes il peut y avoir des différences de version sur les dépendances ou encore des librairies manquantes.

Ici notre problème se limite à 2 systèmes, mais imaginez une équipe de 10 personnes avec des ordinateur sous OS X, Linux ou même Windows, un serveur de test sous Ubuntu 12.04, et un serveur de prod sous CentOS 7. S'assurer que leur application fonctionne bien sur tout ces environnements est un cauchemar !

Mais il existe des solutions et une d'entre elle s'appelle...

#Docker

##C'est quoi Docker ?

Docker est une plateforme qui vas vous permettre d'executer votre code à l'intérieur d'un conteneur indépendament de la machine sur laquelle vous etes ! Un conteneur ressemble à une machine virtuelle sauf qu'il n'embarque pas tout un système d'exploitation avec lui ce qui lui permet de s'executer en quelque seconde et d'être beaucoup plus léger.

Docker peut donc résoudre notre problème d'environnement car quelque soit la machine que nous utiliserons le code s'executera de la même manière.

La plateforme Docker est composé de deux éléments :
- Le démon Docker qui s'éxecute en arrière plan et qui s'occupe de gérer vos conteneurs
- Le client Docker qui vous permet d'intéragir avec le démon par l'intermédiaire d'un outil en ligne de commande

Si vous voulez plus d'information sur le fonctionnement interne de Docker je vous redirige vers l'article du site officiel : [Understanding Docker](https://docs.docker.com/introduction/understanding-docker)

##Comment l'installer ?

Le client Docker fonctionne sur tout les systèmes d'exploitations mais par contre le démon Docker utilise des fonctionnalités du noyau Linux afin de gérer les conteneurs donc il ne fonctionne que sur Linux, heureusement la majorité des serveurs utilise Linux, et pour vos ordinateur sous OS X ou même Windows il existe une solution.

Si vous utilisez une machine avec une distribution Linux vous pourrez lancer le démon Docker directement sur cette dernière, par contre avec Windows ou OS X vous devrez lancer le démon dans une machine virtuelle, mais rassurez vous c'est très simple !

Pour le guide d'installation de Docker en fonction de votre système je vous redirige vers le site officiel : [Guide d'installation](https://docs.docker.com/installation/#installation)

##Un premier exemple

Avant de commencer vous allez devoir télécharger une image docker qui servira de base à vos prochain conteneur.

Pour cette exemple on va partir d'une image ubuntu :

```
> docker pull ubuntu:trusty
trusty: Pulling from ubuntu
e9e06b06e14c: Pull complete
a82efea989f9: Pull complete
37bea4ee0c81: Pull complete
07f8e8c5e660: Already exists
ubuntu:trusty: The image you are pulling has been verified. Important: image verification is a tech preview feature and should not be relied on to provide security.
Digest: sha256:014fa1d5b72b4fe0ec2b4642610fbbfdd52f502da8e14e80de07bd1dd774e4ef
Status: Downloaded newer image for ubuntu:trusty
```

Cette commande va télécharger depuis le Docker  Hub l'image de la version 14.04 (trusty) d'ubuntu. Il existe bien d'autres images que vous pourrez trouver [ici](https://registry.hub.docker.com).

Pour voir les images que vous avez téléchargé utilisez cette commande :

```
> docker images
REPOSITORY    TAG       IMAGE ID        CREATED       VIRTUAL SIZE
ubuntu        trusty    07f8e8c5e660    4 weeks ago   188.3 MB
```

Sur ma machine l'image d'ubuntu fais 188.3 MB, je vous avait dis que c'était léger en comparaisont d'une machine virtuelle !

Maintenant nous allons lancer un conteneur et rentrer à l'intérieur :

```
> docker run -it ubuntu:trusty bash
root@2cdceb5ff771:/#
```

Cette commande crée un conteneur à partir de l'image `ubuntu:trusty`, y lance le programme `bash` et y attache votre shell grâce aux options `-it`

Vous pouvez maintenant executer les commandes que vous voullez, elle s'executeront à l'intérieur du conteneur, par exemple :

```
root@2cdceb5ff771:/# apt-get moo
                 (__)
                 (oo)
           /------\/
          / |    ||
         *  /\---/\
            ~~   ~~
..."Have you mooed today?"...
```

Vous pouvez quitter le conteneur en faisant un `Ctrl-d`

Maintenant que vous êtes retourné sur votre machine vous pouvez afficher la liste des conteneurs lancé avec cette commande :

```
> docker ps
CONTAINER ID    IMAGE   COMMAND   CREATED   STATUS    PORTS   NAMES
```

Il n'y a rien ? C'est normal ! En quittant le conteneur ce dernier c'est arreté aussi. Pour l'afficher quand même il suffit d'entrer cette commande :

```
> docker ps -a
CONTAINER ID    IMAGE           COMMAND   CREATED         STATUS                    PORTS   NAMES
2cdceb5ff771    ubuntu:trusty   "bash"    12 minutes ago  Exited (0) 2 minutes ago          loving_newton
```

Et pour supprimer ce conteneur ?

```
> docker rm 2cdc
2cdc
```

Evidement remplacez '2cdc' par l'id de votre conteneur.

Passons maintenant à un deuxième exemple plus concret avec une application web.

##Un deuxième exemple avec Node.js

Pour commencer vous allez récuperer l'image docker officiel de Node.js en faisant :

```
> docker pull node:0.12.4
0.12.4: Pulling from node
7711db4bb553: Pull complete
d1744e6e9471: Pull complete
9332645b03a3: Pull complete
a52a290821b3: Pull complete
3575f1347ce7: Already exists
39bb80489af7: Already exists
df2a0347c9d0: Already exists
7a3871ba15f8: Already exists
a2703ed272d7: Already exists
c9e3effdd23a: Already exists
node:0.12.4: The image you are pulling has been verified. Important: image verification is a tech preview feature and should not be relied on to provide security.
Digest: sha256:81fb0812dd5e81f768773a121c8a6daced36893210c5ed50b504c4abcb04e10c
Status: Downloaded newer image for node:0.12.4
```

Puis créer un fichier `server.js` avec comme contenu ceci :

```
var http = require('http')

var server = http.createServer(function(req, res) {
  res.end('Coucou depuis docker')
});

server.listen(3000)
```

Et maintenant pour lancer notre application à l'intérieur d'un conteneur vous devez faire :

```
> docker run -d --name node-app -p 3000:3000 -v $(pwd):/app node:0.12.4 node /app/server.js
e9ca3cd8f90b8554ca99ec8ba15a039f827005bd8fecbf80d72ce7267006a6df
```

Si vous vous rendez sur `localhost:3000` (Ou l'ip de la VM si êtes sur Windows ou Mac) vous verrez : 'Coucou depuis docker'

C'est beau mais comment ça marche ? Voyons les options une par une :

- `-d` : Cette option permet de lancer le conteneur en mode démon et donc de tourner en tache de fond à la différence de `-it` qui lancait le conteneur au premier plan et nous donnait un accès direct au conteneur.
- `--name node-app` : Cette option permet simplement de nommer notre conteneur, ce qui peut servir pour le stop et le relancer plus simplement. (Et à d'autre chose plus complexe dont je parlerais dans un prochain article)
- `-p 3000:3000` : Cette option permet de partager le port de votre machine avec le port du conteneur. Le premier nombre est le port de votre machine et le deuxième le port dans le conteneur.
- `-v $(pwd):/app` : Cette option permet de partager un dossier avec votre conteneur, ici nous partageons le dossier courant (où ce trouve notre fichier `server.js`) avec le dossier `/app` dans le conteneur. (Attention si vous êtes sur Mac ou Windows uniquement votre 'home' est partagé).
- `node:0.12.4` : L'image docker que vous voullez utiliser.
- `node /app/server.js` : La commande à executer dans le conteneur.

Et maintenant ? Vous pouver afficher le conteneur en faisant : `docker ps`, le stopper avec : `docker stop node-app` et le supprimer avec `docker rm node-app`.

-----

Voici la fin de ce premier article sur Docker, pour le prochaine article nous verrons comment créer notre propre image avec un Dockerfile et comment lié des conteneurs afin de créer des applications plus complexe.
