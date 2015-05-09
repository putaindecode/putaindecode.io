---
date: "2014-10-21"
title: À la conquête des bugs
tags:
  - bug
  - webcompat
  - monoculture
authors:
  - magsout
---

Le Web, depuis sa création est un vaste champ de bataille. Que ce soit les problèmes de compatibilités, les formats ou les langages propriétaires, la volonté de faire du Web un monde ouvert ne date pas d'hier.

## Au départ

Les débuts du Web furent compliqués. On assista à une guerre entre Netscape et Microsoft. Chacun voulant dominer le marché, en tentant d'imposer ses propres technologies. En 1996, Netscape propose au W3C JSSS (JavaScript-Based Style Sheets). Ce n'est d'ailleurs que depuis novembre 2000 que Netscape, basé sur le moteur Gecko (moteur de Mozilla Firefox), prend véritablement en charge le CSS. Microsoft pour sa part ne supportait par JavaScript à ses débuts et avait développé son propre langage JScript.

Ces problèmes de compatibilités, de technologies et de respect des normes vont considérablement ralentir l'évolution du Web.

## Les petits nouveaux

L'arrivée des nouveaux navigateurs tels que Firefox, Chrome ou même Opera va inverser cette tendance. Les parts de marchés d'Internet Explorer baissant, les développeurs prenant conscience du potentiel du Web, vont déclencher une montée en puissance du Web.

On pourrait croire que cette concurrence ne va apporter que des points positifs, mais pas tant que ça. Les parts de marchés vont pousser les navigateurs (ou les développeurs) à supporter des propriétés non standardisées, à mettre en place des préfixes et à développer une monoculture.

## Le début des problèmes

Les préfixes bien que partis d'une bonne idée, avaient pour objectif d'introduire les nouvelles propriétés CSS  toujours à l'état de proposition/discussion/standardisation. Cela a permis de pouvoir utiliser des propriétés telles que  `border-radius`, `transform`, `box-shadow` bien avant leurs finalisations. Le risque bien entendu, étant d'utiliser des propriétés qui pouvaient changer de spécification, comme ce fut le cas par exemple pour `flexbox`.

L'effet pervers a été aussi de ne pas utiliser tous les préfixes d'une propriété. Cela a eu pour conséquence de créer un Web (notamment sur le mobile) à deux facettes. Nous avions d'un coté les sites `-webkit` compatibles iPhone/iPad et le reste du monde.

Opera a d’ailleurs [abandonné](http://thenextweb.com/insider/2013/02/13/opera-300-million-users-webkit/) son moteur Presto en février 2013 au profit du moteur WebKit.

Plusieurs discussions houleuses ont d'ailleurs eu lieu sur l’implémentation des propriétés `-webkit` dans les moteurs Gecko ou Presto. Idée abandonnée en cours de route.


Coup de théatre [récemment](http://blogs.msdn.com/b/ie/archive/2014/07/31/the-mobile-web-should-just-work-for-everyone.aspx), Microsoft a intégré dans son moteur certaines propriétés `-webkit` pour obtenir des sites Web mobiles (trop basés sur `-webkit`) compatibles avec Windows Phone 8.1.

## Un début de solution ?

C'est dans ce contexte qu'est née l'initiative [webcompat.com](http://webcompat.com). Lancée initialement par des développeurs de chez [Mozilla](https://hacks.mozilla.org/2014/06/introducing-webcompat-com/) et quelques autres [contributeurs](https://github.com/webcompat/webcompat.com/graphs/contributors) en juin 2014.

Le site a un double objectif : rendre le Web le plus compatible possible et éliminer les bugs.

Le site accepte toutes sortes de bugs, que ce soit un problème de compatibilité entre navigateurs (`prefixe`, `sniffing UA`, etc), ou tout simplement un bug d'affichage, que vous soyez propriétaires ou simple utilisateurs du site.

Une fois le bug soumis, quiconque a la possibilité de proposer un diagnostic, de corriger le bug, voir de transmettre la solution aux équipes techniques du site en question (par Twitter, e-mail, GitHub, etc).

Le projet est libre et appartient à sa communauté.

Tout contributeur peut intervenir sur le site webcompat.com pour le [développement](https://github.com/webcompat/webcompat.com/issues?q=is%3Aopen+is%3Aissue+label%3Ahelp-wanted), ou même le [design](https://github.com/webcompat/webcompat.com/issues?q=is%3Aopen+is%3Aissue+label%3Adesign).  Mais bien sûr et surtout sur la correction de [bugs](https://github.com/webcompat/web-bugs/issues?q=is%3Aopen+is%3Aissue).

Microsoft vient d'ailleurs de [rejoindre](http://blogs.msdn.com/b/ie/archive/2014/07/31/the-mobile-web-should-just-work-for-everyone.aspx) Mozilla sur l'initiative webcompat.com. En lançant leur dernière version de Window Phone 8.1 ils ont constaté les [dégâts](https://github.com/webcompat/web-bugs/issues?q=is%3Aissue+is%3Aopen+is%3Aclosed+label%3Aie) de la monoculture des sites mobile.


Si comme eux, vous souhaitez rendre le Web plus compatible, n'hésitez pas à proposer votre aide. En effet, il est de notre responsabilité d’éviter tout monopole ou monoculture. Car même si les navigateurs ont leur part de responsabilité, nous, développeurs en avons une aussi.
