---
date: "2017-10-31"
title: "Se lancer dans le TDD"  
tags:
  - tdd
  - bdd
  - ci  
authors:
  - Freezystem
---

## Introduction

Tout commence en octobre 1999 lorsque [Kent Beck](https://fr.wikipedia.org/wiki/Kent_Beck)
présente une nouvelle méthode de programmation basée sur AGILE: l'eXtreme Programmming abrégé _XP_.  
l'_XP_ définit des pratiques de développement optimisées améliorant la production et
la robustesse du code.  
Parmi les principes les plus connus de sa méthode on pourra citer **l'intégration continue**
aussi appelée _CI_ pour _Continuous Integration_ et **la programmation en binôme**
ou _pair programming_ en anglais.

L'aspect qui nous intéresse ici est un autre pilier de la méthode qui consiste à piloter
le développement par les tests alias _TDD_.

Le TDD est une pratique controversée car coûteuse à mettre en place.
Popularisée par les développeurs elle peine à émerger.

Avec la multiplication des environnements d'execution, la complexité des applications web
et l'essort des projets Open-Source, les développeurs se heurtent à des problèmes de
compatibilités croisées et d'inconsistances.  
Aujourd’hui les standards sont de plus en plus permissifs et favorisent
ainsi les comportements à risque. La plupart du temps, les systèmes sont capables de
corriger vos erreurs, des fois sans même vous en avertir.

Dans ce contexte :
- Comment écrire un code multi-plateforme fonctionnel ?
- Comment être sûr que les ajouts ne cassent pas le code plus ancien ?
- Comment être sûr que le code se comporte comme voulu ?

Commencer par vous imposer des pratiques de développement rigoureuses est impératif
mais les tests seront un complément indispensable à la qualité de votre code.

Heureusement, le TDD apporte alors une réponse élégante à l'ensemble de ces problématiques.

## TDD, vous avez dit TDD ?

Le Test Driven Development _(Développement Dirigé par les Tests)_,
est une technique de développement qui impose l’écriture de tests
avant même l’écriture de la première ligne de code.

Dans la théorie, la méthode requiert l’intervention d’au moins
deux intervenants différents, une personne écrit les tests, l’autre
le code testé. Cela permet d’éviter les problèmes liés à la subjectivité.

Dans la pratique les choses sont plus compliquées,
parfois on développe seul ou on écrit soit même les tests qui
garantissent l’intégrité d'une nouvelle feature dans un projet collaboratif.

> Quoi qu’il arrive, un test peu efficace vaudra toujours mieux que pas de test du tout.
> Le but étant de prendre l’habitude d’en écrire et d’être objectif dans leur rédaction.

Le TDD tend à se démocratiser et elle requiert l’effort de chacun pour devenir un standard.
Tout développeur soucieux de son environnement et de son héritage doit se poser sérieusement
la question.  
Les frameworks de tests, les guides et les documentations sur le sujet fleurissent,
vous pouvez donc vous lancer sans crainte.

On peut découper le TDD en 5 étapes distinctes :

1. Ecrire un test.
2. Vérifier qu’il échoue.
3. Ecrire le code **suffisant** pour que le test passe.
4. Vérifier que le test passe.
5. Optimiser le code et vérifier qu’il n’y ai pas de régression.

Pour simplifier cette logique on peut regrouper ces cinq étapes en trois grandes idées :

- **Tester d’abord**, qui correspond aux 2 premières étapes.
- **Rendre fonctionnel**, qui englobe les points 3 et 4.
- **Rendre meilleur**, qui n’est autre que l’étape 5.

Bill Wake définit ainsi la méthode [3A](http://xp123.com/articles/3a-arrange-act-assert/),
pour Arrange, Act, Assert _(Arranger, Agir, Affirmer)_.  
Il insiste sur le fait que la méthode ne définit pas un ordre immuable,
l’_affirmation_ peut ainsi venir avant l’_action_, etc...

- **Arranger** : Phase de préparation de l’environnement de test dans laquelle
on déclare les variables et les fonctions.
- **Agir** : Phase qui met à l’épreuve notre environnement en lui faisant subir des mutations.
- **Affirmer** : On formule des attentes à propos de l'environement
(variables, fonctions, paramètres).

## TDD : concepts de base

Pour la série de tests suivante on utilisera EcmaScript 6 et la methode
[`.assert()`](https://developer.mozilla.org/fr/docs/Web/API/Console/assert)
de la console navigateur: Vous pourrez ainsi reproduire ces tests vous-même.

Objectif : Ecrire une fonction `countWords()` qui compte les mots d'une phrase.

**ITERATION 1** : écriture et échec du test initial

On écrit tout d'abord une affirmation de base.
```js
console.assert(countWords('') === 0, 'test 0: le texte ne contient aucun mot');
```
> `Uncaught ReferenceError: countWords is not defined`

Après execution la console rejette le test.
On doit d'abord définir `countWords()`.

```js
const countWords = () => {};
console.assert(countWords('') === 0, 'test 0: le texte ne contient aucun mot');
```
> `Assertion failed: test 0: le texte ne contient aucun mot`

`countWords()` est définie et le test échoue mais l'erreur a changé.  
Il faut à présent définir la logique du coeur de notre fonction.

```js
const countWords = text => text || 0;
console.assert(countWords('') === 0, 'test 0: le texte ne contient aucun mot');
```
> `undefined`

La console ne renvoie rien, le test est donc passé.  

> `countWords()` étant très simple nous omettrons les phases d'optimisation.
> On peut aussi considérer que les itérations suivantes comme des optimisations.

**ITERATION 2** : test pour les phrases d'un seul mot

Très bien. Essayons à présent une phrase d'un seul mot.

```js
const countWords = text => text || 0;
console.assert(countWords('') === 0, 'test 0: le texte ne contient aucun mot');
console.assert(countWords('nope') === 1, 'test 1: le texte contient 1 mot');
```
> `Assertion failed: test 1: le texte contient 1 mot`

`countWords()` ne compte pas correctement, ajoutons le code suffisant pour passer le test.

```js
const countWords = text => text ? text.split(' ').length : 0;
console.assert(countWords('') === 0, 'test 0: le texte ne contient aucun mot');
console.assert(countWords('nope') === 1, 'test 1: le texte contient 1 mot');
```
> `undefined`

Le test est passé, ajoutons un autre cas standard.

**ITERATION 3** : test pour les phrases de plusieurs mots

```js
const countWords = text => text ? text.split(' ').length : 0;
console.assert(countWords('') === 0, 'test 0: le texte ne contient aucun mot');
console.assert(countWords('nope') === 1, 'test 1: le texte contient 1 mot');
console.assert(countWords('tdd is fun bro') === 4, 'test 2: le texte contient 4 mots');
```
> `undefined`

Le nouveau test passe sans modification, on peut continuer.

**ITERATION 4** : test pour les phrases contenant des espaces au début et à la fin

Vérifions à présent la robustesse de la fonction.

```js
const countWords = text => text ? text.split(' ').length : 0;
console.assert(countWords('') === 0, 'test 0: le texte ne contient aucun mot');
console.assert(countWords('nope') === 1, 'test 1: le texte contient 1 mot');
console.assert(countWords('tdd is fun bro') === 4, 'test 2: le texte contient 4 mots');
console.assert(countWords(' so is skateboarding ') === 3, 'test 3: le texte contient 3 mots');
```
> `Assertion failed: test 3: le texte contient 3 mots`

Aie.. notre fonction n'est pas assez solide. Corrigeons la pour capter ce nouveau cas en supprimant les
espaces inutiles avant et après le texte.

```js
const countWords = text => text ? text.trim().split(' ').length : 0;
console.assert(countWords('') === 0, 'test 0: le texte ne contient aucun mot');
console.assert(countWords('nope') === 1, 'test 1: le texte contient 1 mot');
console.assert(countWords('tdd is fun bro') === 4, 'test 2: le texte contient 4 mots');
console.assert(countWords(' so is skateboarding ') === 3, 'test 3: le texte contient 3 mots');
```
> `undefined`

Parfait, La fonction est améliorée! Ajoutons quand même un dernier test pour être sur.

**ITERATION 5** : test pour les phrases contenant un nombre inégal d'espaces entre les mots

```js
const countWords = text => text ? text.trim().split(' ').length : 0;
console.assert(countWords('') === 0, 'test 0: le texte ne contient aucun mot');
console.assert(countWords('nope') === 1, 'test 1: le texte contient 1 mot');
console.assert(countWords('tdd is fun bro') === 4, 'test 2: le texte contient 4 mots');
console.assert(countWords(' so is skateboarding ') === 3, 'test 3: le texte contient 3 mots');
console.assert(countWords(`  I'm 28, I love $#@! and    multi-spaces  `) === 7, 'test 4: le texte contient 7 mots');
```
> `Assertion failed: test 4: le texte contient 7 mots`

Et mince.. Encore un cas particulier, modifions l'algorithme en conséquence.
On doit ici retirer les espaces inutiles entre les mots.

```js
const countWords = text => text ? text.trim().replace(/\s+/g, ' ').split(' ').length : 0;
console.assert(countWords('') === 0, 'test 0: le texte ne contient aucun mot');
console.assert(countWords('nope') === 1, 'test 1: le texte contient 1 mot');
console.assert(countWords('tdd is fun bro') === 4, 'test 2: le texte contient 4 mots');
console.assert(countWords(' so is skateboarding ') === 3, 'test 3: le texte contient 3 mots');
console.assert(countWords(`  I'm 28, I love $#@! and    multi-spaces  `) === 7, 'test 4: le texte contient 7 mots');
```
> `undefined`

Le test final est passé sans que les précédents n'échouent.

On notera que l'écriture de tests est un processus itératif.  
La phase d'optimisation implique l'écriture d'un nouveau test qui échoue
et relance donc une nouvelle itération.

Evidemment `countWords()` est très largement sous-optimisée et ne couvre pas tous les cas spéciaux.
On aurait pu ajouter une vérification sur le paramètre `text` et compter avec une expression régulière comme ceci :

```js
const countWords = text => typeof text === 'string' && text.trim() ? text.match(/\S+\s{0,1}/g).length : 0;
```
L'idée ici est que coder est un processus incrémental et que chaque nouveau cycle doit être initié
par un besoin spécifique défini par un test dédié.  

L'écriture des tests est simple: on décompose notre script en une suite d'affirmations
correspondant chacune à une fonctionnalité précise de notre algorithme.

Grâce à ce processus on évite :
- **les régressions**: la suite valide de tests est la garantie que le code reste
fonctionnel malgré les évolutions de l'algorithm.
- **le code mort**: chaque morceau de code écrit est testé et a son utilité.
- **le code non documenté**: chaque comportement est décrit de manière fonctionnelle.

## BDD : Des tests pour tous

Une variante plus agnostique de la logique du développeur existe et permet à des
intervenants externes de faire partie intégrante du processus créatif.

le BDD, Behaviour Driven Development (Développement Dirigé par le Comportement),
permet de définir de manière compréhensible pour tous les intervenants les
spécifications d’une fonctionnalité. Cela permet aussi aux développeurs de comprendre
le comportement général sans évoquer les détails techniques.
La discussion est donc facilitée entre les différents acteurs.  

Pour illustrer cette variante adaptons l'exemple précédent :

> Note : Pour exécuter ce type de code vous aurez besoin d'un _test-runner_ comme
> [Jest](https://facebook.github.io/jest/), [Mocha](https://mochajs.org) ou [Karma](https://karma-runner.github.io).

```js
const countWords = text => text ? text.trim().replace(/\s+/g, ' ').split(' ').length : 0;

describe('countWords()', () => {
  it('doit traiter un texte vide', () => {
    expect(countWords('')).toBe(0);
  });

  it('doit traiter un texte d\'un seul mot', () => {
    expect(countWords('nope')).toBe(1);
  });

  it('doit traiter un texte de n mots', () => {
    expect(countWords('tdd is fun bro')).toBe(4);
  });

  it('doit traiter un texte avec des espaces aux extrémités', () => {
    expect(countWords(' so is skateboarding ')).toBe(3);
  });

  it('doit traiter un texte avec des espaces inégaux entre les mots', () => {
    expect(countWords(`  I'm 28, I love $#@! and    multi-spaces  `)).toBe(7);
  });
});
```

Voici le résultat du run :

![résultat du run de tests](./testrunner.png)

La relecture est simplifiée pour tous les participants non technique.

## Conclusion

Le TDD est destiné à être incorporé à un processus d'[Intégration Continue](http://putaindecode.io/fr/articles/ci/)
pour s'assurer du bon fonctionnement de l'application sur tous les environnements
de production après chaque nouveau `commit`.  

J'espère vous avez apprécié la demo et que ça vous a donné envie de
tester le TDD pour apporter équilibre et harmonie à votre code.  

Dans tous les cas, je peux vous certifier que les autres codeurs vont
en seront reconnaissant, croyez-moi.
