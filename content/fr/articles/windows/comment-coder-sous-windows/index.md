---
date: "2014-10-15"
title: Comment essayer de coder comme un chef sous Windows
tags:
  - windows
  - outils
  - dev
authors:
  - kud
header:
  credit: http://www.customity.com/content/wallpaper/windows-key-wallpaper
---

Oh oui, en voilà une belle question.

Il n'est pas toujours évident d'avoir un Linux, Unix, BSD ou autre avec un petit shell bien sympa sous la main. Et parfois coder sous Windows est une nécessité voire un désir. (Ouais, je ne vous parlerai pas ici de changer de boulot si Windows vous est imposé(e). Je ne vous expliquerai pas non plus votre masochisme d'apprécier cet OS pour développer, ce n'est pas le sujet).

Étant un homme de challenge, j'aime me mettre dans des contextes limités et voir comment je me débrouille pour sortir d'une situation pénible à une situation acceptable voire agréable. Je me suis alors lancé pour vous dans cette aventure.

Oh mais pourquoi j'ai dû faire ça à la base ?

Après avoir créé [mon propre système de synchronisation de machines sous Mac OS X](https://github.com/kud/my) (plus souvent communément appelé dotfiles mais faisant un peu plus), j'ai voulu faire de même sous Windows au cas où mon système crasherait et où je devrais tout réinstaller. On n'est jamais à l'abri.

Pour cela, plusieurs outils vont vous être nécessaires. Un chef sans bons outils, c'est drôlement handicapant. (Déjà que l'OS en question n'aide pas).


## Chocolatey : la base

[Chocolatey](http://chocolatey.org/). Ouais, chocolatey, ce petit script vous permettra de télécharger tout et n'importe quoi en CLI (ligne de commandes). Pour ceux qui ont l'habitude de Mac ou Linux, c'est le brew / apt-get de Windows.

Comment l'installer ?

Lancez `cmd.exe` en mode administrateur (touche windows puis "cmd" puis shift+ctrl+enter) et exécutez ce code :

```console
$ @powershell -NoProfile -ExecutionPolicy unrestricted -Command "iex ((new-object net.webclient).DownloadString('https://chocolatey.org/install.ps1'))" && SET PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin
```

Ou `PowerShell` en mode administrateur (touche windows puis "powershell" puis shift+ctrl+enter) et éxecutez :

```console
$ iex ((new-object net.webclient).DownloadString('https://chocolatey.org/install.ps1'))
```

Une fois installé, vous pourrez installer n'importe quel logiciel listé sur [leur site](http://chocolatey.org/packages).

Passons à la suite.

## Logiciels de développement

Yes, on a donc Chocolatey qui va nous simplifier grandement l'installation de logiciels. Passons maintenant aux outils pour bien développer.

### Git

Lorsque tu joues à un jeu vidéo, tu sauvegardes régulièrement ton avancement non ? Bah là, c'est pareil mais pour le code.

```console
$ choco install git.install
```

- [site officiel](http://git-scm.com/)
- [lien du package](https://chocolatey.org/packages/git.install)

### Node.js

Faire du JavaScript côté serveur ou en shell, le pied. Surtout pour faire des scripts Windows, plutôt que de passer par Batch.

```console
$ choco install nodejs.install
```

- [site officiel](http://nodejs.org/)
- [lien du package](https://chocolatey.org/packages/nodejs.install)

### Éditeur de texte

Sublime Text, l'éditeur préféré des Franç... je m'égare. Bref, un bon éditeur.

```console
$ choco install sublimetext3
```

- [site officiel](http://www.sublimetext.com/)
- [lien du package](https://chocolatey.org/packages/sublimetext3)

Vous pouvez aussi installer [Atom](https://atom.io/) si vous préférez.

### Gestion d'une base de données

HeidiSQL, un logiciel avec une interface qui se rapproche de phpMyAdmin.

```console
$ choco install HeidiSQL
```

- [site officiel](http://www.heidisql.com/)
- [lien du package](http://chocolatey.org/packages/HeidiSQL)

Ou encore MySQL Workbench un excellent soft pour gérer une base de données:
  - Modélisation
  - Édition
  - Migration
Par contre, il est un peu plus complexe à utiliser.

```console
$ choco install mysql.workbench
```

- [site officiel](http://dev.mysql.com/downloads/workbench/)
- [lien du package](http://chocolatey.org/packages/mysql.workbench)


### Un meilleur shell

Cmder va vous permettre quelques fonctionnalités intéressantes que le shell de Windows n'a pas de base, comme taper `<tab>` pour l'autocomplétion, avoir un historique persistant entre 2 sessions, des onglets, le split de console, l'intégration de PuTTY et d'autres choses venu de la banquise. (le lieu de vie des pinguins)

```console
$ choco install Cmder
```

- [site officiel](https://bliker.github.io/cmder/)
- [lien du package](http://chocolatey.org/packages/Cmder)

### Si vous avez besoin de SSH

Pour le SSH sous Windows c'est assez complexe, il faut quelques outils dont le principal, putty (un terminal et +).

```console
$ choco install putty
```

- [site officiel](http://chocolatey.org/packages/putty)
- [lien du package](http://www.chiark.greenend.org.uk/~sgtatham/putty/)


Putty vient avec une suite de logiciels :

- [PuTTYgen](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html) pour générer une clé SSH sous Windows
- [Plink](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html) pour permettre à HeidiSQL de se connecter à une base de données via SSH.
- [Pageant](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html) pour charger votre clé SSH dans Windows pour éviter qu'il demande sans cesse la clé ou le mot de passe.

> Pour que le ssh soit agréable, je vous recommande pageant et ensuite un terminal comme *Clink* ou encore *git bash* qui s'installe via *git*.

### Une machine virtuelle pour tester IE ou même GNU/Linux

On a toujours une intégration à tester sous IE pour ça Microsoft nous donne accès à des machines virtuelles gratuitement sur [ModernIE](https://www.modern.ie/fr-fr). Il nous faut donc Virtualbox pour les lancer.

```console
$ choco install virtualbox
$ choco install VirtualBox.ExtensionPack
```

> l'Extension Pack est utile pour une intégration parfaite avec votre machine si vous installez votre propre VM GNU/Linux ou Windows.

- [site officiel](hhttps://www.virtualbox.org/)
- [lien du package](http://chocolatey.org/packages/virtualbox)


### Compresser / décompresser comme vous le voulez

7zip, le logiciel de référence pour ce genre de pratique.

```console
$ choco install 7zip.install
```

- [site officiel](http://www.7-zip.org/)
- [lien du package](https://chocolatey.org/packages/7zip.install)

### Gérer les pdf

Sumatra pour les lire. PDFCreator pour faire une imprimante virtuelle sortant des PDFs.

#### Sumatra

- [site officiel](http://blog.kowalczyk.info/software/sumatrapdf/free-pdf-reader.html)
- [lien du package](https://chocolatey.org/packages/sumatrapdf.install)

```console
$ choco install sumatrapdf.install
```

#### PDFCreator

- [site officiel](http://www.pdfforge.org/pdfcreator)
- [lien du package](https://chocolatey.org/packages/pdfcreator)

```console
$ choco install pdfcreator
```

### Mettre des onglets dans l'explorateur de fichiers

Nous sommes en 2014 ça fait des années que Microsoft sait mais, ce n'est toujours pas disponible. C'est là que Clover rentre en jeu.

```console
$ choco install Clover
```

- [site officiel](http://ejie.me/)
- [lien du package](http://chocolatey.org/packages/Clover)

### Spaaaaaaaces

Parce qu'avoir plusieurs bureaux / espaces, c'est plus pratique pour gérer ses fenêtres, je vous propose VirtuaWin. Cela vous permettra de garder en plein écran vos logiciels et de zapper d'un logiciel à un autre sans passer par `alt+tab` mais en allant d'un bureau à un autre.

```console
$ choco install virtuawin
```

- [site officiel](http://virtuawin.sourceforge.net/)
- [lien du package](https://chocolatey.org/packages/virtuawin)

### Launchy, le Alfred-like sous Windows

Je sais pas vous mais moi, les raccourcis qui me gâchent mon beau wallpaper choisi avec goût, ça m'énerve. Et puis le clickodrome, c'est lent et chiant. Du coup, lancer ses logiciels à partir d'un moteur de recherche, c'est quand même vachement bien. Ca permet aussi de faire des recherches de fichier, des calculs, et tout un tas d'autres choses. Voici alors Launchy.

```console
$ choco install launchy-beta
```

- [site officiel](http://www.launchy.net/)
- [lien du package](https://chocolatey.org/packages/launchy-beta)

### Pipette et retouche

L'indispensable [PhotoFiltre](http://photofiltre.free.fr/frames.htm) qui, bien qu'il ne soit plus mis à jour depuis 2012, est très stable et efficace. Il fait peu mais, le fait bien.
  - Édition rapide d'images
  - Pipette
  - etc.

Et surtout, il est ultra léger et démarre en moins d'une seconde.

### Et enfin, comment ne pas se niquer les yeux toute la journée

#### f.lux

On va commencer par f.lux. Ce petit logiciel permettant de gérer la colorimétrie de votre écran en fonction de l'heure. Typiquement, les écrans rendent un blanc digne d'un soleil à midi. Sauf que le soir, on allume la lumière et celle-ci n'a pas du coup une couleur blanche mais souvent plutôt rouge. f.lux permet alors d'ajuster votre écran afin que la couleur soit identique à la lumière ambiante pour réduire les différences de couleurs et éviter de vous abimer les yeux. En plus, ça permet au cerveau de se préparer à aller se coucher. :D

```console
$ choco install f.lux
```

- [site officiel](https://justgetflux.com/)
- [lien du package](https://chocolatey.org/packages/f.lux)

#### MacType

Et surtout, MacType. Oh oui MacType. Je pense que seule une personne venant de Mac OS X peut comprendre. Dieu sait que le font rendering sous Windows est vraiment pourri et que Steve Jobs depuis le départ de Mac a fait en sorte sur le rendering des fonts sous son OS soit de qualité.

Pour réduire cette différence entre un Windows et un Mac OS X, je vous propose MacType qui permet de remplacer le font rendering de Windows et d'apprécier lire à nouveau sur cet OS.

```console
$ choco install mactype
```

Je vous conseille le profil `XMac.LCD.Default`.

- [site officiel](https://code.google.com/p/mactype/)
- [lien du package](https://chocolatey.org/packages/mactype)

## Vous voilà paré(e) !

On est bon, on a tous les outils nécessaires pour pouvoir coder correctement sur Windows.

Si vous souhaitez en savoir plus et surtout vous tenir à jour d'éventuels logiciels que je pourrais installer, n'hésitez pas à vous rendre sur mon projet [my-unfortunately](https://github.com/kud/my-unfortunately) qui est le _synchroniser_ dont je vous ai parlé tout à l'heure.

Bon code !
