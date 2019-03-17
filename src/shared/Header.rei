let make:
  (~url: React.Router.url, ~gradient: string=?, array(React.reactElement)) =>
  React.component(React.stateless, React.noRetainedProps, React.actionless);
