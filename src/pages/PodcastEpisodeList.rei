[@react.component]
let make:
  (
    ~episodeList: RequestStatus.t(
                    Belt.Result.t(array(PodcastShallow.t), Errors.t),
                  ),
    ~onLoadRequest: unit => unit,
    ~search: string,
    unit
  ) =>
  React.element;
