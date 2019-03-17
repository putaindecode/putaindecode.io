let make:
  (~width: int=?, ~height: int=?, array(React.reactElement)) =>
  React.component(
    React.stateless,
    React.noRetainedProps,
    React.actionless,
  );
