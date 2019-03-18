---
date: 2017-11-02
title: Introduction à l'Overlay Manager Service, expliqué par quelqu'un qui n'y connaît rien
author: jojmaht
oldSlug: android/overlaymanagerservice
slug: introduction-overlay-manager-service
---

> DISCLAIMER : J'entrave pas un keyword de Java, j'ai jamais développé une seule
> app native, et plus globalement, je ne connais vraiment pas mon sujet. Ainsi,
> si quelqu'un s'y connaissant mieux que moi passe par là, qu'il n'hésite
> surtout pas à me corriger et à m'afficher devant la planète entière, j'ai
> besoin de nourrir mon syndrome de l'imposteur.

Salut les copains aujourd'hui tonton FoetusBoy (SkinnyFoetusDaron) (moi) va vous
parler d'un sujet qu'il ne connaît pas et qui s'insèrera à ce titre aux côtés
d'autres sujets qu'il ne connaît pas tels que la joie de vivre, les souvenirs
des jours joyeux et comment ne pas parler de soi à la troisième personne.

Ouvrez vos calepins à la page bullshit, on va faire un cours sur l'Overlay
Manager Service (ou OMS) d'Android, sur comment ça fonctionne et comment vous
allez pouvoir l'utiliser pour faire des trucs moches.

<figure>
  <img src="/images/articles/2017-11-02-introduction-overlay-manager-service/OMS-moche.png" alt="hahaha comment c'est trop moche" />
  <figcaption>J'ai séché les cours de théorie des couleurs</figcaption>
</figure>

Okay alors maintenant que vos rétines sont perpétuellement démolies par cette
capture d'écran et que votre curiosité est piquée au vif, on attaque le cours
d'histoire. Fin 2015, deux ingénieurs de chez Sony Mobile, Mårten Kongstad et
Martin Wallgren, que j'identifie à 99% de chances comme étant probablement tous
les deux Suédois (et qui illustrent bien l'inventivité de ce peuple lorsqu'il
s'agit de trouver toutes les façons de nommer quelqu'un Martin), coécrivent un
commit dans l'AOSP (Android Open-Source Project), sous le chouette identifiant
"OMS: introduce the OverlayManagerService". Cet événement est chouette pour deux
raisons :

- La première est qu'Android étant malgré le contrôle de Google un projet
  open-source, c'est toujours intéressant de voir les constructeurs participer
  un peu au projet (les mauvaises langues diront que seul Sony joue vraiment le
  jeu de l'open-source et les mauvaises langues n'auraient pas vraiment tort).
- La deuxième est que ça marque l'arrivée sur Android d'un véritable système de
  theming (thématisation en Français, donc je vais dire theming plutôt hein),
  permettant ainsi aux constructeurs d'implémenter leurs customisations de façon
  beaucoup plus souple et surtout aux initiés (moi et bientôt vous) de s'amuser
  un peu.
- Troisième raison (bonus) : C'était bientôt Noël et cette année-là on m'avait
  offert un joli manteau.

Commençons. Comme son nom l'indique si vous parlez la langue de Jay-Z, l'Overlay
Manager Service est un service de gestion de surcouches.

<figure>
  <img src="/images/articles/2017-11-02-introduction-overlay-manager-service/jayz.png" alt="" />
  <figcaption>Si votre Google Translate n'a pas l'option de traduction de Jay-Z vers Molière c'est que vous n'avez pas souscrit à un abonnement Translate Gold</figcaption>
</figure>

L'OMS est lui-même le successeur du RRO, pour "Runtime Resource Overlay", ancien
système propriétaire de Sony Mobile, utilisé en interne pour déployer et
paramétrer rapidement leur surcouche à Android en fonction des demandes et
besoins des opérateurs et des mises à jour d'Android lui-même ou bien pour faire
fonctionner les Thèmes Xperia (on connaît Sony assez friands de la customisation
par les utilisateurs depuis la sortie de la PS3, surtout quand il s'agit de
vendre des thèmes à 25$).

