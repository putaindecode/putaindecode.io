let make:
  (
    ~url: React.Router.url=?,
    ~href: Js.String.t,
    ~className: string=?,
    ~style: ReactDOMRe.style=?,
    ~activeClassName: string=?,
    ~matchSubroutes: bool=?,
    ~onClick: ReactEvent.Mouse.t => unit=?,
    array(React.reactElement)
  ) =>
  React.component(React.stateless, React.noRetainedProps, React.actionless);
