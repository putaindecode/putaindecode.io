---
date: 2018-05-22
title: "Introduction à Clojure(Script)"
author: jeans11
oldSlug: clojure/intro
slug: introduction-a-clojure-script
---

La mise en oeuvre d’applications web, mobile, etc implique bien souvent la même
action: **manipuler des données**. Cette tâche se trouve aussi bien au niveau du
back-end que du front-end. Par exemple, le back transforme, collecte, met à
disposition les données alors que le front s’attache à récupérer ces dernières
et les mettre en forme. Les données peuvent être de différentes formes: chaînes
de caractères, nombres, listes, maps, etc. Le monde réel est bien souvent
confronté à des données beaucoup plus complexes. La manipulation des données est
un des exercices dans lesquels Clojure(Script) excelle.

### Clojure(Script) ???

Clojure(Script), kesako ?

En fait, il faut lire **Clojure** et **ClojureScript**.

[**Clojure**](https://clojure.org/) est un langage compilé, dynamiquement typé,
s’exécutant sur la JVM (compile vers du bytecode). Il a été crée par Rich Hickey
(même si vous avez des croyances différentes, vous pouvez regarder une conf de
ce monsieur,
[c’est très très intéressant](https://www.youtube.com/watch?v=2V1FtfBDsLU) !).
C’est un langage purement fonctionnel et immutable, taillé pour la programmation
concurrente (mais pas que).

[**ClojureScript**](https://clojurescript.org/) c’est Clojure compilant vers du
JavaScript via Google Closure.

> Clojure peut donc être utilisé en back et en front.

**Tous les exemples de code qui vont suivre fonctionnent de la même manière pour
Clojure et ClojureScript.**

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
;keyword (les keywords sont simplement des symbols. Ils sont généralement
;utilisés pour définir des constantes ainsi que les keys des maps)
:hello
;vector
[1 2 3]
;liste (séquence)
(1 2 3)
;set
#{1 2 3}
;map
{:label "Hello"}
```

#### Une histoire de parenthèses

Clojure reprend la syntaxe de LISP, c’est-à-dire que le langage s’écrit en
utilisant ses propres structures de données (homoiconicité). Une opération est
donc faite de liste:

```clojure
(+ 1 1)
=> 2
```

En Clojure, les opérations emploient la notation _prefixe_ qui diffère de la
notation _infixe_ que l'on trouve en JavaScript par exemple:

```javascript
1 + 1
=> 2
```

Contrairement à la notation _infixe_ où l'opérateur est placé entre les
arguments, la notation _prefixe_ place l'opérateur avant les arguments. En
Clojure, les appels de fonctions se feront toujours de cette façon:

```clojure
(operator arg1 arg2 ...)

;Autres exemples d'opérations

(- 2 1)
=> 1

(* 2 2)
=> 4

(/ 4 2)
=> 2

(= 1 1)
=> true
```

En Clojure, les opérateurs `+`, `*`, `-`, `/` sont avant tout des fonctions.
Même si la syntaxe est faite de listes, il y a une différence syntaxique entre
un appel de fonction et la définition d'une liste

```clojure
;Une opération
(+ 1 1)
=> 2

;Une liste
'(+ 1 1) ;(quote (+ 1 1))
=> (+ 1 1)

;Une liste simple
'(1 2 3)
=> (1 2 3)

(1 2 3)
=> ;Error
```

Le dernier exemple provoque une erreur car Clojure tente d'exécuter la fonction
`1` avec les paramètres `2` et `3`. L'utilisation de `'` ou `quote` permet de ne
pas évaluer l'opération mais simplement de la retourner sous forme de liste.

#### Les variables

Les variables (bindings) sont créées avec le mot clé `def`.

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
;Définition d'un binding dans le scope global
(def pikachu "pikachu")

;Définition d'un binding local à la fonction `let`
(let [pikachu (upper-case pikachu)]
  pikachu) ;Le `let` retourne la dernière valeur
=> "PIKACHU"

;Le binding global n'a pas été altéré.
pikachu
=> "pikachu"
```

`let` est une fonction qui définit des variables temporaires seulement dans son
scope local (jusqu'à la fin de la parenthèse fermante). À l'intérieur du `let`,
la variable `pikachu` sera toujours égale à `PIKACHU`, à l'extérieur elle
prendra la valeur `pikachu`. Le code ci-dessous provoque une erreur:

```clojure
(let [raichu "Raichu"]
  raichu)
=> "Raichu"

;Le binding `raichu` n'existe pas dans le scope global
raichu
=> ;Error
```

#### Structures conditionnelles

En Clojure chaque instruction retourne une valeur, même les structures
conditionnelles:

```clojure
(def pokemon-name "Pikachu")

;Simple condition
(when (= pokemon-name "Pikachu")
  "Oh! a Pikachu")
=> "Oh! a Pikachu"

;Condition avec un else
(if (= pokemon-name "Raichu")
  "Oh! a Raichu!"
  "Oh! it's not a Raichu!")
=> "Oh! it's not a Raichu!"

;Fonctionne avec n'importe quel type de collection
(for [pokemon ["Pikachu" "Roucoul" "Chenipan"]]
  (upper-case pokemon))
=> ("PIKACHU" "ROUCOUL" "CHENIPAN")
```

#### Les collections

Clojure dispose de plusieurs types de
[collection](https://clojure.org/reference/data_structures#Collections).

- Les listes simples sont des collections dont l’accès et l'insertion du _head_
  est efficient. En contrepartie, l’accès à un élement de la liste est moins
  performant que pour un vecteur.

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

- Les vecteurs sont des collections optimisées pour l'accès à un élement
  arbitraire (via les indexes):

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

- Les sets sont des collections stockant chaque élément de manière unique
  (rendant la duplication impossible):

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

> En Clojure, les fonctions s'appliquant sur des collections peuvent également
> être utilisées sur des maps. Ces dernières sont alors converties en liste de
> vecteur `([key value] [key value])`.

#### Les fonctions

Clojure étant un langage fonctionnel, les fonctions sont évidemment _first-class
citizen_, ce qui veut dire qu'elles peuvent être passées en argument et être
retournées par d'autres fonctions.

```clojure
;Définition d'une fonction
(defn make-pokemon-appear
  "Display a savage pokemon" ;docstring
  [pokemon-name] ;arguments
    (str "Oh! a savage " pokemon-name " appear")) ;Retourne la dernière ligne

(make-pokemon-appear "Pikachu")
=> "Oh! a savage Pikachu appear"

(defn random-pokemon-appearance
  "Choose a random pokemon to appear"
  [f pokemon-coll]
    (f (rand-nth pokemon-coll))

(random-pokemon-appearance
  make-pokemon-appear
  ["Pikachu" "Roucoul" "Chenipan"])
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

Le mot-clé `(defn name ...)`(sucre syntaxique pour `def name (fn ...)`) est
utilisé pour créer une fonction. Les arguments d’une fonction sont définis dans
un vecteur. Une fonction peut contenir une chaîne de caractères la documentant
(à la manière de python).

```clojure
;La fonction doc permet d'extraire la docstring d'une fonction
(doc make-pokemon-appear)
=> ([pokemon-name])
     Display a savage pokemon
```

Par défaut en Clojure, les fonctions ne sont pas _autocurried_. Toutefois, une
fonction peut être "décomposée":

```clojure
(def default-random-pokemon-appear
  (partial random-pokemon-appear make-pokemon-appear))

(default-random-pokemon-appear ["Pikachu" "Roucoul" "Chenipan"])
=> "Oh! a savage Pikachu appear"
```

`partial` retourne une fonction _partielle_ de la fonction passée en paramètre.
La signature initiale de la fonction `random-pokemon-appear` est `([f coll])`
(une fonction et une collection). En utilisant `partial`,
`default-random-pokemon-appear` devient une fonction avec la signature
`([coll])`. Le premier paramètre `f` ayant déjà été affecté, il n’est plus
nécessaire de le passer à la fonction.

#### Les maps

En Clojure, les maps sont créées de la façon suivante:

```clojure
(def dracolosse
  {:id 149
   :name "Dracolosse"
   :level 67
   :types #{:dragon :flying}})

(:name dracolosse)
=> "Dracolosse"

(:level dracolosse)
=> 67

(get dracolosse :types)
=> #{:dragon :flying}
```

Les keywords peuvent faire office de fonction pour les maps. Ils sont très
utilisés pour les keys. Toutefois, les chaînes de caractères sont utilisables
mais ne peuvent pas être employées en opérateur comme c'est le cas pour les
keywords.

```clojure
(def dracolosse
  {"id" 149
   "name" "Dracolosse"
   "level" 67
   "types" #{:dragon :flying}})

(get dracolosse "name")
=> "Dracolosse"

("name" dracolosse)
=> ;Error
```

Puisque les structures de données Clojure sont immutables, une update retourne
un nouvel objet, et l'objet original reste intact:

```clojure
;Ajouter `2` au `level` de `dracolosse`
(update dracolosse :level + 2)
=> {:id 149
    :name "Dracolosse"
    :level 69
    :types #{:dragon :flying}}

;La map original reste intact
dracolosse
=> {:id 149
    :name "Dracolosse"
    :level 67
    :types #{:dragon :flying}}
```

La première ligne peut paraître un peu bizarre au premier abord. La signature de
la fonction `update` est la suivante: `([map key f x y z & mores]) -> new map`.
La fonction prend donc en paramètre une `map` (un objet), sur laquelle appliquer
la transformation, suivie de la `key` (string ou keyword) à modifier par la
fonction `f`. Les autres paramètres (`x`, `y`, `z`) sont en fait les arguments
optionnels que peut recevoir la fonction de transformation (`f`). Ainsi, les
différentes opérations retournent strictement la même valeur:

```clojure
(update dracolosse :level (fn [level] (+ level 2)))

(update dracolosse :level #(+ % 2)))

(update dracolosse :level + 2)
```

> `#(+ % 2)` est simplement du sucre syntaxique pour une fonction anonyme. Le
> `%` correspond au paramètre de la fonction.

Un programme est souvent ammené à opérer une série de modifications sur un même
objet. Chaîner des opérations est possible grâce aux
[threading macros](https://clojure.org/guides/threading_macros):

```clojure
(-> dracolosse
    (update :level + 2)) ;Ajouter `2` au `level`
    (assoc :height 268)) ;Associer la key `height` avec la valeur 268
=> {:name "Dracolosse"
    :height 268
    :level 69
    :types #{:dragon :flying}}
```

> Le "chaînage" d'opérations existe dans d'autres langages comme par exemple
> OCaml avec l'opérateur `|>` (qui arrive prochainement dans la nouvelle version
> d'ECMAScript).

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

> Une macro est une sorte de fonction qui permet de générer du code lors de la
> phase de compilation (détaillé dans un futur article).

#### Les namespaces

Clojure permet de créer des
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

Dans l’exemple, ci-dessus, `ns` permet de créer le namespace
`my-namespace.utils`. Pour utiliser le namespace dans un autre, Clojure offre
plusieurs possiblités:

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

Clojure dispose d’un puissant mécanisme de
[**destructuring**](https://clojure.org/guides/destructuring):

```clojure
(ns my-namespace.utils
  (:require [clojure.string :refer [join]]))

(defn pokemon->string
  "Take a pokemon and return it to string"
  ;Des bindings locals sont crées en fonction des keys de la map
  ;{label key label key}
  ;`:as` (optionnel) permet de conserver une trace de l'objet
  [{id :id pokemon-name :name types :types :as pokemon}]
  (let [types-string
        (join "" (->> types (map name) (interpose "/")]
    (str pokemon-name "|" id ":" types-string " pokemon")))

(pokemon->string dracolosse)
=> "Dracolosse|149: dragon/flying pokemon
```

Dans l’exemple, ci-dessus, la destructuration s’opère sur une map. Il est
possible de destructurer d’autres structures de données comme les vecteurs par
exemple:

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

> `(into {} (...))` convertit une collection dans le type indiqué en premier
> paramètre.

C’est tout pour cette première partie sur Clojure. Pour en découvrir un peu plus
sur le langage, vous pouvez jeter un oeil à la
[documention](https://clojuredocs.org/). Dans les prochains articles, nous
verrons d'autres aspects du langage, notamment l'interopérabilité avec Java pour
Clojure et avec JavaScript pour ClojureScript, le REPL-driven-development, le
testing, les macros ainsi que l'utilisation de React.

En attendant, attrapez-les tous ! ;)
