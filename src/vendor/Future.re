open Belt;

type getFn('a) = ('a => unit) => unit;

type t('a) =
  | Future(getFn('a));

type status('a) =
  | Pending(list('a => unit))
  | Done('a);

let make = resolver => {
  let status = ref(Pending([]));
  resolver(result =>
    switch (status^) {
    | Pending(callbacks) =>
      status := Done(result);
      callbacks->List.reverse->List.forEach(cb => cb(result));
    | Done(_) => () /* Do nothing; theoretically not possible */
    }
  );

  Future(
    resolve =>
      switch (status^) {
      | Done(result) => resolve(result)
      | Pending(callbacks) => status := Pending([resolve, ...callbacks])
      },
  );
};

let value = x => make(resolve => resolve(x));

let map = (Future(get), f) =>
  make(resolve => get(result => resolve(f(result))));

let flatMap = (Future(get), f) =>
  make(resolve =>
    get(result => {
      let Future(get2) = f(result);
      get2(resolve);
    })
  );

let tap = (Future(get) as future, f) => {
  get(f);
  future;
};

let get = (Future(getFn), f) => getFn(f);

/* *
 * Future Result convenience functions,
 * for working with a type Future.t( Result.t('a,'b) )
 */
let mapOk = (future, f) => future->map(r => Result.map(r, f));

let mapError = (future, f) =>
  future->map(r =>
    switch (r) {
    | Result.Error(v) => Result.Error(f(v))
    | Ok(a) => Result.Ok(a)
    }
  );

let flatMapOk = (future, f) =>
  future->flatMap(r =>
    switch (r) {
    | Result.Ok(v) => f(v)
    | Result.Error(e) => value(Result.Error(e))
    }
  );

let flatMapError = (future, f) =>
  future->flatMap(r =>
    switch (r) {
    | Result.Ok(v) => value(Result.Ok(v))
    | Result.Error(e) => f(e)
    }
  );

let tapOk = (future, f) =>
  future->tap(r =>
    switch (r) {
    | Result.Ok(v) => f(v)->ignore
    | Error(_) => ()
    }
  );

let tapError = (future, f) =>
  future->tap(r =>
    switch (r) {
    | Result.Error(v) => f(v)->ignore
    | Ok(_) => ()
    }
  );

let all2 = ((a, b)) =>
  make(resolve => a->get(a' => b->get(b' => resolve((a', b')))));

let all3 = ((a, b, c)) =>
  make(resolve =>
    all2((a, b))->get(((a', b')) => c->get(c' => resolve((a', b', c'))))
  );

let all4 = ((a, b, c, d)) =>
  make(resolve =>
    all3((a, b, c))
    ->get(((a', b', c')) => d->get(d' => resolve((a', b', c', d'))))
  );

let all5 = ((a, b, c, d, e)) =>
  make(resolve =>
    all4((a, b, c, d))
    ->get(((a', b', c', d')) => e->get(e' => resolve((a', b', c', d', e'))))
  );

let all6 = ((a, b, c, d, e, f)) =>
  make(resolve =>
    all5((a, b, c, d, e))
    ->get(((a', b', c', d', e')) =>
        f->get(f' => resolve((a', b', c', d', e', f')))
      )
  );

let all = futures =>
  futures->List.reduce(value([]), (accFuture, future) =>
    future->flatMap(value =>
      accFuture->map(xs => xs->Belt.List.concat([value]))
    )
  );

let mapAllOk = (future, f) =>
  future->map(values => {
    let value =
      values->List.every(Result.isOk) ?
        values
        ->List.reduce([], (acc, item) =>
            switch (item) {
            | Result.Ok(value) => [value, ...acc]
            | Result.Error(_) => acc
            }
          )
        ->List.reverse
        ->Result.Ok :
        values
        ->List.getBy(Result.isError)
        /* We can "safely" use getExn here as we know we have at least one error */
        ->Option.getExn
        ->Result.Error;
    value->Result.map(f);
  });

let flatMapAllOk = (future, error, f) =>
  future->flatMap(values =>
    values->List.every(Result.isOk) ?
      f(
        values
        ->List.reduce([], (acc, item) =>
            switch (item) {
            | Result.Ok(value) => [value, ...acc]
            | Result.Error(_) => acc
            }
          )
        ->List.reverse,
      ) :
      error->value
  );

let toPromise = future =>
  Js.Promise.make((~resolve, ~reject as _) =>
    future->get(value => resolve(. value))
  );

external _toExn: 'a => exn = "%identity";

let toPromiseWithResult = future =>
  Js.Promise.make((~resolve, ~reject) =>
    future
    ->mapOk(value => resolve(. value))
    ->mapError(value => reject(. _toExn(value)))
    ->get(_ => ())
  );
