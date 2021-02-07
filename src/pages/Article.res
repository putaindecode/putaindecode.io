open Belt

module Styles = {
  open Css
  let appearAnimation = keyframes(list{(0, list{opacity(0.), transform(translateY(20->px))})})
  let root = style(list{
    backgroundColor("F9F6F6"->hex),
    media("(prefers-color-scheme: dark)", list{backgroundColor("111"->hex)}),
    display(flexBox),
    flexDirection(column),
    flexGrow(1.0),
  })
  let container = style(list{animation(~duration=500, ~timingFunction=#easeOut, appearAnimation)})
  let title = style(list{
    fontSize(42->px),
    fontWeight(extraBold),
    textAlign(center),
    paddingTop(40->px),
    lineHeight(#abs(1.2)),
    margin(zero),
  })
  let author = style(list{
    fontSize(16->px),
    display(flexBox),
    flexDirection(row),
    alignItems(center),
    justifyContent(center),
    paddingTop(10->px),
    paddingBottom(40->px),
    color(Theme.darkBody->hex),
    media("(prefers-color-scheme: dark)", list{color("ccc"->hex)}),
    textDecoration(none),
  })
  let avatar = style(list{
    width(32->px),
    height(32->px),
    borderRadius(100.->pct),
    marginRight(10->px),
  })
  let body = style(list{
    maxWidth(640->px),
    width(100.->pct),
    fontSize(18->px),
    margin2(~h=auto, ~v=zero),
    lineHeight(#abs(1.7)),
    selector(
      "h2, h3, h4, h5, h6",
      list{
        fontFamily(#custom(Theme.defaultTextFontFamily)),
        fontWeight(extraBold),
        lineHeight(#abs(1.2)),
      },
    ),
    selector("img", list{maxWidth(100.->pct), backgroundColor(rgba(255, 255, 255, #num(0.75)))}),
    selector(
      "code",
      list{
        fontSize(0.9->em),
        fontFamily(#custom(Theme.codeFontFamily)),
        lineHeight(#abs(1.)),
        backgroundColor("FAF3E1"->hex),
        media("(prefers-color-scheme: dark)", list{backgroundColor("4F3804"->hex)}),
        margin2(~h=0.2->em, ~v=zero),
      },
    ),
    selector(
      "pre",
      list{
        padding(10->px),
        overflowX(auto),
        fontSize(14->px),
        borderRadius(10->px),
        border(2->px, #solid, rgba(0, 0, 0, #num(0.1))),
        media(
          "(prefers-color-scheme: dark)",
          list{border(2->px, #solid, rgba(255, 255, 255, #num(0.1)))},
        ),
        unsafe("WebkitOverflowScrolling", "touch"),
        selector("code", list{fontSize(14->px), backgroundColor(transparent), margin(zero)}),
      },
    ),
    selector(
      "blockquote",
      list{
        paddingLeft(20->px),
        margin(zero),
        fontSize(16->px),
        borderLeft(3->px, solid, rgba(0, 0, 0, #num(0.4))),
        fontStyle(italic),
      },
    ),
    selector(".hljs-keyword", list{color("DA6BB5"->hex)}),
    selector(".hljs-constructor", list{color("DD792B"->hex)}),
    selector(".hljs-identifier", list{color("1E9EA7"->hex)}),
    selector(".hljs-module-identifier", list{color("C84682"->hex)}),
    selector(".hljs-string", list{color("3BA1C8"->hex)}),
    selector(".hljs-comment", list{color("aaa"->hex)}),
    selector(".hljs-operator", list{color("DA6BB5"->hex)}),
    selector(".hljs-attribute", list{color("4CB877"->hex)}),
    selector("table", list{width(100.->pct), textAlign(center)}),
    selector("figure", list{padding2(~v=20->px, ~h=zero)}),
    selector("figcaption", list{textAlign(center)}),
    selector("a", list{wordWrap(breakWord)}),
    selector(
      "table thead th",
      list{backgroundColor(Theme.lightBody->hex), padding2(~v=10->px, ~h=zero)},
    ),
  })
  let share = style(list{
    maxWidth(640->px),
    width(100.->pct),
    display(flexBox),
    flexDirection(row),
    alignItems(center),
    justifyContent(spaceBetween),
    margin2(~h=auto, ~v=20->px),
    padding(20->px),
    backgroundColor("fff"->hex),
    media("(prefers-color-scheme: dark)", list{backgroundColor("222"->hex)}),
    borderRadius(10->px),
    boxShadow(Shadow.box(~y=15->px, ~blur=15->px, ~spread=-5->px, rgba(0, 0, 0, #num(0.2)))),
    media("(max-width: 540px)", list{flexDirection(column)}),
  })
  let shareTitle = style(list{fontWeight(extraBold)})
  let shareButton = style(list{
    backgroundColor("00aced"->hex),
    color("fff"->hex),
    padding2(~h=20->px, ~v=10->px),
    textDecoration(none),
    borderRadius(5->px),
    fontWeight(extraBold),
    active(list{opacity(0.5)}),
  })
  let back = style(list{
    display(flexBox),
    alignItems(center),
    justifyContent(center),
    textAlign(center),
    padding(20->px),
  })
  let backLink = style(list{fontSize(20->px), textDecoration(none), color("1E49B5"->hex)})
}

let externalLinkRe = %re("/^https?:\\/\\//")

let stopDisqusStartDate = Js.Date.utcWithYM(~year=2020.0, ~month=0.0, ())

@react.component
let make = (~slug, ~hash, ~canonical) => {
  let post = Pages.useItem("articles", ~id=slug)

  React.useEffect1(() => {
    switch hash {
    | "" => ()
    | hash =>
      open Webapi.Dom
      Document.querySelector("#" ++ hash, document)->Option.map(element => {
        Js.Global.setTimeout(() => {
          Element.scrollIntoView(element)
        }, 100)
      })->ignore
    }
    None
  }, [slug])

  <div className=Styles.root>
    {switch post {
    | NotAsked
    | Loading =>
      <PageLoadingIndicator />
    | Done(Ok(post)) =>
      let author =
        post.meta
        ->Js.Dict.get("author")
        ->Option.flatMap(Js.Json.decodeString)
        ->Option.getWithDefault("putaindecode")
      <div className=Styles.container>
        <Pages.Head>
          <title> {(post.title ++ " | Putain de code")->React.string} </title>
        </Pages.Head>
        <WidthContainer>
          <h1 className=Styles.title> {post.title->ReasonReact.string} </h1>
          <a href={"https://github.com/" ++ author} className=Styles.author>
            <img
              className=Styles.avatar
              src={"https://avatars.githubusercontent.com/" ++ (author ++ "?size=64")}
              alt=author
            />
            <div>
              {author->ReasonReact.string}
              {" "->ReasonReact.string}
              {post.date
              ->Option.map(date => <>
                {j`•`->ReasonReact.string} {" "->ReasonReact.string} <Date date />
              </>)
              ->Option.getWithDefault(React.null)}
            </div>
          </a>
          <div
            dangerouslySetInnerHTML={"__html": post.body}
            onClick={event =>
              if (event->ReactEvent.Mouse.target)["nodeName"] == "A" {
                switch (ReactEvent.Mouse.metaKey(event), ReactEvent.Mouse.ctrlKey(event)) {
                | (false, false) =>
                  let href = (event->ReactEvent.Mouse.target)["getAttribute"]("href")
                  if !(externalLinkRe->Js.Re.test_(href)) {
                    ReactEvent.Mouse.preventDefault(event)
                    ReasonReact.Router.push(href)
                  }
                | _ => ()
                }
              }}
            className=Styles.body
          />
          <div className=Styles.share>
            <div className=Styles.shareTitle>
              {j`Vous avez aimé cet article?`->ReasonReact.string}
            </div>
            <Spacer height=10 width=0 />
            <a
              className=Styles.shareButton
              onClick={event => {
                event->ReactEvent.Mouse.preventDefault
                open Webapi.Dom
                window
                ->Window.open_(
                  ~url=(event->ReactEvent.Mouse.target)["href"],
                  ~name="",
                  ~features="width=500,height=400",
                )
                ->ignore
              }}
              target="_blank"
              href={"https://www.twitter.com/intent/tweet?text=" ++
              Js.Global.encodeURIComponent(
                post.title ++ (" sur @PutainDeCode https://putaindecode.io/articles/" ++ post.slug),
              )}>
              {"Le partager sur Twitter"->ReasonReact.string}
            </a>
          </div>
          <div className=Styles.back>
            <Pages.Link href="/articles" className=Styles.backLink>
              {j`← Articles`->ReasonReact.string}
            </Pages.Link>
          </div>
          {post.date
          ->Option.flatMap(date =>
            Js.Date.fromString(date)->Js.Date.getTime >= stopDisqusStartDate
              ? None
              : Some(
                  <Disqus
                    url={post.meta
                    ->Js.Dict.get("oldSlug")
                    ->Option.flatMap(Js.Json.decodeString)
                    ->Option.map(old => "http://putaindecode.io/fr/articles/" ++ (old ++ "/"))
                    ->Option.getWithDefault(canonical)}
                  />,
                )
          )
          ->Option.getWithDefault(React.null)}
        </WidthContainer>
      </div>
    | Done(Error(_)) => <ErrorPage />
    }}
  </div>
}
