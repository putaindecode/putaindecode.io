[@react.component]
let make:
  (
    ~url: ReasonReact.Router.url=?,
    ~href: Js.String.t,
    ~className: string=?,
    ~style: ReactDOMRe.style=?,
    ~activeClassName: string=?,
    ~matchSubroutes: bool=?,
    ~onClick: ReactEvent.Mouse.t => unit=?,
    ~children: React.element,
    unit
  ) =>
  React.element;
