---
date: "2015-06-11"
title: Les développeurs Heisenberg
tags:
  - développeur
  - software craftsmanship
authors:
  - enguerran
header:
  credit: https://flic.kr/p/sfX8km
---

_Introduction_

_Ce texte est une traduction de l’article de __Mike Hadlow__ intitulée 
[Heisenberg Developers](http://mikehadlow.blogspot.fr/2014/06/heisenberg-developers.html) 
pour laquelle [il m'a donné le feu vert](https://twitter.com/mikehadlow/status/582805129058992128). 
La traduction originale est sur [disponible sur mon blog](http://blog.ticabri.com/blog/2015/04/21/les-developpeurs-heisenberg/)._


__TL;DR__ Vous ne pouvez pas observer un développeur sans en altérer son 
comportement.

![Settings Webhooks GitHub](heisenberg.png)

##Tout d'abord, une histoire

Il y a quelques années j'ai travaillé sur un assez large projet en tant que 
développeur au sein d'une équipe. Nous devions construire un système interne 
pour assister un process métier déjà en place. Au début tout se passait très 
bien. Les besoins des utilisateurs étaient plutôt bien définis et nous itérions 
efficacement depuis le backlog – la boite à idées des prochaines 
fonctionnalités. Nous étions la plupart du temps livrés à nous-mêmes. Nous 
avions un business owner – le “chef de projet” – non technique et un nombre 
d'utilisateurs potentiels pour nous donner les objectifs généraux, et pouvant 
tester les fonctionnalités lorsqu'elles étaient implémentées. Lorsque nous 
considérions que tel bout de code avait besoin d'un refactoring, nous prenions 
le temps de le faire. Lorsqu'un noeud apparaissait nous changions le design pour 
le faire disparaître. Nous n'avions pas besoin de demander la permission pour 
faire quoi que ce soit, tant que les fonctionnalités étaient livrées à 
intervalle raisonnable, tout le monde était content.

Puis vint cette exigence. Celle qui tente de remplacer des années d'expérience 
et d'intuition d'un expert par un logiciel. Ce qui avait commencé comme une 
exigence vague et fumeuse devint bientôt un monstre alors que nous nous y 
engouffrions de plus en plus. Nous avons essayé de la repousser, ou au moins de 
repousser sa livraison à une version ultérieure du logiciel sans en annoncer de 
date précise. Mais non, les responsables du projet étaient pressants, ils la 
voulaient dans la prochaine version. Un collègue vraiment futé pensa que le 
problème pourrait être résolu avec un DSL (Domain-Specific Language, i.e. le 
langage spécifique du métier) qui permettrait aux utilisateurs d'encoder 
eux-mêmes leurs règles métier, c'est ainsi qu'accompagné d'un autre collègue, 
ils commencèrent à travailler à son élaboration. Plusieurs mois plus tard, ils 
travaillaient toujours dessus. Le métier était frustré par l'absence 
d'avancement et les dates de livraison bien définies au départ ont commencé à 
glisser. C'était un sacré merdier.

Le patron y jeta un oeil, considéra que nous étions des électrons libres et 
décida qu'il fallait redresser le navire. Il embaucha un project manager (PM) à  
l’excellent CV et avec la réputation de pouvoir garder sous contrôle les projets 
capricieux. Il nous a présenté 'Jira', un mot qui génère la peur dans l'âme des 
développeurs. Désormais, plutôt que de prendre une exigence à forte valeur et de 
l'implémenter sans date précise de livraison, nous devions découper la 
fonctionnalité en petites tâches simples, estimer chacune d’elles, puis 
redécouper celles à trop gros tramage si leur exécution risquait de dépasser la 
journée. Toutes les deux semaines nous avions une journée consacrée aux réunions 
permettant de définir ces tâches. Puis durant les 8 jours suivants, nous 
travaillions sur ces tâches en n'omettant pas de tenir Jira à jour après chaque 
tâche en y inscrivant le temps nécessaire à leur exécution. Notre project 
manager n'était pas content lorsque l'exécution effective de la tâche était plus 
longue que son estimation et il s'empressait d'y associer un des membres de 
l'équipe pour travailler avec le développeur original afin d'accélérer son 
traitement. Nous avons très vite appris à ajouter beaucoup de précautions à nos 
estimations. Nous étions concentrés sur la livraison. Toute demande pour revoir 
le design du code et sa maintenance était désapprouvée et notre journée était 
trop encadrée pour nous permettre de refactorer 'en douce'.

Puis cette chose étrange commença à arriver. Tout se mit à ralentir.


Bien sûr nous ne pouvions rien prouver car il n'y avait aucune donnée de 
l’époque ‘pre-PM’ à comparer avec la ‘post-PM’, mais il y avait une diminution 
sensible de la vitesse de livraison des fonctionnalités. Avec ces calculs 
montrant que la date de livraison du projet glissait, notre PM n’innova pas et 
engagea de nouveaux développeurs, je crois que la plupart étaient d’anciens 
collègues avec lesquels il avait travaillé. Nous, l’équipe en place, avions très 
peu de choses à dire sur les embauches, et il nous a semblé qu'il y avait un 
fossé culturel entre nous et les nouveaux. Chaque fois qu’il y avait un débat 
sur le refactoring du code, ou sur la réflexion autour d'une fonctionnalité 
problématique, les nouveaux argumentaient contre, en parlaient comme d’une tour 
d’ivoire et ne délivraient pas les fonctionnalités. Le PM posait son veto et 
prenait le parti des nouveaux.

Nous étions devenus en quelque sorte démotivés. Après avoir tenté plusieurs fois 
d’expliquer comment les choses devaient être faites et être bottées en touche, 
vous commencez par n’avoir plus que deux choix : abandonner, ne pas argumenter 
et attendre la paie, ou partir. Notre meilleur développeur, le mec du DSL, est 
parti, et ceux d’entre nous qui prônaient pour un bon design perdirent un de 
leur champion en chef. J’ai appris à gonfler mes estimations, faire ce qu’on me 
disait de faire, et j’ai gardé mon imagination et ma créativité pour mes projets 
personnels, ceux du soir et du week-end. Ça me paraissait bizarre quand mes 
nouveaux collègues me disaient aimer réellement le développement, d’ailleurs les 
discussions dans nos locaux tournaient plus souvent autour des voitures que des 
langages de programmation. En fait ils semblaient préférer les gestions de 
projets finement grainées. Comme l’un d’eux me l’a expliqué, “tu prends la 
prochaine tâche de la liste, tu fais le taf, tu le valides, et tu n’as plus à 
t’en soucier.” Ça les soulageait des décisions stratégiques ou des visions 
stratégiques à prendre.

Le projet n’était pas heureux. Les fonctionnalités prenaient de plus en plus de 
temps à être livrées. Il semblait y avoir de plus en plus de bugs, très peu 
semblaient être fixés, même avec un nombre croissant de développeurs. 
L’entreprise dépensait de plus en plus d’argent pour des bénéfices en chute 
libre.

##Pourquoi est-ce autant parti de travers ?

La gestion de projets finement grainée est séduisante pour une entreprise. Toute 
organisation a besoin de contrôle. Nous voulons savoir ce que peut nous apporter 
le travail de développeurs si cher payés. Nous voulons être capables d’estimer 
précisément le temps nécessaire à délivrer un système dans le but de faire une 
analyse précise du retour sur investissement et de donner à l’entreprise une 
bonne estimation des dates de livraison. Il y a aussi l’espoir que par la 
construction d’une base de données complète contenant les estimations par 
rapport à l’effort réel, nous pourrions affiner nos estimations, et par 
l’analyse de celle-ci trouver des gains d’efficacité dans le développement 
logiciel.

Le problème avec cette approche c’est qu’elle méconnaît fondamentalement la 
nature du développement logiciel. Il est un processus créatif et expérimental. 
Le développement logiciel est un système complexe articulé par de multiples 
rétroactions et interactions faiblement compréhensibles. C’est un processus 
organique d’essais et d’erreurs, de faux départs, d’expérimentations et de 
viandages monumentaux. De nombreuses études ont montré qu’un bon travail créatif 
est mieux réalisé par des experts autonomes et motivés. En tant que 
développeurs, nous devons être libres de pouvoir tester des trucs, voir comment 
ils évoluent, revenir sur de mauvaises décisions, mais aussi tenter plusieurs 
solutions avant de pouvoir choisir la meilleure. Nous n’avons pas de chiffres 
précis permettant de justifier telle ou telle décision, ou pourquoi nous devons 
arrêter cette tâche en plein milieu et jeter tout ce qui a été fait. Nous ne 
pouvons pas réellement expliquer toutes nos décisions, certaines sont des 
intuitions, d’autres ne sont pas bonnes.

Si vous me demandez combien de temps il faudrait pour développer cette 
fonctionnalité, ma réponse la plus honnête est que je n’en sais rien du tout. Je 
pourrais en avoir une idée précise, mais il y a une telle quantité de petites 
probabilités, que je pourrais me tromper d’un facteur 10. Qu’en est-il de la 
fonctionnalité en elle-même ? Est-ce réellement une bonne idée ? Je ne suis pas 
seulement celui qui va l'implémenter, j'en suis aussi le garant. Et s’il y avait 
une meilleure façon de répondre à ce besoin métier ? Que faire si nous 
découvrons une meilleure façon de faire en deux fois moins de temps ? Et que 
faire si je tombe tout à coup sur une technologie ou une technique qui permette 
de faire une vraie différence sur le marché pour l’entreprise ? Et que faire si 
ce n’était pas prévu ?

Dès que vous demandez à un développeur son programme précis pour les 8 prochains 
jours (ou pire les prochaines semaines ou mois), vous tuez toute créativité et 
sérendipité. Vous devriez penser qu’il est libre de modifier les estimations ou 
les tâches à tout moment, il pensera qu’il est redevable d’au moins expliquer 
ces changements. Plus la tâche est granuleuse, plus vous tuez l’autonomie et la 
créativité. Peu importe le nombre de fois que vous dites que ça n’a pas 
d’importance s’il n’atteint pas ses estimations, il se sentira mal. Sa réponse à 
votre besoin d’estimations prendra deux formes : premièrement il apprendra à 
surestimer largement, juste au cas où il croise le genre de petits pièges qui 
parsèment son chemin ; deuxièmement il cherchera le petit hack qui suffira à 
régler la tâche. Putain de dette technique, ce sera à la prochaine pauvre âme de 
s’en occuper, je dois atteindre mes estimations. Les bons développeurs ont 
l’habitude de trouver la justification difficile mais nécessaire de faire du 
boulot en douce, ils seront effectivement obligés de mentir aux responsables sur 
ce qu’ils font vraiment, mais le management très fin rend difficile la 
possibilité de prendre le temps pour faire ce qui doit être fait.


Pour être clair, je ne parle pas pour tout le monde ici. Tous les développeurs 
ne détestent pas le micro-management. Certains sont plus intéressés par la paie 
que par l’artisanat logiciel. Pour eux, le micro-management peut être très 
attractif. Dès que vous avez compris comment ça marche, vous surestimez et 
faites le minimum nécessaire, puis vous publiez la fonctionnalité. Si les 
utilisateurs sont mécontents, que le système est buggé et qu’il ralentit, vous 
n’aurez rien à vous reprocher, vous avez fait ce qu’on vous a demandé.


Le management fin est une potion magique ‘d’évaporation du talent’. Les 
personnes qui vivent et respirent le développement vont partir – ils n’ont 
généralement pas trop de mal à trouver un autre boulot, autre part. Les 
personnes qui n’aiment pas prendre des décisions et qui ont besoin d’excuses 
resteront. Vous vous retrouverez entouré d’une équipe conciliante qui suivra 
gentiment vos instructions, n’argumentera pas sur l’utilité des fonctionnalités, 
remplira correctement Jira, atteindra ses estimations, et produira un logiciel 
de très faible qualité.

##Alors comment gérer les développeurs ?

Simple : filez leur de l’autonomie. Ça semble être la panacée, mais le 
management granuleux est un poison pour le développement logiciel. C’est 
largement mieux de donner des objectifs globaux et de permettre à vos 
développeurs de les atteindre comme ils le souhaitent. Parfois ils échoueront ; 
vous devez faire avec ça. Et ne réagissez pas aux échecs en ajoutant des 
processus et du contrôle. Travaillez à monter une belle équipe en qui vous 
pouvez avoir confiance et qui peut contribuer à la réussite plutôt que d’occuper 
des salles comme des pisseurs de code passifs.
