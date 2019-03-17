let make:
  (
    ~episode: RequestStatus.t(Belt.Result.t(Podcast.t, Errors.t)),
    ~onLoadRequest: unit => unit,
    array(React.reactElement)
  ) =>
  React.component(React.stateless, React.noRetainedProps, React.actionless);
