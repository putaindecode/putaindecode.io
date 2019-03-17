type action;

type state;

let make:
  (~title: string, array(React.reactElement)) =>
  React.component(state, React.noRetainedProps, action);
