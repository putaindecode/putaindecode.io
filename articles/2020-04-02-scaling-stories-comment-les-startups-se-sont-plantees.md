---
date: 2020-04-02
title: Scaling stories - comment les startups se sont plantées
author: cyppan
slug: scaling-stories-comment-les-startups-se-sont-plantees
---

> - "Ca ne fonctionne pas, mes enfants n'arrivent pas à se connecter à votre service !"
> - "Nous sommes désolé notre équipe technique est mobilisée à 100% sur ce problème c'est une situation exceptionnelle... Nous vous tenons au courant."


C'est le genre de tweet ou de message Linkedin qu'on a pu voir se multiplier avec le confinement récent dû au Covid-19. En effet les services web, et en particulier les outils de communication ou les programmes du secteur de l'edtech (education technology), ont dû faire face à un usage particulièrement intense et soutenu ces derniers temps. Il n'y en a que peu à ma connaissance qui ont été capables de maintenir une qualité de service acceptable (Slack et Zoom ont particulièrement brillé sur ce sujet), et la plupart a dû mettre en place des solutions minutes comme des queues de connexion, 
d'autres encore ont été forcés de désactiver leur service pour une "maintenance" à durée indéterminée...


Même en étant compréhensifs, face à un service planté, on a vite fait de changer. Après tout, avec le choix plus que fourni de services dont on dispose, pourquoi se priver ? Le problème c'est qu'après la crise, il est fort probable que nous ne reviendrons pas au service qu'on avait pourtant trouvé si cool au premier abord... Aïe, pour une startup c'est beaucoup de clients perdus, peut-être assez pour ne jamais retrouver de la traction. Une mort pénible donc pour un business, victime lui aussi du virus.


Mais 🧐

* *Ces entreprises n'auraient-elles pas pu mieux anticiper ?*
* *N'auraient-elle pas pu avoir une meilleure tech à la base, crise ou pas crise ?*
* *Et une fois devant le problème, n'auraient-elles pas pu mieux s'adapter et plus rapidement ?*


## le modèle de "scaling maturity"


