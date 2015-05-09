---
date: "2013-11-07"
title: "HTML\_? Hache-Thé-Aime-Elle vous dites\_?"
tags:
  - html
authors:
  - MoOx
---

Ahh, le HTML. LE [H.T.M.L](http://fr.wikipedia.org/wiki/HTML). Sacré langage hein ?

On le connait tous ce fameux truc qu'on retrouve dans pas mal d'URL : `.html`.
Oui, d'accord, par le passé on avait l'extension de radin `.htm`, mais elle n'a
clairement pas duré.

Vous vous demandez déjà ce qu'il y a à raconter sur l'HTML peut-être ? Et bien,
je ne suis pas là pour vous apprendre toutes les balises, leurs enfants, parents,
les cousins cousines, patati patata… Ah ça non, j'ai autre chose à faire,
et vous aussi. Et si c'est ce que vous cherchez, vous trouverez ce qu'il vous
faut sur [tout](http://docs.webplatform.org/wiki/html/elements)
[un](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
[tas](http://www.w3.org/html/wg/drafts/html/CR/dom.html#elements)
[d'autres](http://en.wikipedia.org/wiki/HTML_element)
[sites](http://www.vectorskin.com/referentiels-standards-w3c/balises-html5/).

Ce que je vais faire par contre, c'est tenter de partager un document sérieux
(dans le fond hein) avec tout pleins de conseils super pertinents pour que vous
écriviez de l'HTML comme personne.
Non, je déconne. En fait, ça va être la grosse marrade avec les trucs
les plus nazes que je peux vous raconter. C'est parti mon jQuéri.

## L'ancien testament

Si vous avez ouvert ne serait-ce que quelques documents HTML dans votre vie,
vous avez dû croiser ce qu'on appelle un [doctype](http://fr.wikipedia.org/wiki/Doctype)
qui ressemble à ça :

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
   "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
```

Vous pourrez remarquer dans ce ~~petit~~ gros bout de code bien relou qu'il y a
une [URL](http://fr.wikipedia.org/wiki/Uniform_Resource_Locator) :
c'est tout simplement la DTD (doctype) du langage en question.
Avec les spécifications pour la validation, toussa toussa…
Si vous avez 2 minutes, allez jeter un coup d'œil.

Je ne vais pas vous le cacher, et même si en théorie, par héritage de SGML/XML
ça part d'une bonne intention, dans la pratique ça sert juste à se toucher la
nouille sur la validation.
Car aujourd'hui HTML (5) n'est clairement plus du XML.

Oui bon ok, moi-même à une époque j'ai eu ma passe où je collais ce petit badge
partout dans mes footers :

<figure>
  <a href="http://validator.w3.org/check?uri=referer">
    <img src="http://www.w3.org/Icons/valid-xhtml10"
        alt="Valid XHTML 1.0 Transitional" height="31" width="88" />
  </a>
  <figcaption>Ça pète la classe hein ?</figcaption>
</figure>

Mais bon les conneries, ça va un moment.
Pour info, j'ai dû valider le code suivant pour obtenir ce logo :

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
   "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
 <html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title> </title>
</head>
<body>

</body>
</html>
```

Ben dites donc, c'est propre tout ça. Un petit document tout vide mais déjà
bien rempli.
Mais attendez, en 2013 on peut pas faire mieux ? Oh si !

## Le nouveau testament

```html
<!doctype html>
<title> </title>
```

Il faut savoir qu'un simple document _valide_, peut se résumer à ça.
Oui oui mes cocos, ce document est parfaitement valide. Voilà, j'voulais vous le
dire. Arrêtez d'utiliser des doctypes dans tous les sens, ça ne sert à rien.
Sachant la qualité du code qu'on trouve sur les internets, les navigateurs
s'arrêtent au parsing lorsqu'ils voient ça `<!doctype html`
(c'est [Paul Rouget](http://paulrouget.com/) qui me l'a dit, je le crois donc
sur parole).
Et après ma petite parenthèse ci-dessous, je vais vous expliquer pourquoi.

Car je sais ce que certains vont me rétorquer.

> Oui mais moi monsieur, je valide en **XHTML 1.1 Strict Turbo X Prime Ultra**<br />
> Puis ton document valide là, il sera valide quand HTML5 sera finalisé…

Dans un sens ils n'auraient pas tort. Mais dans la pratique, les navigateurs
s'en contrebranlent de savoir quel type d'HTML vous utilisez
<small>(à moins que vous aimiez jouer avec la mort et que vous utilisez le
prologue XML lorsque vous servez de l'XHTML…)</small>.
Car quand bien même vous utilisez un doctype à rallonge, il est tout à fait
possible que vous vous chiiez, et que vous laissiez des erreurs.
Oui, l'erreur est humaine…
Puis HTML 5 est déjà bien implémenté dans les grandes lignes. Et ça car il est
presque rétrocompatible.
Vous devriez le comprendre d'ici la fin de cet écrit. Ou pas. Mais je vous le
dis, il a été pensé dans ce sens.

Revenons à la validation. Du coup, à quoi ça sert de valider ?
On va voir ça par un exemple digne des plus grands diplômes.

## Ce `<p>` fout la merde

Prenons le code suivant :

```html
<!DOCTYPE html>
<title>Putain de page</title>
<style>
p {
  margin-top: 2em;
  margin-bottom: 10em;
}
</style>
<h1>Ma première putain de page html</h1>
<p>
  Ouais mec t'as vu ce code de ouf ?
  Il est trop bien parce que:
  <ul>
    <li>Il est<del>valide</del></li>
    <li>Il est beau</li>
  </ul>
</p>
```

Certains d'entre vous ont dû remarquer la coquille.
Celle-là, mes élèves qui découvrent le HTML me la font à chaque fois lorsqu'ils
codent leur super CV
(super exercice tavu, ils apprécient particulièrement le titre).

Toi là au fond, t'as pas repéré le souci encore ?

Regarde plutôt le rendu :

<iframe
  class="putainde-Post-iframe"
  height="350"
  src="/posts/html/hache-the-aime-elle-vous-dites/notvalid.html">
</iframe>

> WAT ?
> ET MON MARGIN BOTTOM KESSIFÉLÀ EN DEUBEULE ?

Le rapport avec la validation me direz-vous ? Et bien plutôt que de perdre du
temps à comprendre le pourquoi du comment, en validant le code ci-dessus,
l'erreur vous est implicitement expliquée
(oui, ce code n'a qu'une seule erreur à la validation).

> Line 17, Column 4: **No p element in scope but a p end tag seen.**

Typiquement, il faut savoir comprendre un message d'erreur et savoir lire entre
les lignes. Pas faire "mais monsieur, j'comprends pas là" (d'ailleurs mes élèves
valident tous leur code, pour apprendre sur le tas, c'est une bonne façon).

Celui-là nous dit en gros : _je ne vois pas d'élement **p** à fermer dans le coin_.
Ça veut dire que… Ça veut dire que mon **p** ouvert n'est pas reconnu ?
Mais attends, qu'est-ce que c'est que cette histoire ?!

Si vous prenez 10 secondes pour inspecter ce code, vous allez vite vous
aperçevoir qu'il est parsé ainsi :

```html
<p>…</p>
<ul>…</ul>
<p></p>
```

_Mais qu'est-ce que… ? Hein ? Mais ? Quoi ? Comment ?_

Oui, vous avez bien vu. L'HTML est parsé n'importe comment. Enfin non, il est parsé
comme il peut, au mieux.
Je pense que là vous commencez à comprendre ?

Ce que j'essaye de vous montrer par là, c'est qu'il faut toujours faire attention
à ce qu'on écrit et ce qu'on pense avoir comme résultat, même avec du
_simple_ HTML.

**Bon après j'espère qu'en 2013, vous avez tous le réflexe d'inspecter
l'HTML dès que vous avez un truc bizarre en CSS ou en JavaScript… Si
c'est pas encore le cas, prenez l'habitude.**

## Mais du coup le navigateur il fait n'importe quoi ?

Le navigateur essaye clairement de faire au mieux.
Si vous inspectez l'exemple précédent, vous vous apercevrez aussi que je n'ai
mis aucune balise `<html>`, `<head>` ou `<body>`.
Pourquoi ? Ben car le parseur le fait à ma place.
Mais pourquoi il fait ça ?
Tout simplement car on oublie (très - trop ?) souvent de bien écrire.
Comme quand j'écris en.

La balise [`<tbody>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/tbody)
est un bon exemple.
Si vous inspectez vos tableaux HTML, vous verrez vite fait que cette balise, que
quasiment personne ne connait/utilise, est pourtant nécessaire/utile.
Mais du coup, si je me fais une petite requête JavaScript
`document.querySelectorAll('table > tr')`,
il est fort possible que je n'aie pas ce que je souhaite.
[La preuve](http://codepen.io/MoOx/pen/esFjx).

Voyons un autre exemple : mettons-nous à la place d'un navigateur si,
alors que je suis en XHTML 1.1 Strict, je lui glisse une balise `<center>`.

- **Cas 1.** Je n'ai pas fait attention au doctype et je veux vraiment une balise
 `<center>` : bah là, rien à dire à part "_Merci_". Le navigateur essaye clairement
 de faire au mieux, et dans un cas comme celui-là, on ne peut que le remercier.

- **Cas 2.** Je sais exactement dans quel doctype je suis, j'ai conscience de ce
que je fais : je joue au con, tant pis pour ma gueule !

Dans tous les cas, le navigateur va laisser passer cette balise au cas où que.
Puis bon, faut avouer que c'est super pratique cette balise hein ?
Comme `<blink>` et `<marquee>` quoi. ❤

<figure>
  ![Can't handle my swag](canthandlemyswag.gif)
  <figcaption><marquee>Marquee for the win.</marquee></figcaption>
</figure>

## Note de service

S'il vous plaît mesdames, messieurs, lorsque vous faites du CSS inline, ou que
vous incorporez un JavaScript, arrêtez-vous à des choses simples,
qui fonctionnent :

- `<style>` suffit. Pas besoin de mettre un type, un langage etc. Et ça vous
évitera des [prises de têtes à la con](http://codepen.io/MoOx/pen/sEzuJ).
Puis, vous avez déjà utilisé autre chose que du CSS vous ?!

- `<script>`, idem, même sur IE 6.
Pareil que précédemment, pas besoin de mettre un hideux
`<script type="text/javascript" language="JavaScript 1.1">`.
La moindre faute de frappe ne pardonne pas.
Aucun intêret à se fatiguer, sauf si votre [script n'est pas du JavaScript](https://code.google.com/p/ruby-in-browser/).

## Le mot de la fin

Ne soyez jamais sûr de vous, que ce soit pour écrire de l'HTML ou faire une mise
en prod' un vendredi soir à [17h30](http://www.miximum.fr/le-bug-de-17h30.html).
Faites pas les malins. Ne sous-estimez pas HTML.
Si ça merde quelque part, vérifiez plus loin que le bout de votre nez, que votre
règle CSS qui marche pas, ou votre morceau de JavaScript buggé.

## [Aller plus loiiin, allez plus haaauuut… !](https://www.youtube.com/watch?v=BCYLQUdsN5g&t=39s)

* <a href="https://github.com/necolas/idiomatic-html" lang="en">idiomatic-html</a>
([ceci n'est pas une contraction d'_idiot_ et d'_automatique_](http://fr.wikipedia.org/wiki/Idiomatique)).
* <a href="https://github.com/necolas/idiomatic-css" lang="en">idiomatic-css</a> (traduction incluse)
* Validation automatique dans un workflow Grunt:
  * [praveenvijayan/grunt-html-validation](https://github.com/praveenvijayan/grunt-html-validation)
  * [jzaefferer/grunt-html](https://github.com/jzaefferer/grunt-html) (basé sur validator.nu)
