---
date: ""
title: "Introduction à Clojure(Script)"
tags:
	- clojure
	- clojurescript
	- jvm
	- javascript
authors:
  - jeans11
header:
  linearGradient: #DD4B39, #DD4B39
---

# Introduction à Clojure(Script)

La mise en oeuvre d’applications web, mobile, etc… implique bien
souvent la même action: **manipuler des données**.
Cette tâche se trouve aussi bien au niveau du back-end que du front-end.
Par exemple, le back transforme, collecte, met à disposition les données
alors que le front s’attache à récupérer ces dernières et les mettre en forme.
Les données peuvent être de différentes formes: chaînes de caractères,
nombres, listes, maps, etc…
Dans le monde réel, on trouve des données un peu plus complexes. La manipulation
des données est un des exercices dans lesquels Clojure(Script) excelle.

### Clojure(Script) ???

Clojure(Script), kesako ?

En fait, il faut lire **Clojure** et **ClojureScript**.

[**Clojure**](https://clojure.org/) est un langage compilé, dynamiquement typé,
s’exécutant sur la JVM (compile vers du bytecode). Il a été crée par Rich Hickey
(même si vous avez des croyances différentes, vous pouvez regarder une conf
de ce monsieur, [c’est très très intéressant](https://www.youtube.com/watch?v=2V1FtfBDsLU) !).
C’est un langage purement fonctionnel et immutable,
gérant très bien la concurrence.

[**ClojureScript**](https://clojurescript.org/) c’est Clojure compilant vers
du JavaScript via Google Closure.

> Clojure peut donc être utilisé en back et en front.

**Tous les exemples de code qui vont suivre fonctionnent de la même manière
pour Clojure et ClojureScript.**

### Un peu de code

#### Primitives

Comme tous les langages, Clojure comporte des primitives:

```clojure
;integer
1
;float
1.0
;string
"Hello"
;keyword
:hello
;vector
[1 2 3]
;sequence
'(1 2 3)
;set
#{1 2 3}
;map
{:label "Hello"}

```

#### Une histoire de parenthèses

Clojure reprend la syntaxe de LISP, c’est-à-dire que le langage s’écrit en
utilisant ses propres structures de données (homoiconicité).
Prenons un exemple simple:

```clojure
(+ 1 1)
=> 2

```

En Clojure, tout est liste, sauf que dans notre exemple ce n’est pas une liste
de données mais bien un appel de fonction. On utilise la fonction `+` pour
ajouter 1 et 1. On dispose de tous les opérateurs arithmétiques:

```clojure
(- 2 1)
=> 1

(* 2 2)
=> 4

(/ 4 2)
=> 2

(= 1 1)
=> true
```

Les appels de fonction se feront toujours de cette façon:

```
(operand arg1 arg2 ...)
```

#### Les variables

On peut créer des variables:

```clojure
(def level (* 2 10))
level
=> 20

(def pikachu (str "Oh! Pikachu is level " level))
pikachu
=> "Oh! Pikachu is level 20"

```

Les variables sont immuables:

```clojure
(def pikachu "Pikachu")

(def upper-case-pikachu (upper-case pikachu))
=> "PIKACHU"

pikachu
=> "Pikachu"
```

#### Structures conditionnelles

En Clojure, chaque instruction retourne une valeur même les structures conditionnelles:

```clojure
(def pokemon-name "Pikachu")

(if (= pokemon-name "Raichu") "Oh! a Raichu!" "Oh! it's not a Raichu!")
=> "Oh! it's not a Raichu!"

(when (= pokemon-name "Pikachu") "Oh! a Pikachu"))
=> "Oh! a Pikachu"

(for [pokemon ["Pikachu" "Roucoul" "Chenipan"]]
  (upper-case pokemon))
=> ("PIKACHU" "ROUCOUL" "CHENIPAN")

```

#### Les collections

Clojure dispose de plusieurs types de [collection](https://clojure.org/reference/data_structures#Collections).

- Les listes simples sont des collections dont l’accès et la modification
du _head_ est efficient. En contrepartie, l’accès à un élement de la liste est
moins performant que pour un vecteur.

```clojure
(def my-list '("Pikachu" "Roucoul" "Chenipan"))
;conj ajoute l'élement en début de liste
(conj my-list "Arcko")
=> ("Arko" "Pikachu" "Roucoul"  "Chenipan")
(first my-list)
=> "Pikachu"
;La liste est scannée avant d'accèder à l'élement.
(nth my-list 1)
=> "Roucoul"
(map upper-case my-list)
=> ("PIKACHU" "ROUCOUL" "CHENIPAN")
```

- Les vecteurs sont des collections qui favorisent l’accès aux élements (via les indexs) :

```clojure
(def my-vec ["Pikachu" "Roucoul" "Chenipan"])
;conj ajoute l'élément à la fin du vecteur
(conj my-vec "Arcko")
=> ["Pikachu" "Roucoul"  "Chenipan" "Arcko"]
;Le vecteur accède directement l'élement.
(nth my-vec 1) ;(my-vec 1)
=> "Roucoul"
(map upper-case my-vec)
=> ("PIKACHU" "ROUCOUL" "CHENIPAN")

```

- Les sets sont des collections qui assurent la présence d’un élément de manière
unique dans la collection:

```clojure
(def my-set #{"Pickachu" "Roucoul" "Roucoul" "Chenipan"})
=> #{"Pickachu" "Roucoul" "Chenipan"}
;Les sets sont particulièrement utiles pour tester la présence d'un élément
(my-set "Dracaufeu")
=> nil ;null
(my-set "Roucoul")
=> "Roucoul"
(when (my-set "Pikachu") "Oh! Great! You have a Pikachu")
=> "Oh! Great! You have a Pikachu"
```

> L’ensemble des fonctions de séquence s’appliquent à tous les types de collection.
En Clojure, les fonctions de sequence peuvent également s’appliquer aux maps.
Elles sont simplement converties en vecteur de vecteurs.

#### Les fonctions

Les fonctions sont très importantes en Clojure. Elles sont massivement utilisées.
On peut les trouver en argument de fonction, en valeur de retour.

```clojure
(defn make-pokemon-appear
  "Display a savage pokemon"
  [pokemon-name]
    (str "Oh! a savage " pokemon-name " appear"))

(make-pokemon-appear "Pikachu")
=> "Oh! a savage Pikachu appear"

(defn random-pokemon-appearance
  "Choose a random pokemon to appear"
  [f pokemon-coll]
    (f (rand-nth pokemon-coll))

(random-pokemon-appearance make-pokemon-appear ["Pikachu" "Roucoul" "Chenipan"])
=> "Oh! a savage Chenipan appear"

;Les fonctions anonymes existent aussi en Clojure
(def add-level-to-pokemon
  (fn [pokemon-name]
    (str pokemon-name " level " (rand-int 100))))

(random-pokemon-appearance
  make-pokemon-appear
  (map add-level-to-pokemon ["Pikachu" "Roucoul" "Chenipan"]))
=> "Oh! a savage Roucoul level 6 appear"
```

On utilise le mot-clé `defn` ou `def` et `fn` pour créer une fonction.
Les arguments d’une fonction sont définis dans un vecteur. Une fonction peut
contenir une _docstring_ se plaçant avant la déclaration des arguments afin de
donner des indications au développeur:

```clojure
(doc make-pokemon-appear)
=> ([pokemon-name])
     Display a savage pokemon

```

Par défaut en Clojure, les fonctions ne sont pas _autocurried_. Toutefois, on
peut utiliser une fonction reproduisant ce comportement:

```clojure
(def default-random-pokemon-appear
  (partial random-pokemon-appear make-pokemon-appear))

(default-random-pokemon-appear ["Pikachu" "Roucoul" "Chenipan"])
=> "Oh! a savage Pikachu appear"
```

`partial` retourne une fonction _partielle_ de la fonction passée en paramètre.
La signature initiale de la fonction `random-pokemon-appear` est `([f coll])`
(une fonction et une collection). En utilisant `partial`, `default-random-pokemon-appear`
devient une fonction avec la signature `([coll])`. Le premier paramètre `f` ayant
déjà été affecté, il n’est plus nécessaire de le passer à la fonction.

#### Les maps

En Clojure, les maps sont créées de la façon suivante:

```clojure
(def dracolosse
  {:id 149 :name "Dracolosse" :level 67 :types #{:dragon :flying}})

(:name dracolosse)
=> "Dracolosse"

(:level dracolosse)
=> 67

(get dracolosse :types)
=> #{:dragon :flying}
```

> En Clojure, les keywords sont simplement des symbols. Ils sont généralement
utilisés pour définir des constantes ainsi que les keys des maps.

Les keywords peuvent faire office de getters pour les maps. Toutefois, il est
possible d'utilise des chaînes de caractères:

```clojure
(def dracolosse
  {"name" "Dracolosse" "level" 67 "types" #{:dragon :flying}})

(get dracolosse "name")
=> "Dracolosse"
("name" dracolosse) ;Exception
```

Une modification sur une map provoque la création d’un nouvel objet:

```clojure
(update dracolosse :level + 2)
=> {:name "Dracolosse" :level 69 :types #{:dragon :flying}}

dracolosse
=> {:name "Dracolosse" :level 67 :types #{:dragon :flying}}
```

La première ligne peut paraître un peu bizarre au premier abord. La signature de
la fonction `update` est la suivante: `([map key f x y z & mores])`  
Les trois premiers paramètres sont évidents. Il s’agit de la `map` sur laquelle
appliquer la transformation suivie de la `key` qui va être modifiée par la
fonction `f`. Les autres paramètres sont en fait les arguments optionnels que
peut recevoir la fonction de transformation. Ainsi, les différentes instructions
retournent strictement la même valeur:

```clojure
(update dracolosse :level (fn [level] (+ level 2)))

(update dracolosse :level #(+ % 2)))

(update dracolosse :level + 2)
```

> `#(+ % 2)` est simplement du sucre syntaxique pour une fonction anonyme.
Le `%` correspond au paramètre de la fonction.

On peut appliquer une série de transformations à une map grâce aux
[threading macros](https://clojure.org/guides/threading_macros):

```clojure
(-> dracolosse
    (update :level + 2))
    (assoc :height 268))
=> {:name "Dracolosse" :height 268 :level 69 :types #{:dragon :flying}}
```

La macro `->` place le résultat de l’instruction précédente dans le premier
argument de la fonction courante. Après compilation, le code précédent donne:

```clojure
 (assoc
   (update
     dracolosse
     :level
     + 2)
   :height 268)
```

#### Les namespaces

Comme beaucoup de langages, Clojure permet de créer des modules ou plutôt des
[**namespaces**](https://clojure.org/reference/namespaces) pouvant contenir un
ensemble d’instructions:

```clojure
;Déclaration du namespace
(ns my-namespace.utils)

(defn group-by-type
  "Take a coll of pokemons and group by it by types"
  [pokemons]
  (reduce
   (fn [acc {:keys [types] :as pokemon}]
     (merge-with
      into
      acc
      (into {} (map #(vector % [pokemon]) types))))
   {}
   pokemons))

;Utilisation du namespace
(use 'my-namespace.utils)

(def pokemons
  [{:id "149" :name "Dracolosse" :types #{:dragon :flying}}
   {:id "376" :name "Metalosse" :types #{:psy :steel}}
   {:id "169" :name "Nostenfer" :types #{:poison :flying}}
   {:id "248" :name "Tyranocif" :types #{:rock :darkness}}])

(def pokemons-by-type (group-by-type pokemons))

;Le nombre de pokemons de type vol
(count (:flying pokemons-by-types))
=> 2

;Le nom des pokemons de type dragon
(map :name (:dragon pokemons-by-types))
=> ("Dracolosse" "Drattack")

;Le nombre de pokemon par type
(into
  {}
  (map
    (fn [[type pokemons]] (vector type (count pokemons))
    pokemons-by-types)
=> {:dragon 2 :flying 2 :poison 1 :psy 1 :steel 1 :rock 1 :darkness 1}

```

Dans l’exemple, ci-dessus, on déclare un namespace `my-namespace.core`.
Pour utiliser le namespace dans un autre namespace,
Clojure offre plusieurs possiblités:

```clojure
(ns my-namespace.core
  ;Charger toutes les fonctions du namespace
  (:use my-namespace.utils)
  ;Préfixer les fonctions du namespace
  (:require [my-namespace.utils :as utils])
  ;Charger uniquement la ou les fonction(s)
  (:require [my-namespace.utils :refer [group-by-type]]))

```

#### Le destructuring

Comme vous avez pu le constater dans certains exemples, Clojure dispose d’un
puissant mécanisme de [**destructuring**](https://clojure.org/guides/destructuring):

```clojure
(ns my-namespace.utils
  (:require [clojure.string :refer [join]]))

(defn pokemon->string
  "Take a pokemon and return it to string"
  [{id :id pokemon-name :name types :types :as pokemon}]
  (let [types-string
        (join "" (->> types (map name) (interpose "/")]
    (str pokemon-name "|" id ":" types-string " pokemon")))

(pokemon->string dracolosse)
=> "Dracolosse|149: dragon/fly pokemon

```

Dans l’exemple, ci-dessus, la destructuration s’opère sur une map. Il est
possible de destructurer d’autres structures de données comme les vecteurs par exemple:

```clojure
(def pokemons-by-type (group-by-type pokemons))

pokemon-by-type
=> {:dragon ({...} {...}) :psy ({...}) ...}

(into
  {}
  (map
    (fn [[type pokemons]]
      (vector type (map :name pokemons)))
    pokemons-by-type))
=> {:dragon ("Dracolosse" "Drattack") :psy ("Metalosse") ...}
```

On applique la fonction `map` sur une hashmap. Clojure convertit cette dernière
en une liste de vecteur. On peut donc très facilement destructurer chaque
vecteur par `[type pokemons]`.

> `(into {} (...))` convertit une collection dans le type indiqué en premier paramètre.

C’est tout pour cette première partie sur Clojure. Il y a encore beaucoup
d’aspects du langage à découvrir. De nombreux articles devraient suivre dans
les semaines à venir. Nous verrons d’autres aspects intéressants du langage
notamment sur l’excellente interopérabilité avec Java et JavaScript, le REPL,
le testing, l’utilisation de React, les macros, etc…

En attendant, attrapez-les tous ! ;)
