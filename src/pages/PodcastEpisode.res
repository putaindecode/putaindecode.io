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
  let container = css({
    "padding": "20px 10px",
    "display": "flex",
    "flexDirection": "row",
    "alignItems": "stretch",
    "flexGrow": 1.0,
    "animation": `500ms ease-out ${appearAnimation}`,
    "@media (max-width: 880px)": {"flexDirection": "column"},
  })
  let playerContainer = css({
    "flexBasis": "33.333%",
    "flexShrink": 0,
    "position": "relative",
    "@media (max-width: 880px)": {"width": "100%"},
  })
  let playerBackground = css({
    "position": "relative",
    "position": "sticky",
    "top": 10,
    "borderRadius": 10,
    "overflow": "hidden",
    "height": 300,
    "backgroundImage": `linear-gradient(to bottom right, ${Theme.gradientRedTop}, ${Theme.gradientRedBottom}`,
  })
  let player = css({"borderWidth": 0, "width": "100%", "height": 300})
  let contents = css({"flexGrow": 1})
  let title = css({
    "fontSize": 42,
    "fontWeight": "800",
    "paddingBottom": 10,
    "lineHeight": 1.2,
  })
  let author = css({
    "fontSize": 16,
    "display": "flex",
    "flexDirection": "row",
    "alignItems": "center",
    "marginBottom": 10,
  })
  let avatar = css({
    "width": 32,
    "height": 32,
    "borderRadius": "100%",
    "marginRight": 10,
  })
  let body = css({
    "fontSize": 18,
    "lineHeight": 1.7,
    "pre": {
      "padding": 10,
      "overflowX": "auto",
      "borderRadius": 10,
      "border": "2px solid rgba(0, 0, 0, 0.1)",
    },
    "a": {"wordWrap": "break-word"},
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

@react.component
let make = (~slug) => {
  let episode = Pages.useItem("podcasts", ~id=slug)
  <div className=Styles.root>
    {switch episode {
    | NotAsked
    | Loading =>
      <PageLoadingIndicator />
    | Done(Ok(episode)) =>
      let trackId =
        episode.meta
        ->Dict.get("soundcloudTrackId")
        ->Option.flatMap(x =>
          switch x->JSON.Decode.classify {
          | String(x) => Some(x)
          | _ => None
          }
        )
      <>
        <Pages.Head>
          <title> {(episode.title ++ " | Putain de code")->React.string} </title>
        </Pages.Head>
        <WidthContainer>
          <div className=Styles.container>
            <div className=Styles.playerContainer>
              <div className=Styles.playerBackground>
                {switch trackId {
                | Some(trackId) =>
                  <iframe
                    className=Styles.player
                    name="Player"
                    src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${trackId}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=true&show_user=true&show_reposts=false&show_teaser=false&visual=true`}
                  />
                | None => React.null
                }}
              </div>
            </div>
            <Spacer width=40 height=20 />
            <div className=Styles.contents>
              <div role="heading" ariaLevel=1 className=Styles.title>
                {episode.title->React.string}
              </div>
              <div className=Styles.author>
                {episode.meta
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
                  <a href={"https://github.com/" ++ name} key=name>
                    <img
                      className=Styles.avatar
                      src={"https://avatars.githubusercontent.com/" ++ (name ++ "?size=64")}
                      alt=name
                    />
                  </a>
                )
                ->React.array}
              </div>
              <div className=Styles.body dangerouslySetInnerHTML={"__html": episode.body} />
              <div className=Styles.share>
                <div className=Styles.shareTitle>
                  {`Vous avez aimé cet épisode?`->React.string}
                </div>
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
                    episode.title ++
                    (" sur @PutainDeCode https://putaindecode.io/podcasts/" ++
                    episode.slug),
                  )}>
                  {"Le partager sur Twitter"->React.string}
                </a>
              </div>
            </div>
          </div>
          <div className=Styles.back>
            <Pages.Link href="/podcasts" className=Styles.backLink>
              {`← Épisodes`->React.string}
            </Pages.Link>
          </div>
        </WidthContainer>
      </>
    | Done(Error(_)) => <ErrorPage />
    }}
  </div>
}
