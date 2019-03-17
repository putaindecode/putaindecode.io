module Posts: {
  let get:
    unit =>
    Future.t(Belt.Result.t(array((Post.t, PostShallow.t)), Js.Exn.t));
  module Json: {
    let make:
      array((Post.t, PostShallow.t)) => array((Post.t, PostShallow.t));
  };
};

module Podcasts: {
  let get:
    unit =>
    Future.t(Belt.Result.t(array((Podcast.t, PodcastShallow.t)), Js.Exn.t));
  module Json: {
    let make:
      array((Podcast.t, PodcastShallow.t)) =>
      array((Podcast.t, PodcastShallow.t));
  };
};

module Home: {
  let get:
    (~posts: array(PostShallow.t), ~podcasts: array(PodcastShallow.t)) =>
    Home.t;
  module Json: {let make: Home.t => Home.t;};
};
