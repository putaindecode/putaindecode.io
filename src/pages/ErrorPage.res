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
  open Emotion
  let terminal = css({
    "margin": 10,
    "backgroundColor": "#222",
    "borderRadius": 10,
    "padding": 10,
    "color": "#fff",
    "height": 300,
    "overflowY": "auto",
    "fontFamily": Theme.codeFontFamily,
    "WebkitOverflowScrolling": "touch",
  })
  let line = css({"whiteSpace": "pre-wrap"})
  let input = css({
    "backgroundColor": "#222",
    "fontFamily": Theme.codeFontFamily,
    "color": "#fff",
    "fontSize": 16,
    "borderWidth": 0,
    "margin": 0,
    "padding": 0,
    "outline": "none",
  })
  let title = css({
    "fontSize": 48,
    "fontWeight": "800",
    "marginTop": 20,
    "marginBottom": 20,
    "textAlign": "center",
  })
}

external elementAsObject: Dom.element => {..} = "%identity"

@react.component
let make = () => {
  let containerRef = React.useRef(Nullable.null)

  let (state, send) = React.useReducer((state, action) =>
    switch action {
    | RunCommand => {
        input: "",
        history: Array.concat(
          state.history,
          [
            User(state.input),
            switch state.input->String.trim {
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
              setTimeout(() => RescriptReactRouter.push("/"), 1_000)->ignore
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
    switch containerRef.current->Nullable.toOption {
    | Some(element) =>
      let element = element->elementAsObject
      element["scrollTop"] = element["scrollHeight"]
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
      ->Array.mapWithIndex((item, index) =>
        <div key={index->Int.toString} className=Styles.line>
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
