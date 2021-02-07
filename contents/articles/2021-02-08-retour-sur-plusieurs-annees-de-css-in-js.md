---
title: Retour sur plusieurs années de CSS-in-JS
date: 2021-02-08
author: bloodyowl
slug: retour-sur-plusieurs-annees-de-css-in-js
---

Voilà maintenant plus de 4 ans, je vous partageais [les raisons me poussant à me détourner de mon amour initial pour CSS](/articles/pourquoi-j-ai-arrete-d-utiliser-css/), alors que je m'en allais vers des alternatives qui proposaient des solutions aux problèmes que je rencontrais quotidiennement. 

L'article original, écrit dans la fougue de la jeunesse, utilisait un ton dit de "petit merdeux". J'ai bien conscience que ça n'avait à l'époque pas aidé à faire passer le message souhaité, comme peuvent [en témoigner](http://www.glazman.org/weblog/dotclear/index.php?post/2016/06/18/Pourquoi-il-n-aurait-pas-du-arrêter-d-utiliser-CSS) [les différents retours](/articles/pourquoi-j-ai-arrete-d-utiliser-css/#disqus_thread). Je donc vais profiter de cette rétrospective pour résumer son propos un peu plus finement. 

## Arrêter de sacraliser CSS

Au départ, CSS était de loin mon langage préféré de la stack web. J'ai adoré bidouiller avec ce langage pendant des années, faire le malin avec des hacks qui me permettaient de faire les rendus que je voulais. **J'ai adoré CSS**. Je trouvais ça chouette d'utiliser des pseudo-éléments pour faire des bords arrondis, de fabriquer mes sprites et de factoriser mes styles en commun derrière des sélecteurs.

Puis vint le travail en équipe et les projets plus gros. Chacun notre tour on casse quelque chose, quelque part dans le projet. On change le style appliqué à un sélecteur et ça applique ces styles à un endroit auquel on ne pensait pas. On corrige, ça pète quelque chose ailleurs. Le problème, c'est que **les sélecteurs s'appliquent globalement sur l'intégralité du projet**. Qui plus est, l'application d'un style est un calcul savant: il dépend non seulement d'un sélecteur, de l'**endroit où il est défini** dans la feuille de style (les derniers écrasent les premiers), mais aussi de ce qu'on appelle **sa spécificité** (une sorte de score de précision, qui fait que plus un sélecteur est considéré comme "fin" par le système, plus il prendra la précédence). Si cette complexité n'était pas suffisante, ce ne sont pas des déclarations de style indivisibles qui s'écrasent les unes les autres, mais les **propriétés individuelles** qu'elles contiennent, comme un gros `merge` complexe dont l'ordre varie selon tous les paramètres cités au dessus pour chaque élément. Il faut donc inspecter minutieusement ce qui s'applique déjà à un élément pour savoir quoi écraser ou non.

Naturellement, la feuille de style devient rapidement une course à la spécificité et on se retrouve avec des styles de plus en plus compliqués à annuler lorsqu'on veut appliquer une exception. Ça devient rapidement un **cauchemar de maintenabilité** : à chaque étape du projet on peut casser des éléments sans avoir voulu les changer, on doit **tout** revérifier à chaque changement.

On peut ceci dit y remédier, en se mettant d'accord sur des **méthodologies** qui feront en sorte d'éviter ce genre d'effets de bord, mieux vaut prévenir que guérir. C'est **BEM** (Block Element Modifier) qui retiendra mon attention, avec une logique plus simple à aborder que la majorité des autres méthodologies : on utilise des sélecteurs avec **la même spécificité**, des attributs `class`, qu'on nomme tous d'une certaine façon. Ce nommage indiquant clairement la nature et le rôle de chaque élément, on isole chaque bloc réutilisable derrière son **namespace**.

```html
<div class="UserProfile">
  <img class="UserProfile-avatar" src="..." />
  <h3 class="UserProfile-username"> ... </h3>
</div>
```

Dès lors, on change de modèle mental : en pratique les sélecteurs ne sont plus des instructions complexes pour trouver des élements de notre page selon leur contexte, mais un **simple clé-valeur**. HTML et CSS **partagent désormais cette clé**, et ça simplifie le travail de tout le monde : une approche unifiée pour toute l'équipe, **moins de conflits** dans l'application des styles, **moins de regressions**, et une **meilleure "recherchabilité"** (la clé étant partagée entre le markup et le style). Le seul détail qui fait tiquer c'est que les noms de `class` sont quand même un poil long et répétitifs.

La communauté réclame depuis des années un standard donnant la possibilité de créer des **styles "scopés"**, c'est à dire **limités dans leur porté**, ce qui résoudrait notre problème de noms trop longs. Et c'est une solution technique, hors standards, qui va apporter une solution : les **CSS modules**. C'est une technique d'injection des styles qui transforme les sélecteurs en les **préfixant de clés uniques, correspondant au scope**. Là où BEM nous forçait à maintenir notre namespace à la main, on a désormais un système capable de s'en charger, et ce système est moins faillible que nous. 

À mon sens, **les CSS modules sont la première occurence de CSS-in-JS**. Probablement une question de syntaxe, mais cette technique est relativement bien acceptée. Suite à la popularisation de ce système, les idées fusent et les solutions CSS-in-JS se multiplient, chacune avec son approche sur le sujet.

Qu'est-ce qu'on peut tirer de ça ? Que oui, comme le disent ses défenseurs, CSS est puissant, son système d'application des styles l'est très certainement. Ce n'est pas pour autant qu'il est **pratique** et **adapté** à de gros projets qu'on doit maintenir dans le temps. La complexité qui en découle **impose aux devs une forme de rigueur**, faute de quoi les regressions sont inévitables. **Ça a un coût, en temps passé et en énergie mentale déployée**.  Si cette rigueur peut être déléguée à une machine, quelle raison aurait-on de s'en priver ?

CSS a beau n'être qu'un **langage informatique**, on a parfois l'impression qu'il est considéré comme une **doctrine religieuse**, et on m'a souvent reproché de promouvoir des approches qui délèguent la charge mentale induite à une machine, avec l'argument que je ne savais pas faire de CSS. Parce que CSS, par sa volonté propre, voulait qu'il en soit autrement. 

Non, CSS n'a pas été originalement prévu pour être utilisé comme ça. Et c'est pas grave, c'était il y a 25 ans (environ un millénaire en années tech). Les usages, les besoins, tout ça a évolué. **Il y a 25 ans il était inimaginable que le web puisse devenir ce qu'il est aujourd'hui**, avec des interfaces incroyablement riches, permettant de faire à peu près ce qu'on veut depuis un navigateur. Pourquoi cette vision originale devrait nous freiner dans nos idées ? Pourquoi devrait-elle nous imposer une difficulté ? On ne parle pas d'un problème éthique complexe : qu'on délègue ou pas, qu'on automatise ou pas, ça ne change rien à personne. Il s'agit juste d'un attachement profond à une doctrine.

Je pense qu'il est temps d'**arrêter de sacraliser tous les aspects de CSS**. Je suis admiratif de son modèle de boite, de styling, et je pense honnêtement que c'est un des outils permettant l'expression du style de la manière la plus simple possible. En revanche, je trouve sa façon de résoudre les styles complètement obsolète et risquée dans les contextes où je l'utilise.

J'utilise les parties de CSS qui me permettent de faire ce que je veux (pour simplifier, tout ce qu'on trouve entre des accolades), et je délègue la gestion des autres parties à une machine.

