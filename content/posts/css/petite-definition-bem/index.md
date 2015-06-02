---
date: "2014-05-05"
title: Petite définition de BEM
tags:
  - css
  - html
  - méthologie
  - convention
authors:
  - kud
---

**[BEM](http://bem.info)** n'est ni une marque de voiture ni un groupe de musique, et encore moins une onomatopée (quoique). C'est plutôt une façon de nommer les classes en CSS, une convention en d'autres termes voire une méthodologie.

Dans cet article, je ne vous expliquerai pas pourquoi il faut préférer BEM à une autre convention, je vous explique surtout comment l'utiliser.

**BEM** apporte une solution à un problème majeur en informatique : le nommage.

Il n'y a rien de plus compliqué en informatique que de nommer un objet : besoin d'être explicite, ne doit pas être trop générique, ni trop compliqué, ni trop verbeux (ça, ça reste à voir avec BEM...).

Lorsque l'on nomme un objet, une méthode, une fonction, une classe, on se doit d'être avant tout compréhensible. Une personne devant lire votre code doit directement comprendre de quoi vous parlez. Cette personne peut très bien être vous 6 mois, 1 an après. Je pense sincèrement qu'un code clair vaut toute la documentation du monde. Je ne dis pas qu'il ne faut pas documenter mais un code doit être facilement compréhensible, la documentation doit juste apporter un contexte, une situation particulière.

Bref, **BEM** est le sigle pour _Block_, _Element_, _Modifier_. Qu'est-ce que cela veut dire.

Prenons par exemple un site web. Nous avons un ensemble avec dedans deux onglets et en dessous le contenu de chaque onglet.

Nous allons définir ce que sont le _block_, le ou les _elements_ et les _modifiers_.

Dans ce cas précis, le _block_ est le conteneur, l'ensemble, ce qui entoure le tout. Appelons-le "Window".

Nous avons alors aussi les _elements_ suivants : les onglets, que nous allons nommer "Tab", et le contenu, là où il y a le texte de chaque onglet "Content".

Comment cela se traduit en **BEM** :

- Notre _block_ s'appelant "Window" sera alors `.Window`
- Nos _elements_ "Tab" seront `.Window-tab`
- Notre _element_ "Content" sera `.Window-content`

Jusque là, cela devrait aller :

```css
.Window {

}

  .Window-tab {

  }

  .Window-content {

  }
```

Ce qui revient de manère générique à :

```css
.Block {

}

  .Block-element {

  }
```

Oui, je vous conseille d'indenter votre code afin de grouper vos classes.

Maintenant, nous allons définir ce qu'est un _modifier_. Un _modifier_ change l'état de l'élément, il peut s'appliquer aussi bien sur un _block_, qu'un _element_.

Si par exemple je souhaite mettre en actif un onglet (le mettre en avant car séléctionné), je ferai alors `.Window-tab--active`, soit :

```css
.Window {

}

  .Window-tab {
    color: gray;
  }

    .Window-tab--active {
      color: black;
    }

  .Window-content {

  }
```

J'aimerais aussi afficher ou non le contenu. Pour cela, je vais lui rajouter un _modifier_

```css
.Window {

}

  .Window-tab {
    color: gray;
  }

    .Window-tab--active {
      color: black;
    }

  .Window-content {
  }

  .Window-content--hidden {
    display: none;
  }
```

J'aurais très bien pu inverser et dire que par défaut le contenu est caché et je lui rajoute la classe `.Window-tab--active` pour l'afficher (`display: block`) mais lorsqu'il s'agit de cacher ou de faire appaître des éléments, je vous conseille vivement de plutôt ajouter un _modifier_ qui cache les éléments, car cela évite de se prendre la tête sur quel `display` mettre par défaut. Là, vous mettez un `display: none` et voilà, qu'importe si celui de base est un `inline`, `inline-block`, `table-cell` ou autre.

Du coup, nous avons maintenant nos différents types de classes. Cela se résume de manière générique à :

```css
.Block {

}

  .Block--modifier {

  }

  .Block-element {

  }

    .Block-element--modifier {

    }
```

Ce qui donne `.Block-element--modifier` (notre **BEM**).

Parlons maintenant du cas des termes multiples dans chaque partie. Voici comment cela se traduit.

`.MyBlock-myElement--myModifier`

Les _blocks_ sont en "PascalCase" (ou UpperCamelCase), les _elements_ et _modifiers_ sont en "camelCase" (ou lowerCamelCase). Nous séparons le _block_ de l'élément par "-" et le _block_ ou l' _element_ d'un _modifier_ par "--".

Maintenant, vous savez tout sur **BEM**. Sachez qu'il existe tout de même plusieurs conventions de **BEM**. Celle que je vous ai apprise là est la norme de **montage.js** mais il y en a d'autres par exemple qui n'utilisent pas les majuscules et font ce genre de choses : `.my-block__my-element--my-modifier`. Il s'avère que c'est la [convention pseudo-officielle](http://bem.info/method/definitions/#naming-for-independent-css-classes).

L'inconvénient de ceci est que c'est moins lisible au premier abord qui est quoi, et de plus, les `_` ne permettent pas de sélectionner facilement un terme en _double-cliquant_ dessus.

Deux petites choses avant de partir.

Dans le but d'éviter de vous faire écraser vos propriétés par quelqu'un d'autre (une bibliothèque, un _SDK_), je vous conseille de rajouter votre organisation.

Typiquement, ça donne `.org-Block-element--modifier`. Tout en minuscule et si possible ne pas dépasser les 3 lettres car vous allez devoir le répéter à chaque fois et ça peut être lourd.

La deuxième chose est la classe qui sert de sélecteur en JavaScript. Plutôt que _binder_ un élément via sa classe "CSS" (à chaque classe sa responsabilité), il est nettement préférable de créer une classe spécifique au JavaScript. Cela donne : `.org-js-Block-element--modifier`. Il suffit simplement de rajouter `-js` entre l'organisation et le _block_.

Nous arrivons à la convention suivante : `.org[-js]-Block[-element][--modifier]`

Certains vous diront qu'ils mettent `.js-org-` mais étant donné que je considère cela comme un _namespace_ global (autant css que js), je préfère mettre l' `org` au début.

Voilà, voilà, c'est certes un peu déroutant au début, et ca parait très verbeux mais cela vous permettra d'éviter de nooooooombreux soucis de nommage de classes où vous vous emmèlerez les pinceaux à coup de :

```css
.footer {
  text-decoration: underline;
}

.content .footer {
  color: black;
  text-decoration: none; /* annule la propriété du précédent sélecteur */
}
```

Ciao les kids.


Quelques ressources pour la route :

- [50 nuances de BEM](http://blog.kaelig.fr/post/48196348743/fifty-shades-of-bem)
- [BEM Resources](https://github.com/sturobson/BEM-resources)
