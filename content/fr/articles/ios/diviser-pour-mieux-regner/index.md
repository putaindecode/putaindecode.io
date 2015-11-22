---

date: "2015-11-26"
title: Diviser pour mieux régner
tags:
  - ios
  - storyboard
  - objective c
  - swift
authors:
  - leoderbois

---

Ceci n'est pas un article sur la manipulation des  collègues pour être le roi du lancé de clavier dans la poubelle (le papier c'est déprécier m'voyez). On va parler d'un sujet qui parle à tous les devs iOS : les *storyboards*.

>Pour faire court :  les storyboards sont les fichiers d'interface sous iOS/OS X. C'est là où vous placer vos `vues` dans vos `scenes`, vous les positionnez entre elles, vous pouvez créer des interactions entre les `scenes` pour passer de l'une à l'autre.  C'est proche des XAML de Visual ou des Layout d'Android, mais avec la notion de relation entre les scènes en plus. Ça permet de créer graphiquement et simplement le workflow de l'application.

## Pourquoi découper son storyboard

Pouvoir relier aussi facilement toutes les scènes dans un même storyboard, c'est génial. Mais alors pourquoi les diviser ?

- Éviter des conflits :

	Si vous travaillez à plusieurs, vous avez surement déjà rencontré des **conflits lors de merges où tout le monde a décidé d'éditer le `storyboard` en même temps**. Le storyboard est donc corrompu et le seul moyen de le récupérer est de prendre celui de quelqu'un et refaire les changements ou de corriger les sources en croisant les doigts. Accompagné de 4L de café.  
	Avec plusieurs `storyboards` : chacun bosse sur sa partie graphique. Si *Bob* travaille sur les *vues de comptes*  et *Joe* sur les *settings* de l'app, chacun à un storyboard et ne change pas ceux des autres. Ça fait beaucoup moins de chance d'avoir des conflits, voir aucun si tout le monde se met d'accord !

- Les gros projets plus faciles à éditer/comrpendre :

    Pour les gros projets, avec beaucoup de `scenes` , ranger ces `scènes` par groupes dans différents `storyboards` peut être un bon moyen de s'y retrouver facilement. Vous n'avez pas à dézoomer à chaque fois que vous voulez chercher une `scene` à l'autre bout du storyboard.

- Augmenter la vitesse de compilation :

    recompiler tout le storyboard juste pour un label changé ça ne sert pas à grand-chose et certains `storyboards` peuvent être long à compiler. Donc moins d'éléments vous avez à recompilier, plus vite ça ira.

- Réutilisation de code

    Imaginons que vous bossez dans une boîte qui fait souvent les mêmes apps pour les clients, vous pouvez vous faire des petits storyboard que vous réutiliserez et customiserez grâce aux contrôleurs (couleur,font,etc). Ça peut faire gagner du temps, mais aussi beaucoup en perdre si vous en abusez ⚠️.

## Comment faire

Rentrons dans le vif du sujet, le côté technique. En quelques lignes de code :


```swift
// *** Swift ***
// Aller chercher le sotyboard
let storyboardSettings = UIStoryboard(name: "settings", bundle: nil)
// Aller chercher le controlleur qui est dans le storybard
let controllerSettings = storyboardSettings.instantiateViewControllerWithIdentifier("settingsController")
// Présenter
self.presentViewController(controllerSettings,animated: true, completion: nil)
```

```objc
// *** Objective C ***
// Aller chercher le sotyboard
UIStoryboard * storyboardSettings = [UIStoryboard storyboardWithName:@"settings" bundle:nil];
// Aller chercher le controlleur qui est dans le storybard
UIViewController* controllerSettings = [storyboardSettings instantiateViewControllerWithIdentifier:@"settingsController"];
// Présenter
[self presentViewController:controllerSettings animated:YES completion:nil];
```

Rien de plus simple ! Mais c'est bien connu, les développeurs iOS sont des fainéants, alors il y a encore plus simple, sans taper une seule ligne de code :

- créer un nouveau storyboard nouveau pour votre *secteur* (File→New→File→[OS]→User Interface),
- ajouter une scène (`UIViewController`),  mettre l'une en `vue initial` (sinon le compilateur aime pas),
- nommer les `storyboardID` de chacune de ces scènes dans le menu `Utilies>Identity Inspector`,
- dans votre storyboad original, dans le menu `Utilies>Object Library` chercher `storyboard` et ajouter une **`Storyboard Refrences`**,
- Sur la référence dans `Utilises>Attributes Inspector` rentrer le nom dans votre storyboard (dans *storyboard*) et remplisser *Reference ID* avec le *storyboardID* de la `scène`,
- pour finir, ajouter une `segue`, à partir d'un bouton (par exemple) vers les *Storyboard Reference* voulu.

Plus long à lire qu'à faire !

<video  controls width='100%'>
  <source src="https://io_infinit_links.storage.googleapis.com/564f1e02798e5b7215565d80/diviser-pour-mieux-regner.mp4?GoogleAccessId=798530033299-s9b7qmrc99trk8uid53giuvus1o74cif%40developer.gserviceaccount.com&Signature=XqaAKWJxx2S2zOfaTf3N5IP5PawfBd96qYsymKb7nC6kL8kzpL3Q8QH2dUOvUYXZ2IAt3sD7phJt9W76l5wAgP5tkO%2BvJeJqReULXFB4UgBbQx6ujEOlNZTko07W8EQVeOzTRz52jZxz4qyd01qCpNbX5QiiKGqbDtwZ%2BwomkjA%3D&Expires=1448300955" type="video/mp4">
</video>
