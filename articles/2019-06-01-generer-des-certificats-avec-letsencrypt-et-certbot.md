---
date: 2019-06-01
title: Génerer des certificats avec Let's Encrypt et Certbot
author: l-vo
slug: generer-des-certificats-avec-letsencrypt-et-certbot
---

J'ai précédemment écrit sur mon blog perso un article sur [la mise en place d'un serveur mail sur Debian](https://keepitsimple.lvo.dev/2019/03/08/Installer-un-serveur-mail-sur-Debian-9-Stretch/). Le cas de la génération des certificats SSL avec [Let's Encrypt](https://letsencrypt.org/) n'avait pas pu y être détaillée ce qui m'avait décidé à programmer l'écriture d'un post sur le sujet. Dont acte.

# Contexte
Lorsqu'il est question de chiffrer des échanges avec un serveur (mail, web ou autre), on a non seulement besoin d'une clé de chiffrage mais aussi d'être sûr que l'entité qui fourni cette clé est bien qui elle prétend être. Les **certificats électroniques** répondent à cette problématique.

## Fonctionnement au sein du protocole HTTPS
Pour illustrer l'utilisation d'un certificat, voyons par exemple son rôle dans le protocole HTTPS. Lorsque vous vous connectez à un site HTTPS, celui-ci vous envoi un certificat:
 
 - votre navigateur va vérifier auprès d'une authorité de confiance que le certificat est valide et qu'il émane bien de l'entité dont il prétend provenir
 - votre navigateur va générer une clé symétrique et la chiffrer avec la clé publique contenue dans le certificat
 - le serveur web sur lequel vous êtes connecté va déchiffrer cette clé symétrique à l'aide de sa clé privée; votre navigateur et le serveur web peuvent désormais utiliser cette clé connue de vous seuls pour chiffrer les données échangées
 
 A noter que le chiffrage asymétrique (clé privée/clé publique) n'est utilisé qu'a l'initialisation de la connexion pour déchiffrer la clé générée par le navigateur de l'utilisateur. C'est ensuite un chiffrage symétrique qui est utilisé avec cette clé car moins coûteux. Le schéma ci-dessous illustre bien ce fonctionnement:  
   
 ![Schéma de fonctionnement du protocole HTTPS](https://www.tutorialspoint.com/security_testing/images/https_Protocol.jpg)  
 (source https://www.tutorialspoint.com/security_testing/https_protocol_basics.htm)
 
 ## Rôle de Let's Encrypt
 Jusqu'il y a peu, le chiffrement SSL était réservé aux sites d'une certaine ampleur puisqu'un certificat représentait un coût annuel de plus ou moins une centaine d'euros. Puis Let's Encrypt est arrivé. Et on peut dire qu'il a radicalement changé la donne puisqu'il permet à n'importe qui de générer des certificats SSL valables 3 mois à conditions de prouver qu'on est bien le propriétaire du domaine ciblé. La durée de validité plus courte des certificats (3 mois contre 1 an pour les certificats "classiques") est compensée par le fait que Let's Encrypt met a disposition un outil qui permet d'automatiser le renouvellement. C'est cet outil (**Certbot**, qui permet aussi la création du certificat) que nous allons étudier dans cet article.
 
 # Manipulation de certificats avec Certbot
 
 ## Installation de Certbot
 
 Installons **Certbot** sur Debian 9 (Stretch):
 ```bash
 root@debian:~# apt-get install certbot
 ```
 Nous partons du principe que vous êtes connecté sur un compte avec les privilèges d'administrateur (c'est une mauvaise pratique qui conviendra dans le cadre de ce tutoriel). Pour votre usage en production, préferez l'usage de la commande `sudo`. Pour installer Certbot sur d'autres distributions, vous pouvez vous référer à la [doc officielle de Certbot](https://certbot.eff.org/).
 
 ## Création d'un certificat
 Listons les certificats présents sur ma machine:
 ```bash
 root@debian:~# certbot certificates
 Saving debug log to /var/log/letsencrypt/letsencrypt.log
 
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 No certs found.
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 ```
 Aucun certificat pour l'instant, c'est tout à fait normal :).

### De façon interactive
 
Supposons que je veuille créer un certificat pour le site *www.mydomain.tld*, la commande la plus simple pour le faire est la suivante:
```bash
root@debian:~# certbot certonly -d www.mydomain.tld
Saving debug log to /var/log/letsencrypt/letsencrypt.log

How would you like to authenticate with the ACME CA?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: Spin up a temporary webserver (standalone)
2: Place files in webroot directory (webroot)
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate number [1-2] then [enter] (press 'c' to cancel):
```
Le principe va être de placer un dossier (nommé *.well-known*) fourni par Certbot sur son serveur, si ce fichier est accessible depuis internet via le nom de domaine *www.mydomain.tld*, c'est gagné, le certificat est généré. Je vais utiliser la méthode 1 *"Spin up a temporary webserver (standalone)"* qui va m'éviter une action manuelle; elle a cependant deux pré-requis:  
- *www.mydomain.tld* doit pointer vers le serveur sur lequel je lance mes commandes Certbot
- Le port 443 ou le port 80 doit être disponible (aucune application ne doit l'utiliser)

Certbot va vous poser quelques questions, votre accord avec les termes de la license, votre adresse email (très utile pour les rappels de renouvellement) et si vous acceptez de la partager (votre adresse email). Ensuite, si les pré-requis cités plus haut sont respectés, vous devriez obtenir les lignes suivantes:
```bash
Obtining a new certificate
Performing the following challenges:
http-01 challenge for www.mydomain.tld
Waiting for verification...
Cleaning up challenges

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/www.mydomain.tld/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/www.mydomain.tld/privkey.pem
   Your cert will expire on 2019-08-31. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot
   again. To non-interactively renew *all* of your certificates, run
   "certbot renew"
 - Your account credentials have been saved in your Certbot
   configuration directory at /etc/letsencrypt. You should make a
   secure backup of this folder now. This configuration directory will
   also contain certificates and private keys obtained by Certbot so
   making regular backups of this folder is ideal.
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le
```
Et voilà, un certificat valable 3 mois vient d'être généré. Pas plus compliqué que ça 🙂. Re-vérifions la liste des certificats:
```bash
root@debian:~# certbot certificates
Saving debug log to /var/log/letsencrypt/letsencrypt.log

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Found the following certs:
  Certificate Name: www.mydomain.tld
    Domains: www.mydomain.tld
    Expiry Date: 2019-08-31 08:03:33+00:00 (VALID: 89 days)
    Certificate Path: /etc/letsencrypt/live/www.mydomain.tld/fullchain.pem
    Private Key Path: /etc/letsencrypt/live/www.mydomain.tld/privkey.pem
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
```
Parfait! Vous pouvez ensuite l'ajouter à votre [configuration Nginx](http://damiengustave.fr/utiliser-un-certificat-lets-encrypt-sur-nginx/#installerlecertificat) ou encore dans un [serveur mail](https://keepitsimple.lvo.dev/2019/03/08/Installer-un-serveur-mail-sur-Debian-9-Stretch/#Utilisation-d%E2%80%99un-client-mail). Je ne rentrerais pas dans les détails de l'utilisation des certificats générés qui dépassent le cadre de ce tutoriel.

### En mode batch
Supposons que vous ayez à générer une dizaine de certificats ou plus, vous n'aurez probablement pas envie de saisir à chaque fois les infos que vous demande Certbot. La commande suivante amène au mème résultat que précédemment:
```bash
root@debian:~# certbot certonly --agree-tos --standalone -m myemail@myprovider.tld -d www.mydomain.tld
```
L'option `--agree-tos` permet d'accepter les termes de la license. Les autres options sont assez parlantes d'elles mêmes.

### Et si les ports 80 et 443 sont déjà occupés ?
Ce sera en effet le cas si vous voulez créer/renouveller un certificat depuis une machine qui héberge déjà un (ou plusieurs) site(s) web. On en vient à une alternative au challenge *.well-knwon* (**http-01**) précédemment utilisé qui est le challenge **dns-01**. C'est à mon sens la façon la plus intéressante de procéder. Certbot va vous fournir une chaine de caractères qu'il va vous falloir enregistrer en temps qu'enregistrement DNS de type TXT de votre domaine. Ce challenge procure un certain nombre d'avantages:
- possibilité de générer/renouveller le certificat sur une machine autre que celle qui va l'utiliser
- possibilité de générer/renouveller le certificat sur une machine ou les ports 80/443 sont occupés
- possibilité d'automatiser le processus via l'API de votre fournisseur de nom de domaine (j'y reviendrais par la suite) 

Le principal inconvénient de cette méthode est le temps de propagation des enregistrements DNS qui peut être assez aléatoire.

Essayons donc ça:
```bash
root@debian:~# certbot certonly --agree-tos --manual --preferred-challenge dns -m myemail@myprovider.tld -d www.mydomain.tld
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator manual, Installer None
Obtaining a new certificate
Performing the following challenges:
dns-01 challenge for www.mydomain.tld
```
Après vous avoir demandé votre accord pour logguer l'adresse IP du serveur demandant le certificat, Certbot va vous fournir une chaine à enregistrer en temps qu'enregistrement DNS de type TXT:
```bash
Please deploy a DNS TXT record under the name
_acme-challenge.www.mydomain.tld with the following value:

0s5k73SZsYv7aN09jNLDQA2HCeLHxK4S-QkI6LHeS-Y

Before continuing, verify the record is deployed.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Press Enter to Continue
```
Créez l'enregistrement TXT dans la zone DNS de votre fournisseur de nom de domaine, patientez un peu le temps que l'enregistrement DNS se propage (plus ou moins une minute devrait suffire) puis appuyez sur "Entrée" pour continuer et génerer votre certificat.

### Et en mode non-interactif c'est possible ?
C'est là que le challenge DNS se montre particulièrement intéressant, l'option `--manual-auth-hook` va vous permettre d'enregistrer un script qui va pouvoir créer votre enregistrement DNS via l'API de votre fournisseur de nom de domaine (pensez à ajouter un *"sleep"* pour laisser à votre enregistrement DNS le temps de se propager). De manière analogue, l'option `--manual-cleanup-hook` vous permet de renseigner un autre script pour supprimer votre enregistrement DNS de type TXT après l'opération.  
  
Vous pouvez par exemple utiliser ou vous inspirer de [cette lib](https://github.com/antoiner77/letsencrypt.sh-ovh) qui permet de générer (et de renouveller) automatiquement des certificats pour des noms de domaines fournis par OVH.

## Renouvellement de certificat
Pour renouveller un certificat, vous n'avez pas besoin de repréciser la plupart des paramètres que vous avez spécifié pour sa création. Par défaut le renouvellement se fait en mode interactif avec proposition entre les méthodes *standalone* et *webroot* (comme vu en début d'article pour la création). Pour utiliser un autre mode, vous devez spécifier le challenge à utiliser (voir les scripts *manual-auth-hook* et *manual-cleanup-hook* pour le mode "batch"). Pour renouveller notre précédent certificat:
```bash
root@debian:~# certbot --manual --preferred-challenge dns
```
Cette commande permet de renouveller tous les certificats sur le point d'expirer présents sur la machine. Si vous avez besoin de cibler spécifiquement un certificat:
```bash
root@debian:~# certbot certonly --manual --preferred-challenge dns -d www.mydomain.tld
```
A noter qu'avec cette commande, si le certificat n'est pas proche d'expirer, Certbot vous proposera de le renouveller ou de garder l'existant.

## Révocation d'un certificat
Pour révoquer un certificat:
```bash
root@debian:~# certbot revoke --cert-name www.mydomain.tld
```
Les dernières versions de Certbot vous proposent également de supprimer les fichiers liés au certificat revoqué. Si vous utilisez une ancienne version de Certbot (ou si vous voulez supprimer les fichiers à postériori), il vous faudra avoir recours à la commande suivante:
```bash
root@debian:~# certbot delete
Saving debug log to /var/log/letsencrypt/letsencrypt.log

Which certificate(s) would you like to delete?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: www.mydomain.tld
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate numbers separated by commas and/or spaces, or leave input
blank to select all options shown (Enter 'c' to cancel):
```
Vous pouvez ainsi choisir interactivement le certificat correspondant aux fichiers que vous voulez supprimer.

# Bon à savoir

## Certificats multi-domaines
Il est aussi possible de générer des certificats multi-domaines (utiles dans le cas par exemple d'un serveur mail qui gère plusieurs domaines), pour celà il suffit simplement de répéter l'option `-d` autant de fois que besoin; par exemple pour un certificat multi-domaine à créer interactivement via le DNS challenge:
```bash
root@debian:~# certbot certonly --agree-tos --manual --preferred-challenge dns -m myemail@myprovider.tld -d www.mydomain1.tld -d www.mydomain2.tld -d www.mydomain3.tld
```

## Longeur de la clé de chiffrement
Certbot utilise par défaut une clé de chiffrement de 2048 octets. C'est aujourd'hui insuffisant. Pour utiliser une clé de 4096 octets (ce que je vous conseille de faire), ajoutez l'option `--rsa-key-size 4096` lorsque vous créez vos certificats.

## Alias
Comme vous pouvez le constater, la commande Certbot nécessite pas mal d'options. N'hésitez pas à vous définir un alias à Certbot avec toutes les options nécessaires pour être sûr de n'en oublier aucune 🙂.


# Conclusion
Comme vous pouvez le constater, utiliser Let's Encrypt pour générer des certificats n'a rien de compliqué et offre de nombreuses possibilités. Donc plus d'excuse pour ne pas avoir ses sites web en https!! De plus l'arrivée de Let's Encrypt ayant permis aux certificats d'être accessibles à tous, les sites non-https devraient être de plus en plus pénalisés à l'avenir (ça a déjà commencé avec [la pastille "non sécurisé" sur Google Chrome](https://www.codeur.com/blog/google-https-site-web/)).