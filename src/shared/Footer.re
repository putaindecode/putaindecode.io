let component = React.statelessComponent("Footer");

module Styles = {
  open Css;
  let footer =
    style([backgroundColor("222"->hex), padding2(~v=20->px, ~h=zero)]);
  let container = style([position(relative)]);
  let rss =
    style([
      position(absolute),
      left(zero),
      top(zero),
      color("fff"->hex),
      textDecoration(none),
      display(flexBox),
      flexDirection(row),
      alignItems(center),
    ]);
  let text = style([media("(max-width: 400px)", [display(none)])]);
  let icon = style([marginRight(10->px)]);
  let copyright =
    style([
      color(rgba(255, 255, 255, 0.5)),
      textAlign(center),
      fontSize(14->px),
    ]);
};

let make = _ => {
  ...component,
  render: _ =>
    <footer className=Styles.footer>
      <WidthContainer>
        <div className=Styles.container>
          <a href="/feed.xml" className=Styles.rss>
            <img
              src="/public/images/website/rss-feed.svg"
              alt="Flux RSS"
              width="16"
              height="16"
              className=Styles.icon
            />
            <div className=Styles.text> "Flux RSS"->React.string </div>
          </a>
          <div className=Styles.copyright>
            {j|© 2019 Putain de code !|j}->React.string
          </div>
        </div>
      </WidthContainer>
    </footer>,
};
