let component = ReasonReact.statelessComponent("ActivityIndicator");

module Styles = {
  open Css;
  let container =
    style([
      display(flexBox),
      flexGrow(1.0),
      alignItems(center),
      justifyContent(center),
    ]);
};

[@react.component]
let make = (~color="#" ++ Theme.darkBody, ~size=32, ~strokeWidth=2, ()) =>
  ReactCompat.useRecordApi({
    ...component,
    render: _ =>
      <div className=Styles.container>
        <svg
          width={string_of_int(size)}
          height={string_of_int(size)}
          viewBox="0 0 38 38"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          stroke=color
          style={ReactDOMRe.Style.make(~overflow="visible", ())}
          ariaLabel="Loading"
          role="alert"
          ariaBusy=true>
          <g fill="none" fillRule="evenodd">
            <g transform="translate(1 1)" strokeWidth={j|$strokeWidth|j}>
              <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
              <path d="M36 18c0-9.94-8.06-18-18-18">
                <animateTransform
                  attributeName="transform"
                  type_="rotate"
                  from="0 18 18"
                  to_="360 18 18"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </path>
            </g>
          </g>
        </svg>
      </div>,
  });
