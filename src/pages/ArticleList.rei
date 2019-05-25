[@react.component]
let make:
  (
    ~postList: RequestStatus.t(Belt.Result.t(array(PostShallow.t), Errors.t)),
    ~onLoadRequest: unit => unit,
    ~search: string,
    unit
  ) =>
  React.element;