Ce Runtime Resource Overlay (surcouches de ressources à l'exécution) s'opposait
à l'outil Static Resource Overlay (surcouches de ressources statiques), un flag
du packager d'Android (aapt) qui était comme qui dirait "bien mais pas top" : il
permettait de séparer le code source d'une application de sa surcouche pour
garder une base de travail propre (bien) mais ces surcouches ne pouvaient être
installées qu'à la compilation de l'app, les rendant donc chiantes à débugger et
nécessitaient plus ou moins qu'on soit le vendor original de l'application à
modifier (pas top). Le principal intérêt du RRO était donc de faire sauter ces
"barrières".

Voyant donc que l'un des principaux reproches faits à Android, à raison ou à
tort (à raison hein, on va pas se mentir) était sa fragmentation et que l'un de
ses facteurs (mais non le seul) était lié aux _vendors_ (Samsung.) mettant trop
de temps à recoder leur surcouche de A à Z à chaque version d'Android (et que de
toute façon pourquoi s'emmerder à mettre à jour un téléphone gratuitement alors
que tu peux en vendre un nouveau pour 700 pétrodollars _allez achète, vil
consommateur_ ?) les braves petits ingés de chez Sony ont préféré faire une
petite PR sympa du côté de l'AOSP pour ajouter ce système de surcouches en natif
dans Android. Resté dormant pendant quelques temps, l'OMS a enfin été activé de
façon officielle (à peu près) par Google, lors de la sortie d'Android 8.0 Oreo,
qui en tire une utilité assez basique mais prometteuse : changer littéralement
une seule couleur dans l'interface, spécifiquement pour les téléphones Pixel.

<figure>
  <img src="/images/articles/2017-11-02-introduction-overlay-manager-service/epoustouflan.png" alt="époustouflan" />
  <figcaption>époustouflan</figcaption>
</figure>

Ça peut paraître peu mais c'est finalement ce genre de modifications à la con
qui peut considérablement ralentir le portage d'une nouvelle version d'Android
sur un device existant. Ouvrons un peu le ventre de la bête.

Un overlay, ça fonctionne assez simplement. Il prend la forme d'un Android
PacKage (ci-après APK), le format standard des applications Android, genre de
point JAR survitaminé, qu'il conviendra donc de signer s'il vous plaît merci
c'est important bonne journée, si vous comptez l'installer par vous-même en
dehors de l'IDE consacré (Android Studio, donc). De par sa nature d'APK, un
overlay devra donc contenir un AndroidManifest.xml, sorte de package.json si je
devais faire une équivalence avec le dev web, cet AndroidManifest donc, qui
prendra la forme suivante :

```
<?xml version="1.0" encoding="utf-8" standalone="no"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="LePetitNomDeMonPackage">
    <overlay android:priority="1000" android:targetPackage="LePetitNomDuPackageCible"/>
</manifest>
```

Mettons les points sur les i et définissons immédiatement ce qu'un overlay n'est
pas : un overlay n'est _pas_ une extension d'application, il ne peut en aucun
cas rajouter des fonctionnalités à une application existante, de la même manière
que vous galéreriez à rajouter des features à un site existant juste en
modifiant son CSS. En somme, à peu de choses près, un overlay se réduit à une
feuille de style où toutes les déclarations seraient faites avec `!important` et
comme on aime les bonnes pratiques bien maintenables chez PutainDeCode on vous
rappellera de ne _JAMAIS_ faire ça s'il vous plaît.

Là où la comparaison s'arrête c'est que contrairement à CSS, les ressources
d'une application ne comprennent pas que les couleurs et occasionnellement les
dimensions des blocs, mais peuvent renfermer les icônes, les sons, les images,
et à peu près tout ce que le développeur original a voulu foutre dedans.

En résumé, rajouter une feature pour envoyer des SMS depuis votre lecteur de
musique : c'est non; remplacer toutes les couleurs d'une appli par du rose, les
typos par du Comic Sans MS et les sons d'interactions par le bruit d'un canard
qui fait "Coin coin" : c'est oui.

