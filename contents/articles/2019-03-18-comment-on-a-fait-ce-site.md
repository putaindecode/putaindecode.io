---
date: 2019-03-18
title: "Comment on a fait ce site"
author: bloodyowl
slug: comment-on-a-fait-ce-site
---

Puisqu'on vient de sortir une refonte du site, c'est l'occasion de faire un tour sur le processus qui nous y a amené.

## tl;dr;

![On prend des markdown et des fichiers Reason et on génère des HTML, des JS, des JSON mais pas de CSS](/public/images/articles/2019-03-18-comment-on-a-fait-ce-site/serious-graph.svg)

## Un nouveau site

Avant ça, le site n'avait pas énormément évolué depuis quelques années. On a commencé à parler d'un redesign complet du site il y a un an et demi, on a maquetté la chose (c'est le design que vous voyez maintenant), mais on n'a rien foutu par manque de temps et par flemme de s'attaquer à un pareil chantier.

On s'est quand même finalement décidé à retaper le site en un weekend, parce qu'on emmerde les proverbes sur les cordonniers.

Alors comment on a fait ?

## Revoir les besoins

Comme tout projet, on accumule au gré des années. On avait à l'époque un script JS qui **parsait l'historique Git** et tapait l'API GitHub pour fournir des données qui se sont avérées être **trop granulaires** pour nos besoins (et qui foirait une fois sur deux dès qu'une nouvelle personne voulait contribuer au projet).

On ajoutait des petites features trop tôt, dès qu'une demande apparaissait dans les issues. Et ces features nous bloquaient pour en produire de nouvelles qui avaient plus d'intérêt pour la vie de l'organisation et du blog (notamment au vu des podcasts arrivés depuis 2016).

En prenant un peu de recul, on a réalisé que nos besoin se résumaient à trois points importants :

- une **home**
- une zone **articles**
- une zone **podcasts**

## Tout refaire sans déglinguer l'historique git

Quand on s'est lancé dans l'ouvrage de refaire le site, il y avait un impératif : **préserver les contributions** de nos auteurs.

D'un autre côté, partir d'un repository existant peut énormément limiter la création (alors que partir d'un projet tout frais tout neuf ça motive). On a du coup choisi une approche alternative: copier le projet, l'altérer à foison, et coller le résultat dans une énorme PR.

Partir d'un `package.json` vierge était essentiel. On avait **beaucoup** trop de trucs.

## Les technos

On a choisir de partir sur [ReasonML](/articles/introduction-a-reasonml), parce que c'est une technologie dans laquelle on croit, que dans l'équipe on est tous familiers avec [React](/articles/reason-react-pour-une-ui-qu-elle-est-bien-typee) et parce qu'avec son _type system_, elle nous apporte des avantages non négligeables sur un projet pouvant être édité par un grand nombre de personnes: c'est une sorte de garde-fou.

Pour le styling, si vous me suivez depuis longtemps, vous savez que [j'adore CSS](/articles/pourquoi-j-ai-arrete-d-utiliser-css), je suis donc parti sur [`bs-css`](https://github.com/SentiaAnalytics/bs-css/), un DSL statiquement typé qui utilise [emotion](https://emotion.sh), ce qui nous permet d'envoyer au client **uniquement les styles requis**.

## L'approche technique: une static SPA

La question qu'on s'est posée : quel est **le moyen le plus efficace de livrer une page de blog** aux lecteurs ?

Et la réponse qui s'est imposée à nous était dans la veine de ce qu'on avait déjà fait par le passé : une **SPA statique**.

Qu'est-ce qu'une SPA statique ? C'est un site statique **conçu comme une single page application**. On conçoit le site comme une application React côté client, et on va pré-rendre les pages non pas côté serveur, mais dans notre système d'intégration continue.

Pourquoi de **l'hébergement statique** ? Parce que c'est moins cher (voire gratuit), qu'on est principalement front et que la dernière fois que je me suis connecté à la console AWS j'y suis resté coincé pendant 5 jours.

Ce que ça apporte : un **chargement initial extrêmement rapide**, une **navigation optimale** et des **besoins en serveur réduits au minimum**.

Quand un lecteur arrive sur le site, il récupère une version de la page **déjà rendue** au moment du build, le client ne fait que "hydrater" la page. Lors que le lecteur navigue vers une autre page, le client va **uniquement chercher la donnée dont il a besoin** pour la page de destination.

En développement local, chaque page démarre avec un **data-store vide**, et les composants vont **demander le chargement des données**. En production, chaque page est livrée **rendue**, avec le data-store **contenant les informations dont elle a besoin**, toute navigation ultérieure sera comme en mode local: les composants vont demander le chargement de ce qui leur manque.

Ce mode de fonctionnement requiert une certaine discipline concernant les endroits où la donnée peut être stockée. Dans notre cas, on a choisi de la placer dans l'état du composant qui orchestre l'application, et de le faire sous la forme suivante:

```reason
type state = {
  articles: Map.String.t(RequestStatus.t(Result.t(Post.t, Errors.t))),
  articleList: RequestStatus.t(Result.t(array(PostShallow.t), Errors.t)),
  podcasts: Map.String.t(RequestStatus.t(Result.t(Podcast.t, Errors.t))),
  podcastList: RequestStatus.t(Result.t(array(PodcastShallow.t), Errors.t)),
  home: RequestStatus.t(Result.t(Home.t, Errors.t)),
};
```

Cet état peut stocker **l'intégralité des données du blog**, comme il peut stocker le **minimum possible**. Si vous voulez en savoir plus, n'hésitez pas à naviguer dans les sources du site.

Une approche alternative est de stocker la donnée requise par chaque URL, mais cette approche s'avère moins efficace au niveau du cache: si on a déjà toutes les données depuis une autre URL, on va quand même devoir les charger à nouveau.

## Coder le blog

Le blog était organisé d'une manière … chaotique. L'emplacement des fichiers markdown dans le repository définissait leur URL sur le site (on devait se dire que c'était une bonne idée à l'époque). Pour plus de perennité, on a choisi de passer à un système où le nom ou l'emplacement du fichier n'avaient pas d'impact sur l'endroit où se retrouve sur le site. Ça nous permet de les organiser par date, par sujet ou par contrib dans le futur sans pour autant influer sur les URLs.

Avec [jojmaht](https://twitter.com/jojmaht), on a pris la tâche ingrate de bouger et transformer la centaine d'articles existants, avec leurs médias, vers une **organisation à plat**, plus simple à gérer.

Une fois cette tâche gérée, on n'avait plus qu'à récupérer les posts et à les générer aux URLs qui vont bien.

## Gérer la retro-compatibilité

On a profité de ce chantier pour réécrire les URLs des articles vers des formats plus lisibles (e.g. `/articles/js/react` -> `/articles/introduction-a-react`).

Pour preserver les anciennes URLs, on a indiqué l'ancienne URL des articles dans chaque fichier markdown, et on a généré à ces endroits là une page HTML:

```html
<!DOCTYPE html>
<meta http-equiv="refresh" content="0;URL=NOUVELLE_URL" />
```

On se sert également de cette ancienne URL comme identifiant de page pour notre système de commentaires qui tourne avec disqus parce que j'ai pas trouvé la page pour migrer les URLs sur leur admin.

Si vous voulez en savoir un peu plus, n'hésitez pas à parcourir [la source du projet](https://github.com/putaindecode/putaindecode.io). Et n'hésitez pas à [contribuer au blog](https://github.com/putaindecode/putaindecode.io/blob/master/CONTRIBUTING.md) si l'envie vous vient.

Bisous.
