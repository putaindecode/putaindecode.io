open Belt;

let component = React.statelessComponent("Article");

module Styles = {
  open Css;
  let appearAnimation =
    keyframes([(0, [opacity(0.), transform(translateY(20->px))])]);
  let root =
    style([
      backgroundColor("F9F6F6"->hex),
      display(flexBox),
      flexDirection(column),
      flexGrow(1.0),
    ]);
  let container =
    style([
      animation(~duration=500, ~timingFunction=`easeOut, appearAnimation),
    ]);
  let title =
    style([
      fontSize(42->px),
      fontWeight(extraBold),
      textAlign(center),
      paddingTop(40->px),
    ]);
  let author =
    style([
      fontSize(16->px),
      display(flexBox),
      flexDirection(row),
      alignItems(center),
      justifyContent(center),
      paddingTop(10->px),
      paddingBottom(40->px),
      color(Theme.darkBody->hex),
      textDecoration(none),
    ]);
  let avatar =
    style([
      width(32->px),
      height(32->px),
      borderRadius(100.->pct),
      marginRight(10->px),
    ]);
  let body =
    style([
      fontFamily("Georgia, serif"),
      maxWidth(640->px),
      width(100.->pct),
      fontSize(18->px),
      margin2(~h=auto, ~v=zero),
      lineHeight(`abs(1.7)),
      selector(
        "h2, h3, h4, h5, h6",
        [fontFamily(Theme.defaultTextFontFamily), fontWeight(extraBold)],
      ),
      selector("img", [maxWidth(100.->pct)]),
      selector(
        "code",
        [
          fontSize(14->px),
          fontFamily(Theme.codeFontFamily),
          lineHeight(`abs(1.)),
          backgroundColor("FAF3E1"->hex),
        ],
      ),
      selector(
        "pre",
        [
          padding(10->px),
          overflowX(auto),
          fontSize(14->px),
          borderRadius(10->px),
          border(2->px, `solid, rgba(0, 0, 0, 0.1)),
          `declaration(("WebkitOverflowScrolling", "touch")),
          selector("code", [backgroundColor(transparent)]),
        ],
      ),
      selector(
        "blockquote",
        [
          paddingLeft(20->px),
          margin(zero),
          fontSize(16->px),
          borderLeft(3->px, solid, rgba(0, 0, 0, 0.4)),
          fontStyle(italic),
        ],
      ),
      selector("p", [textAlign(`justify)]),
      selector(".hljs-keyword", [color("DA6BB5"->hex)]),
      selector(".hljs-constructor", [color("DD792B"->hex)]),
      selector(".hljs-identifier", [color("1E9EA7"->hex)]),
      selector(".hljs-module-identifier", [color("C84682"->hex)]),
      selector(".hljs-string", [color("3BA1C8"->hex)]),
      selector(".hljs-comment", [color("aaa"->hex)]),
      selector(".hljs-operator", [color("DA6BB5"->hex)]),
      selector(".hljs-attribute", [color("4CB877"->hex)]),
      selector("table", [width(100.->pct), textAlign(center)]),
      selector("figure", [padding2(~v=20->px, ~h=zero)]),
      selector("figcaption", [textAlign(center)]),
      selector(
        "table thead th",
        [
          backgroundColor(Theme.lightBody->hex),
          padding2(~v=10->px, ~h=zero),
        ],
      ),
    ]);
  let back =
    style([
      display(flexBox),
      alignItems(center),
      justifyContent(center),
      textAlign(center),
      padding(20->px),
    ]);
  let backLink =
    style([fontSize(20->px), textDecoration(none), color("4A90E2"->hex)]);
};

let make =
    (~post: RequestStatus.t(Result.t(Post.t, Errors.t)), ~onLoadRequest, _) => {
  ...component,
  didMount: _ => {
    switch (post) {
    | NotAsked => onLoadRequest()
    | _ => ()
    };
  },
  render: _ =>
    <div className=Styles.root>
      {switch (post) {
       | NotAsked
       | Loading => <PageLoadingIndicator />
       | Done(Ok(post)) =>
         <WithTitle title={post.title}>
           <div className=Styles.container>
             <WidthContainer>
               <div role="heading" ariaLevel=1 className=Styles.title>
                 post.title->React.string
               </div>
               <Link
                 href={"https://github.com/" ++ post.author}
                 className=Styles.author>
                 <img
                   className=Styles.avatar
                   src={
                     "https://avatars.githubusercontent.com/" ++ post.author
                   }
                   alt={post.author}
                 />
                 <div>
                   post.author->React.string
                   " "->React.string
                   {j|•|j}->React.string
                   " "->React.string
                   <Date date={post.date} />
                 </div>
               </Link>
               <div
                 dangerouslySetInnerHTML={"__html": post.body}
                 className=Styles.body
               />
               <div className=Styles.back>
                 <Link href="/articles" className=Styles.backLink>
                   {j|← Articles|j}->React.string
                 </Link>
               </div>
               <Disqus url=?{post.oldSlug} />
             </WidthContainer>
           </div>
         </WithTitle>
       | Done(Error(_)) => <ErrorPage />
       }}
    </div>,
};