D'ailleurs on va rendre l'application Calculatrice (dont le nom de package est
"com.google.android.calculator", ça servira plus tard) toute rose parce que
pourquoi pas. En décompilant donc l'APK à l'aide de notre fidèle
[apktool](https://ibotpeaches.github.io/Apktool/), nous voilà dans le cœur du
code, dans la matrice, dans la mer numérique, bref, dans un sacré paquet de
fichiers XML.

<figure>
  <img src="/images/articles/2017-11-02-introduction-overlay-manager-service/chosenOne.png" alt="Mes collègues détestent que je dise I'm in à chaque fois que je fais un git pull" />
  <figcaption>*hacker voice* I'm in</figcaption>
</figure>

Selon toute logique, la gestion des couleurs de l'app va probablement se
retrouver dans un fichier qui s'appelle à peu près `colors.xml`, ce qui n'est
pas étonnant parce que c'est comme ça qu'on nomme ses fichiers quand on veut s'y
retrouver, j'ai appris ça à l'école quand je mettais des gommettes sur mes
cahiers. Il s'agit donc maintenant de voir ce à quoi sert chaque valeur dans ce
fichier. Si vous arrivez à déduire le code hexa d'une couleur juste en la
regardant, félicitations, vous êtes probablement un Terminator. Pour ceux qui ne
sont pas des robots tueurs venus du turfu, faire une capture d'écran de
l'application et ouvrir celle-ci dans Photoshop fonctionne très bien aussi.

<figure>
  <img src="/images/articles/2017-11-02-introduction-overlay-manager-service/colors.png" alt="Featuring l'outil pipette de Photoshop, on applaudit l'outil pipette de Photoshop" />
  <figcaption>Devinez à quel moment j'en ai eu marre de faire de belles flèches bien droites</figcaption>
</figure>

Les trois valeurs nous intéressant sont donc `pad_advanced_background_color`,
`pad_numeric_background_color` et `pad_operator_background_color` qui sont
finalement assez bien nommées. Vous remarquerez que les couleurs sont au format
#aarrggbb et non pas #rrggbb, donc faites gaffe quand vous tripotez ça et que
vous remplacez les couleurs par du rose (j'ai choisi le Bubblegum Pink de
Pantone mais si vous préférez d'autres teintes de rose, libre à vous). Il s'agit
maintenant de créer un nouveau fichier colors.xml dans notre
[template OMS](https://github.com/jojmaht/OMS-template) qu'on va remplir
ainsi :

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="pad_advanced_background_color">#fff4cbd4</color>
    <color name="pad_numeric_background_color">#fff4cbd4</color>
    <color name="pad_operator_background_color">#fff4cbd4</color>
</resources>
```

Puis nous pouvons enfin compiler notre chef d'œuvre (toujours avec apktool) puis
l'installer sur notre appareil, non sans l'avoir
[au préalable signé](https://stackoverflow.com/questions/10930331/how-to-sign-an-already-compiled-apk),
puis enfin de l'appliquer via la commande

```
adb shell cmd overlay enable [le namespace de votre package que vous avez spécifié dans AndroidManifest.xml, moi par exemple c'est "com.sfb.pinkcalc"]
```

(il faut que votre téléphone soit en mode Développeur et que vous tourniez sous
Android Oreo minimum sinon ça ne marchera pas, pas la peine de me demander pour
faire marcher ça sur votre téléphone si vous êtes sous Gingerbread, tout ce que
je ferai ce sera me moquer de vous).

Admirons ce merdier, maintenant.

<figure>
  <img src="/images/articles/2017-11-02-introduction-overlay-manager-service/fuckthatspink.png" alt="Sans rire, depuis l'écriture de cet article j'ai pas désactivé cet overlay, j'aime vraiment le look que ça donne à l'app calculatrice" />
  <figcaption>Absolument splendide.</figcaption>
</figure>

C'est à peu près tout pour l'OMS, pour les bases du moins, n'hésitez surtout pas
à décompiler toutes les apps que vous trouvez pour voir un peu comment ça marche
à l'intérieur, c'est aussi pour ça que c'est cool Android. Allez faire vos
propres trucs moches maintenant. _Ciao._
