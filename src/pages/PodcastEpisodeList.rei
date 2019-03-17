let make:
  (
    ~episodeList: RequestStatus.t(
                    Belt.Result.t(array(PodcastShallow.t), Errors.t),
                  ),
    ~onLoadRequest: unit => unit,
    ~search: string,
    array(React.reactElement)
  ) =>
  React.component(React.stateless, React.noRetainedProps, React.actionless);
