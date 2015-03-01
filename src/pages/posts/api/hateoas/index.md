*Salut toi, alors comme ça tu fais du web ? et tu fais quoi de beau en ce moment ? Des plugins script.aculo.us ? Intéressant... je te conseille toutefois de jeter un coup d'oeil à cet article si jamais tu veux vraiment te la péter en soirée avec tes réflexions du style *"Je fais du web"* !*

## Les webservices ##
La première étape pour devenir un beau gosse du web: comprendre ce que l'on entend par webservice ! Et bien c'est très facile, quand tu te promènes sur le skyblog de ta petite soeur ou encore quand tu likes les duck faces de ton amour de vacances, ce qu'il se passe c'est que ton navigateur discute avec le serveur web distant. Il envoie des requêtes du style *"donne moi la page des posts skyblog de ma petite soeur"* et le serveur renvoie du code HTML, des images et des feuilles de styles. Le tout est interprété par ton navigateur et toi tu peux ainsi jouir de cette page bien girly, pleine de licornes et d'arcs-en-ciel.

Pourquoi passer par un navigateur si on veut juste récupérer de l'information brute ? Le web peut être consommé par des machines ! Les serveurs web nous renvoient bien plus de choses que de l'HTML, heureusement !

### La première école : SOAP ###
Imaginons deux programmes  qui veulent discuter en passant par le web. Dans les années 90, des mecs super brillants se sont dit : *"on va se baser sur le XML pour faire communiquer nos programmes sur le web"*.
L'approche est assez logique et ingénieuse. Tout d'abord, les deux partis (le client et le serveur) se partagent une notice d'utilisation : la WSDL (Web Service Description Language), qui est un document XML décrivant toutes les méthodes qui peuvent être appelées par le client sur le serveur, avec les structures de données disponibles pour ces échanges.
Le client prépare donc sa demande et l'enveloppe dans une grosse structure XML contenant toutes les metadonnées (méthode appelée, signature numérique, etc...). Une fois que le serveur a reçu cette demande, il l'a traite et répond aussi dans une grosse enveloppe XML

C'est donc ce que l'on appelle le SOAP (Service Oriented Application Protocol), aucun rapport avec une quelconque savonnette du coup. Cette méthode a fait ses preuves puisqu'elle fait tourner encore aujourd'hui des milliers de systèmes très complexes et très fiables.

### La maison d'en face : ReST ###
Plusieurs années sont passées et les esprits ont évolué. On a commencé à entendre des grandes déclarations comme *"Le SOAP est vraiment pataud !"*, *"Le protocole HTTP est sous-exploité !"* ou encore *"Les enveloppes XML et les WSDL ? merci bien !"* et c'est à ce moment là qu'on a donné un acronyme bidon pour décrire le protocole HTTP sans vraiment le nommer : ReST (Representational State Transfert). Pour l'anecdote, tout le monde s'accorde à dire que cet acronyme ne veut rien dire ;)

Le but du jeu est donc d'utiliser au maximum les possibilités du protocole HTTP, les verbes, les URLs et les codes retours pour décrire des APIs de la manière la plus fidèle possible. On a donc gagné en simplicité et la communication entre machine se veut désormais à la portée de tous. Je reviendrai en détail sur le protocole HTTP un peu plus tard.

### Un partout : balle au centre ###
Je tiens à remettre les choses au clair. On entend beaucoup trop souvent *"Fais du ReST, SOAP c'est nul"*. Il y a en effet clairement un effet de mode ! Les APIs ReST pullulent et sont vraiment très pratiques. Toutefois, dans les gros systèmes nécessitant du RPC ou encore de la signature numérique, pour les échanges de données médicales par exemple, le contrat WSDL et la rigueur du XML sont clairement des alliés ! 


## Alors comme ça, HTTP ca fait tout ? ##
Il y a un type qui s'appelle Leonard Richardson et qui a mis en place un [modèle de maturité](http://martinfowler.com/articles/richardsonMaturityModel.html) (un peu pompeux non ?) pour qualifier les APIs webservice.

