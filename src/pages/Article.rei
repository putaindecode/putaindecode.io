let make:
  (
    ~post: RequestStatus.t(Belt.Result.t(Post.t, Errors.t)),
    ~onLoadRequest: unit => unit,
    array(React.reactElement)
  ) =>
  React.component(React.stateless, React.noRetainedProps, React.actionless);
