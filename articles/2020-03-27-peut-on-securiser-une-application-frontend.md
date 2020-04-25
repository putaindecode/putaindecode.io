---
date: 2020-04-02
title: Est-il possible de sécuriser une application front-end ?
author: Aschen
slug: peut-on-securiser-app-frontend
---

_[English version available on Kuzzle blog](https://blog.kuzzle.io/why-you-cant-secure-a-frontend-application)_

Je suis toujours très surpris d'entendre parler de la sécurité des applications frontend parce que précisément une application frontend s'exécute sur le périphérique de l'utilisateur et ne peut donc pas être sécurisée. Elle doit même être considérée comme un **client potentiellement malveillant**.

En effet, le code source de l'application étant à la disposition de l'utilisateur, **il est possible de l'étudier et de le modifier à volonté** afin d'en comprendre les mécanismes internes ou de récupérer toutes les données stockées sur le périphérique. 

Je suis tombé sur de nombreux articles de diverses sources ([Callstack](https://callstack.com/blog/secure-your-react-native-app/), [Jscrambler](https://blog.jscrambler.com/protecting-your-react-js-source-code-with-jscrambler/), [Tabris](https://tabris.com/securing-your-mobile-application-in-javascript/), [Nativescript](https://www.nativescript.org/blog/secure-your-mobile-app-securing-data-at-rest), [Reactnativecode](https://reactnativecode.com/password-encryption-decryption-using-base64/)) qui détaillaient les "techniques" pour sécuriser une application frontend en utilisant l'obfuscation, du chiffrement custom (XOR avec réutilisation de clé, etc...), et ainsi de suite.

Ce n'est pas la première fois que j'entends parler de recettes sur "l'écriture d'une application frontend sécurisée": **Il peut être dangereux et contre-productif d'essayer de sécuriser une application avec des techniques inefficaces**. Voici pourquoi.

**TLDR;**
  - Ne jamais faire confiance aux applications frontend
  - [N'utilisez pas votre propre cryptographie](https://security.stackexchange.com/a/18198)
  - N'utilisez pas de clé de chiffrement prédictibles
  - [Ne réutilisez pas une clé de chiffrement](https://www.wikiwand.com/en/Stream_cipher_attacks#/Reused_key_attack)
  - [Obfusquer n'est pas sécuriser](https://security.stackexchange.com/questions/24449/how-valuable-is-secrecy-of-an-algorithm/24455#24455)
  - Sécurisez plutôt votre backend

## Authentification

L’envoi des informations d’authentification se fait de manière sécurisée au travers d’une connexion SSL, la confidentialité des communications est donc assurée dans la plupart des cas.

Ajouter une couche de chiffrement basique pour le mot de passe avec un simple XOR et une clé réutilisée pour chaque authentification de chaque client est inutile pour plusieurs raisons:
  - la **réutilisation de la clé** pour chaque client et chaque requête **rend le chiffrement vulnérable** car il est possible de [deviner le message](https://stackoverflow.com/questions/1135186/whats-wrong-with-xor-encryption/1135197#1135197) avec une [analyse de fréquence](https://www.wikiwand.com/en/Frequency_analysis).
  - étant donné que **la clé est stockée dans le device**, il suffit de télécharger l’application pour la connaître
  - si **la clé était stockée dans le localstorage du navigateur**, n'importe quel code Javascript executé sur la page pourrait y accéder

Rajouter une couche de chiffrement peut s’avérer être une bonne idée pour éviter la compromission des données dans le cas d’une [attaque Man In The Middle avec un faux certificat SSL](https://www.eff.org/deeplinks/2010/03/researchers-reveal-likelihood-governments-fake-ssl). 

Pour un chiffrement solide, il sera nécessaire à minima:
  - D’utiliser une clé de la taille du mot de passe
  - D’utiliser une clé différente pour chaque utilisateur et chaque requête
  - De négocier cette clé avec un algorithme de chiffrement asymétrique de type [Diffie Helman](https://www.wikiwand.com/en/Diffie%E2%80%93Hellman_key_exchange)

Cela revient plus ou moins à implémenter une version custom de SSL dans son application et [implémenter son propre système cryptographique n'est jamais une bonne idée](https://security.stackexchange.com/a/18198).

![trying to reinvent the wheel](/public/images/articles/2020-03-27-peut-on-securiser-une-application-frontend/reinvent-the-wheel.png)
*When you try to reinvent the wheel..*  

Il est bien plus facile d’utiliser d’autres techniques de sécurisation tel que le [SSL Pinning](https://security.stackexchange.com/a/29990) pour se prévenir des attaque MITM.

Dernier point, pour un maximum de sécurité, il est conseillé de générer des tokens ayant une durée de validitée courte pour limiter les dégats causés par une éventuelle compromission.

## Stocker des données sensibles

Lorsqu’il est nécessaire de stocker des données sensibles dans une application frontend, il est préférable d’utiliser les mécanismes mis à disposition par les créateurs de l’environnement de développement.

Par exemple, dans une application mobile avec React Native, nous pouvons utiliser la [Keychain d’Apple](https://developer.apple.com/documentation/security/certificate_key_and_trust_services/keys/storing_keys_in_the_keychain) ou le [Keystore d’Android](https://developer.android.com/training/articles/keystore). Ces **mécanismes rendent plus difficile l’extraction de données** sensibles depuis un device mais ils ne doivent **pas non plus être considérés comme inviolables**. (Eg: [Apple Keychain exploit](https://googleprojectzero.blogspot.com/2019/08/a-very-deep-dive-into-ios-exploit.html))

Dans tous les cas, il est inutile de rajouter une couche de chiffrement supplémentaire réalisée avec une clé prédictible car un **attaquant peut faire du reverse engineering sur l’application** pour retrouver la clé.
Ou encore plus facilement, simplement **accéder à la clé stockée en mémoire**.

Cela est contre-productif va **consommer inutilement des ressources CPU** pour le chiffrement/déchiffrement et donc **drainer la batterie**.

## Obfusquer le code source

Bien que je puisse comprendre que les développeurs puisse vouloir compliquer la tâche de reverse engineering d'une application, **l’obfuscation de doit jamais être considérée comme une pratique de sécurisation**.

Elle peut au maximum décourager certains attaquants mais quelqu’un de motivé pourra toujours analyser et comprendre le fonctionnement de l'application.

Surtout si un [obfuscateur open-source](https://github.com/rapid7/jsobfu) est utilisé car celui-ci est donc connu et des [dé-obfuscateurs](http://m1el.github.io/esdeobfuscate/) doivent certainement déjà exister.

De plus, l'obfuscation va rendre le code très difficile à interpréter et optimiser par les différents moteurs Javascript et il en résultera une **baisse significative des performances de l’application**.

![obfuscation benchmark](/public/images/articles/2020-03-27-peut-on-securiser-une-application-frontend/obfuscation-benchmark.png)
*[Benchmark](http://jsben.ch/yiK3U) réalisé avec l'[obfuscateur](https://obfuscator.io/) de [react-native-obfuscating-transformer](https://github.com/javascript-obfuscator/react-native-obfuscating-transformer)*

## Sécurisez votre backend

Comme nous l’avons vu, **une application frontend ne peut pas être sécurisée**. Comme il est impossible d’avoir le contrôle sur le terminal du client, il est impossible de s’assurer que celui-ci n’est pas compromis.

C’est sur le backend que la majeure partie des éléments de sécurité doivent être mis en place. 
Il n’y a pas de recette magique pour sécuriser un backend, c’est **un ensemble de bonnes pratiques** de programmation qui permettra d’arriver à un résultat optimal.

### Ne jamais faire confiance à la saisie des utilisateurs

Depuis le **corps d’une requête HTTP**, en passant par les **headers** ou encore les **cookies**, toutes ces informations qui peuvent être manipulées par l’utilisateur doivent être considérées comme potentiellement malicieuses.

L’utilisation naïve des saisies des utilisateurs peut amener à toutes sortes d’attaques:
  - [SQL Injection](https://www.w3schools.com/sql/sql_injection.asp) et [NoSQL Injection](https://nullsweep.com/a-nosql-injection-primer-with-mongo/)
  - [Remote code execution](https://nodesecroadmap.fyi/chapter-1/threat-RCE.html)
  - [Privilege escalation](https://www.sourceclear.com/vulnerability-database/security/privilege-escalation/javascript/sid-7835)

Il est toujours nécessaire de **vérifier et sanitiser** ces données avant de les utiliser dans une application.

### Limiter les dénis de service (DoS)

Les attaques par déni de service tentent de rendre une application indisponible.

Il est possible, par exemple, **d'envoyer de très grandes requêtes en JSON**, ce qui peut ralentir ou même rendre indisponible votre application.  

_**Atténuer l'attaque**: limiter la taille des requêtes dans les couches basses de votre application, de préférence directement dans les couches réseau._


Si votre backend est écrit en Node.js, il est également nécessaire d'être vigilant lors de la **création de nouvelles promesses**.  
En effet, une Promesse est **automatiquement envoyée à l'Event Loop** et il est alors **impossible de la retirer** avant sa résolution ou son rejet.

Un attaquant peut alors envoyer beaucoup de requêtes sur une route générant des promesses et donc **saturer l'Event Loop**.

_**Atténuer l'attaque**: implémenter un **système de limite de requêtes simultanées** utilisant uniquement des callbacks. Développer avec des callbacks c'est plus compliqué, mais les callbacks ne sont que des pointeurs vers des fonctions n'utilisant aucune ressource jusqu'à ce qu'ils soient invoqués. N'utilisez les promesses **qu'après le système de limite de requêtes**._

### Éviter le bruteforce

Afin d’éviter un bruteforce de l’authentification d’un utilisateur, il est nécessaire d’introduire une **limite au nombre de tentative de connexion**. 

Cette limite peut prendre la forme d’un blocage après X tentatives rajouté à la route d’authentification.

### Stocker les mots de passe de façon sécurisée

En 2019, il y avait encore des entreprises qui [stockent les mots de passes de leurs utilisateurs en clair](https://krebsonsecurity.com/2019/03/facebook-stored-hundreds-of-millions-of-user-passwords-in-plain-text-for-years/).

Cette pratique doit être évitée à tout prix afin de protéger vos utilisateurs en cas de fuite de données de votre application. Pas seulement pour votre propre application : [la majorité des utilisateurs réutilisent le même mot de passe pour plusieurs comptes](https://www.pandasecurity.com/mediacenter/security/password-reuse/). L'impact d'une fuite de mot de passe peut être catastrophique, tant pour vos utilisateurs que pour l'image de votre entreprise.

 
Les mots de passe doivent être stockés à l'aide d'une **fonction cryptographique unidirectionnelle** (ou fonction de hachage).

Le choix de la fonction de hachage doit être basé sur un **algorithme robuste** tel que [bcrypt](https://github.com/kelektiv/node.bcrypt.js) par exemple. Si vous le pouvez, renforcez les mots de passe faibles en utilisant du [key stretching](https://en.wikipedia.org/wiki/Key_stretching), et pour une couche de sécurité supplémentaire, vous pouvez également utiliser un [salt](https://en.wikipedia.org/wiki/Salt_(cryptography)) et un [pepper](https://en.wikipedia.org/wiki/Pepper_%28cryptography%29) sur les mots de passes.

### Et tellement d'autres!

Il y a énormément d’attaques possibles sur un backend, et la plupart sont peu ou pas connues. Certaines sont particulièrement difficiles à détecter et à prévenir :

Une **simple comparaison de deux chaînes de caractères** peut se donner lieu à une [attaque temporelle](https://www.wikiwand.com/fr/Attaque_temporelle) et permettre à un attaquant de deviner un mot de passe ou un token.

Mais encore l’utilisation d’une **librairie d’expression régulières vulnérable** à une [attaque ReDoS](https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS).

C’est pourquoi la sécurisation d’un backend n’est pas une tâche à prendre à la légère et doit être confiée à des experts en sécurité pour former les développeurs mais aussi auditer le code afin de s’assurer d’avoir le minimum de failles possibles car la [sécurité parfaite n’existe pas](https://www.quora.com/Is-perfect-security-possible).

## Le mot de la fin

Lors du développement d'une application, la sécurité doit être prise en compte du début à la fin et la **réflexion doit couvrir l'ensemble du périmètre de l'application**, du backend au frontend, y compris les canaux de communication et l'hébergement.

La sécurité coûte cher et est donc souvent négligée. C'est pourquoi il est préférable d'utiliser des frameworks et des backends conçus par des ingénieurs possédant les compétences et connaissances nécessaires pour assurer une sécurité suffisante aux utilisateurs finaux.

J'aimerais remercier toute l'équipe de [Kuzzle](https://github.com/kuzzleio) qui m'a aidé à rédiger cet article et en particulier [Sébastien Cottinet](https://github.com/scottinet/) et [Yannick Combes](http://github.com/shiranuit) pour leur expertise en sécurité et cryptographie.

---

_Si vous avez des questions ou que vous voulez juste discuter, venez nous parler sur le [Discord de Kuzzle](http://join.discord.kuzzle.io)_
