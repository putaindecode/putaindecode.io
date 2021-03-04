open Belt

module TopArticles = {
  module Styles = {
    open Css

    let topArticle = style(list{
      display(block),
      position(relative),
      margin(10->px),
      backgroundColor("F1F6FC"->hex),
      borderRadius(14->px),
      paddingBottom((5. /. 16. *. 100.)->pct),
      boxShadow(Shadow.box(~y=15->px, ~blur=15->px, ~spread=-5->px, rgba(0, 0, 0, #num(0.2)))),
      textDecoration(none),
      overflow(hidden),
      active(list{
        after(list{
          unsafe("content", ""),
          pointerEvents(none),
          position(absolute),
          top(zero),
          left(zero),
          right(zero),
          bottom(zero),
          backgroundColor(rgba(0, 0, 0, #num(0.1))),
        }),
      }),
      media("(max-width: 720px)", list{paddingBottom((9. /. 16. *. 100.)->pct)}),
    })
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
    let bigTitle = style(list{
      color("fff"->hex),
      fontSize(32->px),
      fontWeight(extraBold),
      textAlign(center),
      padding(20->px),
      paddingTop(zero),
      media("(max-width: 720px)", list{fontSize(18->px)}),
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
    let sub = style(list{
      display(flexBox),
      flexDirection(row),
      alignItems(stretch),
      flexWrap(wrap),
      justifyContent(spaceBetween),
      position(relative),
      zIndex(1),
      overflowX(auto),
      unsafe("WebkitOverflowScrolling", "touch"),
      unsafe("scrollSnapType", "x mandatory"),
      width(100.->pct),
      maxWidth(1024->px),
      margin2(~h=auto, ~v=zero),
      unsafe("paddingLeft", "calc(10px + env(safe-area-inset-left))"),
      unsafe("paddingRight", "calc(10px + env(safe-area-inset-right))"),
      paddingBottom(10->px),
      media("(max-width: 920px)", list{flexWrap(nowrap)}),
    })
    let articleContainer = style(list{
      unsafe("scrollSnapAlign", "center"),
      flexBasis(33.333->pct),
      minWidth(300->px),
      padding(10->px),
    })
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
            ->Js.Dict.get("author")
            ->Option.flatMap(Js.Json.decodeString)
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
                    {j`•`->React.string} {" "->React.string} <Date date />
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
        ->Array.slice(~offset=1, ~len=6)
        ->Array.map(article => {
          let author =
            article.meta
            ->Js.Dict.get("author")
            ->Option.flatMap(Js.Json.decodeString)
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
      <div className=Styles.discover>
        <Pages.Link href="/articles" className=Styles.discoverLink>
          {j`Découvrir les $totalCount articles →`->React.string}
        </Pages.Link>
      </div>
    </div>
}

module LatestPodcasts = {
  module Styles = {
    open Css
    let container = style(list{
      backgroundColor(Theme.lightBody->hex),
      media("(prefers-color-scheme: dark)", list{backgroundColor("111"->hex)}),
    })
    let contents = style(list{
      display(flexBox),
      flexDirection(row),
      alignItems(flexStart),
      paddingTop(20->px),
      paddingBottom(20->px),
      media("(max-width: 720px)", list{flexDirection(column), alignItems(stretch)}),
    })
    let leftCol = style(list{
      flexBasis(150->px),
      flexShrink(0.0),
      padding(10->px),
      media("(max-width: 720px)", list{paddingBottom(zero), alignSelf(center)}),
    })
    let mainCol = style(list{
      flexGrow(1.0),
      padding(10->px),
      media("(max-width: 720px)", list{paddingTop(zero)}),
    })
    let title = style(list{
      fontSize(48->px),
      fontWeight(extraBold),
      marginBottom(20->px),
      media("(max-width: 720px)", list{textAlign(center)}),
    })
    let podcast = style(list{
      marginBottom(10->px),
      backgroundColor("fff"->hex),
      borderRadius(10->px),
      padding(20->px),
      display(block),
      textDecoration(none),
      color(Theme.darkBody->hex),
      media("(prefers-color-scheme: dark)", list{backgroundColor("222"->hex), color("ddd"->hex)}),
      width(100.->pct),
      position(relative),
      overflow(hidden),
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
          backgroundColor(rgba(255, 255, 255, #num(0.5))),
        }),
      }),
    })
    let podcastTitle = style(list{fontSize(18->px), fontWeight(extraBold), marginBottom(10->px)})
    let avatar = style(list{
      width(32->px),
      height(32->px),
      borderRadius(100.->pct),
      marginRight(10->px),
    })
    let discover = style(list{
      display(flexBox),
      alignItems(center),
      justifyContent(center),
      textAlign(center),
      padding(20->px),
    })
    let discoverLink = style(list{fontSize(20->px), textDecoration(none), color("1E49B5"->hex)})
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
            ->Array.slice(~offset=0, ~len=3)
            ->Array.map(podcast =>
              <Pages.Link
                key=podcast.slug href={"/podcasts/" ++ podcast.slug} className=Styles.podcast>
                <div className=Styles.podcastTitle> {podcast.title->React.string} </div>
                {podcast.meta
                ->Js.Dict.get("participants")
                ->Option.flatMap(Js.Json.decodeArray)
                ->Option.map(array => array->Array.keepMap(Js.Json.decodeString))
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
                {j`Découvrir les $totalCount épisodes →`->React.string}
              </Pages.Link>
            </div>
          </div>
        </div>
      </WidthContainer>
    </div>
}

module Styles = {
  open Css
  let topArticles = style(list{position(relative), top(-30->px)})
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
          podcasts={latestPodcasts->Array.slice(~offset=0, ~len=3)} totalCount=podcastTotalCount
        />
      </>
    }}
  </>
}
