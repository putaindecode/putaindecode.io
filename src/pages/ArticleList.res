open Belt

module Styles = {
  open Css
  let container = style(list{
    backgroundColor(Theme.lightBody->hex),
    media("(prefers-color-scheme: dark)", list{backgroundColor("111"->hex)}),
    display(flexBox),
    flexDirection(column),
    flexGrow(1.0),
  })
  let heading = style(list{
    display(flexBox),
    flexDirection(row),
    justifyContent(spaceBetween),
    alignItems(center),
  })
  let search = style(list{
    fontSize(36->px),
    flexGrow(1.0),
    width(1->px),
    maxWidth(300->px),
    backgroundColor(transparent),
    padding(zero),
    margin(zero),
    borderWidth(zero),
    textAlign(#right),
    borderRadius(30->px),
    padding2(~v=10->px, ~h=30->px),
    focus(list{outlineStyle(none), backgroundColor(rgba(0, 0, 0, #num(0.05)))}),
    media("(max-width: 720px)", list{fontSize(20->px)}),
    media("(prefers-color-scheme: dark)", list{color("ddd"->hex)}),
  })
  let mainTitle = style(list{
    fontSize(48->px),
    fontWeight(extraBold),
    marginTop(20->px),
    marginBottom(20->px),
    media("(max-width: 720px)", list{textAlign(center)}),
  })
  let links = style(list{display(flexBox), flexDirection(row), alignItems(stretch), flexWrap(wrap)})
  let linkContainer = style(list{
    width(33.3333->pct),
    minWidth(260->px),
    flexGrow(1.0),
    display(flexBox),
    flexDirection(column),
    padding(10->px),
  })
  let hiddenLinkContainer = merge(list{linkContainer, style(list{display(none)})})

  let article = style(list{
    position(relative),
    display(block),
    overflow(hidden),
    backgroundColor("F1F6FC"->hex),
    borderRadius(14->px),
    paddingBottom((9. /. 16. *. 100.)->pct),
    boxShadow(Shadow.box(~y=15->px, ~blur=15->px, ~spread=-5->px, rgba(0, 0, 0, #num(0.2)))),
    active(list{
      after(list{
        unsafe("content", ""),
        position(absolute),
        pointerEvents(none),
        top(zero),
        left(zero),
        right(zero),
        bottom(zero),
        backgroundColor(rgba(0, 0, 0, #num(0.1))),
      }),
    }),
  })
  let title = style(list{
    color("fff"->hex),
    fontSize(18->px),
    fontWeight(extraBold),
    textAlign(center),
    padding(20->px),
    paddingTop(30->px),
  })
  let discover = style(list{
    display(flexBox),
    alignItems(center),
    justifyContent(center),
    textAlign(center),
    padding(20->px),
  })
  let discoverLink = style(list{fontSize(20->px), textDecoration(none), color("1E49B5"->hex)})
  let authorSmall = style(list{position(absolute), top(10->px), left(10->px)})
  let contents = style(list{
    position(absolute),
    top(zero),
    left(zero),
    right(zero),
    bottom(zero),
    display(flexBox),
    flexDirection(column),
    alignItems(center),
    justifyContent(center),
  })
  let author = style(list{
    fontSize(16->px),
    color("fff"->hex),
    display(flexBox),
    flexDirection(row),
    alignItems(center),
  })
  let avatar = style(list{
    width(32->px),
    height(32->px),
    borderRadius(100.->pct),
    marginRight(10->px),
  })
}

@react.component
let make = (~search as propsSearch) => {
  let postList = Pages.useCollection("articles")
  let (search, setSearch) = React.useState(() => None)
  React.useEffect1(() => {
    setSearch(_ => Some(propsSearch))
    None
  }, [propsSearch])
  let queryString = search->Option.map(QueryString.explode)->Option.getWithDefault(Map.String.empty)
  <div className=Styles.container>
    {switch postList {
    | NotAsked
    | Loading =>
      <PageLoadingIndicator />
    | Done(Ok({items: postList})) =>
      <WidthContainer>
        <Pages.Head>
          <title>
            {(queryString
            ->Map.String.get("search")
            ->Option.map(search => "Articles avec " ++ search)
            ->Option.getWithDefault("Articles") ++ " | Putain de code")->React.string}
          </title>
        </Pages.Head>
        <div className=Styles.heading>
          <div role="heading" ariaLevel=1 className=Styles.mainTitle>
            {"Articles"->React.string}
          </div>
          <input
            className=Styles.search
            placeholder=`Rechercher …`
            type_="text"
            value={queryString->Map.String.get("search")->Option.getWithDefault("")}
            onChange={event => {
              let search = (event->ReactEvent.Form.target)["value"]
              RescriptReactRouter.push(
                "?" ++
                (
                  search == ""
                    ? queryString->Map.String.remove("search")
                    : queryString->Map.String.set("search", search)
                )->QueryString.implode,
              )
            }}
          />
        </div>
        <div className=Styles.links>
          {postList
          ->Array.map(article => {
            let author =
              article.meta
              ->Js.Dict.get("author")
              ->Option.flatMap(Js.Json.decodeString)
              ->Option.getWithDefault("putaindecode")
            <div
              key=article.slug
              className={queryString
              ->Map.String.get("search")
              ->Option.map(Js.String.trim)
              ->Option.map(Js.String.toLowerCase)
              ->Option.map(search =>
                article.title->Js.String.toLowerCase->Js.String.includes(search, _) ||
                  author->Js.String.toLowerCase->Js.String.includes(search, _)
              )
              ->Option.getWithDefault(true)
                ? Styles.linkContainer
                : Styles.hiddenLinkContainer}>
              <Pages.Link
                href={"/articles/" ++ article.slug}
                className=Styles.article
                style={ReactDOM.Style.make(~backgroundImage=Gradient.fromString(article.slug), ())}>
                <div className=Styles.contents>
                  <div className=Styles.authorSmall>
                    <div className=Styles.author>
                      <img
                        className=Styles.avatar
                        src={"https://avatars.githubusercontent.com/" ++ (author ++ "?size=64")}
                        alt=author
                      />
                      <div>
                        {author->React.string}
                        {" "->React.string}
                        {article.date
                        ->Option.map(date => <>
                          {j`•`->React.string} {" "->React.string} <Date date />
                        </>)
                        ->Option.getWithDefault(React.null)}
                      </div>
                    </div>
                  </div>
                  <div className=Styles.title> {article.title->React.string} </div>
                </div>
              </Pages.Link>
            </div>
          })
          ->React.array}
        </div>
      </WidthContainer>
    | Done(Error(_)) => <ErrorPage />
    }}
  </div>
}
