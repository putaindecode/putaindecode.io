---
date: "2016-01-23"  
title: "10 arguments pour promouvoir le TDD"  
tags:
  - tdd
  - bdd
  - ci  
authors:
  - Freezystem
---

Si vous ne savez pas de quoi on parle, commencez par ici :
[se lancer dans le TDD : Définitions et variantes](/fr/articles/tdd/se-lancer-dans-le-tdd-definitions-et-variantes/)

## Promouvoir les tests

Déjà il faut commencer par aborder le sujet avec les différents protagonistes, 
la communication est la clé. Dans de rares cas on vous donnera le feu vert pour 
mettre en place ces tests, mais la plupart du temps l’accueil est bien plus mitigé.

Du haut de ma courte expérience j’ai pris le temps de faire un top 10 des phrases que j’ai 
personnellement entendu ou qui m’ont été rapporté. Modestement on tentera de trouver une 
répartie efficace et claire qui j’espère pourra vous être utile dans les débats 
houleux provoqués par le sujet.

### 1 - On a pas le temps

C’est la réponse naturelle et instinctive aux tests. Les tests sont chronophages. 
On est d’accord là dessus, c’est difficilement défendable. 

Mais prenons un peu de recul. 

_Premièrement_, la mise en place d’un processus supplémentaire dans le workflow est 
une tâche plutôt lourde mais une fois la configuration établie elle l’est pour tous les projets. 

_Deuxièmement_, il faut comparer le gain de temps sur le long terme. Une application male construite, 
male documentée et non testée fini toujours par constituer une dette technique redoutable. 
Je ne compte plus les journées entière à chercher une regression induite par un refacto ou 
simplement en recherche de bugs.

_Enfin_, on peut facilement imaginer qu’une fois habitué, le développeur augmentera 
la rapidité d’écriture des tests.

> Le constat est simple, avantage du long terme sur le court terme en terme d’évolution et de debug.

### 2 - On a pas l’argent

Un autre classique qui va de pair avec la réponse précédente. La bonne répartie pourrai être :

> Si j’avais eu 1€ à chaque fois que j’ai attendu cette phrase... 
> J’aurai donné moi même les fonds pour écrire les tests... 

Plus sérieusement, il est important ici de définir ce que représente l’argent dont il est question :

- _On parle en fait du temps_. Et oui, le temps c’est de l’argent. (cf question 1) 
- _On parle d’une personne supplémentaire pour le pair-programming_. C’est mieux, 
  mais pas obligatoire, promettez de faire preuve d’un minimum d’optimisme lors 
  de l’écriture des tests et tout ira bien. 
  Rappellez-vous, un test peu efficace vaut mieux qu’aucun test.
- _On parle des moyens insuffisants pour embaucher une personne compétente_ pour le faire. 
  N’importe quel développeur motivé en est capable, ce ne sont pas les ressources gratuite 
  qui manque sur la toile. En plus de changer sa routine ça lui permettra de s’épanouir, 
  l’un dans l’autre, tout le monde est gagnant.

Si on pense maintenant en dehors du contexte, des clients perdu par la faute d’une application 
non fonctionnelle est aussi une perte de revenus. 

A contrario des clients fidélisés, 
grace à un site fonctionnel, sont un gain de confiance, donc de popularité, 
donc de trafic et donc d’argent.

> Le problème réside souvent dans la problématique de rentabilité à court terme, en oubliant
> que les gains de demain valent bien plus que les coûts immédiats.

### 3 - On est dans l’agilité extrême, notre code change trop pour écrire des tests

Il ne faut pas tester les applications dans leur entièreté, mais leurs features. 
Découper les tests par fonctionnalité. 

> Il s’agit ici d’avoir une approche atomique du code en production.

### 4 - On ne sait pas comment faire

Le TDD ça s’apprend, le web regorge de ressources sur le sujet (Youtube, Stack Overflow, 
documentation des framework de tests, Sites de Mooc, etc...). Comme on dit :

