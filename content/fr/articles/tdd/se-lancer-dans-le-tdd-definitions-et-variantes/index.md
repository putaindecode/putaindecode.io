---
date: "2016-01-23"  
title: "Se lancer dans le TDD : Définitions et variantes"  
tags:
  - tdd
  - bdd
  - ci  
authors:
  - Freezystem
---

## Introduction

De manière générale, les tests ont toujours fait partie de la programmation. 
Que ce soit conscient ou pas, l’utilisation d’une fonction est déjà un test en soit. 

> On transmet des paramètres à un système et on attend une réponse en retour. 

A priori la confiance que l’on a en un système n’est pas dûe, elle nécessite de 
l’éprouver avec différents paramètres et d’évaluer la cohérence de ses réponses.

> Qui n’a jamais tapé machinalement `1+1=` sur sa calculatrice avant une épreuve de Maths ?

L’homme est sceptique par expérience et la méfiance, elle, est innée. 
L’environnement pouvant influer sur un système il est important d’être à tout moment 
capable de l’éprouver et d’en prévoir les réponses.

> C’est d’autant plus vrai dans le domaine de la programmation web. 

Aujourd’hui les standards sont de plus en plus permissifs et favorisent 
ainsi les comportements à risque. La plupart du temps, le système est capable de 
corriger lui même vos erreurs, des fois sans même vous en avertir. 

> Comment être sûr dans ce contexte, de la consistance de son application dans 
> les différents environnements d’execution ?

Vous imposer des pratiques de développement rigoureuses est une première solution, 
mais les tests seront un complément indispensable à la qualité de votre code.

Les pratiques sont diverses, et, avec l’avènement de l'AGILE une 
méthode de développement se popularise : le TDD.

## TDD, vous avez dit TDD ?

Le Test Driven Development _(Développement piloté par les Tests)_, 
est une technique de développement qui impose l’écriture de tests 
avant même l’écriture de la première ligne de code.

Dans la théorie, la méthode requiert l’intervention d’au moins 
deux intervenants différents, une personne écrit les tests, l’autre 
le code testé. Cela permet d’éviter les problèmes liés à la subjectivité. 

Dans la pratique les choses sont souvent plus compliquées, 
parfois on développe seul, parfois on écrit soit même les tests qui 
garantissent l’intégrité de votre nouvelle feature dans un projet collaboratif. 

> Quoi qu’il arrive un test peu efficace vaudra toujours mieux que pas de test du tout. 
> Le réel but étant de prendre l’habitude d’en écrire et d’être le plus 
> objectif possible dans leur rédaction. 

Le TDD est une pratique qui tend à se démocratiser et elle requiert l’effort 
de chacun pour devenir un standard. Tout développeur soucieux de son environnement 
et de son héritage doit se poser sérieusement la question. 
Les frameworks de tests fleurissent ainsi que les guides et documentations.

De nombreux sites spécialisés proposent déjà de l’aide grâce à une 
communauté grandissante. Aujourd’hui la cause souffre de deux sérieux handicaps, 
d’une part les développeurs peu scrupuleux, de l’autre les entreprises peu 
soucieuses de la qualité de leurs applications. 

C’est donc un combat de tous les jours pour le développeur lambda qui 
demande du temps pour ajouter ces tests au workflow ou au chef de projet 
qui demande à ses devéloppeur d’en écrire.

On peut découper le TDD en 5 étapes distinctes :

1. Ecrire un test.
2. Vérifier qu’il échoue.
3. Ecrire le code suffisant pour que le test passe.
4. Vérifier que le test passe.
5. Optimiser le code en vérifiant qu’il n’y ai pas de régression.

Pour simplifier cette logique on peut regrouper ces cinq étapes en trois grandes idées :

- **Tester d’abord**, qui correspond au 2 premières étapes.
- **Rendre fonctionnel**, qui englobe les points 3 et 4.
- **Rendre meilleur**, qui n’est autre que l’étape 5.

Cette méthodologie est particulièrement adaptée aux tests unitaires.

On notera qu’il existe des variantes, Bill Wake définit ainsi la 
méthode [3A](http://xp123.com/articles/3a-arrange-act-assert/), 
pour Arrange, Act, Assert _(Arranger, Agir, Affirmer)_. 
Il insiste sur le fait que la méthode ne définit pas un ordre immuable, 
l’affirmation peut ainsi venir avant l’action, etc...

- **Arranger** : Phase de préparation de l’environnement d’execution du test dans laquelle 
on procède à la déclaration des variables et des fonctions. On créé alors des _objets de test_.
- **Agir** : Phase qui met à l’épreuve nos objets de tests à l’aide de paramètres 
(éventuellement d’autre objects de test), appellés _mutateurs_. 
- **Affirmer** : On formule des attentes à propos des objets testés.

Cette méthode convient très bien aux tests de type fonctionnel.

exemple : 
```js
// ARRANGE
let a = 10, b = 34, c;
function addNumbers ( a, b ) { return a + b };

// ACT
c = addNumbers(a, b);

// ASSERT
console.assert(c === 44,  '10 + 34 = 44');
```

Dans la pratique on décompose l’écriture d’un script en une suite de tests 
correspondant chacun à une fonctionnalité précise.

## Des tests pour tous

Il existe une variante plus agnostique de la logique du codeur qui permet à des 
intervenants externes de faire partie intégrante du processus. 

le BDD, Behaviour Driven Development (Développement Piloté par le Comportement), 
permet de définir de manière compréhensible pour tous les intervenants les 
spécifications d’une fonctionnalité. Cela permet aux développeurs de connaitre 
les raisons de l’écriture de cette fonctionnalité sans pour autant entrer 
dans le détail du code. La discussion est donc facilitée entre les différents acteurs.

> Cool! Mais j'suis pas sur d'être totalement convaincu

Très bien, pour la suite c'est par ici : 
[se lancer dans le TDD : Cas d'utilisations et cas pratique](/fr/articles/tdd/se-lancer-dans-le-tdd-cas-d-utilisations-et-cas-pratique/)
