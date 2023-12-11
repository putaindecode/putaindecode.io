---
title: Soulé par les primitives HTML pour vos webapps ? Utilisez React Native
date: 2023-12-12
author: MoOx
slug: soule-par-les-primitives-html-pour-vos-webapps-utilisez-react-native
---

Nous en avons déjà parlé, [les primitives du web sont chiantes](/articles/le-web-merite-de-meilleures-primitives).
HTML et CSS sont nécessaires, mais comme [l'assembleur](https://fr.wikipedia.org/wiki/Assembleur).
Et qui code en assembleur aujourd'hui ? Pas grand monde, et c'est très bien comme ça.
HTML et CSS existent mais ça ne veut pas dire pour autant qu'on doit les utiliser sans abstraction.

L'évolution du web au sens large (je ne parle pas ici que de HTTP, HTML & co) est rapide. Le commun des mortels passe aujourd'hui plus de temps sur leur smartphone dans des applis natives que sur des pages web. Plus de temps à avoir des expériences intuitives, accessibles et fluides.

Doit-on donc en tant que développeur se faire chier à tout coder avec des primitives bas niveau ?
Pourquoi croyez vous que des multinationales comme Meta, Microsoft ou Google ont créé et investissent dans des frameworks comme React Native ou Flutter ?
Pour gagner du temps. Mettons de côté l'aspect capitaliste de cette approche (coder moins pour gagner plus) bien que ça soit déjà un argument en soi.
Notre temps d'être-humain est précieux. Alors pourquoi le gaspiller à coder des choses avec des langages bas niveau ?

Je vais pas tourner autour du pot, parlons de [_React Native for Web_](https://necolas.github.io/react-native-web/), un clone web du framework largement adopté [React Native](https://reactnative.dev).
C'est vraiment quelque chose que vous devriez sérieusement considérer lors de vos développements front-end, non seulement pour ses performances dans les applications multiplateformes, mais aussi comme une solution autonome pour le développement web.

Déjà, sachez que, _React Native for Web_ n'était pas censé être un clone de _React Native_. Il devait simplement apporter un SDK web (pour apporter des meilleurs primitives), inspiré de _React Native_ certes, mais pas un clone. Son petit nom de naissance était d'ailleurs [React Web SDK](https://github.com/necolas/react-native-web/commit/e34820c11c82417f673103c2d67ecd19e26f0193).

_React_ est un framework axé sur le web mais dépendant fortement du DOM, ce sacré petit DOM qu'on doit délaisser petit à petit.
_React DOM_ est notre ami, mais il est temps de le laisser partir. Il est temps de passer à autre chose. De le réléger au rang d'utilitaire comme une Citroën C15.
_React DOM_ n'est qu'une implémentation du réconciliateur _React_ pour le DOM. Il en existe d'autres comme [React Native for Windows and macOS](https://microsoft.github.io/react-native-windows/) ou même [@react-three/xr](https://github.com/pmndrs/react-xr) quand on a envie de faire du spatial computing du pauvre.

Le créateur de _React Native for Web_, [@necolas](https://github.com/necolas) en avait surement plein le cul du couple HTML/DOM et s'est donc inspiré de _React Native_.
C'est quand même bien plus cool d'avoir des composants explicites comme `<View />`, `<Text />`, `<Image />`, `<ScrollView />`, `<Pressable />` avec des props qui facilitent la vie...
Et finalement, ce SDK web est devenu un clone de _React Native_ pour en faire une solution autonome pour le développement web, et pas seulement comme un compagnon pour les applications multiplateformes (oui je radote).

Avant que le gros pépère Elon Musk pète un plomb, Necolas était heureux et travaillait chez [~~Twitter~~ X](https://twitter.com/) où il bossait sur une nouvelle implémentation web. A l'époque, le résultat de son travail était quand bien [plus que bienvenue](https://twitter.com/necolas/status/1058949372837122048). Rien que pour la perf CSS, on peut saluer _React Native for Web_.

On le sait tous que [CSS à de gros défaut](/articles/pourquoi-j-ai-arrete-d-utiliser-css). On a pas arrêter d'en parler [ici](/articles/comprendre-le-css-in-js-par-l-exemple) et [là](/articles/retour-sur-plusieurs-annees-de-css-in-js).

En s'appuyant sur un sous-ensemble de CSS (principalement Flexbox), grâce à _React Native for Web_, on peut maintenir des styles cohérents sur tous les navigateurs et toutes les plateformes. Cette cohérence simplifie non seulement le processus de développement, mais garantit également que l'identité visuelle de l'application reste cohérente, même si une application mobile n'est pas immédiatement prévue.

Mais y'a pas que le CSS dans la vie, et on a déjà une tétra-chié de solutions CSS-in-JS disponibles.

Là je vous parle d'avoir un impacte sur la plateforme web dans son ensemble.

## Avant que vous me chier dessus, parlons d'accessibilité

Un aspect remarquable de _React Native for Web_ est son engagement envers [l'accessibilité](https://necolas.github.io/react-native-web/docs/accessibility/). Oui oui, HTML lui-même offre de nombreuses fonctionnalités d'accessibilité, mais clairement, c'est pas la grosse marrade quand il faut apprendre tout ça. Et c'est assez plaisant que _React Native for Web_ facilite la construction d'applications web accessibles.
Vous avez déjà utiliser Twitter avec un clavier ? Testez.
C'est fait avec _React Native for Web_ et c'est accessible. Et c'est pas le seul exemple mais il est assez gros pour vous rendre compte qu'on est bien loti avec cette solution.

C'est très bien qu'en France on est [RGAA](https://accessibilite.numerique.gouv.fr). Mais si on doit se faire chier à la main pour rendre accessible une application web, c'est pas la joie. Et c'est pas avec des primitives HTML qu'on va y arriver. C'est pas avec des `<div>` et des `<span>` qu'on va rendre accessible une application web.
Puis quand on veut faire des trucs un peu chiadé avec des animations stylés et la gestion des inputs utilisateurs (leurs gros doigts là), c'est quand même cool avec des libs bien foutus comme [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) et [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/).
Un petit [React Native Bottom Sheet](https://github.com/gorhom/react-native-bottom-sheet) accessible sans effort, c'est pas cool ?

## Avant que vous me chier dessus avec "mais si je veux faire bidouiller mon DOM un peu"

Mais bien sur que vous serez pas bridé avec RNW. Tranquille, détendez-vous.
Si tu fais du RNW, tu peux y aller progressivement, ou inversement (démarrer un projet full RNW).
À tout moment, tu peux tranquillement faire ton petit bout de code cra-cra où tu vas patauger dans le DOM tel un Indiana Jones en fin de vie.
T'inquiètes pas, tu peux utiliser n'importe quand l'API _React DOM_ ou utiliser toute la plateforme web sans aucune limitation. Ta petite `<div>`, ton petit `<canvas>` ou autre. Aucune restriction mon bichon ! Hop hop tu utilises [l'API Platform](https://reactnative.dev/docs/platform) ou tu sors ta meilleur plume pour directement écrire dans un fichier web spécifique, en utilisant une extension `.web.js`.

Wait, what ? Une implémentation web pour un composant donné ?

## Parce que le web c'est pas que des applis web

Même si vous n'avez pas envie immédiat de faire une application iOS ou Android, **l'utilisation de _React Native for Web_ peut vous ouvrir la porte à ces plateformes, alors que l'inverse n'est pas vrai**. Si vous commencez une application web en utilisant directement _React DOM_, vous ne pourrez pas facilement partager votre code avec d'autres plateformes car vous serez limité au DOM.
Vous serez bien emmerdé quand votre boss vous annoncera un changement de buisness modèle à cause de cette putain d'inflation et qu'il faudra faire une application mobile pour les clients.

La codebase et les composants partagés entre _React Native for Web_ et _React Native_ pour mobile facilitent l'ouverture de l'application aux plateformes mobiles.

Faites le bon choix stratégique pour avoir une flexibilité dans les plans de développement futurs sans avoir besoin d'une refonte complète de l'application web existante, ou pire et encore plus couteux dans ce monde capitaliste: plusieurs implémentations.

Vous pourriez même utiliser votre codebase pour des applications Windows ou macOS en utilisant [React Native for Windows and macOS](https://microsoft.github.io/react-native-windows/), un projet maintenu par le frérot Microsoft, [utilisé sur des produits importants comme Office ou l'application Xbox Windows](https://microsoft.github.io/react-native-windows/resources-showcase). Oui, Microsoft Office et l'app Xbox utilisent l'API _React Native_ ! C'est pas rien non ?


Même si le grand méchant Meta vous effrait (moi le premier), rappelez vous que c'est open source. Des linuxiens (avec ou sans barbe) pourront toujours faire un fork.
Dans tous les cas, je vous invite à trouver votre compagnon de route pour le développement web.
Je vous ai dit que _React Native for Web_ est un très bon candidat ?

Et pour ceux qui on peur que Necolas pète un plomb et parte élever des vaches dans le Larzac, sachez qu'il travaille chez [Meta](https://www.meta.com) depuis belle lurette a apporté de nombreuses contributions à _React_ lui-même pour assurer un avenir prometteur pour les codebases multiplateformes. Si vous êtes curieux, vous pouvez jeter un œil à sa [RFC: React DOM for Native](https://github.com/react-native-community/discussions-and-proposals/pull/496) ou même au projet [StyleX](https://stylexjs.com/blog/introducing-stylex) qui [finira par être intégré à _React Native_ et _React Native for Web_](https://www.threads.net/@nicolas.img/post/C0fxzFuL4gp).

Tout ça pour dire que la prochaine fois que vous devez démarrez une application web, réfléchissez bien à la bonne abstraction.
Je vous ai parlé de  _React Native for Web_ ?
