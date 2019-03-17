let make:
  (
    ~postList: RequestStatus.t(Belt.Result.t(array(PostShallow.t), Errors.t)),
    ~onLoadRequest: unit => unit,
    ~search: string,
    array(React.reactElement)
  ) =>
  React.component(React.stateless, React.noRetainedProps, React.actionless);
