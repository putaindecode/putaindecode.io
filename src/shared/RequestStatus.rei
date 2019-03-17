type t('a) =
  | NotAsked
  | Loading
  | Done('a);

let isLoading: t('a) => bool;

let isDone: t('a) => bool;

let flatMap: (t('a), 'a => t('b)) => t('b);

let map: (t('a), 'a => 'b) => t('b);

let getWithDefault: (t('a), 'a) => 'a;
