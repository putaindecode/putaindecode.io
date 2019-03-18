---
date: 2010-03-19
title: Introduction à la méthodologie RUD
author: jojmaht
slug: introduction-a-rud
---

> DISCLAIMER : Je me suis rendu coupable de tous les crimes contre la lisibilité que je décris ici, de A à Z.
> Je ne prétends aucunement que faire ces choses fait de vous (ou moi du coup hein, on se protège) de mauvais devs, je dis simplement que peut-être qu'il est temps qu'en tant qu'industrie nous nous posions pour réfléchir sur ce que nous devons défendre. Je pense que le code peut être simple, je pense que connaître les comportements arcanes d'un langage peut être à la fois une force et une faiblesse. Je pense que **le développement doit être accessible** au plus grand nombre. Je pense qu'il est temps d'en finir avec la notion de *vrai* ou de *faux* développeur. Je vous souhaite une bonne lecture, les opinions exprimées ici sont les miennes donc n'hésitez pas à me coller un procès au cul, à moi et moi seul (je partage pas).

Salut les copains, je profite de mon article annuel pour vous parler d'un autre truc qui commence doucement à m'éplucher les mirettes dans vos pratiques actuelles du développement informatique et pour cette fois, je connais un peu plus mon sujet.

Voyez-vous, J'ACCUSE; J'accuse vous, j'accuse moi, j'accuse tout, j'accuse toi. Je vous accuse tous autant que vous êtes de bien trop vous prendre la tête sur le styling de vos pages. Vous vous faites royalement chier à trouver la ligne de code élégante pour régler votre problème sans avoir l'élémentaire courtoisie de vous demander si un manos précédent n'a pas réussi à régler un problème corollaire sinon adjacent via *StackOverflow*. Que ce soit avec Flex ou sans Flex, Grid ou sans Grid, `float:left` ou sans `float:left`, vous vous fourvoyez **à la race**.

Soyez sans craintes très chers amis car joj (c'est moi, je m'appelle plus skinnyfoetusboy, surprise !) a la solution à tous vos petits maux, bobos et tracas. J'ai récemment élaboré une méthodologie CSS qui vous permettra de maintenir votre code plus efficacement, rendra la relecture plus simple et fera même revenir l'être aimé.

La recette miracle tient en trois lettre : *RUD*.

Rajoutez Une Div.

**Rajoutez. Une. Div.**

Le postulat de base est simple, il arrive régulièrement que nous cherchions la pureté dans notre code, cet instant où la grâce divine guide nos doigts pour écrire le code à notre place et où la frénésie remplace avantageusement le café dégueulasse à 35¢ de la machine d'à côté afin d'enfin venir à bout du centrage de cette div qui vous gonfle depuis bien trop longtemps, *et puis merde quoi, c'est pas à ça que ça devait servir, Flex ?*<br /> Vous tapotez ardemment sur votre clavier, Glenn Gould dans les oreilles comme sur les doigts pour trouver la solution à ce problème, putain, pourquoi quand ça *marche sur IE* ça **foire sur Chrome** et pourquoi quand ça **marche sur Chrome** ça *foire sur IE* ?

<figure>
  <img src="/images/articles/2019-03-19-introduction-a-rud/rud.jpg" />
  <figcaption>Moi, avant d'avoir rajouté une div vs. Moi, après avoir rajouté une div. Effets garantis.</figcaption>
</figure>

Vous cherchez depuis trop longtemps comment régler ça efficacement, depuis tellement longtemps alors que la solution est bien plus simple : RAJOUTEZ. UNE. DIV.
Enveloppez votre problème dans une div, foutez un `justify-whatever: center` et voilà. <br />
Posez-vous la question : pourquoi est-ce que vous n'avez pas rajouté cette div plus tôt ?
Pris dans un **orgueil mal-placé** et dans la volonté de faire beau/élégant/malin/stylé/wow-je-vais-en-faire-un-codepen plutôt que de faire simplement bien et maintenable, et malgré la meilleure méthodologie BEM du monde, on s'évertue à rentrer du `:before`, du `:after` et d'autres tas de trucs qui pourraient être vachement mieux branlés en rajoutant simplement une div dans le DOM à l'endroit où elle devrait être : dans le template. <br />**Pourquoi vous créez des éléments dans votre CSS bordel ?**

