---
date: "2015-07-02"
title: Les Dockerfiles
tags:
  - docker
authors:
  - Uhsac
header:
  credit: https://www.flickr.com/photos/tristantaussac/15145365916/
---

Dans [l'article précédent](/posts/docker/introduction-a-docker), je vous ai
présenté le fonctionnement de base de Docker. Mais cela vous limitait à
l'usage des images que vous pouviez trouver sur le [Docker
Hub](https://registry.hub.docker.com/). Afin de vraiment pouvoir utiliser
Docker au maximum, il serait appréciable de pouvoir créer des images adaptées à
nos projets et c'est là l'utilité des Dockerfiles.

# Les Dockerfiles

Les Dockerfiles sont des fichiers qui permettent de construire une image Docker
adaptée à nos besoins, étape par étape. Rentrons dans le vif du sujet en créant
une image permettant de lancer un projet JavaScript.

Pour commencer, créez un nouveau fichier `Dockerfile` à la racine de votre
projet.

La première chose à faire dans un Dockerfile est de définir de quelle image
vous héritez. Pour cet exemple, je vous propose d'utiliser une image de Debian
comme base (ce qui est une bonne pratique, car cette image
est plutôt légère en comparaison avec celle d'Ubuntu par exemple).

```
FROM debian:jessie
```

`FROM` permet de définir notre image de base, vous pouvez l'utiliser uniquement
une fois dans un Dockerfile.

Comme nous voulons créer une image pour une application JavaScript full-stack,
nous devons commencer par installer Node.js. Pour ce faire, on va télécharger
l'archive Node.js directement depuis le site officiel à l'aide de curl que nous
allons aussi devoir installer.

```
RUN apt-get update \
&& apt-get install -y curl \
&& rm -rf /var/lib/apt/lists/*

RUN curl -LO "https://nodejs.org/dist/v0.12.5/node-v0.12.5-linux-x64.tar.gz" \
&& tar -xzf node-v0.12.5-linux-x64.tar.gz -C /usr/local --strip-components=1 \
&& rm node-v0.12.5-linux-x64.tar.gz
```

`RUN` permet d'exécuter une commande à l'intérieur de votre image comme si vous
étiez devant un shell unix. 

La première commande nous permet d'installer curl et de nettoyer ensuite le
gestionnaire de paquets afin que notre image soit un peu plus légère.

Avec la deuxième commande, nous téléchargeons le binaire de Node.js que nous
installons ensuite à ça place, et on n'oublie pas de supprimer l'archive
ensuite.

Vous pouvez vous demander pourquoi j'exécute plusieurs commandes sur une même
instruction `RUN` ? Eh bien, cela permet simplement de limiter le nombre
d'instructions dans votre Dockerfile ce qui rendra votre image finale plus
légère.

Maintenant, nous allons ajouter les sources de notre projet dans l'image et
télécharger nos dépendances.

```
ADD package.json /app/

WORKDIR /app

RUN npm install

ADD . /app/
```

`ADD` permet d'ajouter des fichiers locaux ou distants à l'intérieur de votre
image, il est le plus souvent utilisé pour importer les sources de votre projet
ou des fichiers de configuration.

`WORKDIR` permet de changer le répertoire courant de votre image, toutes les
commandes qui suivront seront exécutées à partir de ce répertoire.

Avec la dernière instruction, nous ajoutons les sources de notre projet à
l'intérieur de l'image, mais vous allez vous demander pourquoi nous ne l'avons
pas fait en même temps que l'ajout des fichiers de dépendances. Eh bien, cela
nous permet d'économiser beaucoup de temps ! 

Quand Docker crée une nouvelle image à partir d'un Dockerfile, il exécute chaque
instruction dans un conteneur, et le résultat de cette instruction est
sauvegardé sous forme de couche. Au final, une image est un assemblage de
plusieurs couches (une par instruction). Et donc, quand vous reconstruisez une
image pour la seconde fois, les instructions qui n'impliquent pas de changements
ne sont pas réexécutées, car la couche est récupérée depuis l'image précédente. Par
contre, si l'instruction implique un changement quelconque, elle est réexécutée
ainsi que toutes les instructions suivantes.

Dans notre cas, les sources auront tendance à beaucoup changer, et donc ne pas
retélécharger les dépendances à chaque changement dans le code est un réel gain
de temps !

Maintenant, nous allons indiquer quel port et dossier nous souhaitons partager
avec l'extérieur du conteneur.

```
EXPOSE 3000

VOLUME /app/log
```
`EXPOSE` et `VOLUME` permettent respectivement d'indiquer quel port et quel
dossier nous souhaitons partager.

Et pour finir, nous pouvons indiquer quelle instruction doit s'exécuter au
lancement de votre conteneur grâce à l'instruction `CMD`.

```
CMD node server.js 
```

Voici un résumé de notre Dockerfile :

```
# Image de base
FROM debian:jessie

# Installation de curl avec apt-get
RUN apt-get update \
&& apt-get install -y curl \
&& rm -rf /var/lib/apt/lists/*

# Installation de Node.js à partir du site officiel
RUN curl -LO "https://nodejs.org/dist/v0.12.5/node-v0.12.5-linux-x64.tar.gz" \
&& tar -xzf node-v0.12.5-linux-x64.tar.gz -C /usr/local --strip-components=1 \
&& rm node-v0.12.5-linux-x64.tar.gz

# Ajout du fichier de dépendances package.json 
ADD package.json /app/

# Changement du repertoire courant
WORKDIR /app

# Installation des dépendances
RUN npm install

# Ajout des sources
ADD . /app/

# On expose le port 3000
EXPOSE 3000

# On partage un dossier de log
VOLUME /app/log

# On lance le serveur quand on démarre le conteneur
CMD node server.js
```

Avant de transformer ce Dockerfile en une image, vous devez créer un fichier de
plus, le `.dockerignore`, ce fichier permet comme un `.gitignore` de ne pas
inclure certain fichiers dans votre image Docker, et c'est très important afin
d'éviter d'inclure les dépendances de votre projet dans votre image
(`node_modules` dans notre cas) qui sont propres à votre
système, mais pas au système du conteneur. Voici à quoi votre `.dockerignore`
doit ressembler :

```
node_modules
.git
```

Pour transformer ce Dockerfile en une image Docker, vous devez utiliser cette
commande :

```console
$ docker build -t fullstack-js .
Sending build context to Docker daemon 4.381 MB
Sending build context to Docker daemon
Step 0 : FROM debian:jessie
 ---> bf84c1d84a8f
Step 1 : RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
 ---> Running in 93258459a279
...
 ---> 4fffcf3749a2
Removing intermediate container 93258459a279
Step 2 : RUN curl -LO "https://nodejs.org/dist/v0.12.5/node-v0.12.5-linux-x64.tar.gz" && tar -xzf node-v0.12.5-linux-x64.tar.gz -C /usr/local --strip-components=1 && rm node-v0.12.5-linux-x64.tar.gz
 ---> Running in a3a17d584bae
...
 ---> 4eaa62ace8de
Removing intermediate container a3a17d584bae
Step 3 : ADD *.json /app/
 ---> 1e8ffd7e10a8
Removing intermediate container 5db20e8b8ed2
Step 4 : WORKDIR /app
 ---> Running in 7b84b06642b1
 ---> 9c0e2287c34d
Removing intermediate container 7b84b06642b1
Step 5 : RUN npm install
 ---> Running in 0523df6e9aac
...
 ---> 6d7327ebee30
Removing intermediate container 0523df6e9aac
Step 6 : ADD . /app
 ---> 13bdbe70c6fa
Removing intermediate container 3c83d82c1d53
Step 7 : EXPOSE 3000
 ---> Running in 51e252173b12
 ---> 6c62eb1197e2
Removing intermediate container 51e252173b12
Step 8 : VOLUME /app/log
 ---> Running in 4af0bb73307b
 ---> 15b6190de473
Removing intermediate container 4af0bb73307b
Step 9 : CMD node server.js
 ---> Running in 9522c6b9bf95
 ---> aaf20fb25dac
Removing intermediate container 9522c6b9bf95
Successfully built aaf20fb25dac
```

L'option `-t` permet de nommer votre image docker, ce qui vous servira lorsque
vous voudrez lancer votre conteneur. Et le `.` est le repertoire où se trouve
le Dockerfile, dans notre cas le dossier courant.

Maintenant, vous pouvez lancer votre conteneur de cette manière :

```console
$ docker run -d -p 3000:3000 -v $(pwd)/log:/app/log fullstack-js
```

Cette commande permet de lancer notre image en partageant le port et un dossier
avec votre ordinateur, si vous voulez plus de détails sur le fonctionnement du
client Docker, je vous invite à lire mon [article
précédent](/posts/docker/introduction-a-docker).

---

Dans cet article, vous avez pu voir comment créer votre propre Dockerfile,
maintenant vous pouvez créer des images Docker parfaitement adaptées à votre
projet, et même plus. En cherchant sur Internet, vous pourrez trouver des images
Docker pour tout et n'importe quoi, comme des images pour lancer Chrome dans un
conteneur par exemple. Pour en savoir plus, je vous redirige vers le
blog de [Jessie
Frazelle](https://blog.jessfraz.com/post/docker-containers-on-the-desktop/).

Dans le prochain article, je vous parlerai de docker-compose, un outil qui
permet de lancer des applications multi-conteneurs facilement.
