---
date: "2015-12-01"
title: Avantages à diviser ses storyboards sur iOS/OS X
tags:
  - ios
  - os x
  - storyboard
  - swift
  - objective c
  - xcode
authors:
  - leolelego
---

Aujourd'hui, on va aborder un sujet qui parle à tous les devs iOS : les
**storyboards**.

> Pour faire court : les storyboards sont les fichiers d'interface sous iOS/OS
> X. C'est là où vous placez vos `vues` dans vos `scènes`, vous les positionnez
> entre elles, vous pouvez créer des interactions entre les `scènes` pour passer
> de l'une à l'autre. C'est proche des XAML de Visual ou des Layouts d'Android,
> mais avec la notion de relation entre les `scènes` en plus. Ça permet de créer
> graphiquement et simplement le workflow de l'application.

## Pourquoi découper son storyboard

Pouvoir relier aussi facilement toutes les `scènes` dans un même storyboard,
c'est génial. Mais alors, pourquoi les diviser ?

### Éviter des conflits

Si vous travaillez à plusieurs, vous avez sûrement déjà rencontré des conflits
lors de merges où tout le monde a décidé d'éditer le `storyboard` en même temps.
Le storyboard est donc corrompu et le seul moyen de le récupérer est de prendre
celui de quelqu'un et refaire les changements ou de corriger les sources en
croisant les doigts. Accompagné de 4 L de café.\
Avec plusieurs `storyboards` : chacun bosse sur sa partie graphique. Si _Bob_ travaille
sur les _vues de comptes_ et _Joe_ sur les _settings_ de l'app, chacun a un storyboard
et ne change pas ceux des autres. On limite ainsi les chances d'avoir des conflits.

### Les gros projets plus faciles à éditer/comprendre

Pour les gros projets, avec beaucoup de `scènes`, ranger ces `scènes` par
groupes dans différents `storyboards` peut être un bon moyen de s'y retrouver
facilement. Vous n'avez pas à dézoomer chaque fois que vous voulez chercher une
`scène` à l'autre bout du storyboard.

### Augmenter la vitesse de compilation

Recompiler tout le storyboard juste pour un `label` changé ça ne sert pas à
grand-chose et certains `storyboards` peuvent être longs à compiler. Donc moins
d'éléments vous avez à recompiler, plus vite ça ira.

### Réutilisation de code

Imaginons que vous bossez dans une boîte qui fait souvent les mêmes apps pour
les clients, vous pouvez vous faire de petits storyboards que vous réutiliserez
et customiserez grâce aux contrôleurs (couleur, font, etc). Ça peut faire gagner
du temps, mais aussi beaucoup en perdre si vous en abusez ⚠️.

## Comment faire

Rentrons dans le vif du sujet, le côté technique. En quelques lignes de code :

```swift
// *** Swift ***
// Aller chercher le storyboard
let storyboardSettings = UIStoryboard(name: "settings", bundle: nil)
// Aller chercher le contrôleur qui est dans le storybard
let controllerSettings =
storyboardSettings.instantiateViewControllerWithIdentifier("settingsController")
// Présenter
self.presentViewController(controllerSettings,animated: true, completion: nil)
```

```objc
// *** Objective C ***
// Aller chercher le sotyboard
UIStoryboard * storyboardSettings = [UIStoryboard storyboardWithName:@"settings"
bundle:nil];
// Aller chercher le contrôleur qui est dans le storybard
UIViewController* controllerSettings = [storyboardSettings
instantiateViewControllerWithIdentifier:@"settingsController"];
// Présenter
[self presentViewController:controllerSettings animated:YES completion:nil];
```

Rien de plus simple ! Mais c'est bien connu, les développeurs iOS sont des
fainéants, alors il y a encore plus simple, sans taper une seule ligne de code :

- créez un nouveau storyboard pour votre _secteur_ (File→New→File→[OS]→User
  Interface),
- ajoutez une `scène` (`UIViewController`), mettre l'une en `vue initiale`
  (sinon le compilateur n'aime pas),
- nommez les `storyboardID` de chacune de ces `scènes` dans le menu
  `Utilies>Identity Inspector`,
- dans votre storyboard original, dans le menu `Utilies>Object Library` cherchez
  `storyboard` et ajoutez une **`Storyboard References`**,
- sur la référence dans `Utilises>Attributes Inspector` rentrez le nom dans
  votre storyboard (dans _storyboard_) et remplissez _Reference ID_ avec le
  _storyboardID_ de la `scène`,
- pour finir, ajoutez une `segue`, à partir d'un bouton (par exemple) vers les
  _Storyboard Reference_ voulus.

Plus long à lire qu'à faire !
