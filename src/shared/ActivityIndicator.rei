let make:
  (
    ~color: string=?,
    ~size: int=?,
    ~strokeWidth: int=?,
    array(React.reactElement)
  ) =>
  React.component(React.stateless, React.noRetainedProps, React.actionless);
