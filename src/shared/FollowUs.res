module Styles = {
  open Emotion
  let container = css({
    "margin": "20px 0",
    "backgroundColor": Theme.pageAccentedBackgroundColor,
    "borderRadius": 10,
    "padding": 20,
  })
  let title = css({
    "fontSize": 32,
    "fontWeight": "800",
    "marginBottom": 20,
    "textAlign": "center",
  })
  let subTitle = css({"fontSize": 18, "marginBottom": 10, "textAlign": "center"})
  let list = css({
    "display": "flex",
    "flexDirection": "row",
    "alignItems": "center",
    "justifyContent": "center",
  })
}

@react.component
let make = () =>
  <WidthContainer>
    <div className=Styles.container>
      <div className=Styles.title role="heading" ariaLevel=2> {"Ne rien rater"->React.string} </div>
      <div className=Styles.subTitle role="heading" ariaLevel=3>
        {`Sur les réseaux`->React.string}
      </div>
      <div className=Styles.list>
        <a href="https://twitter.com/PutainDeCode">
          <img src="/public/images/website/twitter.svg" width="48" height="48" alt="Twitter" />
        </a>
        <Spacer />
        <a href="https://facebook.com/putaindecode">
          <img src="/public/images/website/facebook.svg" width="48" height="48" alt="Facebook" />
        </a>
        <Spacer />
        <a href="https://github.com/putaindecode">
          <img src="/public/images/website/github.svg" width="48" height="48" alt="Facebook" />
        </a>
        <Spacer />
        <a href="https://itunes.apple.com/fr/podcast/putain-de-code-!/id1185311825">
          <img
            src="/public/images/website/apple-podcast.svg"
            width="48"
            height="48"
            alt="Apple Podcast"
          />
        </a>
        <Spacer />
        <a href="https://soundcloud.com/putaindecode">
          <img
            src="/public/images/website/soundcloud.svg" width="48" height="48" alt="Soundcloud"
          />
        </a>
      </div>
      <div className=Styles.subTitle role="heading" ariaLevel=3>
        {`Sur le chat`->React.string}
      </div>
      <div className=Styles.list>
        <a href="https://discord.gg/jtbGNNc">
          <img src="/public/images/website/discord.svg" width="48" height="48" alt="Discord" />
        </a>
      </div>
    </div>
  </WidthContainer>
