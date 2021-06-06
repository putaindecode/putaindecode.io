module Styles = {
  open Emotion
  let appearAnimation = keyframes({
    "from": {"opacity": 0.0, "transform": "translateY(20px)"},
  })
  let root = css({
    "backgroundColor": Theme.pageSlightlyAccentedBackgroundColor,
    "display": "flex",
    "flexDirection": "column",
    "flexGrow": 1.0,
  })
  let container = css({"animation": `500ms ease-out ${appearAnimation}`})
  let title = css({
    "fontSize": 42,
    "fontWeight": "800",
    "textAlign": "center",
    "paddingTop": 40,
    "lineHeight": 1.2,
    "margin": 0,
  })
  let author = css({
    "fontSize": 16,
    "display": "flex",
    "flexDirection": "row",
    "alignItems": "center",
    "justifyContent": "center",
    "paddingTop": 10,
    "paddingBottom": 40,
    "color": Theme.pageTextColor,
    "textDecoration": "none",
  })
  let avatar = css({
    "width": 32,
    "height": 32,
    "borderRadius": "100%",
    "marginRight": 10,
  })
  let body = css({
    "maxWidth": 640,
    "width": "100%",
    "fontSize": 18,
    "margin": "0 auto",
    "lineHeight": 1.7,
    "h2, h3, h4, h5, h6": {
      "fontFamily": Theme.defaultTextFontFamily,
      "fontWeight": "800",
      "lineHeight": 1.2,
    },
    "img": {"maxWidth": "100%", "backgroundColor": "rgba(255, 255, 255, 0.75)"},
    "code": {
      "fontSize": "0.9em",
      "fontFamily": Theme.codeFontFamily,
      "lineHeight": 1.0,
      "backgroundColor": Theme.codeBackgroundColor,
      "margin": "0 0.2em",
    },
    "pre": {
      "padding": 10,
      "overflowX": "auto",
      "fontSize": 14,
      "borderRadius": 10,
      "border": `2px solid ${Theme.onePercentContrastColor}`,
      "WebkitOverflowScrolling": "touch",
      "code": {"fontSize": 14, "backgroundColor": "transparent", "margin": 0},
    },
    "blockquote": {
      "paddingLeft": 20,
      "margin": 0,
      "fontSize": 16,
      "borderLeft": `3px solid ${Theme.onePercentContrastColor}`,
      "fontStyle": "italic",
    },
    "table": {"width": "100%", "textAlign": "center"},
    "figure": {"padding": "20px 0"},
    "figcaption": {"textAlign": "center"},
    "a": {"wordWrap": "break-word"},
    "table thead th": {
      "backgroundColor": Theme.pageAccentedBackgroundColor,
      "padding": "10px 0",
    },
  })
  let share = css({
    "maxWidth": 640,
    "width": "100%",
    "display": "flex",
    "flexDirection": "row",
    "alignItems": "center",
    "justifyContent": "space-between",
    "margin": "20px auto",
    "padding": 20,
    "backgroundColor": Theme.pageBackgroundColor,
    "borderRadius": 10,
    "boxShadow": "0 15px 15px -5px rgba(0, 0, 0, 0.2)",
    "@media (max-width: 540px)": {"flexDirection": "column"},
  })
  let shareTitle = css({"fontWeight": "800"})
  let shareButton = css({
    "backgroundColor": "#00aced",
    "color": "#fff",
    "padding": "10px 20px",
    "textDecoration": "none",
    "borderRadius": 5,
    "fontWeight": "800",
    ":active": {"opacity": 0.5},
  })
  let back = css({
    "display": "flex",
    "alignItems": "center",
    "justifyContent": "center",
    "textAlign": "center",
    "padding": 20,
  })
  let backLink = css({"fontSize": 20, "textDecoration": "none", "color": "#1E49B5"})
}

let externalLinkRe = %re("/^https?:\\/\\//")

let stopDisqusStartDate = Date.UTC.makeWithYM(~year=2020, ~month=0)

@val external document: {..} = "document"

@react.component
let make = (~slug, ~hash, ~canonical) => {
  let post = Pages.useItem("articles", ~id=slug)

  React.useEffect1(() => {
    switch hash {
    | "" => ()
    | hash =>
      switch document["querySelector"](. `#${hash}`)->Nullable.toOption {
      | Some(element) =>
        let _ = setTimeout(() => {
          element["scrollIntoView"](.)
        }, 100)
      | None => ()
      }
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
        ->Dict.get("author")
        ->Option.flatMap(x =>
          switch x->JSON.Decode.classify {
          | String(x) => Some(x)
          | _ => None
          }
        )
        ->Option.getWithDefault("putaindecode")
      <div className=Styles.container>
        <Pages.Head>
          <title> {(post.title ++ " | Putain de code")->React.string} </title>
          <meta property="og:title" content={post.title ++ " | Putain de code"} />
          <meta name="twitter:title" content={post.title ++ " | Putain de code"} />
        </Pages.Head>
        <WidthContainer>
          <h1 className=Styles.title> {post.title->React.string} </h1>
          <a href={"https://github.com/" ++ author} className=Styles.author>
            <img
              className=Styles.avatar
              src={"https://avatars.githubusercontent.com/" ++ (author ++ "?size=64")}
              alt=author
            />
            <div>
              {author->React.string}
              {" "->React.string}
              {post.date
              ->Option.map(date => <>
                {`•`->React.string} {" "->React.string} <DateView date />
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
                  if !(externalLinkRe->RegExp.test(href)) {
                    ReactEvent.Mouse.preventDefault(event)
                    RescriptReactRouter.push(href)
                  }
                | _ => ()
                }
              }}
            className=Styles.body
          />
          <div className=Styles.share>
            <div className=Styles.shareTitle> {`Vous avez aimé cet article?`->React.string} </div>
            <Spacer height=10 width=0 />
            <a
              className=Styles.shareButton
              onClick={event => {
                event->ReactEvent.Mouse.preventDefault
                window["open"](.
                  (event->ReactEvent.Mouse.target)["href"],
                  "",
                  "width=500,height=400",
                )->ignore
              }}
              target="_blank"
              href={"https://www.twitter.com/intent/tweet?text=" ++
              encodeURIComponent(
                post.title ++ (" sur @PutainDeCode https://putaindecode.io/articles/" ++ post.slug),
              )}>
              {"Le partager sur Twitter"->React.string}
            </a>
          </div>
          <div className=Styles.back>
            <Pages.Link href="/articles" className=Styles.backLink>
              {`← Articles`->React.string}
            </Pages.Link>
          </div>
          {post.date
          ->Option.flatMap(date =>
            Date.fromString(date)->Date.getTime >= stopDisqusStartDate
              ? None
              : Some(
                  <Disqus
                    url={post.meta
                    ->Dict.get("oldSlug")
                    ->Option.flatMap(x =>
                      switch x->JSON.Decode.classify {
                      | String(x) => Some(x)
                      | _ => None
                      }
                    )
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
