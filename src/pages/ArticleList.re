open Belt;

let component = React.statelessComponent("ArticleList");

module Styles = {
  open Css;
  let container =
    style([
      backgroundColor(Theme.lightBody->hex),
      media("(prefers-color-scheme: dark)", [backgroundColor("111"->hex)]),
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
      media(
        "(prefers-color-scheme: dark)",
        [backgroundColor("222"->hex), color("ddd"->hex)],
      ),
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
          pointerEvents(none),
          position(absolute),
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
      ~postList: RequestStatus.t(Result.t(array(PostShallow.t), Errors.t)),
      ~onLoadRequest,
      ~search,
      _,
    ) => {
  ...component,
  didMount: _ =>
    switch (postList) {
    | NotAsked => onLoadRequest()
    | _ => ()
    },
  render: _ => {
    let queryString = search->QueryString.explode;
    <div className=Styles.container>
      {switch (postList) {
       | NotAsked
       | Loading => <PageLoadingIndicator />
       | Done(Ok(postList)) =>
         <WithTitle
           title={
             search
             ->QueryString.explode
             ->Map.String.get("search")
             ->Option.map(search => "Articles avec " ++ search)
             ->Option.getWithDefault("Articles")
           }>
           <WidthContainer>
             <div className=Styles.heading>
               <div role="heading" ariaLevel=1 className=Styles.title>
                 "Articles"->React.string
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
                          search == ""
                            ? queryString->Map.String.remove("search")
                            : queryString->Map.String.set("search", search)
                        )
                        ->QueryString.implode,
                   );
                 }}
               />
             </div>
             {postList
              ->Array.map(article =>
                  <Link
                    className={
                      search
                      ->QueryString.explode
                      ->Map.String.get("search")
                      ->Option.map(Js.String.trim)
                      ->Option.map(Js.String.toLowerCase)
                      ->Option.map(search =>
                          article.title
                          ->Js.String.toLowerCase
                          ->Js.String.includes(search, _)
                          || article.author
                             ->Js.String.toLowerCase
                             ->Js.String.includes(search, _)
                        )
                      ->Option.getWithDefault(true)
                        ? Styles.link : Styles.hiddenLink
                    }
                    href={"/articles/" ++ article.slug}
                    key={article.slug}>
                    <div className=Styles.author>
                      <img
                        className=Styles.avatar
                        src={
                          "https://avatars.githubusercontent.com/"
                          ++ article.author
                          ++ "?size=64"
                        }
                        alt={article.author}
                      />
                      <div>
                        article.author->React.string
                        " "->React.string
                        {j|•|j}->React.string
                        " "->React.string
                        <Date date={article.date} />
                      </div>
                    </div>
                    <div className=Styles.postTitle>
                      article.title->React.string
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
