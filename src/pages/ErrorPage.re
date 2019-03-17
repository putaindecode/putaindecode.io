open Belt;

type action =
  | RunCommand
  | SetValue(string);

type line =
  | User(string)
  | System(string);

type state = {
  history: array(line),
  input: string,
  containerRef: ref(option(Webapi.Dom.Element.t)),
};

let component = React.reducerComponent("ErrorPage");

module Styles = {
  open Css;
  let terminal =
    style([
      margin(10->px),
      backgroundColor("222"->hex),
      borderRadius(10->px),
      padding(10->px),
      color("fff"->hex),
      height(300->px),
      overflowY(auto),
      fontFamily(Theme.codeFontFamily),
      `declaration(("WebkitOverflowScrolling", "touch")),
    ]);
  let line = style([whiteSpace(`preWrap)]);
  let input =
    style([
      backgroundColor("222"->hex),
      fontFamily(Theme.codeFontFamily),
      color("fff"->hex),
      fontSize(16->px),
      borderWidth(zero),
      margin(zero),
      padding(zero),
      outlineStyle(none),
    ]);
  let title =
    style([
      fontSize(48->px),
      fontWeight(extraBold),
      marginTop(20->px),
      marginBottom(20->px),
      textAlign(center),
    ]);
};

let make = _ => {
  ...component,
  initialState: () => {history: [||], input: "", containerRef: ref(None)},
  reducer: (action, state) =>
    switch (action) {
    | RunCommand =>
      React.UpdateWithSideEffects(
        {
          ...state,
          input: "",
          history:
            Array.concat(
              state.history,
              [|
                User(state.input),
                switch (state.input->Js.String.trim) {
                | "" => System("")
                | "help" => System({|available commands:
- help
- ls
- cat |})
                | "ls" =>
                  System(
                    {|- hack-website.sh
- go-to-home.sh
- nuclearcodes.txt|},
                  )
                | "cat" => System("cat: missing argument")
                | "cat hack-website.sh"
                | "cat ./hack-website.sh"
                | "hack-website.sh"
                | "./hack-website.sh" => System("lol")
                | "cat nuclearcodes.txt"
                | "cat ./nuclearcodes.txt" => System("000000")
                | "go-to-home.sh"
                | "./go-to-home.sh" =>
                  Js.Global.setTimeout(() => React.Router.push("/"), 1_000)
                  ->ignore;
                  System("Redirecting ...");
                | "cat go-to-home.sh"
                | "cat ./go-to-home.sh" => System("React.Router.push(\"/\")")
                | _ =>
                  System(
                    "command not found: "
                    ++ state.input
                    ++ "\ntry command 'help'",
                  )
                },
              |],
            ),
        },
        ({state}) =>
          switch (state.containerRef^) {
          | Some(containerRef) =>
            Webapi.Dom.(
              containerRef->Element.setScrollTop(
                containerRef->Element.scrollHeight->float_of_int,
              )
            )
          | None => ()
          },
      )
    | SetValue(input) => React.Update({...state, input})
    },
  render: ({send, state, handle}) => {
    let userPrefix = "~ ";
    <WidthContainer>
      <div role="heading" ariaLevel=1 className=Styles.title>
        "Erreur"->React.string
      </div>
      <div
        className=Styles.terminal
        onClick={event =>
          event->ReactEvent.Mouse.target##querySelector("input")##focus()
        }
        ref={handle((containerRef, {state}) =>
          state.containerRef := Js.Nullable.toOption(containerRef)
        )}>
        {state.history
         ->Array.mapWithIndex((index, item) =>
             <div key={j|$index|j} className=Styles.line>
               {React.string(
                  switch (item) {
                  | User(value) => userPrefix ++ value
                  | System(value) => value
                  },
                )}
             </div>
           )
         ->React.array}
        <div>
          userPrefix->React.string
          <input
            type_="text"
            className=Styles.input
            autoFocus=true
            value={state.input}
            onChange={event =>
              send(SetValue(event->ReactEvent.Form.target##value))
            }
            onKeyDown={event => {
              if (event->ReactEvent.Keyboard.key == "Enter") {
                send(RunCommand);
              };
              if (event->ReactEvent.Keyboard.key == "Tab") {
                event->ReactEvent.Keyboard.preventDefault;
              };
            }}
          />
        </div>
      </div>
    </WidthContainer>;
  },
};