## CSS-in-JS, qu'est-ce que ça apporte ?

Alors maintenant, au bout de 4/5 ans, qu'est-ce que ça donne, CSS-in-JS ? Est-ce que c'était une immense connerie ? Est-ce que c'est finalement une bonne idée ?

Pour expliquer un peu mon usage: je travaille sur une **web app dont je maîtrise le markup** (si ce n'est pas votre cas, il y a fort à parier que CSS-in-JS vous pose plus de problèmes que de solutions ⚠️). 

J'utilise deux "genres" de CSS-in-JS. Mon application se divise en deux parties: un widget dans une iframe-sourceless et un dashboard. Le widget utilise pour des raisons pratiques des styles inline (l'attribut style, oui oui 😱) et le dashboard la bibliothèque [emotion](https://emotion.sh/docs/introduction).

Eh bien je suis très content des deux. **Je n'ai pas eu la moindre régression liée à de l'application de style depuis que j'utilise CSS-in-JS**. 

Ma manière de définir et d'appliquer un style à un élément ressemble à ça (attention, c'est du [ReScript](https://rescript-lang.org)):

```reason
// on stocke la spécification dans une variable
module Styles = {
  open Css;
  let callToAction =
    style([
      backgroundColor(BeOpTheme.mainGreen->hex),
      fontSize(16->px),
      padding4(~left=40->px, ~right=40->px, ~top=13->px, ~bottom=16->px),
      borderRadius(26->px),
      color("fff"->hex),
      textAlign(center),
    ])
}
// on passe cette variable à l'élément souhaité
<TouchableOpacity onPress>
  <div className=Styles.callToAction>
    title
  </div>
</TouchableOpacity>
```

Que vous trouviez ça **joli ou moche, là n'est pas le sujet**. La machine fait ce qu'on lui dit. Elle génère un nom de `class` en faisant un hash des styles, cette `class` **ne pourra déclencher aucun effet de bord** ailleurs dans l'application. 

Ça m'a rendu la gestion des styles tellement **bête et simple** qu'il n'y a pas grand chose à dire dessus. **J'assigne à une variable une spécification de style**, et **je donne cette variable à l'élément** sur lequel je la veux appliquée, et ce sera le seul style appliqué à mon élément. _That's it_. Ça élimine une catégorie entière de problèmes, me laissant l'occasion de me concentrer sur d'autres choses. Vu que j'utilise une bibliothèque typée qui s'assure qu'une propriété reçoit une valeur d'un type attendu : **j'écris du CSS avec des petites roues**, ça m'évite même de laisser passer des fautes de frappe.

Et ce qui étaient autrefois des casse-têtes immenses sont gérés automatiquement : **ça élimine les styles morts** facilement, ce qui est virtuellement infaisable à grande échelle (ici, c'est simplement une variable, et on sait très facilement détecter les variables inutilisées). C'est même capable d'**extraire les styles critiques au rendu de la page**, automatiquement !

Quand je reviens à l'occasion sur des trucs nécessitant des sélecteurs CSS (pour des choses où je ne maîtrise pas le markup, et c'est un cas d'usage très légitime), je réalise à quel point j'avais accepté une complexité incroyable parce que c'était la seule façon. Quand j'y réfléchis bien, pour styliser des éléments, j'étais obligé de me **créer une cartographie mouvante dépendant d'un algorithme de résolution dont je n'avais pas forcément les paramètres à tout instant donné**. 

Les sélecteurs représentent une charge mentale énorme qui est **évitable**. C'est ça, la killer feature de CSS-in-JS.

La puissance des sélecteurs complexes CSS ne **valent pas le coup pour moi** tant que leur [balance bénéfice/risque](/articles/tradeoffs) est plus faible que l'alternative. **Si exprimer la même chose que le sélecteur CSS avec du JS est plus lisible et maintenable, je ne vais pas hésiter**.

C'est bien d'avoir un système ultra-puissant qui impose de déployer une énergie folle. Je préfère être capable de retourner dans mon code au quotidien [sans avoir à me faire des nœuds au cerveau](/articles/introduction-a-rud).

## Mais ça casse le web !

C'est un des nombreux arguments d'autorité qu'on a entendu au fil des années. Les technologies telles que CSS-in-JS, **ça casserait le web**.

Le blog que vous êtes en train de lire est [**une application web qui utilise CSS-in-JS**](/articles/comment-on-a-fait-ce-site). Est-ce qu'il casse le web ? Est-ce ça vous empêche de lire son contenu avec les styles désactivés ? Est-ce que ça vous empêche de parcourir le site sans JavaScript ? Essayez !

**Ce que le navigateur reçoit, il est parfaitement capable de l'interpréter**. 

**Ça ne change rien au résultat final**, et ça facilite la vie des gens qui travaillent dessus au quotidien. [Pourquoi on s'en priverait ?](/articles/2021-01-29-ecrivez-du-code-stupide) À l'heure où l'immense majorité du code qu'on écrit à destination d'un navigateur passe par une étape de compilation (que ce soit un préprocesseur, un minifier…), pourquoi ne pas aller au bout et considérer la plateforme web comme une "compilation target" ? Pourquoi ne pas s'autoriser une abstraction qui nous permet de travailler plus confortablement pour **un résultat équivalent, sinon meilleur** ?

## Pourquoi des réactions si épidermiques face à CSS-in-JS ?

Je pense qu'il est difficile d'envisager que **nos connaissances puissent devenir obsolètes**, particulièrement quand la connaissance a été difficile à acquérir. Tous les hacks CSS de mes débuts n'ont plus cours aujourd'hui, mes vieilles techniques ECMAScript3 sont inutiles depuis les mises à jour du langage, mes façons de gérer les interfaces en manipulant scrupuleusement le DOM me paraissent complètement archaïques maintenant que j'ai à disposition **des outils gérant toute cette complexité** pour moi. 

Ça n'a pourtant pas servi à rien : ça a forgé la vision du développement que j'ai aujourd'hui par la somme de mes expériences. **Chacun·e d'entre nous a une vision singulière grâce à son parcours et c'est une excellente chose**, parce que ça multiplie les points de vue et rend notre communauté plus riche.

Mais il faut être capable d'**archiver son savoir**, particulièrement dans les domaines technologiques où l'évolution est rapide, il faut toujours partir du principe que **l'utilité de nos connaissances n'est pas intemporelle**.

Demain, avec l'expérience collective accumulée et les progrès qu'elle induira, **ce qui a toujours été vrai ne le sera plus**. Certaines limites se poussent, d'autres se rapprochent. Dans l'immense majorité des cas, c'est pour le mieux : les applications qu'on est capable de produire aujourd'hui étaient encore impensables il y a quelques années. La vitesse à laquelle on est capable de les produire l'était encore plus.

## Qu'est-ce qu'on peut souhaiter maintenant ?

Ce que je souhaite pour les années à venir, c'est que les groupes de travail spécifiant les standards web parviennent à **mettre le doigt sur les problèmes décrits ici**, que je suis loin d'être le seul à exprimer.

Qu'on arrête de se concentrer sur des nouveaux sélecteurs, des nouveaux systèmes de layout ne faisant rien de plus que ce qu'on pouvait déjà faire avant ou des raccourcis pour des propriétés de transformation qui de toute façon dépendent de l'ordre dans lequel on les applique. Je ne dis pas que ce sont des propositions inutiles dans l'absolu, mais ça me semble être très superficiel au regard des **transformations structurelles** que des outils maintenus par la communauté proposent. 

J'aimerais qu'on déploie notre énergie à **rendre la plateforme meilleure**, **plus accessible** et **plus maintenable**. Aujourd'hui on est encore forcés de gérer nous-mêmes des "pièges à focus" pour nos modales, on n'a toujours pas de solution viable pour faire varier les propriétés CSS d'un conteneur selon l'espace à sa disposition (on est censé prévoir tous les contextes où un composant réutilisable va s'afficher, puis qu'on ne peut le faire varier que selon une taille de fenêtre), on n'a pas de brique native pour créer des animations utilisant des propriétés physique performantes (les applications natives mobiles parviennent avec elles à créer des animations logiques, aidant à la compréhension des interfaces). Ces problèmes ne sont pas nouveaux, certains sont identifiés depuis plus de 15 ans, et **de l'extérieur il ne semble pas qu'il s'agisse d'une priorité** (même si certains sont en cours de développement, ça aura quand même mis le temps). 

Quitte à laisser la communauté développer ses alternatives, autant lui offrir de **meilleures briques de base** (au hasard, un système natif de liste virtualisée), une **meilleure accessibilité par défaut**, **des arguments pour ramener sur le web des produits s'étant tournés vers les stores** mobiles pour y délivrer de meilleures expériences : tout le monde y gagne.

Plus on fera comme si les usages tels que ceux qui poussent les gens à utiliser CSS-in-JS n'existent pas, ou pire, qu'ils ne sont pas légitimes, plus la scission dans la communauté sera grande et **moins le web y gagnera**. 

Aliéner la communauté en expliquant avec dédain qu'une partie **fait de la merde**, qu'elle **ne sait pas se servir des outils qu'on lui met à disposition**, ça ne mènera nulle part. **Le narratif du _dev JS qui comprend rien à CSS et donc fait du CSS-in-JS_ n'a jamais tenu**, et la plupart des adeptes de CSS-in-JS ont utilisé (voire aimé) CSS avant d'y trouver des limites pratiques. 

Au motif d'une doctrine ou d'une préférence esthétique, ne pas chercher à comprendre **pourquoi** on se tourne vers de telles solutions, à comprendre les **limites structurelles** que pose le modèle qu'offre et promeut CSS, c'est retarder indéfiniment le moment où on pourra se poser autour d'une table pour parler de ces limites et y **trouver des solutions**.

Quand la majorité des application devra utiliser [WebAssembly](https://developer.mozilla.org/fr/docs/WebAssembly) pour contourner les limites de la plateforme et être en mesure de délivrer **de meilleurs produits pour leurs utilisateur·rice·s**, on pourra pas dire que ce sera sorti de nulle part.
