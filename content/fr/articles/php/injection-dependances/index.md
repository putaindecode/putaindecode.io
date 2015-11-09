---
date: "2014-11-05"
title: "L'injection de dépendances en PHP"
tags:
  - php
  - php-di
authors:
  - neemzy
---

Salutations ! Aujourd'hui, je suis venu te parler de PHP (sisi), et notamment du mécanisme d'injection de dépendances avec lequel tu n'es peut-être pas familier. Au menu, des objets, des usines et des conteneurs, alors enfile ton bonnet et tes gants, on va bouger du bordel !

## L'injection de dépendances ? C'est quoi ce truc ?

Si tu fais de la programmation orientée objet, il est fort probable que ce terme ne te soit pas totalement inconnu. En PHP, on a principalement commencé à nous en rebattre les oreilles avec l'avènement de Symfony, qui est aujourd'hui le framework web majeur pour ce langage. Fabien Potencier, créateur et *lead developer* de Symfony, cite en exemple sur [son blog](http://fabien.potencier.org/article/11/what-is-dependency-injection) cette définition :

> *Dependency Injection is where components are given their dependencies through their constructors, methods, or directly into fields.*
>
> Quelqu'un

C'est clair, non ? Non ? Bon. Imaginons un bout d'appli PHP, où l'on désire gérer des personnes qui ont chacune une adresse postale. Si tu n'as pas trop dormi à la fac le vendredi matin après ta cuite du jeudi soir, tu devrais pouvoir déterminer tout seul qu'on va avoir besoin d'une classe `Person` et d'une classe `Address` :

```php
class Address
{
    private $number;
    private $street;
    private $zipcode;
    private $city;

    public function __construct($number, $street, $zipcode, $city)
    {
        $this->number = $number;
        $this->street = $street;
        $this->zipcode = $zipcode;
        $this->city = $city;
    }
}

class Person
{
    private $address;
}
```

Tu noteras que je n'ai pas encore écrit le constructeur de la classe `Person`. Justement. Le développeur naïf procédera de la façon suivante :

```php
class Person
{
    private $address;

    public function __construct($number, $street, $zipcode, $city)
    {
        $this->address = new Address($number, $street, $zipcode, $city);
    }
}

$person = new Person(5, 'Allée des Rosiers', 78670, 'Villennes-sur-Seine');
```

Alors oui, hein, ça marche, et on peut instancier une personne et son adresse en une ligne de code. Le problème est qu'en procédant ainsi, les classes `Person` et `Address` deviennent **étroitement couplées** : la classe `Person` est inutilisable sans la classe `Address`, et pire, le code interne de la première serait impacté par un changement sur la seconde.

Pas convaincu ? Qu'est-ce qui se passera le jour où on lèvera 10 millions de dollars pour internationaliser l'appli ?

```php
class Address
{
    // ...
    private $country;

    public function __construct($number, $street, $zipcode, $city, $country)
    {
        // ...
        $this->country = $country;
    }
}
```

Ah bah mince, il faut aussi modifier le constructeur de la classe `Person` pour y ajouter le nouveau paramètre `$country` de manière symétrique. C'est ballot.

Dans l'idéal, la classe `Person` devrait se foutre royalement de la façon dont la classe `Address` fonctionne. Une personne a toujours besoin d'une adresse, mais ça n'implique certainement pas que ce soit le rôle de cette classe de la forger. Alors, on fait comment ? C'est très simple :

```php
class Person
{
    private $address;

    public function __construct(Address $address)
    {
        $this->address = $address;
    }
}
```

L'injection de dépendances, c'est précisément ça. Si une classe a besoin d'une instance d'une autre classe, que ce soit dans son constructeur ou dans une autre méthode (un *setter* par exemple), alors elle prend cette instance directement en paramètre et ne s'occupe certainement pas de l'instancier elle-même. Procéder ainsi permet d'écrire du code **découplé**, évitant toute interdépendance entre ses différents composants, ce qui les rend **réutilisables** sans devoir embarquer toute la smala au passage, mais également beaucoup plus **maintenables** puisque chaque classe s'occupe de ses fesses et pas de celles des autres. En PHP, on tire également parti du *type hinting* d'objets, qui permet de s'assurer d'emblée que notre paramètre est une instance de la classe voulue et non pas n'importe quoi.

Alors oui, je t'entends déjà grommeler :

> Ouais mais du coup je dois instancier une adresse moi-même à chaque fois que je crée une personne, c'est relou ton truc

Si telle est ton opinion, ~~tu ne mérites pas de vivre~~ je t'invite à poursuivre la lecture de cet article avec l'entrain qui te caractérise.

## L'usine à la rescousse

Je ne sais pas si tu sais, mais il existe un *design pattern* assez répandu en programmation orientée objet que l'on nomme **factory** (usine en français, d'où le titre pourrave de cette partie).

