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
    ":focus": {
      "outline": "none",
      "backgroundColor": Theme.halfPercentContrastColor,
    },
    "@media (max-width: 720px)": {"fontSize": 20},
  })
  let title = css({
    "fontSize": 48,
    "fontWeight": "800",
    "marginTop": 20,
    "marginBottom": 20,
    "@media (max-width: 720px)": {"textAlign": "center"},
  })
  let link = css({
    "color": Theme.pageTextColor,
    "textDecoration": "none",
    "padding": 20,
    "backgroundColor": Theme.pageBackgroundColor,
    "borderRadius": 10,
    "marginBottom": 10,
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
  let hiddenLink = cx([link, css({"display": "none"})])
  let postTitle = css({"fontSize": 24, "fontWeight": "800"})
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
}

@react.component
let make = (~search, ()) => {
  let episodeList = Pages.useCollection("podcasts")
  let queryString = search->QueryString.decode
  <div className=Styles.container>
    {switch episodeList {
    | NotAsked
    | Loading =>
      <PageLoadingIndicator />
    | Done(Ok({items: episodeList})) =>
      <WidthContainer>
        <Pages.Head>
          <title>
            {(search
            ->QueryString.decode
            ->Dict.get("search")
            ->Option.map(search => "Podcasts avec " ++ search)
            ->Option.getWithDefault("Podcasts") ++ " | Putain de code")->React.string}
          </title>
        </Pages.Head>
        <div className=Styles.heading>
          <div role="heading" ariaLevel=1 className=Styles.title>
            {j`Épisodes`->React.string}
          </div>
          <input
            className=Styles.search
            placeholder=`Rechercher …`
            type_="text"
            value={search->QueryString.decode->Dict.get("search")->Option.getWithDefault("")}
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
        {episodeList
        ->Array.map(episode =>
          <Pages.Link
            className={search
            ->QueryString.decode
            ->Dict.get("search")
            ->Option.map(String.trim)
            ->Option.map(String.toLowerCase)
            ->Option.map(search =>
              episode.title->String.toLowerCase->String.includes(search) ||
                episode.meta
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
                ->Array.some(participant =>
                  participant->String.toLowerCase->String.includes(search)
                )
            )
            ->Option.getWithDefault(true)
              ? Styles.link
              : Styles.hiddenLink}
            href={"/podcasts/" ++ episode.slug}
            key=episode.slug>
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
                <img
                  className=Styles.avatar
                  key=name
                  src={"https://avatars.githubusercontent.com/" ++ (name ++ "?size=64")}
                  alt=name
                />
              )
              ->React.array}
            </div>
            <div className=Styles.postTitle> {episode.title->React.string} </div>
          </Pages.Link>
        )
        ->React.array}
      </WidthContainer>
    | Done(Error(_)) => <ErrorPage />
    }}
  </div>
}