![modèle de scaling maturity](https://cyppan.me/scaling-maturity-fr.png)

En premier lieu j'aimerais introduire le concept de *scaling maturity*. "To scale" c'est l'art d'adapter (automatiquement ou non) sa stack technique afin de répondre à la demande en entrée. Et reconnaissons déjà que Zoom et Slack sont beaucoup plus matures que (par exemple) de jeunes startups de l'edtech.    
Analysons les à l'aide du modèle de *scaling maturity*.

1 - **Volume d'usage nominal**: Slack ou Zoom avaient déjà un trafic (très) important, le pic d'activité représente un pourcentage plus petit que pour une startup pour qui c'est peut-être un boost de 100 ou 1000 fois l'activité habituelle.    
2 - **Maturité du produit**: Ils ont eu le temps de connaître les spécificités de leur usage, les caractéristiques d'accès aux données, les points de fragilité de leur système, ...    
3 - **Compétences techniques**: Ils ont probablement une équipe tech plus grande et plus expérimentée.

Pour synthétiser, ils en savent beaucoup sur la façon dont leur produit est utilisé et quelle est leur roadmap, et donc savent bien quel type d'effort concentrer pour s'adapter à la demande supplémentaire. En plus, leur infrastructure actuelle peut déjà encaisser un volume conséquent.


De l'autre côté, les jeunes services web se sont retrouvés submergés, cherchant de l'aide désespérement et des solutions pour [sharder](https://en.wikipedia.org/wiki/Shard_%28database_architecture%29) et répliquer leur base de donnée relationnelle existante (plus à ce sujet un peu plus loin).    
Je prends à présent l'exemple hypothétique d'une startup edtech offrant un service de classe en ligne innovant.

1 - **Volume d'usage nominal**: Quelques clients aiment leur produit, "c'est le futur", ils croient au potentiel de croissance et l'ajout de fonctionnalités avec le temps. Il y a donc un faible volume d'utilisation pour le moment et une croissance mesurée attendue, ils ont opté pour quelques serveurs OVH économiquement intéressants.    
2 - **Maturité du produit**: Leur produit est très jeune, ils misent sur l'innovation et des boucles de feedback rapides pour l'étoffer.    
3 - **Compétences techniques**: Des stagiaires, peut-être de jeunes employés, parfois des fondateurs qui font eux-mêmes les premiers prototypes. A ce niveau les salaires pèsent beaucoup dans la balance.

Je m'autorise ici une conclusion préliminaire à la première question: les entreprises n'auraient pas pu anticiper, et même j'irai plus loin pour les plus petites d'entre elles, elles ne devaient pas le faire... En effet, si on souhaite créer un produit avec du scaling "infini" dès le début, ça implique d'investir beaucoup **en temps et en argent**. Deux ressources précieuses que l'on préfère rationnellement investir sur d'autres sujets quand on est un business en phase de démarrage (comme trouver sa place sur le marché, ajouter des fonctionnalités, croître, ...).

> ![cygne noir](https://cyppan.me/black-swan.jpg)
> Covid-19 est un très bon exemple de ce qu'on appelle un évènement ["cygne noir"](https://fr.wikipedia.org/wiki/Th%C3%A9orie_du_cygne_noir)
> Un évènement qui est très rare, a des répercussions massives, que les entreprises n'avaient donc pas prévu.    
> En effet ce point est assez évident, néanmoins je trouve cet "interlude du cygne" bienvenu 😉

J'ai pu parler récemment avec quelques startups edtech qui recherchaient des solutions urgemment... Elles en étaient au même point : elles ne pouvaient plus doper les ressources de leur base de donnée relationnelle (**scale up**). Après avoir essayé d'ajouter du cache, déployer de nouveau noeuds, de refactorer leurs applications, le point limitant final restait la base de donnée... La seule solution était donc de sharder (**scale out**) afin de répartir les écritures sur plusieurs instances en parallèle. Ils cherchaient donc des solutions intelligentes (dans le sens autonomes) à ajouter en amont de leur base de donnée afin de pouvoir continuer le scale. Pas si évident, et plutôt cher...
Et je ne parlerai même pas de la gestion de la **migration** dans ce contexte !

Pour avoir une idée de la difficulté de sharder une base de donnée existante, je dirais que plus le requêtage des données est global et complexe (par exemple de l'agrégation cross-compte), le plus intelligent et cher devra être le proxy en amont. Ca peut aller d'une simple hash-distribution à un "query planner" distribué complexe, et difficile à scale lui aussi par ailleurs.

A la lumière du modèle de *scaling maturity*, il est assez clair qu'on ne peut les blâmer de ne pas avoir eu ces mécanismes de scale déjà en place auparavant, mais elles auraient pu au moins avoir mieux planifié leur **prochaine étape de scale**.


## Comment on scale efficacement quand on est une startup?

Déconstruisons déjà ce qui doit être "scaled":

* **la capacité serveur**: La maîtrise des coûts implique un dimensionnement adapté en terme de taille CPU / RAM / storage. Par serveur, j'entends noeuds physiques, virtuels ou containers.
* **les patterns d'accès aux données**: C'est à dire connaître son usage, éviter de gérer des états partagés, des requêtes globales, préférer l'immutabilité, ...
* **l'intervention humaine et la maintenance**: Plus on automatise, plus vite on peut itérer, des outils comme Github, CircleCI ou terraform sont précieux.
* **le refactoring de code**: "scale" veut souvent dire pré-calculer des états, utiliser du cache, plus de synchronisation, tout ça doit être codé et maintenu également...

Note: si votre produit n'a pas encore de traction réelle, se préoccuper de ce sujet est probablement prématuré et inutile, un rapide prototype MVC avec la techno que vous connaissez déjà fera tout à fait l'affaire.

Mais si vous avez de l'usage et une première idée de la direction du produit, alors il y a plusieurs possibilités. Si vous avez avec vous un fondateur au profil technique il sait certainement quoi faire. Sinon, et en particulier si vous avez levé des fonds, c'est une bonne idée de se faire accompagner sur le design de l'infrastructure dès à présent.

Explorons différentes stratégies.


### La stratégie de scaling infini

Dissipons immédiatement les nuages de fumée, il est théoriquement possible d'**approcher** une telle architecture mais ce sera très coûteux (en temps et en argent _ encore une fois deux choses précieuses pour une startup), et potentiellement assez rigide.    
La clé ici serait d'utiliser au maximum des services gérés de haut niveau qui tournent sur de grosses infrastructures clouds. Les services choisis devraient être 100% dynamiques, c'est à dire scale de manière transparente: on ne devrait pas avoir à gérer de ressources physiques ou même virtuelles. Idéalement ces services intègreraient de base de la réplication (pour scale en lecture) et du sharding (pour scale en écriture) et pourraient être répartis dans différentes régions sur la planète.

Voici quelques exemples de services gérés de cet ordre :

* Base de donnée relationnelle: Google cloud Spanner
* NoSQL synchronisation temps réel: Google firestore
* Cluster de cache cross-region: AWS Elasticache
* Stockage de fichier distributé: AWS S3
* Data streaming: Google Pub/sub
* Data warehouse: Google Bigquery

He oui, ça fait beaucoup de services Google, tout simplement parce qu'ils ont un train d'avance..!

![courbe de scaling dynamique](https://cyppan.me/dynamic-scaling-curve-fr.png)

*Ici je me dois de nuancer cette courbe*

* Le prix est en fait très bas au démarrage : ces services offrent des niveaux d'utilisation gratuit pour un volume limité et/ou pendant une période limitée.
* Une fois un usage conséquent atteint, un tarif dégressif ou des techniques d'optimisation des coûts liées au provider viendront réduire la facture.


### la strategie de scaling step by step

![courbe de scaling step by step](https://cyppan.me/static-scaling-curve-fr.png)

C'est la stratégie classique et probablement la plus efficace, on fait avec ce qu'on a à disposition au début (compétences, personnes) mais on essaie d'avoir toujours un coup d'avance. On reste conscient des points de fragilité du système, et on sait comment y remédier. On s'attache à planifier les prochaines migrations.    
Ca nécessite en particulier :

* De développer une pipeline solide de monitoring et d'alerting. Il y a beaucoup d'outils pour faire ça aujourd'hui.
* De tester chaque migration. Car plus le système est distribué, le moins prévisibles seront les problèmes. Il est plus simple de tester avant de migrer.

Par exemple, les prochaines étapes de scale planifiées pourraient être:

* Sharder la base de donnée ou le stream de données.
* Conserver les données en silos isolés logiquement, afin de pouvoir scaler plus simplement le reste.
* Introduire un scaling automatique des services HTTP basé sur le trafic.

Le principal est de rester économique et intelligent : pour scale efficacement il faut scale dans les bonnes proportions et au bon moment. Trop tôt et ça coûtera trop cher, trop tard et la qualité de service tombera... C'est pourquoi avoir un feedback pertinent (automatisé) sur l'architecture est un réel plus.

Les clouds proposent souvent des metrics de monitoring intégrées, par exemple si on utilise les environnements AWS Beanstalk pour des services webs il est fourni automatiquement les métriques suivantes :

* le nombre de requêtes
* la latence moyenne
* l'indice de charge du serveur (load)
* le CPU
* le réseau entrant/sortant
* ...

Il est très facile alors de les visualiser en dashboards, de configurer de l'alerting, ou même d'activer de l'auto-scaling basé sur le pourcentage de CPU utilisé... Autant d'outils que l'on peut utiliser directement pour scaler ses web services correctement. Après tout, le plus d'informations (métriques) on a à la base, le mieux on peut prendre les bonnes décisions au final.

Bien entendu, scaler efficacement c'est scaler de manière appropriée, à chaque situation sa réponse adaptée..!

Pour conclure, la bonne solution se situe probablement entre les deux stratégies. Ca dépendra du budget, de la complexité technique du produit, et des compétences à disposition, ...    
Au moins j'espère que vous avez une meilleure idée de comment anticiper le scale !

Scale safe 👋









