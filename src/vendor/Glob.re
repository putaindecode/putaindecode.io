open Belt;

[@bs.module "glob"]
external glob:
  (string, (Js.Nullable.t(Js.Exn.t), array(string)) => unit) => unit =
  "";

let glob = path =>
  Future.make(resolve =>
    glob(path, (err, value) =>
      switch (Js.Nullable.toOption(err)) {
      | Some(error) => resolve(Result.Error(error))
      | None => resolve(Result.Ok(value))
      }
    )
  );
