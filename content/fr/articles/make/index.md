---
date: "2014-11-03"
title: "Laissez-vous pousser la barbe, apprenez à écrire des Makefiles"
tags:
  - shell
  - makefile
authors:
  - madx
---

À l'heure où tout le monde se rue sur des outils comme [Gulp][p!gulp],
[Grunt][p!grunt] ou autres [Rake][gem:rake], certains irréductibles (dont je
fais partie) ont fait le choix d'employer un des outils les plus standards et
emblématiques dont tout développeur a entendu parler au moins une fois dans sa
vie : *Make*.

Si de prime abord on a l'impression d'un système assez archaïque (ce qui n'est
pas toujours forcément faux), on se rend rapidement compte que _Make_, couplé à
une petite dose de scripting shell permet rapidement de mettre en place un moyen
de compiler ses fichiers et de lancer des tâches.

Les fichiers de configuration de _Make_ sont appellés _Makefiles_ (oui, ce sont
eux qui ont donné leurs noms aux `(Gulp|Grunt|Rake)files`). Les instructions
qu'ils contiennent sont exécutées grâce à la commande `make` dans votre
terminal.

# Hello World

Je vous propose de commencer en douceur par un classique _Hello World_. On va
simplement définir une tâche `hello-world` dont l'action va être d'afficher
_"Hello, world"_ à l'écran (boooring).

``` make
hello-world:
	echo "Hello, world"
```

Première remarque importante, les indentations dans un _Makefile_ **doivent**
être faites avec des tabulations. Oui, je sais, c'est moche, on dirait du
Python, mais c'est comme ça.

Voilà le genre d'erreurs qu'on se prend si on met des espaces à la place des
tabulations :

```
Makefile:2: *** séparateur manquant . Arrêt.
```


Pour exécuter notre commande, il nous suffit de lancer `make hello-world` dans
un terminal :

``` console
$ make hello-world
echo "Hello, world"
Hello, world
```

Décortiquons un peu cette exécution. Pour chaque commande qu'il exécute, _Make_
affiche la commande complète avant d'afficher la sortie standard de ladite
commande. C'est souvent très pratique car toutes les variables (on va revenir là dessus)
qu'on met dans la commande sont résolues, et on voit clairement ce que _Make_
exécute. Par contre, dans certains cas on s'en fout un peu, on peut alors
préfixer la ligne à rendre silencieuse par un `@`, comme ça :

``` make
hello-world:
	@ echo "Hello, world"
```

``` console
$ make hello-world
Hello, world
```

# Règles, cibles, recettes et pré-requis

OK, jusque là c'est génial, on a un super outil pour lancer des commandes qu'on
pourrait déjà stocker dans un bête script shell. Pas super utile finalement.

Bon, on va corser un peu les choses et commencer par définir un peu de
terminologie avant que vous soyez totalement largués.

Un _Makefile_ est une collection de **règles**, chacune étant composée d'une
**cible**, de **pré-requis** (ou pas) et d'une **recette**. Dans notre exemple
précédent, `hello-world` est la cible et `@ echo "Hello, world"` est la recette
de la règle. Elle ne spécifie par contre pas de pré-requis.

Relisez trois ou quatre fois le paragraphe précédent jusqu'à ce que ce soit bien
imprimé.

Vous l'aurez compris, on invoque une règle depuis la ligne de commande en
spécifiant le nom de sa cible après la commande `make`. Si on ne précise rien,
c'est la première règle trouvée qui est exécutée (donc dans notre cas,
`hello-world`).

Les pré-requis sont déclarés après la cible. On pourrait par exemple ajouter un
`sauter-une-ligne` comme pré-requis à notre cible `hello-world` :

``` make
hello-world: sauter-une-ligne
	@ echo "Hello, world"

sauter-une-ligne:
	@ echo
```

``` console
$ make hello-world

Hello, world
```

Facile, non ? Ok alors on peut *vraiment* attaquer les choses sérieuses.

# Construire des fichiers

