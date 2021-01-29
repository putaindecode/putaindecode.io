---
title: Écrivez du code stupide
date: 2021-01-29
author: bloodyowl
---

Dans les premières années de nos carrières, on se concentre souvent sur le fait
de faire du code dont on peut être fier. Du code propre. Du code élégant. Du
code intelligent.

J'ai passé des heures à essayer que mon code fasse des trucs intelligents, à
essayer d'éviter la répétition à tout prix avec de la factorisation, à écrire
des abstractions dans tous les sens, m'assurant que j'écrivais toujours le bout
de code le plus court pour une tâche donnée.

J'en ai aujourd'hui plus rien à secouer. Du tout.

J'en suis arrivé à un petit mantra:

<div style="font-size: 32px; text-align: center;">
  <strong>Faites des plans intelligents.</strong><br>
  <strong>Écrivez du code stupide.</strong>
</div>

## Pourquoi → Comment → Quoi

J'aime beaucoup la conférence TED
[«Start with why»](https://www.youtube.com/watch?v=u4ZoJKF_VuA) de Simon Sinek
(vous l'avez très certainement déjà vue), et bien que ça parle de boites, je
pense que l'idée générale peut s'appliquer à beaucoup de domaines.

Pour paraphraser un peu: **partez de la vision, ensuite trouvez comment le
faire, ensuite faites-le**.

![Why, how and what](/public/images/articles/2021-01-29-ecrivez-du-code-stupide/GoldenCircle.png)

Bien sûr Sinek parle d'un principe général, mais dans notre cas ça marche aussi
pour des cas précis.

### Pourquoi

Savoir le **pourquoi**, c'est ce qui nous fait comprendre dès le départ quelle
**valeur** on est censé amener. Le **pourquoi** c'est notre ligne directrice, ce
qu'on vise. Quand on sait le **pourquoi**, même si on se retrouve bloqué dans la
technique, ça nous donne l'opportunité de trouver et de proposer des
alternatives qui offrent une valeur équivalente.

### Comment

Une fois qu'on sait **pourquoi** on va faire quelque chose, on peut se
concentrer sur le **comment**. **Comment** est-ce qu'on rend ça réel ?
**Comment** ça va marcher ? **Comment** notre fonctionnalité, notre idée ou
notre fix va s'intégrer dans le projet ? **Comment** la solution un s'évalue
face à la solution deux ?

### Quoi

Une fois qu'on a plannifié le **comment**, le **quoi** est la partie la moins
intéressante. C'est un boulot de traduction. On écrit dans un langage ce qu'on a
exprimé dans un autre.

Faire les choses dans cet ordre a de multiples avantages pour l'organisation et
les gens qui la composent :

- les gens connaissent la valeur qu'ils vont apporter dès le départ
- avec l'objectif en vue, les gens ont en général de meilleures idées
- les "mauvaises" idées sont éliminées tôt dans le processus

## Notre boulot n'est pas une question de code

Ce que je considère comme étant un·e bon·ne développeur·se, c'est pas quelqu'un
qui va écrire le one-liner le plus efficace, mais quelqu'un qui est doué·e pour
aller du **pourquoi** au **comment**, et arrive simplement à faire le **quoi**.

Pour arriver là, je pense qu'à un certain point, on doit tous et toutes arrêter
d'avoir quoi que ce soit à faire du "beau code". Dans ce sens, les outils de
normalisation comme [Prettier](https://prettier.io) sont à mon avis une des plus
grosses avancées qu'on ait faites dans les années récentes, parce qu'ils nous
ont permis de concentrer notre énergie ailleurs que sur les effets de bord sans
intérêt du **quoi**.

Notre boulot, c'est de transformer une **vision** en **réalité**.

Le code n'est pas une fin en soi. C'est pour ça que je crois fermement au **code
stupide**.

## C'est quoi du "code stupide"?

Ce que j'appelle **code stupide**, c'est du code qui est:

- **facile à lire**: pour que vos collègues (ou votre futur vous) puissent
  comprendre facilement
- **explicite**: c'est pas grave si votre nom de variable ou de fonction fait 30
  bornes de long. Ne mettez pas dans un commentaire ce que vous pouvez mettre
  dans un nom.
- **honnête**: n'essayez **pas** de cacher la complexité métier pour en faire
  une fausse simplicité. La seule chose que vous accomplirez c'est faire en
  sorte que les gens doivent aller dans pleins d'endroits dans le code pour
  comprendre les idées.
- **supprimable**: pour ne pas arriver dans la situation où personne n'ose
  toucher à un bout de code, ne sachant pas si ça va casser quelque chose

Pour prendre un exemple trivial, dans la codebase React de ma boite, on fait du
**prop-drilling**, ce qui veut dire qu'on passe toute la donnée depuis le
composant à la racine à ses descendants via les props. Fut un temps je trouvais
ça affreux. Aujourd'hui, certains se battraient encore contre ça, parce que ça
n'a pas **l'air propre**, qu'on ferait mieux d'utiliser un **data store
séparé**.

Bien sûr. C'est stupide.

C'est la manière la plus stupide de passer de la donnée d'un composant à ses
descendants. **C'est aussi le plus simple**. N'importe qui ayant bossé sur une
codebase React sait comment passer une prop à un composant. N'importe qui lisant
la source d'un composant sait **exactement** de quelles données il a besoin en
quelques secondes. Si on utilisait un data store, cette personne devrait
probablement naviguer entre 3 ou 4 fichiers juste pour comprendre ce qui se
passe.

Quand vous écrivez du **code intelligent**, la personne que vous avez le plus de
chances de balader, c'est le vous du futur, quand vous allez revenir sur votre
bout de code _super malin_ dont vous vous souviendrez pas et sur lequel vous
allez passer plusieurs heures à essayer de le piger.

Que votre bout de code soit intelligent ou stupide, ça ne change rien pour
l'utilisateur final. Ce n'est que du code source. Si un bout de code stupide
vous permet d'ajouter de une valeur plus rapidement à votre produit, pourquoi
perdre du temps ? Si le bout de code stupide est facilement compréhensible,
pourquoi l'obfusquer en essayant de le rendre plus malin qu'il n'a besoin de
l'être ?

![Effort on value](/public/images/articles/2021-01-29-ecrivez-du-code-stupide/EffortValue.png)

**Le code stupide réduit mécaniquement l'effort\*\*** immédiat et futur, rendant
la valeur que vous apportez plus accessible.

Si on était des machines à écrire du code, on apporterait pas une immense
valeur.

On est doué·e·s quand on prend un peu de recul et qu'on a une vue d'ensemble.

<div style="font-size: 32px; text-align: center;">
  <strong>Faites des plans intelligents.</strong><br>
  <strong>Écrivez du code stupide.</strong>
</div>

_→ Cet article est également disponible
[en anglais](https://bloodyowl.io/blog/2021-01-09-write-dumb-code/) sur mon
blog_
