let pad2 = string => ("0" ++ string)->Js.String.sliceToEnd(~from=-2, _);

[@react.component]
let make = (~date, ()) => {
  open Js.Date;
  let utc = date;
  let date = fromString(date);
  let dateString =
    date->getUTCFullYear->Js.String.make
    ++ "/"
    ++ (date->getUTCMonth +. 1.0)->Js.String.make->pad2
    ++ "/"
    ++ date->getUTCDate->Js.String.make->pad2;
  <time dateTime=utc> dateString->ReasonReact.string </time>;
};
