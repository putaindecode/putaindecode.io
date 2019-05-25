[@react.component]
let make:
  (
    ~post: RequestStatus.t(Belt.Result.t(Post.t, Errors.t)),
    ~onLoadRequest: unit => unit,
    unit
  ) =>
  React.element;