En gros, le principe est de créer une classe dont le rôle est d'instancier d'autres classes, précisément dans le cas où une telle tâche demande plusieurs lignes de code, afin justement d'éviter de répéter celles-ci. Pour reprendre notre exemple :

```php
class PersonFactory
{
    public function createPerson($number, $street, $zipcode, $city, $country)
    {
        $address = new Address($number, $street, $zipcode, $city, $country);

        return new Person($address);
    }
}
```

Pour le coup, tu te dis peut-être que je te prends allègrement pour un idiot : pourquoi se prendre le chou à créer une classe qui fait exactement ce qu'on faisait directement dans `Person` au départ ? Parce que tu n'as pas bien écouté, ~~petit c~~ jeune padawan. L'objectif en utilisant l'injection de dépendances, c'est que nos classes ne soient pas dépendantes (justement) les unes des autres si ce n'est pas justifié. Une personne a beau avoir besoin d'une adresse, on pourrait fort bien imaginer les utiliser l'une sans l'autre (tu comprendras à la partie suivante). Dans le cas de `PersonFactory`, notre objectif est justement de créer une personne à partir des différents composants d'une adresse en une ligne de code, pour conserver la simplicité du code métier qui te tient tant à coeur (et tu as bien raison, au fond). Seulement, `Person` et `Address` restent utilisables avec ou sans `PersonFactory` : l'objectif est atteint, petit navire.

Tant qu'on en est à se simplifier la vie :

```php
class PersonFactory
{
    // ...

    private function getZipcodeFromDistrict($district)
    {
        return 75000 + $district;
    }

    public function createParigot($number, $street, $district)
    {
        return $this->createPerson($number, $street, $this->getZipcodeFromDistrict($district), 'Paris', 'France');
    }
}
```

Tu t'imagines faire ce genre de chose dans la classe `Person` ou la classe `Address` ? J'espère bien que non.

## Oui, ça sert à quelque chose une interface

Dans tes souvenirs brumeux de vendredis matins étudiants (*cf. supra*), tu retrouveras peut-être des bribes de cours portant sur les **interfaces**. Si tout ce que tu as retenu, c'est qu'"une classe toute vide ça sert à rien", lis donc ce qui va suivre.

Une interface, c'est avant tout un contrat. Une classe qui **implémente** une interface s'engage à implémenter toutes les méthodes que celle-ci déclare. Sans même lire le code de ladite classe, on sait donc d'emblée comment on peut jouer avec et comment elle est censée fonctionner.

Poursuivons encore sur notre exemple et imaginons qu'on doive gérer des adresses ne respectant pas le format utilisé jusqu'ici, par exemple une adresse plus basique constituée d'une unique chaîne de caractères :

```php
class BasicAddress
{
    private $address;
}
```

Dans l'état actuel des choses, on ne peut pas utiliser une instance de cette classe avec `Person`, puisque le constructeur de cette dernière attend une instance d'`Address`. Qu'à cela ne tienne !

