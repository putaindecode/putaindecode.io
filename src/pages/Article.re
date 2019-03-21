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
      lineHeight(`abs(1.2)),
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
        [
          fontFamily(Theme.defaultTextFontFamily),
          fontWeight(extraBold),
          lineHeight(`abs(1.2)),
        ],
      ),
      selector("img", [maxWidth(100.->pct)]),
      selector(
        "code",
        [
          fontSize(0.9->em),
          fontFamily(Theme.codeFontFamily),
          lineHeight(`abs(1.)),
          backgroundColor("FAF3E1"->hex),
          margin2(~h=0.2->em, ~v=zero),
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
          selector(
            "code",
            [fontSize(14->px), backgroundColor(transparent), margin(zero)],
          ),
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
      selector("a", [wordBreak(breakAll)]),
      selector(
        "table thead th",
        [
          backgroundColor(Theme.lightBody->hex),
          padding2(~v=10->px, ~h=zero),
        ],
      ),
    ]);
  let share =
    style([
      maxWidth(640->px),
      width(100.->pct),
      display(flexBox),
      flexDirection(row),
      alignItems(center),
      justifyContent(spaceBetween),
      margin2(~h=auto, ~v=20->px),
      padding(20->px),
      backgroundColor("fff"->hex),
      borderRadius(10->px),
      boxShadow(
        ~y=15->px,
        ~blur=15->px,
        ~spread=(-5)->px,
        rgba(0, 0, 0, 0.2),
      ),
      media("(max-width: 540px)", [flexDirection(column)]),
    ]);
  let shareTitle = style([fontWeight(extraBold)]);
  let shareButton =
    style([
      backgroundColor("00aced"->hex),
      color("fff"->hex),
      padding2(~h=20->px, ~v=10->px),
      textDecoration(none),
      borderRadius(5->px),
      fontWeight(extraBold),
      active([opacity(0.5)]),
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
    style([fontSize(20->px), textDecoration(none), color("1E49B5"->hex)]);
};

let externalLinkRe = [%re "/^https?:\\/\\//"];

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
                     "https://avatars.githubusercontent.com/"
                     ++ post.author
                     ++ "?size=64"
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
                 onClick={event =>
                   if (event->ReactEvent.Mouse.target##nodeName == "A") {
                     switch (
                       ReactEvent.Mouse.metaKey(event),
                       ReactEvent.Mouse.ctrlKey(event),
                     ) {
                     | (false, false) =>
                       let href =
                         event->ReactEvent.Mouse.target##getAttribute("href");
                       if (!externalLinkRe->Js.Re.test_(href)) {
                         ReactEvent.Mouse.preventDefault(event);
                         React.Router.push(href);
                       };
                     | _ => ()
                     };
                   }
                 }
                 className=Styles.body
               />
               <div className=Styles.share>
                 <div className=Styles.shareTitle>
                   {j|Vous avez aimé cet article?|j}->React.string
                 </div>
                 <Spacer height=10 width=0 />
                 <a
                   className=Styles.shareButton
                   onClick={event => {
                     event->ReactEvent.Mouse.preventDefault;
                     Webapi.Dom.(
                       window
                       ->Window.open_(
                           ~url=event->ReactEvent.Mouse.target##href,
                           ~name="",
                           ~features="width=500,height=400",
                         )
                       ->ignore
                     );
                   }}
                   target="_blank"
                   href={
                     "https://www.twitter.com/intent/tweet?text="
                     ++ Js.Global.encodeURIComponent(
                          post.title
                          ++ " sur @PutainDeCode https://putaindecode.io/articles/"
                          ++ post.slug,
                        )
                   }>
                   "Le partager sur Twitter"->React.string
                 </a>
               </div>
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