> Google est ton ami !

### 5 - On en a pas besoin si on est rigoureux

Alors là, comment dire…?

> Je fais attention quand je conduis, mais ce n’est pas pour autant que je débloucle ma ceinture.

C’est un peu l’idée. En plus de guider le développement les tests évitent 
les problèmes de régressions. Ils permettent aussi de prévenir les bugs avant 
qu’ils n’arrivent parce qu’on les a justement anticipé.

### 6 - C’est juste une mode, ça passera

Ce n’est pas une mode, c’est une évolution dans la manière de coder, il faut donc 
faire évoluer sa manière de travailler. 
Les tests existent depuis toujours, mais avec la progression des environnements 
de développement viennent aussi de nouvelle manière de fonctionner et faire 
évoluer son rapport au code et à celui des autres. 

> Faire évoluer les mentalités sur l'utilité des tests est primordiale.

### 7 - Je travaille seul(e), je sais ce que je fais

On travaille très rarement seul ou uniquement pour soi, soit demain, soit plus tard, 
un collègue ou un utilisateur sera victime de cette négligeance. 

> Si votre librairie est incapable d’offrir une consistance acceptable personne ne l’utilisera.

Les tests équivallent à un cahier des charges fonctionnel intemporel facilitant la 
transmission des connaissances et des spécifications.

> Tester c'est encadrer son développement par des guidelines formatrices.

### 8 - Ca a toujours fonctionné sans, on ne voit pas l’intérêt de changer de façon de faire

Refuser le progrès, quelle drôle de manière d’avancer.
 
> Pour la conférence internationale de la semaine prochaine, vous préfèrez une 
> invitation par email pour chaque intervenant ou une lettre transmise à dos de cheval ?

Le pari ici c’est de faire évoluer les pratiques de développement, d’établir un standard 
pour les générations futures. 

> On sous éstime beaucoup trop l’importance d’un algorithme robuste et fonctionnel, 
> il en va de la crédibilité de votre produit et donc de sa rentabilité / popularité.

### 9 - On commence comme ça et après il faudra écrire des tests pour les tests

En fait, le code que l’on test n’est autre que le test du test, c’est aussi simple que ça.

> Inception !

### 10 - On n’a pas de données critiques

Ma préférée pour la fin. C’est la plus mauvaise réponse que l’on peut vous donner. 

Les données sont le nerf de la guerre. Si ce n’est pas l’algorithme, ce sont les données 
qui font la valeur monetaire d’une application donc toutes donnée doit être considérée 
comme critique. Et si votre algorithme est la partie à valeur ajoutée de votre code, 
j’ose espérer qu’il est rigoureusement testé. 

Admettons que votre but est de collecter de la data, ne seriez vous pas rassuré de 
savoir que toutes les points d’acquisition de cette donnée sont pleinement fonctionnels ?

> Les données sont la pierre angulaire de votre application, veillez à leur
> intégrité et à leur disponibilité avec grand soin.

## Pour conclure

Comme vous l’aurez remarqué il ne s’agit pas que de réprendre la bonne parole. 
Il faut joindre les actes aux mots. Plus les développeurs rédigeront de tests, 
plus les frameworks auront les moyens financiers et humain d’évoluer et de se 
rendre accessible. 

> A ce niveau là, c’est juste du bon sens.

Le TDD et le BDD sont des pratiques simples à mettre en place qui s’intègrent 
facilement dans un workflow et permettent de garantir la maintenabilité et la 
non régression d’un code à travers son évolution. Elles permettent aussi de 
rendre tout travail collaboratif plus simple.

J’espère que ce post vous aura convaincu de l’utilité de mettre en place ce type 
de méthodologie aussi bien à titre personnel que professionnel. N’hésitez pas à 
en parler autour de vous, à comparer les avis de développeurs séniors ou juniors 
et si vous êtes convaincu n’hésitez pas non plus à répendre la bonne parole.
