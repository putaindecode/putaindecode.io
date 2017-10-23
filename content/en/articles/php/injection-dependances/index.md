---
date: "2014-11-05"
title: "Dependency injection with PHP"
tags:
  - php
  - php-di
authors:
  - neemzy
---

Hi there! I'm here today to tell you about PHP (true story), and specifically
the dependency injection mechanism you may not be familiar with. Objects,
factories and containers are on the way, so put on your docker cap and gloves
and let's move shit around!

## Dependency injection? What the hell is that?

If you're into object-oriented programming, I'd bet you've stumbled upon the
word before. As for us PHP folks, we mainly started to hear about it with the
advent of Symfony, which is now the main web framework for the language. Fabien
Potencier, its creator and lead developer, explains the concept on [his
blog](http://fabien.potencier.org/article/11/what-is-dependency-injection) by
quoting the following definition:

> _Dependency Injection is where components are given their dependencies through
> their constructors, methods, or directly into fields._
>
> Someone

Crystal clear, isn't it? It isn't? Well. Let's picture a piece of a PHP app,
where we want to manage people, each of which has a postal address. If you
haven't been sleeping to much in college on Friday mornings following your
Thursday night binge drinking sessions, you may eventually conclude on your own
we're going to need two classes, namely `Person` and `Address`:

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

I bet you noticed I didn't write the constructor for `Person`. That's on
purpose. A naive developer may do it as follows:

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

So yeah, well, that works, and instantiating a person and its address only takes
a single line of code. The problem is that this way of doing makes `Person` and
`Address` **tightly coupled**: the `Person` class is unusable without `Address`,
and worse, the former's internal code would be impacted by any change on the
latter.

Not convinced, are you? What's going to happen the day we raise 10 million
dollars to internationalize our app?

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

Oh, we now have to evolve the `Person` constructor to add the new `$country`
parameter symmetrically. Bummers.

Ideally, the `Person` class should give no shit about how `Address` works
internally. A person still needs an address, but it most certainly doesn't mean
it is this class's business to craft it. So, how do we achieve that? Quite
simply, actually:

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

Dependency injection is just that. If a class needs an instance of another
class, should it be in its constructor or another method (like a *setter*), said
method should directly receive this instance as a parameter and absolutely not
dwelve into the specifics of instantiating it by itself. Doing so helps writing
**decoupled** code, avoiding interdependency between its components, which makes
them **reusable** without having to bring the whole arsenal with, but much more
**maintenable** as well since each class deals with itself only. In PHP, we also
take advantage of object type hinting, which allows us to be totally sure our
parameter is an instance of the class we want and nothing else.

Alright, I can already hear you ranting:

> Well now I gotta instantiate an address by myself every time I do so with a
> person, this is shit

If so is your opinion, ~~you'd be better off dead~~ please keep on reading this
article with that wild enthusiasm of yours!

## Factory to the rescue

Don't know if you know, but there is a quite common object-oriented design
pattern named **factory** (hence this part's stupid title).

The idea, roughly, is to create a class which sole purpose is to instantiate
other classes, precisely when doing so requires multiple lines of code, in order
to avoid repeating these. Going on with our example:

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

Right now, you may be thinking I'm messing around with you: why bother creating
a class which does exactly what we did directly in `Person` in the first place?
Because you haven't been paying attention, ~~little cu~~ young Padawan. The
goal, when using dependency injection, is not to make our classes depend on each
other if they don't need to. A person does need an address, but we may very well
imagine using these two classes independently (you'll see how in the next part).
As for `PersonFactory`, it is here to allow us to create a person from an
address' ingredients in a single line of code, to preserve simplicity in
business code as you wished for (and are goddamn right about). But here,
`Person` and `Address` remain usable with or without `PersonFactory`: mission
complete.

While we're on the subject of making our lives easier:

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

Would you have made this sort of thing in `Person` or `Address`? I sure hope you
wouldn't.

## Yes, an interface has a purpose

In your white-out student Friday mornings (*cf. supra*), you may find back some
scattered memories of a lesson on **interfaces**. If all you can remember is
that "an empty class is freakin' useless", read on.

An interface is first and foremost a contract. A class **implementing** an
interface commits to implement each and every method the latter declares.
Without even reading said class' code, we already know how to play with it and
how it's supposed to work.

Let's use our same old example again and imagine we have to deal with addresses
that don't respect the format we've used until now, like a basic address only
made of a single string:

```php
class BasicAddress
{
    private $address;
}
```

The way things are now, an instance of this class cannot be used with `Person`
since its constructor expects an instance of `Address`. Let's fix that!

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

$address = new BasicAddress('test test one two one two');
$person = new Person($address);

$factory = new PersonFactory();
$robert = $factory->createParigot(1, 'Rue de la Paix', 2);

echo($person->getAddress()->getFullAddress()); // 'test test one two one two'
echo($robert->getAddress()->getFullAddress()); // '1, rue de la Paix, 75002 Paris, France'
```

See the point? By asking for an instance of _any_ class implementing
`AddressInterface` instead of an instance of `Address` specifically, we loosen
even more the coupling between our classes. No matter how we create a person,
should it be with `Address` or `BasicAddress`, we'll be able to print the actual
address the same way.

## Bitch please, contain your orgasms

You may have frowned upon a detail in that last part: the fact we didn't make
`PersonFactory` a static class (bwaaah) means we have to instantiate it to be
able to use it; without a doubt, this has lead you to think "lel, gunna have
`new SomethingFactory()` all over da place to instantiate my shit". Once again,
dependency injection can help, although indirectly: with a dependency injection
container.

A container (should be enough) can pretty much be compared to a huge factory
that can instantiate multiple classes. In actuality, to avoid having to write
and maintain some monolithic, god-like class, we'll rather make it call the
other factories. Once more with our example:

```php
class DependencyInjectionContainer
{
    public function getPersonFactory()
    {
        return new PersonFactory();
    }
}
```

But it obviously doesn't stop there. When using dependency injection on a large
scale, we often find ourselves having to manually instantiate objects we need.
In some cases, these objects are always the same, like factories but not only:
think about the various libraries used in a web project. Wouldn't it be great to
have instant access to these objects through the container?

```php
$container = new DependencyInjectionContainer();

$container->getOrm()->performSomeNaughtyQuery();
$container->getTwig()->renderUglyTemplate();
$container->getTranslator()->translate('Putain de code !');
```

Objects managed in such a fashion thus become **services** of your application.

> Does that mean services are instantiated for each call?

Not necessarily! There are mechanisms allowing us to keep a single instance and
serve it on subsequent calls. This is out of this article's scope, but you can
take a look at [PHP-DI](http://php-di.org/), a nicely done dependency injection
container library you can use in your own project.

## The end

If you're a PHP developer, I hope I could show you how to write more
maintenable, elegant code by making use of dependency injection. If you're not,
be aware that this concept is quite common in object-oriented programming in
general - after all, [it's even in
Angular](https://docs.angularjs.org/guide/di).

Happy coding, and remember, pushing to production on Friday is bad. Now, go!
