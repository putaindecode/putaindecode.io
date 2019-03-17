type t = {
  latestPosts: array(PostShallow.t),
  postTotalCount: int,
  latestPodcasts: array(PodcastShallow.t),
  podcastTotalCount: int,
};

let fromJs: ResourceIo.home => t;

let toJs: t => ResourceIo.home;

let query: unit => Future.t(Belt.Result.t(t, Errors.t));
