---
title: Le vrai problème des Web Components
date: 2021-02-15
author: bloodyowl
slug: le-vrai-probleme-des-web-components
---

Les Web Components sont souvent vendus comme **l'alternative** des standards
face aux **frameworks** qui ont envahi le dévelopemment front-end depuis
plusieurs années. C'est un discours commercial (ou un discours d'_advocate_
comme on appelle ça dans le développement), mais qu'en est-il vraiment ? Les Web
Components sont-ils une **alternative viable** à React, Vue, Angular et consorts
? Tiennent-ils la promesse d'unifier tout le monde derrière une même bannière ?
À quoi servent-ils ?

## Un peu d'histoire

L'histoire des Web Components débute par une énorme tentative de forçage. Google
([qui n'en est décidément pas à son coup d'essai pour emmerder le monde avec ses idées de technos](https://pastebin.com/NUMTTrKj))
débarque, défonce la porte du W3C à grands coups de pieds, jette un brouillon de
spécification sur le bureau, crie "ET C'EST DÉJÀ DANS CHROME" et s'en va comme
il est venu. Dans le jargon on appelle ça une **belette sauvage**.

Mais que contient cette spécification ? Elle s'articule autour de quatre
concepts:

- des **templates**: du HTML inerte et clonable
- des **decorators**: un moyen d'appliquer du HTML depuis CSS (?)
- des **custom elements**: qui permettent de créer ses propres éléments
  utilisables dans un document HTML, avec leur comportement propre
- le **shadow DOM**: un système de sous-arbre DOM

Certains de ses aspects font rêver, comme **les styles scopés**, mais la
solution a du mal à prendre en dehors de Google. L'immense majorité de la
communauté est complètement paumée devant ce concept de shadow DOM et ne
comprend pas bien comment sont censés s'articuler les différents concepts de la
specification.

Passent quelques années et le W3C finit par faire évoluer le brouillon de
spécification en quelque chose de plus viable, mais ça met du temps. Le W3C
hérite de questions balayées par le document et doit les résoudre, avec le soin
de ne rien casser. La tâche est d'autant plus ardue que Chrome fait déjà tourner
la version brouillon.

Pendant ce temps, Google a eu le temps de promouvoir sa specification à fond les
ballons, avec des frameworks construits autour et une forte communication de
leurs _advocates_.

Aujourd'hui, les Web Components retrouvent un peu de succès grâce à des
[bibliothèques](https://lit-html.polymer-project.org) et
[frameworks](https://stenciljs.com) qui permettent de simplifier la gestion de
l'état et du DOM à l'intérieur du _custom-element_.

## Le problème fondamental des Web Components

Je pense que les Web Components ont un problème fondamental : en tentant de
réconcilier la généricité d'un web partagé par tous avec le fait de se créer son
propre "standard local", **ils finissent par ne répondre à aucun besoin
critique**.

### Le partage des custom elements

Partager et réutiliser, c'est la priorité **numéro 1** d'un système de
composants. C'est pourtant quasiment impossible à atteindre quand on rajoute
l'orchestration depuis HTML dans la balance.

La manière d'enregistrer un _custom element_ est de passer une `class` héritant
de `HTMLElement` à une petite API:

```javascript
window.customElements.define("my-tag-name", MyTagClass);
```

Comme la forme que prend cette API le suggère, `my-tag-name` sera ajouté
**globalement** à la page, ce qui est logique, puisque le tag doit être
utilisable dans du code HTML.

En général, pour rester pratique à l'usage, un module JavaScript dans lequel on
déclare un _custom-element_ va l'auto-enregistrer, et on trouvera l'appel à
`window.customElements.define` à la fin du fichier. Dès lors, pour utiliser
notre nouveau tag, il faudra simplement s'assurer qu'il a été déclaré dans la
page :

```javascript
// adds `my-tag-name` to our global scope if not already
import "./MyTag.js";
```

Le problème ici: entre la déclaration et l'utilisation, on trouve un **lien
faible**, et un oubli est vite arrivé. Il peut difficile pour des outils de
détecter qu'un tag n'est pas déclaré ou au contraire déclaré sans être utilisé,
puisque l'appel à `window.customElements.define` n'est pas **pur** au sens du
programme: déclarer un nouvel élément **peut avoir des effets de bord**.

L'API nous laisse en plus **responsables du _namespacing_** : il faudra toujours
préfixer vos noms de tags par une chaîne de caractères propre à votre
organisation, et pas de chance si des éléments tiers que vous comptez utiliser
sont tombés sur le même préfixe.

Le versionning semble également absent des considérations de la spécification.
Si différentes parties de votre application évoluent à des vitesses différentes
et que vous devez vous retrouver avec deux versions du même élément, l'une des
deux parties de votre application devra faire un sacrifice sur le nommage, avec
un `color-picker-legacy` ou un `color-picker-v2`.

### L'orchestration des composants

À moins d'être disposé à faire un retour de 10 ans en arrière quant à la gestion
de l'état et du DOM, il me semble peu souhaitable de les gérer soi-même. On va
donc avoir tendance à utiliser des bibliothèques et frameworks **dans ses
_custom-elements_**. Sans ces outils, on se retrouve dans les écueils de
maintenabilité qui limitaient ce qu'on est capable de produire sereinement.

Pour apporter une valeur qui dépasse le simple styling et une gestion d'états
très basique, les web-components dépendent eux aussi de solutions tierces. À
"praticité" égale, ils n'unifient pas les frameworks, ils en contiennent.

L'intérêt de pouvoir orchestrer ses Web Components via différents frameworks au
sens d'une même entreprise perd alors un peu de sa superbe, puisqu'on duplique
de la fonctionnalité entre la logique macro (orchestration) et micro
(comportement des éléments eux-même).

### Nos besoin pratiques ne sont pas ceux de HTML

Les _custom-elements_ étant des éléments HTML, ils héritent de leur manière
d'échanger de l'information: les **attributs**, les **propriétés** et les
**évènements**. Pour être utilisables depuis du code HTML, les attributs doivent
être **sérialisables**, et le reste devra passer par des propriétés et des
évènements.

Pour passer de l'information complexe, vous devrez donc impérativement passer
par du code JS:

```javascript
myCustomElement.value = 1;
myCustomElement.addEventListener("change", function(event) {
  // do something with event.target.value
});
```

Et si vous faites l'effort d'accepter des attributs sérialisés, votre code n'en
sera que plus complexe.

Hors frameworks, cette mécanique va par ailleurs compliquer votre capacité à
exiger des propriétés ou callbacks. Pour prendre un exemple simple, dans ma
codebase j'ai un composant `TouchableOpacity` (un bouton qui devient
semi-transparent lorsque la souris est appuyée dessus). Ce composant **impose**
via le compiler qu'on lui passe un callback `onPress`, faute de quoi ça signifie
que je n'utilise pas le bon composant adapté, ou que j'ai oublié de lui en
passer un. Cette mécanique me permet de créer sereinement des composants avec
des contraintes d'utilisation, et m'évite d'avoir à **supporter des cas non
souhaités**. Les custom-elements, si je les utilisais bas-niveau, m'imposeraient
à leur échelle de prévoir ce genre de cas.

Il est théoriquement possible d'avoir des outils capables de détecter et
d'alerter sur ce genre de comportements. En pratique, à moins d'imposer un outil
d'orchestration des Web Components (aka un nouveau framework), ça semble
fortement compromis.

### L'interopérabilité avec les outils génériques

Si je crois _crawler_ une page pour interpréter le sens, recevoir une miriade
d'éléments personnalisés a de grandes chances de m'empêcher d'en tirer un sens.
Prenons un exemple repris de la documentation de [Google AMP](https://amp.dev),
qui utilise les Web Components:

```html
<amp-list
  width="auto"
  height="100"
  layout="fixed-height"
  src="/static/inline-examples/data/amp-list-urls.json"
>
  <template type="amp-mustache">
    <div class="url-entry">
      <a href="{{url}}">{{title}}</a>
    </div>
  </template>
</amp-list>
```

AMP ajoutant les roles `aria` qui vont bien au _runtime_, le serveur me renvoit
le code vu plus haut. Qu'est-ce que je suis censé en faire ?

Est-ce que je dois:

- m'amuser à lister et interpréter manuellement tous les éléments custom de tous
  les sites ?
- forcer les gens à ajouter les rôles d'accessibilité à l'appel de leurs
  _custom-elements_, ce qui fait perdre un énorme intérêt à l'abstraction par
  composant

Il est possible de bidouiller des solutions pour faire du Server-Side Rendering,
mais c'est en réécrivant le contenu de chaque _custom-element_ lorsque le
JavaScript prend le relai, ce qui n'est pas idéal à l'étape où le navigateur
travaille le plus.

## Un rêve irréconciliable avec la réalité

La plupart des problèmes que j'ai listé ici me paraissent cruciaux lorsqu'on
développe une application web avec des attentes modernes. C'est à mon avis la
raison du succès des frameworks front-end : **ils les ont réglé avec de
l'outillage**.

Les **Web Components**, qui cherchent à résoudre une partie des problèmes
auxquels s'adressent les framework, ont quant à eux la tâche beaucoup plus
ingrate, faire la même chose avec les impératifs de **standardisation** et de
**retro-compatibilité**, sans pour autant empêcher les **évolutions futures**.

Ajouter la nécessité de pouvoir sérialiser en HTML ses composants dont le
comportement est déclaré dans du code JavaScript, en imposant un lien faible
entre les deux (mon navigateur n'affiche aucune erreur si j'utilise un tag non
enregistré), c'est se tirer une balle dans le pied. La **separation of
concerns** n'a de sens que si nos **concerns** sont indépendants, et ce n'est
définitivement pas le cas des Web Components.

Ils ne **parviennent pas à réconcilier** les contraintes inhérentes aux
standards avec la fonctionnalité qu'ils doivent apporter, et **c'est tout à fait
normal** : Google a essayé de faire rentrer un rond dans un carré, empilant les
concepts jusqu'à perdre la substance même du besoin original : faire un standard
de composants réutilisables sur le web.

En se foutant royalement du concessus (qui aurait eu de fortes de chances de
déboucher sur «venez on le fait pas»), Google a foncé tête baissée pour créer
une fonctionnalité pas finie, déjà limitée dans ses évolutions futures par son
l'adoption que l'entreprise s'est efforcée de lancer à grands coups de
communication et d'_advocacy_.

C'est dommage.