Les pré-requis sont particulièrement pratiques quand on veut construire un
fichier depuis un autre, ce qui est la principale action d'à peu près tout
processus de compilation (paraît même que c'est grosso modo la définition de la
compilation).

On peut par exemple écrire un _Makefile_ nous permettant de compiler un fichier
_Markdown_ en _HTML_ :

``` make
article.html: article.md
	marked article.md > article.html
```

Cette règle spécifie simplement que pour construire le fichier `article.html`
j'ai besoin du fichier `article.md` et que j'utilise la commande
[`marked`][npm:marked] pour construire le fichier. Essayez, vous verrez, c'est
magique.

Là où ça devient intéressant, c'est que si je lance de nouveau `make
article.html`, rien ne se passe. Eh oui, _Make_ vérifie les dates de
modification des pré-requis et les compare avec la date de modification de la
cible pour savoir s'il doit où non reconstruire la cible.

On peut bien sûr aller plus loin en ayant des fichiers qui dépendent de
fichiers, qui à leur tour dépendent de fichiers, …

<a name="ref-phony-target"></a>

On peut aussi avoir une cible factice qui ne représente pas un fichier et qui
elle-même dépend de plusieurs fichiers (`website: index.html apropos.html
contact.html`).

# Variables et substitutions

La syntaxe des variables dans un *Makefile* ressemblent beaucoup aux variables
de votre Shell, *mais pas tout à fait*.

``` make
SOURCE = index.md
DESTINATION = index.html

${DESTINATION}: ${SOURCE}
  marked ${SOURCE} > ${DESTINATION}
```

On peut aussi utiliser une substitution pour s'éviter de tout retaper. La
syntaxe pour ça est assez simple et se passe d'explications :

``` make
SOURCE = index.md
DESTINATION = ${SOURCE:.md=.html}
```

Là où ça devient beaucoup plus intéressant c'est qu'on peut stocker des listes
dans une variable. Pour ça, pas vraiment d'effort à faire, il suffit de rajouter
des noms à la suite :

``` make
SOURCE = index.md article.md
DESTINATION = ${SOURCE:.md=.html}
```

Attention par contre ! En faisant ça si vous utilisez `${SOURCE}` comme cible
d'une règle, vous allez définir plusieurs règles d'un coup, ce qui n'est peut
être pas ce que vous voulez.

On peut contourner ça assez simplement en utilisant une substitution au niveau
de la règle. La syntaxe est un poil différente :

``` make
%.html: %.md
  [...]
```

Vous l'aurez compris, `%` est identique dans la cible et dans la dépendance,
donc avec cette règle si vous faites un `make index.html`, *Make* va tenter de
construire la dépendance `index.md` avant tout.

Un problème se pose à nous avec cette syntaxe : « Bah merde, comment je récupère
les noms de fichiers là ? »

# Variables spéciales

Superbe transition étant donné qu'on va parler ici de quelques variables
spéciales bien pratiques !

- `$@` contient le nom de la cible de la règle en cours d'exécution ;
- `$^` contient la liste des dépendances de la règle (la flèche pointe vers la
  liste de dépendances) ;
- `$<` contient la première dépendance de la règle (la flèche pointe à gauche,
  là où est la dépendance).

À l'aide de celles-ci on peut du coup compléter notre exemple précédent :

``` make
%.html: %.md
  marked $< > $@
  [...]
```

# Fonctions

Pour faciliter quelques opérations, *Make* fournit un ensemble de fonctions de
base. Appeler ces fonctions rappelle un peu la façon dont on lance une commande
dans un sous-shell en Bash : `$(fonction argument1 argument2)`.

Voici une petite démonstration de `wildcard`, `addsuffix` et `basename` dont
vous vous doutez sans doute les effets :

``` make
SOURCES = $(wildcard *.md)
DESTINATIONS = $(addsuffix .html,$(basename ${SOURCES}))

all: ${DESTINATIONS}

%.html: %.md
  marked $< > $@