**Pourquoi j'en vois des qui gueulent sur le CSS-in-JS et qui font à côté la défense du HTML-in-CSS ?**

"Oui mais je vais quand même pas rajouter une div simplement pour afficher un chevron alors que je peux simplement claquer un `:before` ?" Si, si, vous allez faire ça, ça va vachement simplifier la peer-review de la pauvre personne qui s'en chargera, et ça aidera la personne qui relira votre code dans six mois (dans 90% des cas : vous) à comprendre ce que vous cherchiez à faire dans votre esprit malade.

La pureté du code n'est qu'une pauvre manœuvre de *gatekeeping* pour vous prouver que, oui mon chéri, maman t'aime fort car tu es très malin, bravo, tu gères des ternaires de huit lignes dans ta tête je suis fière de toi.<br />
En faisant ce genre de choses vous ne faites que perpétuer les croyances selon lesquelles le développement est une pratique arcane réservée à une élite alors que *vous êtes en train de développer le Wordpress de tonton Jean-Marc.*

L'autre bonne nouvelle vis-à-vis de cette méthodologie tout bonnement novatrice est qu'elle s'applique en réalité à tous vos besoins de développement, non pas en rajoutant des divs autour de vos conteneurs Docker (votre devops vous *cassera la gueule* si vous faites ça) mais en apprenant simplement à accepter qu'un code explicite est plus lisible, maintenable et propre qu'un code malin.<br />Je parlais plus haut de ternaires de huit lignes (expérience véridique), et je vous pose la question : quand vous écrivez un truc pareil, à aucun moment vous ne vous dites "euh dis donc, je serais pas un peu en train de me compliquer la vie" ?

Le développement informatique n'est pas un concours de minimalisme, vous n'êtes pas payés à l'absence de lignes de code, vos solutions alambiquées en 30 caractères ne sont que des *proofs of concept* face à la réalité de l'industrie.

Combien j'en ai vu qui étaient capables de me sortir des RegExp de tête ou de claquer du bitwise à toutes les sauces et de les utiliser, parfois pertinemment ? Plein en fait, des gens très talentueux d'ailleurs.<br />
Mais, les features compliquées du langage ont un sens, une raison d'être, et elles sont là pour vous, pas contre vous. Ainsi, vouloir à tout prix, à tout moment, utiliser les fonctionnalités les plus poussées pour accomplir les besoins les plus triviaux c'est simplement du **fayotage** à base de "regarde, j'ai bien appris ma leçon" (et on aime pas les fayots, relisez Le Petit Nicolas).

Je ne vous dis pas d'écrire du mauvais code (ni repris ni échangé ni remboursé je pars à Ibiza avec l'argent des abonnés) ni d'écrire le code le plus simple possible (parce que si vous faites ça ça redevient compliqué, faites pas votre app uniquement avec des if-statements, vous y êtes encore dans trente ans) : <br />Comprenez simplement vos outils et sachez lesquels vous maîtrisez.

Il sera peut-être parfois plus dur d'écrire du code ultra explicite mais croyez-moi bien quand je vous dis que vous serez content de pouvoir vous relire quand votre ternaire-dont-vous-êtes-super-fier-putain-j'ai-bossé pétera inévitablement au lieu d'être seul sur le sable, les yeux dans l'eau à essayer de vous remémorer votre mindset de l'époque en vous flagellant.

Certains me diront peut-être "oui mais c'est une bonne pratique de faire X ou Y" et je vous le dis, du code en prod vaut cent fois mieux que du code dans le manuel des Castors Juniors du web, même si ce dernier est "hyper propre" ou "**approuvé par Douglas Crockford**".

Il n'y a de *bonnes pratiques* que celles qui vous permettent de travailler **efficacement en équipe et avec vous-même**.

La vérité c'est que le développement web peut être simple et propre, et que le code spaghetti est toujours du code spaghetti même quand vous le comprenez (parce que vous êtes le seul à le comprendre) et qu'il vous fait vous sentir malin.
Si vous tenez tant que ça à faire du code illisible, allez donc faire de l'assembleur ou du brainfuck.

Je retourne me coucher.
