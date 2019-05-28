[@react.component]
let make:
  (
    ~episode: RequestStatus.t(Belt.Result.t(Podcast.t, Errors.t)),
    ~onLoadRequest: unit => unit,
    unit
  ) =>
  React.element;