```

L'exemple construit dynamiquement la liste des fichiers HTML à produire à partir
de la liste des fichiers *Markdown* disponibles puis définit une règle `all`
permettant de tout construire d'un coup, et une règle définissant compiler
unitairement un fichier *Markdown* vers HTML.

Vous noterez qu'`addsuffix`/`basename` peut être remplacé par une substitution
simple comme on a vu précédemment.

Je vous invite à fouiller
[le chapitre sur les fonctions du manuel][man:make:functions].

# La cible `.PHONY`

Dans certains cas la cible d'une règle ne représente pas un fichier (c'était le
cas de notre cible `website` [un peu plus haut](#ref-phony-target)).

Dans ces cas-là, on va vouloir exécuter la règle quoi qu'il arrive, comme si la
cible était tout le temps périmée.

Une cible particulière existe pour ça : `.PHONY`. Toutes les dépendances de
cette cible seront marquées comme (traduction pourrie) imposteurs (*phony*
donc).

Pour reprendre l'exemple précédent, on déclarera donc :

``` make
.PHONY: website

website: index.html apropos.html contact.html
  [...]
```

Désormais, chaque appel à `make website` tentera de construire les dépendances
et exécutera les commandes de la recette de la règle.

# Un exemple complet

L'exemple suivant permet de compiler un site Web depuis un ensemble de fichiers
*Markdown*.

``` make
SOURCES = $(wildcard src/*.md)
DESTINATIONS = ${SOURCES:src/%.md=build/%.html}

all: ${DESTINATIONS}

info:
	@ echo Will build ${DESTINATIONS} from ${SOURCES}

clean:
	rm -f ${DESTINATIONS}

build/%.html: src/%.md
	mkdir -p build
	marked $< > $@

.PHONY: all info clean
```

Vous noterez que comme on stocke nos résultats dans le dossier `build`, il faut
potentiellement le créer quand on compile un fichier dedans.

# Pour aller plus loin

Il existe bien d'autres fonctionnalités dans *Make* (du moins dans *GNU Make*),
avec notamment :

- Les [*canned recipes*][man:make:canned] (recettes en boîte), permettant de
  définir un bout de règle réutilisable à plusieurs endroits.
- Des [expressions conditionnelles][man:make:conditions] pour avoir des tests
  dans votre *Makefile* et effectuer des traitements différents selon
  l'environnement.
- Les [règles en *order only*][man:make:types] qui permettent d'indiquer une
  dépendance dont la date de modification ne doit pas être prise en compte (on
  peut s'en servir pour éviter le `mkdir` dans l'exemple complet).
- Et [plein d'autres fonctions][man:make:functions] bien pratiques !

Je vous invite aussi à jeter un coup d'œil au [*Makefile* de Veil][gh:veil], un outil que
j'utilise pour générer des sites statiques à partir de fichiers *Markdown*
(ah bah tiens, comme dans mes exemples, c'est rigolo). Il y a plein de
fonctionnalités de *Make* utilisées dans ce projet et je pense que ça peut être
source d'idées.

Voilà pour cette premier introduction à *Make*, j'espère que ça vous a plu et
que vous êtes fin prêts à affronter tous ces bouseux avec leur système de build
à base de streams, de brocolis et autres râteaux.

[p!gulp]: /posts/js/introduction-gulp/
[p!grunt]: /posts/js/premiers-pas-avec-grunt/
[gem:rake]: https://rubygems.org/gems/rake
[npm:marked]: https://www.npmjs.org/package/marked
[man:make]: https://www.gnu.org/software/make/manual/make.html
[man:make:canned]: https://www.gnu.org/software/make/manual/make.html#Canned-Recipes
[man:make:conditions]: https://www.gnu.org/software/make/manual/make.html#Functions
[man:make:types]: https://www.gnu.org/software/make/manual/make.html##Prerequisite-Types
[man:make:functions]: https://www.gnu.org/software/make/manual/make.html#Functions
[gh:veil]: https://github.com/madx/veil/
