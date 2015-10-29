---
date: "2015-03-12"
title: "HATEOAS, le Graal des développeurs d'API"
tags:
  - api
  - rest
authors:
  - awillemant
---

Nous vivons aujourd'hui dans un monde où tout devient service. Twitter, Facebook, Google Drive, GitHub, tout le monde y va de sa petite API pour que nous, geeks, puissions profiter pleinement des moult fonctionnalités offertes par ces plateformes. Qu'entend-on par service ? Comment les rendre disponibles facilement et intelligemment ? On va essayer d'y répondre !

## Les webservices
Rappelons juste, pour mettre tout le monde d'accord, ce qui se passe pendant une simple navigation web.

1. Tu tapes l'adresse de ton site préféré
2. Le navigateur envoie la requête
3. Le navigateur reçoit du code HTML et l'interprète, pour voir s'il faut charger d'autres choses
4. Le navigateur relance les requêtes pour charger les images, scripts et CSS
5. Le navigateur reçoit toutes les ressources et te les affiche dans sa fenêtre.

On parle donc de contenu qu'il faut afficher pour les êtres humains, avec des images, des styles et des comportements qui facilitent l'ergonomie et te permettent de dire *"wouaouw, ce site est vraiment beau, cool et pratique !"*

Imaginons maintenant la même chose, mais à destination des programmes, qui ne consomment que de l'information brute et structurée, on ne va donc plus s'encombrer avec les CSS, les JS, et autres gifs animés (oui, les gifs animés, ça les fait pas marrer les machines...) ! On va se concentrer sur le contenu échangé et sur les moyens utilisés pour optimiser ces échanges.

### La première école : SOAP
Imaginons deux programmes qui veulent discuter en passant par le web. Dans les années 90, des mecs super brillants se sont dit : *"On va se baser sur le XML pour faire communiquer nos programmes sur le web"*.
L'approche est assez logique et ingénieuse. Tout d'abord, les deux parties (le client et le serveur) se partagent une notice d'utilisation : la WSDL (Web Service Description Language), qui est un document XML décrivant toutes les méthodes qui peuvent être appelées par le client sur le serveur, avec les structures de données disponibles pour ces échanges.
Le client prépare donc sa demande et l'enveloppe dans une grosse structure XML contenant toutes les métadonnées (méthode appelée, signature numérique, etc.). Une fois que le serveur a reçu cette demande, il la traite et répond aussi dans une grosse enveloppe XML.

Tu viens de comprendre le SOAP (Service Oriented Application Protocol), aucun rapport avec une quelconque savonnette du coup. Cette méthode a fait ses preuves puisqu'elle fait tourner encore aujourd'hui des milliers de systèmes très complexes et très fiables.

### La maison d'en face : REST
Plusieurs années ont passées et les esprits ont évolué. On a commencé à entendre des grandes déclarations comme : *"Le SOAP c'est vraiment lourdingue !"*, *"Le protocole HTTP est sous-exploité !"* ou encore *"Les enveloppes XML et les WSDL ? Merci bien !"* et c'est à ce moment-là qu'on a donné un acronyme bidon pour décrire le protocole HTTP sans vraiment le nommer : REST (REpresentational State Transfert). Pour l'anecdote, tout le monde s'accorde à dire que cet acronyme ne veut rien dire ;)

Le but du jeu est donc d'utiliser au maximum les possibilités du protocole HTTP, les verbes, les URL et les codes retours pour décrire des API de la manière la plus fidèle possible. On a donc gagné en simplicité et la communication entre machines se veut désormais à la portée de tous. Je reviendrai en détail sur le protocole HTTP un peu plus tard.

### Un partout : balle au centre
Je tiens à remettre les choses au clair. On entend beaucoup trop souvent : *"Fais du REST, SOAP c'est nul"*. Il y a en effet clairement un effet de mode ! Les API REST pullulent et sont vraiment très pratiques. Toutefois, dans les gros systèmes nécessitant du RPC ou encore de la signature numérique, pour les échanges de données médicales par exemple, le contrat WSDL et la rigueur du XML sont clairement des alliés !


## Alors comme ça, HTTP ça fait tout ?
Il y a un type qui s'appelle Leonard Richardson et qui a mis en place un [modèle de maturité](http://martinfowler.com/articles/richardsonMaturityModel.html) pour qualifier les API webservice.

