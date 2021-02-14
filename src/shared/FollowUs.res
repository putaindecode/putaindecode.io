module Styles = {
  open Css
  let container = style(list{
    marginTop(20->px),
    marginBottom(20->px),
    backgroundColor(Theme.lightBody->hex),
    media("(prefers-color-scheme: dark)", list{backgroundColor("111"->hex)}),
    borderRadius(10->px),
    padding(20->px),
  })
  let title = style(list{
    fontSize(32->px),
    fontWeight(extraBold),
    marginBottom(20->px),
    textAlign(center),
  })
  let subTitle = style(list{fontSize(18->px), marginBottom(10->px), textAlign(center)})
  let list = style(list{
    display(flexBox),
    flexDirection(row),
    alignItems(center),
    justifyContent(center),
  })
}

@react.component
let make = () =>
  <WidthContainer>
    <div className=Styles.container>
      <div className=Styles.title role="heading" ariaLevel=2> {"Ne rien rater"->React.string} </div>
      <div className=Styles.subTitle role="heading" ariaLevel=3>
        {j`Sur les réseaux`->React.string}
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
        {j`Sur le chat`->React.string}
      </div>
      <div className=Styles.list>
        <a href="https://discord.gg/jtbGNNc">
          <img src="/public/images/website/discord.svg" width="48" height="48" alt="Discord" />
        </a>
      </div>
    </div>
  </WidthContainer>
