---
date: "2015-07-31"
title: "Créer un site web gratuitement avec GitHub Pages"
tags:
  - github
  - html
authors:
  - revolunet
header:
  credit: https://www.flickr.com/photos/expressmonorail/
  linearGradient: 160deg, rgb(26, 37, 85), rgba(51, 98, 204, 0.6)
---

Pour une fois, on ne va pas trop parler de code dans cet article, mais
simplement de comment créer en quelques minutes un site web basique et
l'héberger gratuitement sur la plateforme [github.com](http://github.com).

Transférez cet article à toute personne qui souhaiterait avoir un site web mais
qui pense encore que c'est trop compliqué :)

Dans un premier temps, vous devez simplement avoir quelques connaissances de
base :

 - **HTML** : une bonne [introduction](https://developer.mozilla.org/fr/docs/Web/Guide/HTML/Introduction)
 - **GitHub** : créez un compte gratuit ici : [github.com](http://github.com)

Nous allons utiliser [github.com](http://github.com) pour héberger notre
**site web statique** dans un *repository* (un dossier). Ce service
incontournable permet de stocker le code du site, de le
[versionner](https://fr.wikipedia.org/wiki/Logiciel_de_gestion_de_versions), et
de le publier gratuitement sur Internet dans des conditions optimales
(CDN, anti-DDoS...)

**Attention** : tous les fichiers hébergés sur votre compte GitHub gratuit sont
publics, à moins de souscrire à un compte privé payant, donc n'y stockez rien
de sensible/secret.

## Qu'est-ce qu'un site web statique ?

Pour la plupart des sites, les solutions de blog (CMS de type WordPress et
autres) sont largement surdimensionnées. Elles requièrent un hébergement
particulier (PHP ou autre), des connaissances techniques pour l'installation,
et surtout une maintenance à moyen/long-terme à cause des mises à jour
de sécurité surprises et autres correctifs de bugs à appliquer.

Or, il est possible de créer des sites webs modernes et performants qui n'ont
pas besoin de code côté serveur (donc pas de PHP), et peuvent donc être hébergés
n'importe où, et à moindre coût. Le code du site sera uniquement composé de
HTML, CSS et JavaScript, et s'exécutera directement dans le navigateur du
visiteur, ce qui présente de nombreux avantages :

 - simple et efficace
 - pas de maintenance
 - pas de risque de hacking
 - performances optimales
 - liberté totale

De plus, en 2015, n'importe quel service en ligne digne de ce nom propose une
[API](https://www.mashape.com) qui permet d'intégrer directement sur votre site
des fonctionnalités tierces, sans avoir besoin de code côté serveur, donc cette
approche pure **client-side** n'a **pas de limites**.

Dans ce premier article nous allons voir comment créer un site web basique à
base de HTML/CSS, mais nous verrons par la suite comment utiliser un
[générateur de site web statique](http://staticgen.com) pour créer des sites
webs plus avancés.

## Créer le repository GitHub

Créez votre compte GitHub, puis un nouveau *repository* pour votre site web :
[https://github.com/new](https://github.com/new) (exemple : supersite)

Le repository sera créé à cette adresse :
[https://github.com/USERNAME/supersite](https://github.com/USERNAME/supersite)

## Créer un site web avec *GitHub page generator*

Grâce aux templates par défaut, créez votre site *single-page* en 3 clics.

Allez sur la page du projet :  [https://github.com/USERNAME/supersite](https://github.com/USERNAME/supersite)

 - Puis **Repository settings** (icône en bas à droite)
 - **Automatic page generator** puis **Launch**
 - Éditez le texte du site
 - Sélectionnez votre template préféré puis **Publish Page**

Attendez quelques secondes et allez sur : [http://USERNAME.github.io/supersite](http://USERNAME.github.io/supersite) pour découvrir le résultat final.

**✔** Site web en ligne et dispo pour le monde entier :)

## Modifier le site en ligne

Allez sur la page du projet, [https://github.com/USERNAME/supersite](https://github.com/USERNAME/supersite).

C'est ici que l'on retrouve tout le code et les fichiers du site.

Cliquez sur le fichier à modifier, typiquement `index.html` qui est la page
d'accueil, cliquez sur l'icône "crayon" en haut à droite pour éditer le fichier
et appliquez vos changements.

Une fois les changements effectués, complétez le formulaire "Commit changes"
en-dessous, avec un titre explicite permettant d'identifier votre modification.

Exemple : "Ajout des infos de contact".

Cliquez sur **Commit changes**, attendez quelques secondes et allez sur
[http://USERNAME.github.io/supersite](http://USERNAME.github.io/supersite)
pour admirer les changements.

**✔** Site web mis à jour :)

## Éditer le site sur son ordinateur

Pour pouvoir éditer plus facilement le site, ajouter/modifier des fichiers...
vous pouvez le récupérer sur votre machine, et vous pourrez alors utiliser
votre [éditeur de texte préféré](http://atom.io) pour le modifier.

Installez et configurez l'application GitHub : [mac.github.com](http://mac.github.com)
ou [windows.github.com](http://windows.github.com)

 - **Clone** : va rapatrier les fichiers de votre site sur votre ordinateur
 - **Éditez** les fichiers directement
 - **Testez** si le site fonctionne comme prévu
 - Puis choisissez **Commit** pour enregistrer vos modifications
 - Et enfin **Sync** pour renvoyer vos fichiers sur GitHub et mettre à jour
le site pour le reste du monde.

**✔** Site web mis à jour :)

## Tester le site sur votre machine

Vous pouvez ouvrir le fichier `index.html` dans un navigateur pour voir le
résultat.

**Note :** Si vous avez ajouté Google Maps ou une API JavaScript, vous devrez
lancer un serveur web pour pouvoir voir le résultat. Par exemple, lancez
`python -m SimpleHTTPServer` dans votre terminal depuis le dossier du site
(où se trouve `index.html`) puis ouvrez http://127.0.0.1:8000 dans votre navigateur.
(Ceci est dû à une [restriction de sécurité](https://developer.mozilla.org/fr/docs/Web/JavaScript/Same_origin_policy_for_JavaScript))


## Installer un superbe template

Si vous voulez des templates différents de ceux proposés par GitHub,
vous devez simplement remplacer les fichiers présents dans le dossier
du projet.

Choisissez par exemple un des templates gratuits de haute qualité
disponibles sur [html5up.net](http://html5up.net) ou sur
[pixelarity.com](http://pixelarity.com) (payant).

Téléchargez les sources et placez les fichiers dans votre projet.

Éditez les fichiers, testez, puis commit & sync, et voilà :)

## Et après ?

- Apprenez la syntaxe Markdown : [réference](https://en.support.wordpress.com/markdown-quick-reference/)
- Apprenez Git : [try.github.io](https://try.github.io)
- Apprenez JavaScript : [jsbooks.revolunet.com](http://jsbooks.revolunet.com)
et [le livre d'Eric Elliott](https://ericelliottjs.com/product/programming-javascript-applications-paper-ebook-bundle/)
- Lisez tous les articles de [Putain de code !](http://putaindecode.fr/)

---

## FAQ

### Comment installer un nom de domaine ?

 - Achetez un nom de domaine sur [gandi.net](http://gandi.net) ou
un autre fournisseur sérieux (surtout pas chez pas 1&1, lws ou
autre discounter douteux)
 - Éditez la "Zone DNS" du domaine et suivez les
 [instructions GitHub pour DNS](https://help.github.com/articles/tips-for-configuring-a-cname-record-with-your-dns-provider/)
 - ajoutez un fichier `CNAME` dans votre projet, contenant la ligne
`www.myproject.com`.

Les changements DNS peuvent mettre jusqu'à 24h pour se propager
donc essayez www.myproject.com un peu plus tard.

Ces pages d'aide sur GitHub pourront vous être utiles : [Custom domain](https://help.github.com/articles/setting-up-a-custom-domain-with-github-pages/), [DNS setup](https://help.github.com/articles/tips-for-configuring-a-cname-record-with-your-dns-provider/).

### Comment ajouter une page ?

Pour créer simplement des pages supplémentaires, ajoutez un
nouveau fichier HTML, par exemple `produits.html`, dans le projet et
faites un lien vers cette page depuis l'index, par exemple
`<a href="produits.html">Consulter les produits</a>`.

### Comment analyser le trafic de mon site ?

Si vous voulez tracker vos visiteurs, savoir d'où ils viennent, ce qu'ils
font et où ils vont, créez un compte sur
[Google Analytics](http://www.google.com/analytics) et ajoutez le code de
tracking sur vos pages HTML.

### Comment ajouter une carte ?

Suivez les [instructions Leaflet](http://leafletjs.com/examples/quick-start.html), la cartographie open-source et gratuite qui bénéficie d'une communauté active.

Si vous avez juste besoin d'une carte sous forme d'image fixe, générez le code HTML ici :
[staticmapmaker.com](http://staticmapmaker.com) et copiez le code dans votre page.


### Comment ajouter un système de commentaires ?

Créez un compte sur [disqus.com](http://disqus.com) et ajoutez le code JavaScript sur
votre page.

### Comment ajouter un formulaire de contact ?

Créez un compte sur [typeform.com](http://typeform.com), créez votre formulaire et
ajoutez le code JavaScript "embed" sur votre page.

Vous pouvez aussi créer un compte sur [mailchimp.com](http://mailchimp.com), créer un
formulaire et l'ajouter sur votre page grâce au code "embed".

### Comment recevoir des paiements ?

Créez un compte sur [stripe.com](http://stripe.com) et ajoutez le code JavaScript sur
votre page.

### Qu'est-ce que gh-pages ?

`gh-pages` est une branche spéciale de votre code sur GitHub (une version du
    code) qui publie et héberge *automagiquement* votre site.

### Comment être prêsent sur Google ?

Créez du contenu de **qualité**, ciblé, **unique** sur Internet et **utile** à
vos visiteurs. Créez du lien avec des sites et communautés sur le même thème.

Naturellement, d'autres sites parleront alors du vôtre, vous enverront des
visiteurs et vous feront monter progressivement dans les résultats au fil des mois.

---

Voilà pour ce premier pas vers le développement web !

Les commentaires ci-dessous sont là pour recevoir vos remarques et questions :)
