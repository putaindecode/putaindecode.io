open Belt;

module TopArticles = {
  let component = ReasonReact.statelessComponent("TopArticles");
  module Styles = {
    open Css;

    let topArticle =
      style([
        display(block),
        position(relative),
        margin(10->px),
        backgroundColor("F1F6FC"->hex),
        borderRadius(14->px),
        paddingBottom((5. /. 16. *. 100.)->pct),
        boxShadow(
          ~y=15->px,
          ~blur=15->px,
          ~spread=(-5)->px,
          rgba(0, 0, 0, 0.2),
        ),
        textDecoration(none),
        overflow(hidden),
        active([
          after([
            `declaration(("content", "")),
            pointerEvents(none),
            position(absolute),
            top(zero),
            left(zero),
            right(zero),
            bottom(zero),
            backgroundColor(rgba(0, 0, 0, 0.1)),
          ]),
        ]),
        media(
          "(max-width: 720px)",
          [paddingBottom((9. /. 16. *. 100.)->pct)],
        ),
      ]);
    let contents =
      style([
        position(absolute),
        top(zero),
        left(zero),
        right(zero),
        bottom(zero),
        display(flexBox),
        flexDirection(column),
        alignItems(center),
        justifyContent(center),
      ]);
    let bigTitle =
      style([
        color("fff"->hex),
        fontSize(32->px),
        fontWeight(extraBold),
        textAlign(center),
        padding(20->px),
        paddingTop(zero),
        media("(max-width: 720px)", [fontSize(18->px)]),
      ]);
    let author =
      style([
        fontSize(16->px),
        color("fff"->hex),
        display(flexBox),
        flexDirection(row),
        alignItems(center),
      ]);
    let avatar =
      style([
        width(32->px),
        height(32->px),
        borderRadius(100.->pct),
        marginRight(10->px),
      ]);
    let sub =
      style([
        display(flexBox),
        flexDirection(row),
        alignItems(stretch),
        flexWrap(wrap),
        justifyContent(spaceBetween),
        position(relative),
        zIndex(1),
        overflowX(auto),
        `declaration(("WebkitOverflowScrolling", "touch")),
        `declaration(("scrollSnapType", "x mandatory")),
        width(100.->pct),
        maxWidth(1024->px),
        margin2(~h=auto, ~v=zero),
        padding2(~h=10->px, ~v=zero),
        paddingBottom(10->px),
        media("(max-width: 920px)", [flexWrap(nowrap)]),
      ]);
    let articleContainer =
      style([
        `declaration(("scrollSnapAlign", "center")),
        flexBasis(33.333->pct),
        minWidth(300->px),
        padding(10->px),
      ]);
    let article =
      style([
        position(relative),
        display(block),
        overflow(hidden),
        backgroundColor("F1F6FC"->hex),
        borderRadius(14->px),
        paddingBottom((9. /. 16. *. 100.)->pct),
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
            backgroundColor(rgba(0, 0, 0, 0.1)),
          ]),
        ]),
      ]);
    let title =
      style([
        color("fff"->hex),
        fontSize(18->px),
        fontWeight(extraBold),
        textAlign(center),
        padding(20->px),
        paddingTop(30->px),
      ]);
    let discover =
      style([
        display(flexBox),
        alignItems(center),
        justifyContent(center),
        textAlign(center),
        padding(20->px),
      ]);
    let discoverLink =
      style([
        fontSize(20->px),
        textDecoration(none),
        color("1E49B5"->hex),
      ]);
    let authorSmall =
      style([position(absolute), top(10->px), left(10->px)]);
  };
  [@react.component]
  let make = (~articles: array(PostShallow.t), ~totalCount, ()) =>
    ReactCompat.useRecordApi({
      ...component,
      render: _ => {
        <WithTitle title="Putain de code">
          <div>
            <WidthContainer>
              {articles[0]
               ->Option.map(article =>
                   <Link
                     href={"/articles/" ++ article.slug}
                     className=Styles.topArticle
                     style={ReactDOMRe.Style.make(
                       ~backgroundImage=Gradient.fromString(article.slug),
                       (),
                     )}>
                     <div className=Styles.contents>
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
                           article.author->ReasonReact.string
                           " "->ReasonReact.string
                           {j|•|j}->ReasonReact.string
                           " "->ReasonReact.string
                           <Date date={article.date} />
                         </div>
                       </div>
                       <div className=Styles.bigTitle>
                         article.title->ReasonReact.string
                       </div>
                     </div>
                   </Link>
                 )
               ->Option.getWithDefault(ReasonReact.null)}
            </WidthContainer>
            <div className=Styles.sub>
              {articles
               ->Array.slice(~offset=1, ~len=6)
               ->Array.map(article =>
                   <div key={article.slug} className=Styles.articleContainer>
                     <Link
                       href={"/articles/" ++ article.slug}
                       className=Styles.article
                       style={ReactDOMRe.Style.make(
                         ~backgroundImage=Gradient.fromString(article.slug),
                         (),
                       )}>
                       <div className=Styles.contents>
                         <div className=Styles.authorSmall>
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
                               article.author->ReasonReact.string
                               " "->ReasonReact.string
                               {j|•|j}->ReasonReact.string
                               " "->ReasonReact.string
                               <Date date={article.date} />
                             </div>
                           </div>
                         </div>
                         <div className=Styles.title>
                           article.title->ReasonReact.string
                         </div>
                       </div>
                     </Link>
                   </div>
                 )
               ->ReasonReact.array}
            </div>
            <div className=Styles.discover>
              <Link href="/articles" className=Styles.discoverLink>
                {j|Découvrir les $totalCount articles →|j}
                ->ReasonReact.string
              </Link>
            </div>
          </div>
        </WithTitle>;
      },
    });
};

