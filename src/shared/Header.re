let component = ReasonReact.statelessComponent("Header");

module Styles = {
  open Css;
  let container =
    style([
      backgroundColor(Theme.gradientRedBottom->hex),
      backgroundImage(
        linearGradient(
          180->deg,
          [
            (0, Theme.gradientRedTop->hex),
            (100, Theme.gradientRedBottom->hex),
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
      color(rgba(255, 255, 255, 0.8)),
      textAlign(center),
    ]);
};

[@react.component]
let make = (~url: ReasonReact.Router.url, ~gradient=?, ()) =>
  ReactCompat.useRecordApi({
    ...component,
    render: _ =>
      <header
        className=Styles.container
        style={ReactDOMRe.Style.make(~backgroundImage=?gradient, ())}>
        <WidthContainer>
          <div className=Styles.contents>
            <Link href="/" className=Styles.logo>
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
            </Link>
          </div>
        </WidthContainer>
      </header>,
  });
