[@react.component]
let make:
  (
    ~home: RequestStatus.t(Belt.Result.t(Home.t, Errors.t)),
    ~onLoadRequest: unit => unit,
    unit
  ) =>
  React.element;
