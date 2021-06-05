module Styles = {
  open Emotion
  let container = css({
    "backgroundColor": Theme.pageAccentedBackgroundColor,
    "display": "flex",
    "flexDirection": "column",
    "flexGrow": 1.0,
  })
  let heading = css({
    "display": "flex",
    "flexDirection": "row",
    "justifyContent": "space-between",
    "alignItems": "center",
  })
  let search = css({
    "fontSize": 36,
    "flexGrow": 1.0,
    "width": 1,
    "maxWidth": 300,
    "backgroundColor": "transparent",
    "margin": 0,
    "borderWidth": 0,
    "textAlign": "right",
    "borderRadius": 30,
    "padding": "10px 30px",
    "color": "inherit",
    ":focus": {"outline": "none", "backgroundColor": Theme.halfPercentContrastColor},
    "@media (max-width: 720px)": {"fontSize": 20},
  })
  let mainTitle = css({
    "fontSize": 48,
    "fontWeight": "800",
    "marginTop": 20,
    "marginBottom": 20,
    "@media (max-width: 720px)": {"textAlign": "center"},
  })
  let links = css({
    "display": "flex",
    "flexDirection": "row",
    "alignItems": "stretch",
    "flexWrap": "wrap",
  })
  let linkContainer = css({
    "width": "33.3333%",
    "minWidth": 260,
    "flexGrow": 1.0,
    "display": "flex",
    "flexDirection": "column",
    "padding": 10,
  })
  let hiddenLinkContainer = cx([linkContainer, css({"display": "none"})])

  let article = css({
    "position": "relative",
    "display": "block",
    "overflow": "hidden",
    "backgroundColor": "#F1F6FC",
    "borderRadius": 14,
    "paddingBottom": {
      let ratio = 9. /. 16. *. 100.
      `${ratio->Float.toString}%`
    },
    "boxShadow": "0 15px 15px -5px rgba(0, 0, 0, 0.2)",
    ":active": {
      "::before": {
        "content": `""`,
        "position": "absolute",
        "pointerEvents": "none",
        "top": 0,
        "left": 0,
        "right": 0,
        "bottom": 0,
        "backgroundColor": "rgba(0, 0, 0, 0.3)",
      },
    },
  })
  let title = css({
    "color": "#fff",
    "fontSize": 18,
    "fontWeight": "800",
    "textAlign": "center",
    "padding": 20,
    "paddingTop": 30,
  })
  let discover = css({
    "display": "flex",
    "alignItems": "center",
    "justifyContent": "center",
    "textAlign": "center",
    "padding": 20,
  })
  let discoverLink = css({"fontSize": 20, "textDecoration": "none", "color": "#1E49B5"})
  let authorSmall = css({"position": "absolute", "top": 10, "left": 10})
  let contents = css({
    "position": "absolute",
    "top": 0,
    "left": 0,
    "right": 0,
    "bottom": 0,
    "display": "flex",
    "flexDirection": "column",
    "alignItems": "center",
    "justifyContent": "center",
  })
  let author = css({
    "fontSize": 16,
    "color": "#fff",
    "display": "flex",
    "flexDirection": "row",
    "alignItems": "center",
  })
  let avatar = css({
    "width": 32,
    "height": 32,
    "borderRadius": "100%",
    "marginRight": 10,
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
  let queryString = search->Option.map(QueryString.decode)->Option.getWithDefault(Dict.empty())
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
            ->Dict.get("search")
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
            value={queryString->Dict.get("search")->Option.getWithDefault("")}
            onChange={event => {
              let search = (event->ReactEvent.Form.target)["value"]
              let nextQueryString = queryString->Dict.copy
              if search === "" {
                nextQueryString->Dict.delete("search")
              } else {
                nextQueryString->Dict.set("search", search)
              }
              RescriptReactRouter.push("?" ++ nextQueryString->QueryString.encode)
            }}
          />
        </div>
        <div className=Styles.links>
          {postList
          ->Array.map(article => {
            let author =
              article.meta
              ->Dict.get("author")
              ->Option.flatMap(x =>
                switch x->JSON.Decode.classify {
                | String(x) => Some(x)
                | _ => None
                }
              )
              ->Option.getWithDefault("putaindecode")
            <div
              key=article.slug
              className={queryString
              ->Dict.get("search")
              ->Option.map(String.trim)
              ->Option.map(String.toLowerCase)
              ->Option.map(search =>
                article.title->String.toLowerCase->String.includes(search) ||
                  author->String.toLowerCase->String.includes(search)
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
                          {`•`->React.string} {" "->React.string} <DateView date />
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
