open Belt;

type t = {
  latestPosts: array(PostShallow.t),
  postTotalCount: int,
  latestPodcasts: array(PodcastShallow.t),
  podcastTotalCount: int,
};

let fromJs = (home: ResourceIo.home) => {
  latestPosts: home##latestPosts->Array.map(PostShallow.fromJs),
  postTotalCount: home##postTotalCount,
  latestPodcasts: home##latestPodcasts->Array.map(PodcastShallow.fromJs),
  podcastTotalCount: home##podcastTotalCount,
};

let toJs = (home): ResourceIo.home => {
  "latestPosts": home.latestPosts->Array.map(PostShallow.toJs),
  "postTotalCount": home.postTotalCount,
  "latestPodcasts": home.latestPodcasts->Array.map(PodcastShallow.toJs),
  "podcastTotalCount": home.podcastTotalCount,
};

let query = () => {
  Request.make(~url=Environment.apiUrl ++ "/home/home.json", ())
  ->Future.mapOk(fromJs);
};
