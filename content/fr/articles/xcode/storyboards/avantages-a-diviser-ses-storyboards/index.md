---
date: "2015-12-01"
title: Avantages à diviser ses storyboards en iOS/OS X
tags:
  - ios
  - os x
  - storyboard
  - swift
  - objective c
  - xcode
authors:
  - leoderbois
---
Aujourd'hui on va parler d'un sujet qui parle à tous les devs iOS : les
**storyboards**.

>Pour faire court :  les storyboards sont les fichiers d'interface sous iOS/OS
X. C'est là où vous placer vos `vues` dans vos `scenes`, vous les positionnez
entre elles, vous pouvez créer des interactions entre les `scenes` pour passer
de l'une à l'autre.  C'est proche des XAML de Visual ou des Layout d'Android,
mais avec la notion de relation entre les `scenes` en plus. Ça permet de créer
graphiquement et simplement le workflow de l'application.

## Pourquoi découper son storyboard

Pouvoir relier aussi facilement toutes les `scenes` dans un même storyboard,
c'est génial. Mais alors pourquoi les diviser ?

### Éviter des conflits :

Si vous travaillez à plusieurs, vous avez surement déjà rencontré des
conflits lors de merges où tout le monde a décidé d'éditer le `storyboard` en
même temps. Le storyboard est donc corrompu et le seul moyen de le récupérer
est de prendre celui de quelqu'un et refaire les changements ou de corriger les
sources en croisant les doigts. Accompagné de 4L de café.  
Avec plusieurs `storyboards` : chacun bosse sur sa partie graphique. Si *Bob*
travaille sur les *vues de comptes*  et *Joe* sur les *settings* de l'app,
chacun à un storyboard et ne change pas ceux des autres. Ça fait beaucoup moins
de chance d'avoir des conflits, voir aucun si tout le monde se met d'accord !

### Les gros projets plus faciles à éditer/comrpendre :

Pour les gros projets, avec beaucoup de `scenes` , ranger ces `scenes` par
groupes dans différents `storyboards` peut être un bon moyen de s'y retrouver
facilement. Vous n'avez pas à dézoomer à chaque fois que vous voulez chercher
une `scene` à l'autre bout du storyboard.

### Augmenter la vitesse de compilation :

Recompiler tout le storyboard juste pour un label changé ça ne sert pas à
grand-chose et certains `storyboards` peuvent être long à compiler. Donc moins
d'éléments vous avez à recompilier, plus vite ça ira.

### Réutilisation de code

Imaginons que vous bossez dans une boîte qui fait souvent les mêmes apps
pour les clients, vous pouvez vous faire des petits storyboard que vous
réutiliserez et customiserez grâce aux contrôleurs (couleur,font,etc). Ça peut
faire gagner du temps, mais aussi beaucoup en perdre si vous en abusez ⚠️.

## Comment faire

Rentrons dans le vif du sujet, le côté technique. En quelques lignes de code :

```swift
// *** Swift ***
// Aller chercher le sotyboard
let storyboardSettings = UIStoryboard(name: "settings", bundle: nil)
// Aller chercher le controlleur qui est dans le storybard
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
// Aller chercher le controlleur qui est dans le storybard
UIViewController* controllerSettings = [storyboardSettings
instantiateViewControllerWithIdentifier:@"settingsController"];
// Présenter
[self presentViewController:controllerSettings animated:YES completion:nil];
```

Rien de plus simple ! Mais c'est bien connu, les développeurs iOS sont des
fainéants, alors il y a encore plus simple, sans taper une seule ligne de code :

- créer un nouveau storyboard nouveau pour votre *secteur*
(File→New→File→[OS]→User Interface),
- ajouter une `scene` (`UIViewController`),  mettre l'une en `vue initial`
(sinon le compilateur aime pas),
- nommer les `storyboardID` de chacune de ces `scenes` dans le menu
`Utilies>Identity Inspector`,
- dans votre storyboad original, dans le menu `Utilies>Object Library` chercher
`storyboard` et ajouter une **`Storyboard Refrences`**,
- Sur la référence dans `Utilises>Attributes Inspector` rentrer le nom dans
votre storyboard (dans *storyboard*) et remplisser *Reference ID* avec le
*storyboardID* de la `scene`,
- pour finir, ajouter une `segue`, à partir d'un bouton (par exemple) vers les
*Storyboard Reference* voulu.

Plus long à lire qu'à faire !
