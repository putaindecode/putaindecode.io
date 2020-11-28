module Styles = {
  open Css;
  let container =
    style([
      backgroundColor(Theme.gradientRedBottom->hex),
      backgroundImage(
        linearGradient(
          135.0->deg,
          [
            (0.0->pct, Theme.gradientRedTop->hex),
            (100.0->pct, Theme.gradientRedBottom->hex),
          ],
        ),
      ),
    ]);
  let contents =
    style([
      display(flexBox),
      flexDirection(column),
      alignItems(center),
      justifyContent(center),
      padding3(~top=20->px, ~h=zero, ~bottom=50->px),
    ]);
  let logo =
    style([
      display(flexBox),
      flexDirection(column),
      alignItems(center),
      textDecoration(none),
    ]);
  let name =
    style([
      display(flexBox),
      flexDirection(row),
      alignItems(center),
      textDecoration(none),
      paddingBottom(10->px),
    ]);
  let title =
    style([fontSize(22->px), color("fff"->hex), fontWeight(extraBold)]);
  let subTitle =
    style([
      fontSize(14->px),
      color(rgba(255, 255, 255, `num(0.8))),
      textAlign(center),
    ]);
  let banner =
    style([
      backgroundColor("000"->hex),
      padding(10->px),
      color("fff"->hex),
      textAlign(`center),
    ]);
  let bannerTitle = style([fontSize(24->px), fontWeight(bold)]);
  let bannerLink = style([fontSize(20->px), color("8CBEF9"->hex)]);
};

[@react.component]
let make = (~url: ReasonReact.Router.url, ~gradient=?, ()) =>
  <>
    <div className=Styles.banner>
      <div role="heading" className=Styles.bannerTitle>
        "Black Lives Matter"->React.string
      </div>
      <div>
        <a
          className=Styles.bannerLink
          href="https://blacklivesmatters.carrd.co/#">
          "Comment aider"->React.string
        </a>
        {j| • |j}->React.string
        <a className=Styles.bannerLink href="https://minnesotafreedomfund.org">
          "Minnesota Freedom Fund"->React.string
        </a>
        {j| • |j}->React.string
        <a
          className=Styles.bannerLink
          href="https://www.okpal.com/adama-traore/#/">
          "Justice Pour Adama"->React.string
        </a>
      </div>
    </div>
    <header
      className=Styles.container
      style={ReactDOMRe.Style.make(~backgroundImage=?gradient, ())}>
      <WidthContainer>
        <div className=Styles.contents>
          <Pages.Link href="/" className=Styles.logo>
            <div className=Styles.name>
              Logo.logo
              <Spacer />
              <div
                className=Styles.title
                role="heading"
                ariaLevel={
                  switch (url.path) {
                  | [] => 1
                  | _ => 2
                  }
                }>
                "Putain de code !"->ReasonReact.string
              </div>
            </div>
            <div className=Styles.subTitle>
              {js|Blog participatif de la communauté dev|js}
              ->ReasonReact.string
            </div>
          </Pages.Link>
        </div>
      </WidthContainer>
    </header>
  </>;