module LatestPodcasts = {
  let component = ReasonReact.statelessComponent("LatestPodcasts");

  module Styles = {
    open Css;
    let container =
      style([
        backgroundColor(Theme.lightBody->hex),
        media(
          "(prefers-color-scheme: dark)",
          [backgroundColor("111"->hex)],
        ),
      ]);
    let contents =
      style([
        display(flexBox),
        flexDirection(row),
        alignItems(flexStart),
        paddingTop(20->px),
        paddingBottom(20->px),
        media(
          "(max-width: 720px)",
          [flexDirection(column), alignItems(stretch)],
        ),
      ]);
    let leftCol =
      style([
        flexBasis(150->px),
        flexShrink(0),
        padding(10->px),
        media(
          "(max-width: 720px)",
          [paddingBottom(zero), alignSelf(center)],
        ),
      ]);
    let mainCol =
      style([
        flexGrow(1.0),
        padding(10->px),
        media("(max-width: 720px)", [paddingTop(zero)]),
      ]);
    let title =
      style([
        fontSize(48->px),
        fontWeight(extraBold),
        marginBottom(20->px),
        media("(max-width: 720px)", [textAlign(center)]),
      ]);
    let podcast =
      style([
        marginBottom(10->px),
        backgroundColor("fff"->hex),
        borderRadius(10->px),
        padding(20->px),
        display(block),
        textDecoration(none),
        color(Theme.darkBody->hex),
        media(
          "(prefers-color-scheme: dark)",
          [backgroundColor("222"->hex), color("ddd"->hex)],
        ),
        width(100.->pct),
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
    let podcastTitle =
      style([
        fontSize(18->px),
        fontWeight(extraBold),
        marginBottom(10->px),
      ]);
    let avatar =
      style([
        width(32->px),
        height(32->px),
        borderRadius(100.->pct),
        marginRight(10->px),
      ]);
    let discover =
      style([
        display(flexBox),
        alignItems(center),
        justifyContent(center),
        textAlign(center),
        padding(20->px),
      ]);
    let discoverLink =
      style([
        fontSize(20->px),
        textDecoration(none),
        color("1E49B5"->hex),
      ]);
  };

  [@react.component]
  let make = (~podcasts: array(PodcastShallow.t), ~totalCount, ()) =>
    ReactCompat.useRecordApi({
      ...component,
      render: _ => {
        <div className=Styles.container>
          <WidthContainer>
            <div className=Styles.contents>
              <div className=Styles.leftCol>
                <img
                  width="150"
                  height="150"
                  src="/public/images/website/podcast.svg"
                  alt=""
                />
              </div>
              <div className=Styles.mainCol>
                <div role="heading" ariaLevel=2 className=Styles.title>
                  "Podcast"->ReasonReact.string
                </div>
                {podcasts
                 ->Array.slice(~offset=0, ~len=3)
                 ->Array.map(podcast =>
                     <Link
                       key={podcast.slug}
                       href={"/podcasts/" ++ podcast.slug}
                       className=Styles.podcast>
                       <div className=Styles.podcastTitle>
                         podcast.title->ReasonReact.string
                       </div>
                       {podcast.participants
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
                        ->ReasonReact.array}
                     </Link>
                   )
                 ->ReasonReact.array}
                <div className=Styles.discover>
                  <Link href="/podcasts" className=Styles.discoverLink>
                    {j|Découvrir les $totalCount épisodes →|j}
                    ->ReasonReact.string
                  </Link>
                </div>
              </div>
            </div>
          </WidthContainer>
        </div>;
      },
    });
};

let component = ReasonReact.statelessComponent("Homepage");

module Styles = {
  open Css;
  let topArticles = style([position(relative), top((-30)->px)]);
};

[@react.component]
let make =
    (~home: RequestStatus.t(Result.t(Home.t, Errors.t)), ~onLoadRequest, ()) =>
  ReactCompat.useRecordApi({
    ...component,
    didMount: _ => {
      switch (home) {
      | NotAsked => onLoadRequest()
      | _ => ()
      };
    },
    render: _ =>
      <>
        {switch (home) {
         | NotAsked
         | Loading => <PageLoadingIndicator />
         | Done(
             Ok({
               latestPosts,
               postTotalCount,
               latestPodcasts,
               podcastTotalCount,
             }),
           ) =>
           <>
             <div className=Styles.topArticles>
               <TopArticles articles=latestPosts totalCount=postTotalCount />
             </div>
             <LatestPodcasts
               podcasts=latestPodcasts
               totalCount=podcastTotalCount
             />
           </>
         | Done(Error(_)) => <ErrorPage />
         }}
      </>,
  });
