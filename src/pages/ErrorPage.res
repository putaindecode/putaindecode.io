open Belt

type action =
  | RunCommand
  | SetValue(string)

type line =
  | User(string)
  | System(string)

type state = {
  history: array<line>,
  input: string,
}

module Styles = {
  open Css
  let terminal = style(list{
    margin(10->px),
    backgroundColor("222"->hex),
    borderRadius(10->px),
    padding(10->px),
    color("fff"->hex),
    height(300->px),
    overflowY(auto),
    fontFamily(#custom(Theme.codeFontFamily)),
    unsafe("WebkitOverflowScrolling", "touch"),
  })
  let line = style(list{whiteSpace(#preWrap)})
  let input = style(list{
    backgroundColor("222"->hex),
    fontFamily(#custom(Theme.codeFontFamily)),
    color("fff"->hex),
    fontSize(16->px),
    borderWidth(zero),
    margin(zero),
    padding(zero),
    outlineStyle(none),
  })
  let title = style(list{
    fontSize(48->px),
    fontWeight(extraBold),
    marginTop(20->px),
    marginBottom(20->px),
    textAlign(center),
  })
}

@react.component
let make = () => {
  let containerRef = React.useRef(Js.Nullable.null)

  let (state, send) = React.useReducer((state, action) =>
    switch action {
    | RunCommand => {
        input: "",
        history: Array.concat(
          state.history,
          [
            User(state.input),
            switch state.input->Js.String.trim {
            | "" => System("")
            | "help" =>
              System(`available commands:
- help
- ls
- cat `)
            | "ls" =>
              System(`- hack-website.sh
- go-to-home.sh
- nuclear-codes.txt`)
            | "cat" => System("cat: missing argument")
            | "cat hack-website.sh"
            | "cat ./hack-website.sh" =>
              System("# seriously?\necho \"lol\"")
            | "hack-website.sh"
            | "./hack-website.sh" =>
              System("lol")
            | "cat nuclear-codes.txt"
            | "cat ./nuclear-codes.txt" =>
              System("000000")
            | "go-to-home.sh"
            | "./go-to-home.sh" =>
              Js.Global.setTimeout(() => RescriptReactRouter.push("/"), 1_000)->ignore
              System("Redirecting ...")
            | "cat go-to-home.sh"
            | "cat ./go-to-home.sh" =>
              System(`RescriptReactRouter.push("/")`)
            | _ => System("command not found: " ++ (state.input ++ "\ntry command 'help'"))
            },
          ],
        ),
      }
    | SetValue(input) => {...state, input: input}
    }
  , {history: [], input: ""})

  React.useEffect1(() => {
    switch containerRef.current->Js.Nullable.toOption {
    | Some(containerRef) =>
      open Webapi.Dom
      containerRef->Element.setScrollTop(containerRef->Element.scrollHeight->float_of_int)
    | None => ()
    }
    None
  }, [state.history])

  let userPrefix = "~ "
  <WidthContainer>
    <div role="heading" ariaLevel=1 className=Styles.title> {"Erreur"->React.string} </div>
    <div
      className=Styles.terminal
      onClick={event => (event->ReactEvent.Mouse.target)["querySelector"]("input")["focus"]()}
      ref={containerRef->ReactDOM.Ref.domRef}>
      {state.history
      ->Array.mapWithIndex((index, item) =>
        <div key=j`$index` className=Styles.line>
          {React.string(
            switch item {
            | User(value) => userPrefix ++ value
            | System(value) => value
            },
          )}
        </div>
      )
      ->React.array}
      <div>
        {userPrefix->React.string}
        {<input
          type_="text"
          className=Styles.input
          autoFocus=true
          value={state.input}
          onChange={event => send(SetValue((event->ReactEvent.Form.target)["value"]))}
          onKeyDown={event => {
            if event->ReactEvent.Keyboard.key == "Enter" {
              send(RunCommand)
            }
            if event->ReactEvent.Keyboard.key == "Tab" {
              event->ReactEvent.Keyboard.preventDefault
            }
          }}
        />->React.cloneElement({"autoCapitalize": "off"})}
      </div>
    </div>
  </WidthContainer>
}
