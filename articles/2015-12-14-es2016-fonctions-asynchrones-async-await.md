---
date: 2015-12-14
title: "ES2016 (?): fonctions asynchrones (async/await)"
author: naholyr
oldSlug: js/es2016/async-await
slug: es2016-fonctions-asynchrones-async-await
---

Aujourd'hui, une fonctionnalité peut-être abusivement taggée "ES6" puisqu'elle
ne fait pas partie des propositions acceptées cette année : les fonctions
asynchrones (async/await). La
[spécification](https://tc39.github.io/ecmascript-asyncawait/) est encore au
stade 3 (candidate) à l'heure de cet article. Mais il ne fait plus aucun doute
qu'elle (ou une variante) fera partie de la spécification ES2016.

## Fonctions asynchrones

Pour les traitements asynchrones, vous connaissez déjà
[les promesses](/fr/articles/js/es2015/promises/) qui ont évidemment remplacé
les callbacks dans votre code. Si vous n'avez pas déjà fait la bascule vers les
promesses (ne serait-ce que pour la propagation d'erreur),
[les générateurs](/fr/articles/js/es2015/generators/) ont dû finir de vous
convaincre grâce aux
[coroutines](/fr/articles/js/es2015/generators/#use-case-co-routines).

Nous allons voir aujourd'hui une nouvelle manière de traiter les fonctions
asynchrones. Mais ne jetez pas vos promesses, tout tourne encore autour d'elles.

## Exemple de traitement asynchrone : Promise

Partons du programme suivant exécuté le 6 décembre dernier dont l'API est basée
sur les promesses :

- Il récupère tous les utilisateurs prénommés Nicolas
- Il envoie un mail à chacun pour souhaiter bonne fête

```js
function sendEmails(query) {
  const usersP = getUsers(query);
  // On récupère le champ "email" de tous les utilisateurs
  const emailsP = usersP.then(users => users.map(u => u.email));
  // Pour chaque email…
  const sentP = emailsP.then(emails =>
    emails.map(email => {
      // … on envoie un mail
      return sendMail(email, "Bonne fête");
    }),
  );
  // On attend que tous les envois soient résolus
  return Promise.all(sentP);
}

sendEmails({ firstName: "Nicolas" })
  .then(() => console.log("OK"))
  .catch(() => console.error("FAIL"));
```

## Nouveaux mot-clés `async` et `await`

Une fonction peut être marquée comme asynchrone lorsque préfixée par `async` :

```js
async function myFunction() {
  // …
}
```

Dans une fonction asynchrone, et **seulement** dans une fonction asynchrone, le
mot-clé `await` devient disponible. Lorsqu'il est utilisé en préfixe d'une
promesse, l'évaluation de l'expression est "mise en pause" jusqu'à la résolution
(ou le rejet) de la promesse :

```js
async function myFunction() {
  await aPromise;
  // on n'arrivera à cette ligne que lorsque "aPromise" sera résolue
}
```

Évidemment, l'expression a alors pour valeur celle de résolution de la promesse,
et en cas d'erreur l'expression va lever (`throw`) une erreur :

```js
async function myFunction() {
  try {
    const result = await aPromise;
    // Ici "aPromise" est résolue avec la valeur "result"
  } catch (err) {
    // Ici "aPromise" est rejetée avec l'erreur "err"
  }

  return 42; // cette ligne n'est atteinte qu'après résolution/rejet
}
```

Concrètement, si vous vous souvenez de l'article sur les générateurs et de la
partie sur les coroutines, remplacez `async function` par `function *` et
`await` par `yield`, et vous avez compris le principe. ;)

## Notre premier exemple, avec les fonctions asynchrones

Réécrivons notre premier exemple avec des fonctions asynchrones :

```js
async function sendEmails(query) {
  const users = await getUsers(query);
  const emails = users.map(u => u.email);
  const sentP = emails.map(email => sendMail(email, "Bonne fête"));
  return await Promise.all(sentP);
}

// Attention, on ne peut pas utiliser "await" hors d'une fonction "async"
// il faut donc "wrapper" notre code autour d'une fonction asynchrone
async function main() {
  try {
    await sendEmails({ firstName: "Nicolas" });
    console.log("OK");
  } catch (e) {
    console.error("FAIL");
  }
}

main();
```

Mieux ? Moins bien ? Question de goût, mais on retrouve un code impératif plus
habituel.

## Attention au piège de l'exécution en série !

Prenons l'exemple de requêtes qu'on exécute en concurrence avant d'utiliser
leurs résultats :

```js
const xP = getX(); // Requête Ajax
const yP = getY(); // Requête BDD
const resultP = Promise.all([xP, yP]).then(sum);
```

Dans cet exemple, les requêtes sont lancées, exécutées en parallèle puis leurs
retours attendus avant de passer à la suite.

Si on le traduit bêtement ainsi, on perd l'aspect concurrentiel :

```js
const x = await getX() // Requête Ajax…
// … requête terminée !
const y = await getY() // Requête BDD…
// … requête terminée !
const result = sum([x, y])
```

Il faudra bien distinguer le moment où on souhaite **démarrer l'action** et le
moment où l'on souhaite **disposer de son résultat**, il y a plusieurs manières
de résoudre le problème, qui dépendent essentiellement du goût du développeur ;)

```js
const xP = getX() // Requête Ajax démarrée…
const yP = getY() // Requête BDD démarrée…

// Version 1 :
const x = await xP // …requête Ajax terminée !
const y = await yP // …requête BDD terminée !
const result = sum([x, y])

// Version 2 avec un tableau :
const vars = [await xP, await yP]
const result = sum(vars)

// Version 3 avec Promise.all :
const vars = await Promise.all([xP, yP])
const result = sum(vars)
```

## Et aujourd'hui ?

On peut utiliser Babel pour compiler son code utilisant `async/await` en un code
basé sur les générateurs : il vous suffira d'ajouter les plugins Babel
`syntax-async-functions` et `transform-async-to-generator` (attention à inclure
`babel-polyfill` en fichier d'entrée).

## Conclusion

Grâce aux fonctions asynchrones, la refactorisation d'un code bloquant vers un
code non bloquant devient vraiment aisée. Les promesses simplifiaient déjà le
processus mais on n'était pas débarassé des callbacks. Là, à deux mot-clés près,
c'est exactement la même chose !

D'un certain côté, c'est un retour en arrière : l'asynchrone mène aux promesses,
qui mènent à la programmation fonctionnelle, qui apporte tant de bienfaits… Il
s'agira de trouver le bon équilibre, je ne suis pas convaincu d'abandonner mes
`.then` tout de suite, mais il est certain que c'est une véritable avancée pour
ce langage : la courbe d'apprentissage des traitements asynchrones va être
drastiquement aplanie ;)
