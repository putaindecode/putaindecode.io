type action;

type state;

[@react.component]
let make: (~title: string, ~children: React.element, unit) => React.element;
