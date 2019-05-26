---
date: 2019-05-26
title: Type option et point d'interrogation
author: freddy03h
slug: type-option-et-point-d-interrogation
---

Le type option est vraiment super à utiliser en Reason, je vous conseil la lecture de [l’article de Matthias](/articles/introduction-a-reasonml) (et tous les autres articles sur Reason). Mais j’ai un peu buté sur un petit point, c'est celle de la **combinaison du type option** et de l’utilisation du **point d'interrogation** pour les **paramètres optionnels** d’une fonction ou d’un composant React [malgré la doc à ce sujet](https://reasonml.github.io/docs/en/function#optional-labeled-arguments), alors je résume cela dans cet article.

On va prendre comme exemple un composant `UserRow` qui prend en paramètre un `name` et une `imageSrc` qui peut être facultative.

Une solution peut être d’utiliser le type option explicitement comme type de paramètre.

```reason
/* UserRow.re */
[@react.component]
let make = (~name: string, ~imageSrc: option(string)) => {
  <div>
    <div>
      {imageSrc
       ->Belt.Option.map(src => <img src />)
       ->Belt.Option.getWithDefault(ReasonReact.null)}
    </div>
    <div> name->ReasonReact.string </div>
  </div>;
};
```

À l’intérieur du composant le type option est parfait pour gérer l’optionalité du paramètre. Mais à l’usage nous sommes obligé de l’utiliser de cette manière :

```reason
<UserRow name="Ariel" imageSrc={Some("https://example.com/user.jpg")} />

<UserRow name="Manon" imageSrc={None} />
```

Il est impossible d’omettre le paramètre `imageSrc`. Il faudra obligatoirement lui renseigner un option. Pour rendre le renseignement du paramètre vraiment optionnel, on peut utiliser le point d'interrogation comme valeur par défaut dans la déclaration du composant.

```reason
/* UserRow.re */
[@react.component]
let make = (~name: string, ~imageSrc: option(string)=?) => { … };
```

Le point d'interrogation va permettre de renseigner directement le type inclus dans l’option (ici un string) ou d’omettre complètement le paramètre, ce qui donne ceci à l'usage :

```reason
<UserRow name="Ariel" imageSrc="https://example.com/user.jpg" />

<UserRow name="Manon" />
```

La valeur sera **automatiquement encapsulée dans un option**, ce qui fait que l’implémentation ne change pas et on profite toujours des avantages du type option dans le composant.

## Bon alors c'est tout ?

Là on pourrait se dire que c’est bon c’est fini, mais en fait pas vraiment.

Si on résume, notre component accepte en paramètre que `imageSrc` soit absent, ou qu’il soit un string. Mais impossible de lui donner un option, et cela peut être embêtant à l’usage.

Par exemple, `UserRow` est utilisé dans un autre composant `FollowerRow` qui lui prend en paramètre un `avatarUrl`, et qui sera un type option. Pour transmettre la valeur de `avatarUrl` à `imageSrc` nous seront obligé de faire quelque chose comme ça :

```reason
/* FollowerRow.re */
[@react.component]
let make = (~name: string, ~avatarUrl: option(string)=?) =>
  <div>
    {avatarUrl
    ->Belt.Option.map(url => <UserRow name imageSrc={url} />)
    ->Belt.Option.getWithDefault(<UserRow name />)}
  </div>;
```

Vu que `imageSrc` ne prend pas de type option, on est obligé d'appeler `<UserRow>` différement selon que `avatarUrl` soit `Some()` ou `None`.

Mais heureusement il existe une notation qui va nous permettre de renseigner un option, c’est là encore le point d'interrogation :

```reason
<UserRow name imageSrc=?{avatarUrl} />
```

Le point d'interrogation va permettre de renseigner le paramètre avec un type option, de transmettre la valeur contenue dans le `Some()` de `avatarUrl` ou d’omettre complètement le paramètre `imageSrc` si `avatarUrl` est `None`.

## Double usage du point d'interrogation

Si on résume, le premier point d'interrogation, celui utilisé pour donner une valeur option à un paramètre optionnel permet de **renseigner directement la valeur ou d’omettre le paramètre**.

Et ensuite, le deuxième point d'interrogation, celui utilisé dans la déclaration d’optionalité du paramètre du composant, permet lui de **ré-encapsuler la valeur (ou l’absence de valeur) dans un type option**.

Dis comme ça, cela peut sembler inutilement complexe, sauf que **la complexité est gérée par le langage**, et qu’à l’utilisation on y gagne en souplesse :

- J’ai un composant avec un paramètre optionnel que je peux gérer, en interne, grâce aux avantages du type option
- Je peux renseigner ce paramètre avec une valeur string, option ou l’omettre.

## Notation raccourcis et typage

Pour les besoins de l’exemple j’ai volontairement utilisé du code très explicite, mais il faut savoir qu’on a quelques raccourcis dans la notation.

### Punning

L’avantage du JSX de ReasonReact par rapport à React.js c’est le punning. Le raccouris quand un label et la valeur sont le même. On a déjà l’habitude en JS avec les objets, au lieu de `return {name: name}`, on peut faire `return {name}`.

On peut aussi l’utiliser avec le point d'interrogation, par exemple :

```reason
[@react.component]
let make = (~name: string, ~avatarUrl as imageSrc:option(string)=?) =>
  <div>
    <UserRow name imageSrc=?{imageSrc} />
  </div>;
```

devient

```reason
[@react.component]
let make = (~name: string, ~avatarUrl as imageSrc:option(string)=?) =>
  <div>
    <UserRow name ?imageSrc />
  </div>;
```

(d’ailleurs, si vous écrivez le code sans punning, le Reformat vous réécrit automatiquement votre code avec).

C’est aussi l’occasion d’aborder le fait de pouvoir renommer un argument avec `as`. Il ne faut vraiment pas s’en priver. En fait il faut savoir que `(~name)` est lui même un raccourcis pour `(~name as name)`.

### Inférence de type

L’inférence de type est vraiment très bonne en Reason, si j’ai explicité le type option et leur contenu string, je peux très bien m’en passer. Ce qui nous donne un exemple finale moins verbeux :

```reason
/* UserRow.re */
[@react.component]
let make = (~name, ~imageSrc=?) =>
  <div>
    <div>
      {imageSrc
      ->Belt.Option.map(src => <img src />)
      ->Belt.Option.getWithDefault(ReasonReact.null)}
    </div>
    <div> name->ReasonReact.string </div>
  </div>;

/* FollowerRow.re */
[@react.component]
let make = (~name, ~avatarUrl as imageSrc=?) =>
  <div> <UserRow name ?imageSrc /> </div>;
```
