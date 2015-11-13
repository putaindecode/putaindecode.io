---
date: "2013-11-11"
title: Structurer son projet avec Revel et Mgo
tags:
  - golang
  - mongo
  - revel
  - mgo
authors:
  - OwlyCode
---

Tu te sens l’âme d’un rebelle ? Tu veux tester de la techno atypique ? Ça tombe
bien, aujourd’hui on est là pour ça. On va toucher à un sujet pas forcément
majoritaire : le langage Go. Si tu ne connais pas les bases, je t’invite à aller
sur la [homepage du projet](http://golang.org/) et à parcourir le
[go-tour anglais](http://tour.golang.org/) ou
[celui en français](http://go-tour-fr.appspot.com/), c'est un showcase complet du langage
(et très bien fichu).
Mais si t'es juste curieux et que comprendre chaque pixel de l'article n'est pas
une obsession pour toi, tu devrais pouvoir voir de quoi on parle. Même
[Nyalab](/#crew) y est arrivé.

Dans cet article on va voir **comment brancher un projet go+revel à une base de
données mongodb** et obtenir ainsi une base de travail sympa pour explorer le
développement web avec Go.

## Les technos utilisées

### [Golang](http://golang.org)

Langage compilé, publié en 2009, communément considéré comme “désorienté objet”,
c’est une alternative solide au C/C++ qui prône un découpage modulaire (par
“package”) des applications. Il est prédisposé à une utilisation en
développement web grâce à un package natif de gestion des réseaux et du
protocole http.

### [Revel](http://robfig.github.io/revel/)

Framework développé en Go et pour Go. Il intègre tout ce qu’il faut pour
développer une application web : rechargement du code à chaud, gestion des urls
par routing, parsing des paramètres GET et POST, mécanisme de validation des
données, gestion de sessions, gestion du cache, framework de tests et même
moteur de tâches planifiées cron-likes. Il a pour particularité d’être
complètement découplé sur la partie modèle et ne fourni aucun ORM ou ODM,
juste un petit module pour gérer des transactions sur des bases sql-like.

### [Mgo](http://labix.org/mgo)

Driver Go complet pour MongoDB, permettant d’établir la connexion et d’envoyer
des requêtes. Il dispose d’un mécanisme de mapping des documents mongodb sur les
type struct de Go.

### [MongoDB](http://www.mongodb.org/)

Base de données NoSql agile et scalable, les documents sont stockés au format
json dans des collections. Le requêtage se fait en manipulant des objets et des
fonctions javascript.

## Attends, attends ... Pourquoi Go ?
Le premier vrai argument, c'est la **performance**. Sans rentrer dans
l'explication hyper poussée d'un [benchmark](http://jaxbot.me/articles/benchmarks_nodejs_vs_go_vs_php_3_14_2013), on peut
affirmer sans trop de risque que Go se hisse au moins au niveau de node.js. On
va pas risquer de vexer les autres membres du crew avec des affirmations
trollesques dès le premier post.

On peut aussi ajouter que Go est un **langage moderne**, qui inclut toutes les
**petites friandises pour attirer le développeur** curieux et assoiffé de
qualité. Framework de tests et outil de mise en forme du code sont natifs et
permettent à la techno d'échapper aux interminables guerres de conventions :

> De toutes façons le no-newline avant "{" c'est vraiment pour les pourritures
> responsables de 99% des maux de la Terre.
> - Un évangeliste du PSR

Troisième argument de choix en Go : la **simplicité de parallélisation**.
Personne ne viendra te dire *"ça c'est synchrone, sry bro."* ou *"ça c'est
asynchrone, callback it bitch."*. Tout repose sur le mot clef qui a donné son
nom au langage (ou l'inverse) `go`. Tu peux te faire un `go myFunc()` et paf !
Tout ce qui est appelé dans myFunc() saute sur un thread séparé. Et pour gérer
la synchronicité entre plusieurs thread il y a un mécanisme de canaux. Ce sont
des files FIFO (the First In is the First Out) dont la lecture est bloquante
(il existe des techniques évoluées pour faire du polling, cf
[gotour#68](http://tour.golang.org/#68)).

Pour finir, cerise sur le gateau, **Go compile vite**, extrêment vite, et ça va
sauver ton intégrité mentale sur les gros projets. Par contre c'est foutu pour
tes pauses cafés aux prétextes douteux.

##Let’s Go (#nojoke, siriouz bizness)
On va partir du principe que tu as Go et Revel prêts pour la baston. On attaque
direct à sec par le classique “revel new” puisqu'on va partir de la structure de
base.

```console
$ revel new github.com/OwlyCode/PutainDeProjet
```

Là théoriquement, tu te retrouves avec la structure par défaut du boilerplate
revel, quelque chose comme ça:

- app
  - controllers
  - views
- conf
- messages
- public
- tests

C’est là qu’on se met au boulot. On a de quoi faire un site complet avec ça mais
 aucune trace de gestion de base de données là dedans. On commence donc par
 créer un dossier `app/modules` et un sous dossier `app/modules/mongo`. C’est
 dans ce dossier que va se trouver notre gestionnaire de connexion à mongoDB.
 En fait ce n’est rien de plus qu’un binding entre Revel et Mgo. La technique
 utilisée pour brancher ce binding côté Revel est celle des
 [interceptors](http://robfig.github.io/revel/manual/interceptors.html).

```go
package mongo

import (
    "github.com/robfig/revel"
    "labix.org/v2/mgo"
    "sync"
)

// Extension du controlleur.
type Mongo struct {
    *revel.Controller
    MongoSession  *mgo.Session
    MongoDatabase *mgo.Database
}

// Stockage global de la session dont la visibilité est restreinte au package.
var session *mgo.Session

// Singleton
var dial sync.Once

// Renvoie la session mgo en cours, si aucune n'existe, elle est créée.
func GetSession() *mgo.Session {

    host, _ := revel.Config.String("mongo.host")

    // Grâce au package sync cette fonction n'est appelée
    // qu'une seule fois et de manière synchrone.
    dial.Do(func() {
        var err error
        session, err = mgo.Dial(host)
        if err != nil {
            panic(err)
        }
    })

    return session
}

// Alimente les propriétés affectées au controlleur en clonant la session mongo.
func (c *Mongo) Bind() revel.Result {
    // Oublie pas de mettre mongo.database dans le app.conf, genre "localhost"
    databaseName, _ := revel.Config.String("mongo.database")

    c.MongoSession = GetSession().Clone()
    c.MongoDatabase = c.MongoSession.DB(databaseName)

    return nil
}

// Ferme un clone
func (c *Mongo) Close() revel.Result {

    if c.MongoSession != nil {
        c.MongoSession.Close()
    }

    return nil
}

// Fonction appelée au chargement de l'application.
// Elle effectue un appel a notre fonction Bind avant
// chaque execution du controlleur.
func init() {
    revel.InterceptMethod((*Mongo).Bind, revel.BEFORE)
    revel.InterceptMethod((*Mongo).Close, revel.AFTER)
    // On veut aussi fermer le clone si le controlleur plante.
    revel.InterceptMethod((*Mongo).Close, revel.PANIC)
}
```

On a créé notre connexion à mongo, mais maintenant on va aussi l’utiliser. Dans
le contrôleur, rien de plus simple :

```go
import (
    "github.com/robfig/revel"
    "github.com/OwlyCode/PutainDeProjet/app/modules/mongo"
)

type AppController struct {
    *revel.Controller
    mongo.Mongo // Le controlleur doit étendre notre type Mongo.
}

func (c *AppController) Index() revel.Result {
    usersCollection := c.MongoDatabase.C("users")
    // tu peux maintenant manipuler ta mgo.Collection.
    // [ ... ]
}
```

Mais tu peux aussi l’appeler ailleurs dans le projet, par exemple dans un autre
module :

```go
import (
    "github.com/OwlyCode/PutainDeProjet/app/modules/mongo"
)

func DoStuff(user *models.User) {
    session := mongo.GetSession()
    defer session.Close() // Oublie pas de fermer le robinet à la fin!

    // tu peux maintenant manipuler ta mgo.Session.
    // [ ... ]
}
```

**C'est bien beau de copier coller mais ...**

... tu te demandes certainement pourquoi on a créé un dossier `app/modules`, si
c’est pour n’y mettre qu’un sous dossier mongo dedans. Et c’est une très bonne
question. En fait, notre dossier mongo représente un module du projet bien
délimité. A l’avenir, si tu veux aussi brancher du mysql, et bien y a juste à
créer `app/modules/mysql`. Rien ne change pour l’existant et tu ne pollues pas
la racine de ton projet. L’autre avantage c’est qu’en un coup d’oeil dans ce
dossier tu as un aperçu direct des features de l’application.

Enfin, l'approche module, c'est aussi un gage de MVC. Admettons qu'on veuille
coder une application de facturation, il nous suffit de créer un dossier
`app/modules/invoicing` et de travailler dans ce dossier sur toute la partie
métier. Comme par exemple le calcul des totaux, le calcul de la TVA etc... Grâce
 à cette approche, on garde des contrôleurs très fins et restreints à ce que
 doit être leur rôle premier : faire communiquer le modèle et la vue.

## Modèles globaux, modèles locaux
J’ai évoqué plus haut dans la liste des technos une feature hyper sexy de mgo :
le mapping des documents mongodb en json sur les types struct. Ce qui veut dire
qu’avec mgo, on peut définir des modèles bien structurés. Certains seront
communs à toute l’application, par exemple un utilisateur, mais d’autres seront
spécifiques à un module, comme par exemple une facture.

Une bonne pratique est d’approcher le rangement des modèles selon cette
structure:

- app
  - controllers
  - __models__
  - modules
    - invoicing
      - engine
      - __models__
    - mongo
  - views
- conf
- messages
- public
- tests

Le but du jeu évidemment c'est d'avoir le moins de modèles globaux possibles.
Idéalement, si le dossier `app/models` n'existe pas ce n'est pas plus mal. Mais
attention à ne pas chercher à l'éliminer au prix de la modularité du code. Il
vaut mieux avoir un modèle explicitement déclaré comme global plutot que de
l'isoler dans un module et de rendre tous les autres modules du projet
dépendants de ce dernier.

Pourquoi c'est important ? C'est surtout parce que ça pose les bonnes questions
et amène les bonnes remarques. "Vais-je avoir besoin de ce modèle réellement
PARTOUT ?", "C'est étrange j'ai créé deux modules mais au final je passe mon
temps à faire des va-et-vient de l'un à l'autre... Peut être que je devrais les
fusionner." ou encore "90% de mon projet se trouve dans un seul module, il y a
peut être un problème.". Mais au delà de ça, ça te permets d'isoler des modules
quasi autonomes (deux ou trois coups d'abstraction avec des interfaces et ça
roule). Tu pourras plus tard les sortir de ton projet si par exemple tu veux les
réutiliser sur un autre (svn include pour les ancêtres, git submodules pour les
autres).

## Pour aller plus loin
Isoler distinctement le gestionnaire de connexion, la logique métier et les
modèles dans des modules est une première étape vers une architecture propre et
évolutive. Tu peux même pousser ça plus loin en utilisant des interfaces comme
je l'ai brièvement mentionné un peu plus tôt, c'est même d'ailleurs ce que je te
conseille. Si tu veux creuser ce sujet là tu trouveras pas mal de monde qui s'y
intéresse en fouinant sur le
[groupe de discussion des utilisateurs golang](https://groups.google.com/forum/#!forum/Golang-Nuts).
Tu as par exemple ce gars là qui a
[remplacé sa dépendance à la librairie mgo par des interfaces](https://groups.google.com/forum/#!searchin/Golang-Nuts/interface/golang-nuts/Q0WhF7vhw5Q/T1tSJHT4aCoJ)
pour éviter d'inclure le package a chaque fois et faciliter ses tests. Tu peux
envisager de faire la même chose pour découpler tes modèles et la logique métier
.

En attendant il ne me reste qu'à te souhaiter une bonne coding night, tu as
toutes les armes nécessaires pour gérer mongo dans ton projet revel. ;-)
