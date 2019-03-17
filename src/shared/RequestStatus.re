type t('a) =
  | NotAsked
  | Loading
  | Done('a);

let isLoading =
  fun
  | Loading => true
  | _ => false;

let isDone =
  fun
  | Done(_) => true
  | _ => false;

let flatMap = (x, f: 'a => t('b)): t('b) =>
  switch (x) {
  | Done(x) => f(x)
  | Loading => Loading
  | NotAsked => NotAsked
  };

let map = (x, f: 'a => 'b): t('b) =>
  switch (x) {
  | Done(x) => Done(f(x))
  | Loading => Loading
  | NotAsked => NotAsked
  };

let getWithDefault = (x, v) =>
  switch (x) {
  | Done(x) => x
  | Loading => v
  | NotAsked => v
  };
