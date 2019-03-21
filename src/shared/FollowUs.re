let component = React.statelessComponent("FollowUs");

module Styles = {
  open Css;
  let container =
    style([
      marginTop(20->px),
      marginBottom(20->px),
      backgroundColor(Theme.lightBody->hex),
      borderRadius(10->px),
      padding(20->px),
    ]);
  let title =
    style([
      fontSize(32->px),
      fontWeight(extraBold),
      marginBottom(20->px),
      textAlign(center),
    ]);
  let subTitle =
    style([fontSize(18->px), marginBottom(10->px), textAlign(center)]);
  let list =
    style([
      display(flexBox),
      flexDirection(row),
      alignItems(center),
      justifyContent(center),
    ]);
};

let make = _ => {
  ...component,
  render: _ =>
    <WidthContainer>
      <div className=Styles.container>
        <div className=Styles.title role="heading" ariaLevel=2>
          "Ne rien rater"->React.string
        </div>
        <div className=Styles.subTitle role="heading" ariaLevel=3>
          {j|Sur les réseaux|j}->React.string
        </div>
        <div className=Styles.list>
          <Link href="https://twitter.com/PutainDeCode">
            <img
              src="/images/website/twitter.svg"
              width="48"
              height="48"
              alt="Twitter"
            />
          </Link>
          <Spacer />
          <Link href="https://facebook.com/putaindecode">
            <img
              src="/images/website/facebook.svg"
              width="48"
              height="48"
              alt="Facebook"
            />
          </Link>
          <Spacer />
          <Link href="https://github.com/putaindecode">
            <img
              src="/images/website/github.svg"
              width="48"
              height="48"
              alt="Facebook"
            />
          </Link>
          <Spacer />
          <Link
            href="https://itunes.apple.com/fr/podcast/putain-de-code-!/id1185311825">
            <img
              src="/images/website/apple-podcast.svg"
              width="48"
              height="48"
              alt="Apple Podcast"
            />
          </Link>
          <Spacer />
          <Link href="https://soundcloud.com/putaindecode">
            <img
              src="/images/website/soundcloud.svg"
              width="48"
              height="48"
              alt="Soundcloud"
            />
          </Link>
        </div>
        <div className=Styles.subTitle role="heading" ariaLevel=3>
          {j|Sur le chat|j}->React.string
        </div>
        <div className=Styles.list>
          <Link href="https://discord.gg/jtbGNNc">
            <img
              src="/images/website/discord.svg"
              width="48"
              height="48"
              alt="Discord"
            />
          </Link>
        </div>
      </div>
    </WidthContainer>,
};
