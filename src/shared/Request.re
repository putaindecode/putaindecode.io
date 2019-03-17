open Belt;

module Xhr = {
  type xhr;
  [@bs.new] external make: unit => xhr = "XMLHttpRequest";
  [@bs.send.pipe: xhr] external open_: (string, string, bool) => unit = "open";
  [@bs.send.pipe: xhr] external send: Js.Null.t(string) => unit = "send";
  [@bs.send.pipe: xhr]
  external setRequestHeader: (string, string) => unit = "setRequestHeader";
  [@bs.set] external setResponseType: (xhr, string) => unit = "responseType";
  [@bs.set]
  external onChange: (xhr, unit => unit) => unit = "onreadystatechange";
  [@bs.get] external readyState: xhr => int = "readyState";
  [@bs.get] external status: xhr => int = "status";
  [@bs.get] external response: xhr => 'a = "response";
};

[@bs.deriving jsConverter]
type method = [ | `GET | `POST | `PATCH | `DELETE];

let make =
    (
      ~url,
      ~method=`GET,
      ~body=?,
      ~contentType="application/json",
      ~responseType="json",
      (),
    ) => {
  let xhr = Xhr.make();
  let future =
    Future.make(resolve => {
      let method = methodToJs(method);
      Xhr.open_(method, url, true, xhr);
      Xhr.setResponseType(xhr, responseType);
      Xhr.onChange(xhr, () =>
        if (Xhr.readyState(xhr) === 4) {
          switch (Xhr.status(xhr)) {
          | 400
          | 404
          | 401
          | 403
          | 500
          | 422 => resolve(Result.Error(Errors.Error))
          | _ as status when status >= 200 && status < 300 =>
            if ([%bs.raw {|typeof xhr.response === "string"|}]) {
              /* IE 11 hack */
              try (
                resolve(
                  Result.Ok(
                    Obj.magic(Js.Json.parseExn(Xhr.response(xhr))),
                  ),
                )
              ) {
              | _ => resolve(Result.Ok(Xhr.response(xhr)))
              };
            } else {
              resolve(Result.Ok(Xhr.response(xhr)));
            }
          | _ => resolve(Result.Error(Errors.Error))
          };
        }
      );
      Xhr.setRequestHeader("Accept", "application/json", xhr);
      switch (body) {
      | Some(_body) => Xhr.setRequestHeader("Content-Type", contentType, xhr)
      | None => ()
      };

      Xhr.send(
        body
        ->Option.flatMap(body => Js.Json.stringifyAny(body))
        ->Js.Null.fromOption,
        xhr,
      );
    });
  future;
};
