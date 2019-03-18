open Belt;

let component = React.statelessComponent("PostcastEpisodeList");

module Styles = {
  open Css;
  let container =
    style([
      backgroundColor(Theme.lightBody->hex),
      display(flexBox),
      flexDirection(column),
      flexGrow(1.0),
    ]);
  let heading =
    style([
      display(flexBox),
      flexDirection(row),
      justifyContent(spaceBetween),
      alignItems(center),
    ]);
  let search =
    style([
      fontSize(36->px),
      flexGrow(1.0),
      width(1->px),
      maxWidth(300->px),
      backgroundColor(transparent),
      padding(zero),
      margin(zero),
      borderWidth(zero),
      textAlign(`right),
      borderRadius(30->px),
      padding2(~v=10->px, ~h=30->px),
      focus([outlineStyle(none), backgroundColor(rgba(0, 0, 0, 0.05))]),
      media("(max-width: 720px)", [fontSize(20->px)]),
    ]);
  let title =
    style([
      fontSize(48->px),
      fontWeight(extraBold),
      marginTop(20->px),
      marginBottom(20->px),
      media("(max-width: 720px)", [textAlign(center)]),
    ]);
  let link =
    style([
      color(Theme.darkBody->hex),
      textDecoration(none),
      padding(20->px),
      backgroundColor("fff"->hex),
      borderRadius(10->px),
      marginBottom(10->px),
      position(relative),
      overflow(hidden),
      boxShadow(
        ~y=15->px,
        ~blur=15->px,
        ~spread=(-5)->px,
        rgba(0, 0, 0, 0.2),
      ),
      active([
        after([
          `declaration(("content", "")),
          position(absolute),
          pointerEvents(none),
          top(zero),
          left(zero),
          right(zero),
          bottom(zero),
          backgroundColor(rgba(255, 255, 255, 0.5)),
        ]),
      ]),
    ]);
  let hiddenLink = merge([link, style([display(none)])]);
  let postTitle = style([fontSize(24->px), fontWeight(extraBold)]);
  let author =
    style([
      fontSize(16->px),
      display(flexBox),
      flexDirection(row),
      alignItems(center),
      marginBottom(10->px),
    ]);
  let avatar =
    style([
      width(32->px),
      height(32->px),
      borderRadius(100.->pct),
      marginRight(10->px),
    ]);
};

let make =
    (
      ~episodeList:
         RequestStatus.t(Result.t(array(PodcastShallow.t), Errors.t)),
      ~onLoadRequest,
      ~search,
      _,
    ) => {
  ...component,
  didMount: _ =>
    switch (episodeList) {
    | NotAsked => onLoadRequest()
    | _ => ()
    },
  render: _ => {
    let queryString = search->QueryString.explode;
    <div className=Styles.container>
      {switch (episodeList) {
       | NotAsked
       | Loading => <PageLoadingIndicator />
       | Done(Ok(episodeList)) =>
         <WithTitle title="Podcasts">
           <WidthContainer>
             <div className=Styles.heading>
               <div role="heading" ariaLevel=1 className=Styles.title>
                 {j|Épisodes|j}->React.string
               </div>
               <input
                 className=Styles.search
                 placeholder={js|Rechercher …|js}
                 type_="text"
                 value={
                   search
                   ->QueryString.explode
                   ->Map.String.get("search")
                   ->Option.getWithDefault("")
                 }
                 onChange={event => {
                   let search = event->ReactEvent.Form.target##value;
                   React.Router.push(
                     "?"
                     ++ (
                          search == "" ?
                            queryString->Map.String.remove("search") :
                            queryString->Map.String.set("search", search)
                        )
                        ->QueryString.implode,
                   );
                 }}
               />
             </div>
             {episodeList
              ->Array.map(episode =>
                  <Link
                    className={
                      search
                      ->QueryString.explode
                      ->Map.String.get("search")
                      ->Option.map(Js.String.trim)
                      ->Option.map(Js.String.toLowerCase)
                      ->Option.map(search =>
                          episode.title
                          ->Js.String.toLowerCase
                          ->Js.String.includes(search, _)
                          || episode.participants
                             ->Array.some(participant =>
                                 participant
                                 ->Js.String.toLowerCase
                                 ->Js.String.includes(search, _)
                               )
                        )
                      ->Option.getWithDefault(true) ?
                        Styles.link : Styles.hiddenLink
                    }
                    href={"/podcasts/" ++ episode.slug}
                    key={episode.slug}>
                    <div className=Styles.author>
                      {episode.participants
                       ->Array.map(name =>
                           <img
                             className=Styles.avatar
                             key=name
                             src={
                               "https://avatars.githubusercontent.com/"
                               ++ name
                               ++ "?size=64"
                             }
                             alt=name
                           />
                         )
                       ->React.array}
                    </div>
                    <div className=Styles.postTitle>
                      episode.title->React.string
                    </div>
                  </Link>
                )
              ->React.array}
           </WidthContainer>
         </WithTitle>
       | Done(Error(_)) => <ErrorPage />
       }}
    </div>;
  },
};
