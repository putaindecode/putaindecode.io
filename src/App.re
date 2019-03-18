open Belt;

include CssReset;

type action =
  | LoadHome
  | ReceiveHome(Result.t(Home.t, Errors.t))
  | LoadArticle(string)
  | ReceiveArticle(string, Result.t(Post.t, Errors.t))
  | LoadArticleList
  | ReceiveArticleList(Result.t(array(PostShallow.t), Errors.t))
  | LoadPodcast(string)
  | ReceivePodcast(string, Result.t(Podcast.t, Errors.t))
  | LoadPodcastList
  | ReceivePodcastList(Result.t(array(PodcastShallow.t), Errors.t));

type state = {
  articles: Map.String.t(RequestStatus.t(Result.t(Post.t, Errors.t))),
  articleList: RequestStatus.t(Result.t(array(PostShallow.t), Errors.t)),
  podcasts: Map.String.t(RequestStatus.t(Result.t(Podcast.t, Errors.t))),
  podcastList: RequestStatus.t(Result.t(array(PodcastShallow.t), Errors.t)),
  home: RequestStatus.t(Result.t(Home.t, Errors.t)),
};

let default = {
  articles: Map.String.empty,
  articleList: NotAsked,
  podcasts: Map.String.empty,
  podcastList: NotAsked,
  home: NotAsked,
};

let component = React.reducerComponent("App");

let make = (~url, ~initialData=?, _) => {
  ...component,
  initialState: () => initialData->Option.getWithDefault(default),
  reducer: (action, state) =>
    switch (action) {
    | LoadArticle(slug) =>
      UpdateWithSideEffects(
        {
          ...state,
          articles:
            state.articles->Map.String.set(slug, RequestStatus.Loading),
        },
        ({send}) =>
          Post.query(slug)
          ->Future.get(value => send(ReceiveArticle(slug, value))),
      )
    | ReceiveArticle(slug, payload) =>
      Update({
        ...state,
        articles:
          state.articles->Map.String.set(slug, RequestStatus.Done(payload)),
      })
    | LoadArticleList =>
      UpdateWithSideEffects(
        {...state, articleList: RequestStatus.Loading},
        ({send}) =>
          PostShallow.query()
          ->Future.get(value => send(ReceiveArticleList(value))),
      )
    | ReceiveArticleList(payload) =>
      Update({...state, articleList: RequestStatus.Done(payload)})
    | LoadPodcast(slug) =>
      UpdateWithSideEffects(
        {
          ...state,
          podcasts:
            state.podcasts->Map.String.set(slug, RequestStatus.Loading),
        },
        ({send}) =>
          Podcast.query(slug)
          ->Future.get(value => send(ReceivePodcast(slug, value))),
      )
    | ReceivePodcast(slug, payload) =>
      Update({
        ...state,
        podcasts:
          state.podcasts->Map.String.set(slug, RequestStatus.Done(payload)),
      })
    | LoadPodcastList =>
      UpdateWithSideEffects(
        {...state, podcastList: RequestStatus.Loading},
        ({send}) =>
          PodcastShallow.query()
          ->Future.get(value => send(ReceivePodcastList(value))),
      )
    | ReceivePodcastList(payload) =>
      Update({...state, podcastList: RequestStatus.Done(payload)})
    | LoadHome =>
      UpdateWithSideEffects(
        {...state, home: RequestStatus.Loading},
        ({send}) =>
          Home.query()->Future.get(value => send(ReceiveHome(value))),
      )
    | ReceiveHome(payload) =>
      Update({...state, home: RequestStatus.Done(payload)})
    },
  render: ({state, send}) =>
    <>
      <Header
        url
        gradient=?{
          switch (url.path) {
          | ["articles", slug] => Some(Gradient.fromString(slug))
          | _ => None
          }
        }
      />
      {switch (url.path) {
       | [] =>
         <Homepage home={state.home} onLoadRequest={() => send(LoadHome)} />
       | ["podcasts"] =>
         <PodcastEpisodeList
           episodeList={state.podcastList}
           onLoadRequest={() => send(LoadPodcastList)}
           search={url.search}
         />
       | ["podcasts", slug] =>
         <PodcastEpisode
           key=slug
           episode={
             state.podcasts
             ->Map.String.get(slug)
             ->Option.getWithDefault(RequestStatus.NotAsked)
           }
           onLoadRequest={() => send(LoadPodcast(slug))}
         />
       | ["articles"] =>
         <ArticleList
           postList={state.articleList}
           onLoadRequest={() => send(LoadArticleList)}
           search={url.search}
         />
       | ["articles", slug] =>
         <Article
           key=slug
           post={
             state.articles
             ->Map.String.get(slug)
             ->Option.getWithDefault(RequestStatus.NotAsked)
           }
           onLoadRequest={() => send(LoadArticle(slug))}
         />
       | _ => <ErrorPage />
       }}
      <FollowUs />
      <Footer />
    </>,
};