### Niveau 0 ###
C'est le minimum acceptable dans la communication HTTP:
* Toutes les requêtes sont envoyées à la même URL, quelque soit la demande.
* Toutes les requêtes sont envoyées avec le verbe POST
* Quelque soit le type de retour (donnée ou erreur), le code HTTP retourné par le serveur sera toujours 200 (OK, tout s'est bien passé)
* Le contenu échangé est majoritairement du XML (pour les enveloppes notamment)

Quand on fait du webservice avec SOAP, c'est ce niveau qui est utilisé lors de la communication HTTP.

### Niveau 1 ###
Avec ce premier niveau, on essaye d'enrichir un peu plus l'utilisation. On ajoute la notion de *ressource*, en fonction de la donnée métier manipulée, l'URL de la requête sera différente. La preuve par l'exemple:
* ***POST /agenda*** : permet de travailler avec les données de l'agenda de l'application
* ***POST /customers*** : permet de travailler avec le registre des clients  

On profite aussi de la vue hiérarchique que nous proposent les URLs :
* ***POST /customers/42*** : permet de travailler avec le client qui possède l'identifiant 42

Rien qu'en traçant les URLs appelées sur le serveur, on peut comprendre ce que le client HTTP cherche à faire... pas dégueu non ?

### Niveau 2 ###
Le protocole HTTP utilise des verbes pour les requêtes et des codes numériques pour les retours. Ce sont ces deux mécanismes que l'on va utiliser en complément du niveau 1.

Les principaux verbes HTTP que l'on utilise sont GET, POST, PUT et DELETE. Leur nom est déjà très évocateur.
* ***GET /customers/42*** on récupère les information du client 42
* ***PUT /customers*** *(+ corps de la requête)* pour enregistrer un nouveau client
* ***POST /customers/42*** *(+ corps de la requête)* : pour mettre à jour les informations du client 42
* ***DELETE /customers/42*** : pour supprimer le client 42.

Facile non ? La réponse du serveur devient tout aussi logique grâce aux codes HTTP.
Ces codes sont juste des nombres de 3 chiffres respectant cette logique :
* ***1xx*** : *"Je suis en train de bosser, attends encore un peu"*
* ***2xx*** : *"Voilà le résultat, ça s'est bien passé"*
* ***3xx*** : *"Le contenu est déplacé, va voir ailleurs (cf entête location)"*
* ***4xx*** : *"Tu me demandes n'importe quoi, tu as merdé"*
* ***5xx*** : *"J'ai merdé..."*

Parmi les plus connus, on a donc 404 (*"tu me demandes quelques chose qui n'existe pas"*), 403 (*"accès interdit"*), 304 (*"pas la peine de m'emmerder, la donnée est dans ton cache"*) et bien sûr 200 (*"OK, tout va bien"*).

Et si les codes HTTP sont ta nouvelle passion, je te suggère de te documenter sur le code [418](http://fr.wikipedia.org/wiki/Hyper_Text_Coffee_Pot_Control_Protocol) !


### Niveau 3 : HATEOAS ###

Alors on a les verbes HTTP et les codes retours. A quoi peut ressembler le Graal des APIs ReST alors ? Si on réfléchit un peu, on peut se dire qu'il faudrait, pour toutes les URLs, donner un code retour HTTP cohérent pour chaque verbe, logique non ? De cette manière, on peut entamer un véritable dialogue avec le serveur HTTP, entièrement basé sur ReST. Voilà une bonne nouvelle pour ceux qui se sentent seuls !

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

C'est un bon début, mais ce niveau 3 va encore plus loin ! Toi, lecteur... n'as-tu jamais trouvé génial qu'avec de simples liens dans les pages web, tu pouvais naviguer des heures et des heures ? Et comment on appelle du texte avec des liens ? de l'hypertexte ! 

Pourquoi ne pas ajouter des liens dans les ressources retournées via ReST ? Nous venons de mettre le doigt sur HATEOAS (*Hypermedia As The Engine Of Application State*). On peut imaginer un tas de chose comme:
* Quand on renvoie un tableau json par exemple, dans chaque item, 
  * on peut ajouter les liens qui permettent de le mettre à jour
  * on peut ajouter les liens qui permettent de récupérer des données liées comme l'auteur d'un livre, les mentions d'un tweet, etc...
  * on peut ajouter l'url de putaindecode.fr :P

Voici un exemple de trame JSON avec les informations HATEOAS. Pour information, il s'agit d'un webservices qui permet de lister des conférences.

<figure>
    ![JSON HATEOAS](json_annote.png)
    <figcaption>JSON avec liens Hypermedia</figcaption>
  </figure>