### Niveau 0
C'est le minimum acceptable dans la communication HTTP :
* Toutes les requêtes sont envoyées à la même URL, quelle que soit la demande.
* Toutes les requêtes sont envoyées avec le verbe POST.
* Quel que soit le type de retour (donnée ou erreur), le code HTTP retourné par le serveur sera toujours 200 (OK, tout s'est bien passé).
* Le contenu échangé est majoritairement du XML (pour les enveloppes notamment).

Quand on fait du webservice avec SOAP, c'est ce niveau qui est utilisé lors de la communication HTTP.

### Niveau 1
Avec ce premier niveau, on essaye d'enrichir un peu plus l'utilisation. On ajoute la notion de *ressource*, en fonction de la donnée métier manipulée, l'URL de la requête sera différente. La preuve par l'exemple :
* ***POST /agenda*** : permet de travailler avec les données de l'agenda de l'application
* ***POST /customers*** : permet de travailler avec le registre des clients  

On profite aussi de la vue hiérarchique que nous proposent les URL :
* ***POST /customers/42*** : permet de travailler avec le client qui possède l'identifiant 42

Rien qu'en traçant les URL appelées sur le serveur, on peut comprendre ce que le client HTTP cherche à faire... pas dégueu, non ?

### Niveau 2
Le protocole HTTP utilise des verbes pour les requêtes et des codes numériques pour les retours. Ce sont ces deux mécanismes qui seront utilisés en complément du niveau 1.

Les principaux verbes HTTP que l'on utilise sont GET, POST, PUT et DELETE. Leur nom est déjà très évocateur.
* ***GET /customers/42*** pour récupérer les informations du client 42
* ***PUT /customers*** *(+ corps de la requête)* pour enregistrer un nouveau client
* ***POST /customers/42*** *(+ corps de la requête)* pour mettre à jour les informations du client 42
* ***DELETE /customers/42*** pour supprimer le client 42

Facile, non ? La réponse du serveur devient tout aussi logique grâce aux codes HTTP.
Ces codes sont juste des nombres de 3 chiffres respectant cette logique :
* ***1xx*** : *"Je suis en train de bosser, attends encore un peu."*
* ***2xx*** : *"Voilà le résultat, ça s'est bien passé."*
* ***3xx*** : *"Le contenu est déplacé, va voir ailleurs (cf. en-tête location)."*
* ***4xx*** : *"Tu me demandes n'importe quoi, tu as merdé."*
* ***5xx*** : *"J'ai merdé..."*

Parmi les plus connus, on a donc 404 (*"tu me demandes quelque chose qui n'existe pas"*), 403 (*"accès interdit"*), 304 (*"pas la peine de m'emmerder, la donnée est dans ton cache"*) et bien sûr 200 (*"OK, tout va bien"*).

Et si les codes HTTP sont ta nouvelle passion, je te suggère de te documenter sur le code [418](http://fr.wikipedia.org/wiki/Hyper_Text_Coffee_Pot_Control_Protocol) !


### Niveau 3 : HATEOAS

Alors on a les verbes HTTP et les codes retours. À quoi peut ressembler le Graal des API REST alors ? Si on réfléchit un peu, on peut se dire qu'il faudrait, pour toutes les URL, donner un code retour HTTP cohérent pour chaque verbe, logique non ? De cette manière, on peut entamer un véritable dialogue avec le serveur HTTP, entièrement basé sur REST. Voilà une bonne nouvelle pour ceux qui veulent tailler une bavette ailleurs que sur Google Hangouts !

Un petit exemple de dialogue :

```
> GET /customers/42
200 OK

> PUT /customers/42 {...}
409 Conflict

> DELETE /customers/42
204 No Content

> GET /customers/42
404 Not Found
```

C'est un bon début, mais ce niveau 3 va quand même un peu plus loin ! N'as-tu jamais trouvé génial qu'avec de simples liens dans les pages web, tu pouvais naviguer des heures et des heures ?

Pourquoi ne pas ajouter des liens dans les ressources retournées via REST ? Nous venons de mettre le doigt sur HATEOAS (*Hypermedia As The Engine Of Application State*). On peut désormais imaginer un tas de choses comme :
* Quand on renvoie un tableau json par exemple, dans chaque item,
  * on peut ajouter les liens qui permettent de le mettre à jour ;
  * on peut ajouter les liens qui permettent de récupérer des données liées comme l'auteur d'un livre, les mentions d'un tweet, etc. ;
  * on peut ajouter l'URL de putaindecode.fr.

Voici un exemple de trame JSON avec les informations HATEOAS. Pour information, il s'agit d'un webservice qui permet de lister des conférences.

```
[
  {
    "conference": {
      "id": 1,
      "links": [
        {
          "rel": "list",
          "href": "http://localhost:8080/hateoas-webservice/rs/conferences/"
        },
        {
          "rel": "self",
          "href": "http://localhost:8080/hateoas-webservice/rs/conferences/1"
        }
      ],
      "name": "Take Off Conf 2013",
      "startDate": "2013-01-17T00:00:00+01:00",
      "endDate": "2013-01-18T00:00:00+01:00",
      "talks": [
        {
          "id": 1,
          "speakerName": "Jakob Mattsson",
          "title": "You are not service oriented enough!",
          "links": [
            {
              "rel": "self",
              "href": "http://localhost:8080/hateoas-webservice/rs/talks/1"
            },
            {
              "rel": "list",
              "href": "http://localhost:8080/hateoas-webservice/rs/talks/"
            }
          ]
        },
        {
          "id": 2,
          "speakerName": "Olivier Lacan",
          "title": "Science-based development",
          "links": [
            {
              "rel": "self",
              "href": "http://localhost:8080/hateoas-webservice/rs/talks/2"
            },
            {
              "rel": "list",
              "href": "http://localhost:8080/hateoas-webservice/rs/talks/"
            }
          ]
        },
        {
          "id": 3,
          "speakerName": "Xavier Coulon",
          "title": "Build your website with awestruct and publish...",
          "links": [
            {
              "rel": "self",
              "href": "http://localhost:8080/hateoas-webservice/rs/talks/3"
            },
            {
              "rel": "list",
              "href": "http://localhost:8080/hateoas-webservice/rs/talks/"
            }
          ]
        },
        {
          "id": 4,
          "speakerName": "Rémi Parmentier",
          "title": "Design for developers",
          "links": [
            {
              "rel": "self",
              "href": "http://localhost:8080/hateoas-webservice/rs/talks/4"
            },
            {
              "rel": "list",
              "href": "http://localhost:8080/hateoas-webservice/rs/talks/"
            }
          ]
        }
      ]
    }
  },{
  ...
  }
]
```


Dans cette trame, tu auras remarqué les objets dans les tableaux nommés "links", ce sont les liens disponibles pour chacun des objets renvoyés ! On peut imaginer qu'en fonction des droits de l'utilisateur courant, il y ait plus ou moins de liens.


## Est-ce que c'est standard ?

Eh bien non ! Il n'y a pas vraiment de convention pour l'écriture des liens dans les trames renvoyées. Cela dépend du format renvoyé dans un premier temps. Comment formaliser un standard si on renvoie en JSON, XML et YML en fonction des en-têtes HTTP du client ?

De la même manière, tu auras remarqué que l'on ne précise pas le verbe HTTP à utiliser sur les URL. C'est la raison pour laquelle il faut implémenter un retour cohérent pour tous les verbes HTTP courants !

Et pour finir, comment connaître le format du document JSON accepté avec les requêtes POST par exemple ? Il n'y a pas non plus de règle ! On pourrait imaginer par exemple un document "type" qui serait renvoyé après une requête "OPTION" sur l'URL.

Il y a toutefois quelques expérimentations comme [HAL](http://en.wikipedia.org/wiki/Hypertext_Application_Language) ou encore [JSON API](http://jsonapi.org/) qui tentent de normaliser un peu ce flou artistique.

Tu fais ta petite popote ! Tu fais comme tu veux ! Ça a du bon aussi !

## "Bon ok, je fais comment pour le mettre en place maintenant ?"

Tu remontes tes manches et tu te démerdes !

Il y a quelques frameworks qui vont te donner un coup de main. Dans le monde Java par exemple, il existe [Resteasy-links](http://docs.jboss.org/resteasy/docs/2.0.0.GA/userguide/html/LinkHeader.html) (avec un exemple d'utilisation [sur mon repo GitHub](https://github.com/awillemant/hateoas-example)), ou encore [Spring HATEOAS](http://projects.spring.io/spring-hateoas/)

Pour les *Nodistes*, une simple recherche sur [npmjs](https://www.npmjs.com/search?q=hateoas) renverra un tas d'outils !

## Références

Oui, parce qu'il y a des gens bien plus brillants que moi pour vous convaincre sur l'Hypermedia !

* [Wikipédia](http://en.wikipedia.org/wiki/HATEOAS)
* [Blog de Martin Fowler](http://martinfowler.com/articles/richardsonMaturityModel.html)
* Les travaux de Steve Klabnik, Rubyiste reconnu (ex : [Designing Hypermedia APIs](https://www.youtube.com/watch?v=g4sqydY3hHU))
* Ori Pekelman : [son talk à la Take Off Conf 2014](https://www.youtube.com/watch?v=ZZxOaCP8vyg)
* [Un excellent article de Xebia sur la bonne utilisation de POST et PUT](http://blog.xebia.fr/2014/03/17/post-vs-put-la-confusion/)
