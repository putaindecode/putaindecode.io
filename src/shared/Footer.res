module Styles = {
  open Emotion
  let footer = css({"backgroundColor": "#222", "padding": "20px 0"})
  let container = css({"position": "relative"})
  let rss = css({
    "position": "absolute",
    "left": 0,
    "top": "50%",
    "color": "#fff",
    "transform": "translateY(-50%)",
    "textDecoration": "none",
    "display": "flex",
    "flexDirection": "row",
    "alignItems": "center",
  })
  let github = css({
    "position": "absolute",
    "right": 0,
    "top": "50%",
    "color": "#fff",
    "transform": "translateY(-50%)",
    "textDecoration": "none",
    "display": "flex",
    "flexDirection": "row",
    "alignItems": "center",
  })
  let text = css({"@media (max-width: 400px)": {"display": "none"}})
  let icon = css({"marginRight": 10})
  let copyright = css({
    "color": "rgba(255, 255, 255, 0.5)",
    "textAlign": "center",
    "fontSize": 14,
  })
}

@react.component
let make = () =>
  <footer className=Styles.footer>
    <WidthContainer>
      <div className=Styles.container>
        <a href="/api/articles/feeds/desc/feed.xml" className=Styles.rss>
          <img
            src="/public/images/website/rss-feed.svg"
            alt="Flux RSS"
            width="16"
            height="16"
            className=Styles.icon
          />
          <div className=Styles.text> {"Flux RSS"->React.string} </div>
        </a>
        <div className=Styles.copyright> {`© 2021 Putain de code !`->React.string} </div>
        <a href="https://github.com/putaindecode/putaindecode.io" className=Styles.github>
          {"GitHub"->React.string}
        </a>
      </div>
    </WidthContainer>
  </footer>