```php
interface AddressInterface
{
    public function getFullAddress();
}

class BasicAddress implements AddressInterface
{
    private $address;

    public function getFullAddress()
    {
        return $this->address;
    }
}

class Address implements AddressInterface
{
    // ...

    public function getFullAddress()
    {
        return $this->number.', '.$this->street.', '.$this->zipcode.' '.$this->city.', '.$this->country;
    }
}

class Person
{
    // ...

    public function __construct(AddressInterface $address)
    {
        $this->address = $address;
    }

    public function getAddress()
    {
        return $this->address;
    }
}

$address = new BasicAddress('test test un deux un deux');
$person = new Person($address);

$factory = new PersonFactory();
$robert = $factory->createParigot(1, 'Rue de la Paix', 2);

echo($person->getAddress()->getFullAddress()); // 'test test un deux un deux'
echo($robert->getAddress()->getFullAddress()); // '1, rue de la Paix, 75002 Paris, France'
```

Tu vois l'idée ? En demandant une instance de n'importe quelle classe implémentant `AddressInterface` au lieu d'une instance d'`Address` spécifiquement, on se donne plus de mou et on réduit encore davantage le couplage entre nos classes. Qu'on crée une personne avec une instance d'`Address` ou de `BasicAddress`, on pourra dans tous les cas obtenir l'adresse postale de ladite personne de la même façon.

## Elle contient ta fiancée, hein Mitch ?

Tu auras peut-être tiqué sur un détail du dernier exemple : le fait de ne pas faire de `PersonFactory` une classe statique (beurk) nous oblige à l'instancier pour pouvoir l'utiliser ; ce qui, à n'en pas douter, t'aura mené à te dire "arf, ça va m'en faire des `new MachinFactory()` pour instancier mes objets". Là encore, l'injection de dépendances peut nous aider, quoique de manière indirecte : en utilisant un conteneur d'injection de dépendances.

Un conteneur (ça sera plus court) peut *grosso modo* être comparé à une grosse *factory* capable d'instancier plusieurs classes. En pratique, afin d'éviter d'écrire et de devoir maintenir une classe monolithique, on en fera plutôt quelque chose qui fait appel aux différentes *factories*. Poursuivons sur notre exemple :

```php
class DependencyInjectionContainer
{
    public function getPersonFactory()
    {
        return new PersonFactory();
    }
}
```

Mais ça ne s'arrête évidemment pas là. De par le fait d'utiliser l'injection de dépendances à grande échelle, on a souvent besoin d'instancier nous-même les objets dont on a besoin. Dans certains cas, ce seront toujours les mêmes, ce qui vaut pour les *factories* mais pas que : pense aux différentes librairies qui composent un projet web, par exemple. Ce ne serait pas génial que les différentes instances de ces classes soient accessibles via le conteneur pour pouvoir y accéder à l'envi ?

```php
$container = new DependencyInjectionContainer();

$container->getOrm()->performSomeNaughtyQuery();
$container->getTwig()->renderUglyTemplate();
$container->getTranslator()->translate('Putain de code !');
```

Les objets ainsi gérés par un tel conteneur deviennent dès lors des **services** dans ton application.

> Mais ça signifie instancier un service à chaque appel ?

Pas nécessairement ! Il existe des mécanismes permettant de conserver une même instance pour la servir lors des appels suivants. Cela sort un peu du cadre de cet article, mais je t'invite vivement à jeter un oeil à [PHP-DI](http://php-di.org/), qui est un conteneur d'injection de dépendances très bien fichu que tu peux utiliser dans ton projet si tu le souhaites.

## Épilogue

Si tu développes en PHP, j'espère t'avoir montré qu'il est possible d'écrire du code plus maintenable et plus élégant en utilisant l'injection de dépendances. Dans le cas contraire, sache que ce concept est très répandu dans les langages orientés objet d'une manière générale - après tout, [on en retrouve même dans Angular](https://docs.angularjs.org/guide/di).

Bon code, et n'oublie pas, on ne met pas en prod le vendredi, c'est mal. Allez, file !
