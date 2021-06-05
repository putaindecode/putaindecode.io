module TopArticles = {
  module Styles = {
    open Emotion

    let topArticle = css({
      "display": "block",
      "position": "relative",
      "margin": 10,
      "backgroundColor": "#F1F6FC",
      "borderRadius": 14,
      "paddingBottom": {
        let ratio = 5. /. 16. *. 100.
        `${ratio->Float.toString}%`
      },
      "boxShadow": "0 15px 15px -5px rgba(0, 0, 0, 0.2)",
      "textDecoration": "none",
      "overflow": "hidden",
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
      "@media (max-width: 720px)": {
        "paddingBottom": {
          let ratio = 9. /. 16. *. 100.
          `${ratio->Float.toString}%`
        },
      },
    })
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
    let bigTitle = css({
      "color": "#fff",
      "fontSize": 32,
      "fontWeight": "800",
      "textAlign": "center",
      "padding": 20,
      "paddingTop": 0,
      "@media (max-width: 720px)": {"fontSize": 18},
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
    let sub = css({
      "display": "flex",
      "flexDirection": "row",
      "alignItems": "stretch",
      "flexWrap": "wrap",
      "justifyContent": "space-between",
      "position": "relative",
      "zIndex": 1,
      "overflowX": "auto",
      "WebkitOverflowScrolling": "touch",
      "scrollSnapType": "x mandatory",
      "width": "100%",
      "maxWidth": 1024,
      "margin": "0 auto",
      "paddingLeft": "calc(10px + env(safe-area-inset-left))",
      "paddingRight": "calc(10px + env(safe-area-inset-right))",
      "paddingBottom": 10,
      "@media (max-width: 920px)": {"flexWrap": "nowrap"},
    })
    let articleContainer = css({
      "scrollSnapAlign": "center",
      "flexBasis": "33.333%",
      "minWidth": 300,
      "padding": 10,
    })
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
  }
  @react.component
  let make = (~articles: array<Pages.listItem>, ~totalCount, ()) =>
    <div>
      <Pages.Head> <title> {"Putain de code"->React.string} </title> </Pages.Head>
      <WidthContainer>
        {articles[0]
        ->Option.map(article => {
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
          <Pages.Link
            href={"/articles/" ++ article.slug}
            className=Styles.topArticle
            style={ReactDOM.Style.make(~backgroundImage=Gradient.fromString(article.slug), ())}>
            <div className=Styles.contents>
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
              <div className=Styles.bigTitle> {article.title->React.string} </div>
            </div>
          </Pages.Link>
        })
        ->Option.getWithDefault(React.null)}
      </WidthContainer>
      <div className=Styles.sub>
        {articles
        ->Array.slice(~from=1, ~end=7)
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
          <div key=article.slug className=Styles.articleContainer>
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
      <div className=Styles.discover>
        <Pages.Link href="/articles" className=Styles.discoverLink>
          {`Découvrir les ${totalCount->Int.toString} articles →`->React.string}
        </Pages.Link>
      </div>
    </div>
}

module LatestPodcasts = {
  module Styles = {
    open Emotion
    let container = css({
      "backgroundColor": Theme.pageAccentedBackgroundColor,
    })
    let contents = css({
      "display": "flex",
      "flexDirection": "row",
      "alignItems": "flex-start",
      "paddingTop": 20,
      "paddingBottom": 20,
      "@media (max-width: 720px)": {"flexDirection": "column", "alignItems": "stretch"},
    })
    let leftCol = css({
      "flexBasis": 150,
      "flexShrink": 0,
      "padding": 10,
      "@media (max-width: 720px)": {"paddingBottom": 0, "alignSelf": "center"},
    })
    let mainCol = css({
      "flexGrow": 1.0,
      "padding": 10,
      "@media (max-width: 720px)": {"paddingTop": 0},
    })
    let title = css({
      "fontSize": 48,
      "fontWeight": "800",
      "marginBottom": 20,
      "@media (max-width: 720px)": {"textAlign": "center"},
    })
    let podcast = css({
      "marginBottom": 10,
      "backgroundColor": Theme.pageBackgroundColor,
      "borderRadius": 10,
      "padding": 20,
      "display": "block",
      "textDecoration": "none",
      "color": Theme.pageTextColor,
      "width": "100%",
      "position": "relative",
      "overflow": "hidden",
      "boxShadow": "0 15px 15px -5px rgba(0, 0, 0, 0.2)",
      ":active": {
        "::after": {
          "content": `""`,
          "position": "absolute",
          "pointerEvents": "none",
          "top": 0,
          "left": 0,
          "right": 0,
          "bottom": 0,
          "backgroundColor": "rgba(255, 255, 255, 0.5)",
        },
      },
    })
    let podcastTitle = css({"fontSize": 18, "fontWeight": "800", "marginBottom": 10})
    let avatar = css({
      "width": 32,
      "height": 32,
      "borderRadius": "100%",
      "marginRight": 10,
    })
    let discover = css({
      "display": "flex",
      "alignItems": "center",
      "justifyContent": "center",
      "textAlign": "center",
      "padding": 20,
    })
    let discoverLink = css({"fontSize": 20, "textDecoration": "none", "color": "#1E49B5"})
  }

  @react.component
  let make = (~podcasts: array<Pages.listItem>, ~totalCount, ()) =>
    <div className=Styles.container>
      <WidthContainer>
        <div className=Styles.contents>
          <div className=Styles.leftCol>
            <img width="150" height="150" src="/public/images/website/podcast.svg" alt="" />
          </div>
          <div className=Styles.mainCol>
            <div role="heading" ariaLevel=2 className=Styles.title> {"Podcast"->React.string} </div>
            {podcasts
            ->Array.slice(~from=0, ~end=3)
            ->Array.map(podcast =>
              <Pages.Link
                key=podcast.slug href={"/podcasts/" ++ podcast.slug} className=Styles.podcast>
                <div className=Styles.podcastTitle> {podcast.title->React.string} </div>
                {podcast.meta
                ->Dict.get("participants")
                ->Option.flatMap(x =>
                  switch x->JSON.Decode.classify {
                  | Array(array) => Some(array)
                  | _ => None
                  }
                )
                ->Option.map(array =>
                  array->Belt.Array.keepMap(x =>
                    switch x->JSON.Decode.classify {
                    | String(x) => Some(x)
                    | _ => None
                    }
                  )
                )
                ->Option.getWithDefault([])
                ->Array.map(name =>
                  <img
                    className=Styles.avatar
                    key=name
                    src={"https://avatars.githubusercontent.com/" ++ (name ++ "?size=64")}
                    alt=name
                  />
                )
                ->React.array}
              </Pages.Link>
            )
            ->React.array}
            <div className=Styles.discover>
              <Pages.Link href="/podcasts" className=Styles.discoverLink>
                {`Découvrir les ${totalCount->Int.toString} épisodes →`->React.string}
              </Pages.Link>
            </div>
          </div>
        </div>
      </WidthContainer>
    </div>
}

module Styles = {
  open Emotion
  let topArticles = css({"position": "relative", "top": -30})
}

@react.component
let make = () => {
  let latestPosts = Pages.useCollection("articles", ~page=1)
  let latestPodcasts = Pages.useCollection("podcasts", ~page=1)
  <>
    {switch (latestPosts, latestPodcasts) {
    | (NotAsked, _)
    | (_, NotAsked)
    | (Loading, _)
    | (_, Loading) =>
      <PageLoadingIndicator />
    | (Done(Error(_)), _)
    | (_, Done(Error(_))) =>
      <ErrorPage />
    | (
        Done(Ok({items: latestPosts, totalCount: postTotalCount})),
        Done(Ok({items: latestPodcasts, totalCount: podcastTotalCount})),
      ) => <>
        <div className=Styles.topArticles>
          <TopArticles articles=latestPosts totalCount=postTotalCount />
        </div>
        <LatestPodcasts
          podcasts={latestPodcasts->Array.slice(~from=0, ~end=3)} totalCount=podcastTotalCount
        />
      </>
    }}
  </>
}
