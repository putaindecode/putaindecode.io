open Belt;

let component = React.statelessComponent("PodcastEpisode");

module Styles = {
  open Css;
  let appearAnimation =
    keyframes([(0, [opacity(0.), transform(translateY(20->px))])]);
  let container =
    style([
      padding2(~v=20->px, ~h=10->px),
      display(flexBox),
      flexDirection(row),
      alignItems(stretch),
      flexGrow(1.),
      animation(~duration=500, ~timingFunction=`easeOut, appearAnimation),
      media("(max-width: 880px)", [flexDirection(column)]),
    ]);
  let playerContainer =
    style([
      flexBasis(33.333->pct),
      flexShrink(0),
      position(relative),
      media("(max-width: 880px)", [width(100.->pct)]),
    ]);
  let playerBackground =
    style([
      position(relative),
      position(sticky),
      top(10->px),
      borderRadius(10->px),
      overflow(hidden),
      height(300->px),
      backgroundImage(
        linearGradient(
          180->deg,
          [
            (0, Theme.gradientRedTop->hex),
            (100, Theme.gradientRedBottom->hex),
          ],
        ),
      ),
    ]);
  let player =
    style([borderWidth(zero), width(100.->pct), height(300->px)]);
  let contents = style([flexGrow(1.0)]);
  let title =
    style([
      fontSize(42->px),
      fontWeight(extraBold),
      paddingBottom(10->px),
    ]);
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
  let body =
    style([
      fontSize(18->px),
      lineHeight(`abs(1.7)),
      selector(
        "pre",
        [
          padding(10->px),
          overflowX(auto),
          borderRadius(10->px),
          border(2->px, `solid, rgba(0, 0, 0, 0.1)),
          `declaration(("WebkitOverflowScrolling", "touch")),
        ],
      ),
      selector("p", [textAlign(`justify)]),
    ]);
  let back =
    style([
      display(flexBox),
      alignItems(center),
      justifyContent(center),
      textAlign(center),
      padding(20->px),
    ]);
  let backLink =
    style([fontSize(20->px), textDecoration(none), color("4A90E2"->hex)]);
};

let make =
    (
      ~episode: RequestStatus.t(Result.t(Podcast.t, Errors.t)),
      ~onLoadRequest,
      _,
    ) => {
  ...component,
  didMount: _ => {
    switch (episode) {
    | NotAsked => onLoadRequest()
    | _ => ()
    };
  },
  render: _ => {
    switch (episode) {
    | NotAsked
    | Loading => <PageLoadingIndicator />
    | Done(Ok(episode)) =>
      let trackId = episode.soundcloudTrackId;
      <WithTitle title={episode.title}>
        <WidthContainer>
          <div className=Styles.container>
            <div className=Styles.playerContainer>
              <div className=Styles.playerBackground>
                <iframe
                  className=Styles.player
                  name="Player"
                  src={j|https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/$trackId&color=%23ff5500&auto_play=false&hide_related=true&show_comments=true&show_user=true&show_reposts=false&show_teaser=false&visual=true|j}
                />
              </div>
            </div>
            <Spacer width=40 height=20 />
            <div className=Styles.contents>
              <div role="heading" ariaLevel=1 className=Styles.title>
                episode.title->React.string
              </div>
              <div className=Styles.author>
                {episode.participants
                 ->Array.map(name =>
                     <Link href={"https://github.com/" ++ name}>
                       <img
                         className=Styles.avatar
                         key=name
                         src={"https://avatars.githubusercontent.com/" ++ name}
                         alt=name
                       />
                     </Link>
                   )
                 ->React.array}
              </div>
              <div
                className=Styles.body
                dangerouslySetInnerHTML={"__html": episode.body}
              />
            </div>
          </div>
          <div className=Styles.back>
            <Link href="/podcasts" className=Styles.backLink>
              {j|← Épisodes|j}->React.string
            </Link>
          </div>
        </WidthContainer>
      </WithTitle>;
    | Done(Error(_)) => <ErrorPage />
    };
  },
};
