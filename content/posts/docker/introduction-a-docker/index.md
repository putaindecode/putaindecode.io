---
date: "2015-06-11"
title: Introduction à Docker
tags:
  - docker
authors:
  - Uhsac
header:
  credit: https://www.flickr.com/photos/68359921@N08/16097336663/
---

Avant de vous parler de Docker je vais vous raconter une histoire que tout
développeur a vécu au moins une fois.

Il était une fois un jeune développeur qui codait tranquillement sur son
ordinateur. Il était pressé car comme tout étudiant qui se
respecte il devait présenter son travail le lendemain matin. Après des heures de
travail, l'application était là, et elle fonctionnait à merveille ! Le
lendemain, notre codeur arriva tout fier pour sa présentation, avec son projet
sur une clé usb. Il le transfère sur l'ordinateur de son pote et là, ça
ne fonctionne pas !

## Quel est le problème ?

L'application de notre jeune développeur ne fonctionne pas sur l'ordinateur de son ami à cause d'un problème d'environnement. Entre deux systèmes, il
peut y avoir des différences de version sur les dépendances ou encore des
bibliothèques manquantes.

Ici, notre problème se limite à 2 systèmes, mais imaginez une équipe de 10
personnes avec des ordinateurs sous OS X, Linux ou même Windows, un serveur de
test sous Ubuntu 12.04, et un serveur de production sous CentOS 7.
S'assurer que leur application fonctionne bien sur tous ces environnements peut
s'avérer être un vrai cauchemar !

Mais il existe des solutions et parmi l'une d'entre elles nous avons...

## Docker

### C'est quoi Docker ?

Docker est une plateforme qui va vous permettre d'exécuter votre code à
l'intérieur d'un conteneur indépendamment de la machine sur laquelle vous êtes !
Un conteneur ressemble à une machine virtuelle sauf qu'il n'embarque pas tout un
système d'exploitation avec lui ce qui lui permet de s'exécuter en quelque
secondes et d'être beaucoup plus léger.

Docker peut donc résoudre notre problème d'environnement, car quelle que soit la
machine que nous utiliserons, le code s'exécutera de la même manière.

La plateforme Docker est composée de deux éléments :
- Le démon Docker qui s'exécute en arrière-plan et qui s'occupe de gérer vos
conteneurs
- Le client Docker qui vous permet d'interagir avec le démon par l'intermédiaire
d'un outil en ligne de commande

