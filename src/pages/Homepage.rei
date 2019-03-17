let make:
  (
    ~home: RequestStatus.t(Belt.Result.t(Home.t, Errors.t)),
    ~onLoadRequest: unit => unit,
    array(React.reactElement)
  ) =>
  React.component(React.stateless, React.noRetainedProps, React.actionless);
