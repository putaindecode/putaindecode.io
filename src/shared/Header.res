module Styles = {
  open Emotion
  let container = css({
    "backgroundColor": Theme.gradientRedBottom,
    "backgroundImage": `linear-gradient(to bottom right, ${Theme.gradientRedTop}, ${Theme.gradientRedBottom})`,
  })
  let contents = css({
    "display": "flex",
    "flexDirection": "column",
    "alignItems": "center",
    "justifyContent": "center",
    "padding": "20px 0 50px",
  })
  let logo = css({
    "display": "flex",
    "flexDirection": "column",
    "alignItems": "center",
    "textDecoration": "none",
  })
  let name = css({
    "display": "flex",
    "flexDirection": "row",
    "alignItems": "center",
    "textDecoration": "none",
    "paddingBottom": 10,
  })
  let title = css({"fontSize": 22, "color": "#fff", "fontWeight": "800"})
  let subTitle = css({
    "fontSize": 14,
    "color": "rgba(255, 255, 255, 0.8)",
    "textAlign": "center",
  })
  let banner = css({
    "backgroundColor": "#000",
    "padding": 10,
    "color": "#fff",
    "textAlign": "center",
  })
  let bannerTitle = css({"fontSize": 24, "fontWeight": "700"})
  let bannerLink = css({"fontSize": 20, "color": "#8CBEF9"})
}

@react.component
let make = (~url: RescriptReactRouter.url, ~gradient=?, ()) => <>
  <header className=Styles.container style={ReactDOM.Style.make(~backgroundImage=?gradient, ())}>
    <WidthContainer>
      <div className=Styles.contents>
        <Pages.Link href="/" className=Styles.logo>
          <div className=Styles.name>
            Logo.logo
            <Spacer />
            <div
              className=Styles.title
              role="heading"
              ariaLevel={switch url.path {
              | list{} => 1
              | _ => 2
              }}>
              {"Putain de code !"->React.string}
            </div>
          </div>
          <div className=Styles.subTitle>
            {`Blog participatif de la communauté dev`->React.string}
          </div>
        </Pages.Link>
      </div>
    </WidthContainer>
  </header>
</>