Si vous voulez plus d'informations sur le fonctionnement interne de Docker je
vous redirige vers l'article du site officiel : [Understanding
Docker](https://docs.docker.com/introduction/understanding-docker)

### Comment l'installer ?

Le client Docker fonctionne sur tous les systèmes d'exploitation. En revanche,
le démon Docker utilise des fonctionnalités du noyau Linux afin de gérer
les conteneurs. Il ne fonctionne donc que sur Linux. Heureusement la majorité des
serveurs utilise Linux, et pour vos ordinateurs sous OS X, ou même Windows, il
existe une solution.

Si vous utilisez une machine avec une distribution Linux vous pourrez lancer le
démon Docker directement sur cette dernière, par contre avec Windows ou OS X
vous devrez lancer le démon dans une machine virtuelle, mais rassurez-vous,
c'est très simple !

Pour le guide d'installation de Docker en fonction de votre système je vous
redirige de nouveau vers le site officiel : [Guide
d'installation](https://docs.docker.com/installation/#installation)

### Un premier exemple

Avant de commencer, vous allez devoir télécharger une image Docker qui servira
de base à vos prochains conteneurs.

Pour cet exemple, on va partir d'une image Ubuntu :
```console
$ docker pull ubuntu:trusty
trusty: Pulling from ubuntu
e9e06b06e14c: Pull complete
a82efea989f9: Pull complete
37bea4ee0c81: Pull complete
07f8e8c5e660: Already exists
ubuntu:trusty: The image you are pulling has been verified. Important: image verification is a tech preview feature and should not be relied on to provide security.
Digest: sha256:014fa1d5b72b4fe0ec2b4642610fbbfdd52f502da8e14e80de07bd1dd774e4ef
Status: Downloaded newer image for ubuntu:trusty
```

Cette commande va télécharger depuis le Docker Hub l'image de la version 14.04
(trusty) d'Ubuntu. Il existe bien d'autres images que vous pourrez trouver
[sur le registry Docker](https://registry.hub.docker.com).

Pour voir les images que vous avez téléchargées, utilisez cette commande :

```console
$ docker images
REPOSITORY    TAG       IMAGE ID        CREATED       VIRTUAL SIZE
ubuntu        trusty    07f8e8c5e660    4 weeks ago   188.3 MB
```

Sur ma machine, l'image d'Ubuntu fais 188.3 MB, je vous avais dit que c'était
léger en comparaison à une machine virtuelle !

Maintenant, nous allons lancer un conteneur et rentrer à l'intérieur :

```console
$ docker run -it ubuntu:trusty bash
root@2cdceb5ff771:/#
```

Cette commande crée un conteneur à partir de l'image `ubuntu:trusty`, y lance le
programme `bash` et y attache votre shell grâce aux options `-it`

Vous pouvez maintenant exécuter les commandes que vous voulez, elle
s'exécuteront à l'intérieur du conteneur, par exemple :

```console
root@2cdceb5ff771:/#
$ apt-get moo
                 (__)
                 (oo)
           /------\/
          / |    ||
         *  /\---/\
            ~~   ~~
..."Have you mooed today?"...
```

Vous pouvez quitter le conteneur en faisant un `Ctrl-d`

Maintenant que vous êtes retourné sur votre machine, vous pouvez afficher la
liste des conteneurs lancés avec cette commande :

```console
$ docker ps
CONTAINER ID    IMAGE   COMMAND   CREATED   STATUS    PORTS   NAMES
```

Il n'y a rien ? C'est normal ! En quittant le conteneur ce dernier s'est arrêté
aussi. Pour l'afficher quand même, il suffit d'entrer cette commande :

```console
$ docker ps -a
CONTAINER ID    IMAGE           COMMAND   CREATED         STATUS                    PORTS   NAMES
2cdceb5ff771    ubuntu:trusty   "bash"    12 minutes ago  Exited (0) 2 minutes ago          loving_newton
```

Et pour supprimer ce conteneur ?

```console
$ docker rm 2cdc
2cdc
```

Évidemment, remplacez '2cdc' par le `CONTAINER ID` approprié.

Passons maintenant à un deuxième exemple plus concret avec une application web.

## Un deuxième exemple avec Node.js

Pour commencer, vous allez récupérer l'image docker officiel de Node.js en
faisant :

```console
$ docker pull node:0.12.4
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

Puis créez un fichier `server.js` avec le contenu suivant :

```js
var http = require('http')

var server = http.createServer(function(req, res) {
  res.end('Coucou depuis Docker')
});

server.listen(3000)
```

Et maintenant, pour lancer notre application à l'intérieur d'un conteneur, vous
devez faire :

```console
$ docker run -d --name node-app -p 3000:3000 -v $(pwd):/app node:0.12.4 node /app/server.js
e9ca3cd8f90b8554ca99ec8ba15a039f827005bd8fecbf80d72ce7267006a6df
```

Si vous vous rendez sur `localhost:3000` (ou l'IP de la VM si êtes sur Windows
ou Mac), vous verrez : 'Coucou depuis Docker'

C'est beau, mais comment ça marche ? Examinons les options une par une :

- `-d` : cette option permet de lancer le conteneur en mode démon et donc de
tourner en tâche de fond à la différence de `-it` qui lançait le conteneur au
premier plan et nous donnait un accès direct au conteneur.
- `--name node-app` : cette option permet simplement de nommer notre conteneur,
ce qui peut servir pour l'arrêter et le relancer plus simplement (et à d'autres
choses plus complexes dont je parlerai dans un prochain article).
- `-p 3000:3000` : cette option permet de partager le port de votre machine avec
le port du conteneur. Le premier nombre est le port de votre machine et le
deuxième le port dans le conteneur.
- `-v $(pwd):/app` : cette option permet de partager un dossier avec votre
conteneur, ici, nous partageons le dossier courant (où se trouve notre fichier
`server.js`) avec le dossier `/app` dans le conteneur (attention si vous êtes
sur Mac ou Windows uniquement votre 'home' est partagé).
- `node:0.12.4` : l'image Docker que vous voulez utiliser.
- `node /app/server.js` : la commande à exécuter dans le conteneur.

Et maintenant ? Vous pouvez afficher le conteneur en faisant : `docker ps`, l'arrêter
avec : `docker stop node-app` et le supprimer avec `docker rm node-app`.

-----

Dans cet article, nous avons vu comment récupérer des images Docker depuis le
Docker Hub et comment les instancier afin de créer des conteneurs. Mais pour aller
plus loin, ce serait bien si nous pouvions créer nos propres images, c'est ce que
nous apprendrons à faire à l'aide des Dockerfile dans le prochain article.
