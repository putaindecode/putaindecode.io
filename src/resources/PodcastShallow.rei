type t = {
  title: string,
  date: string,
  slug: string,
  participants: array(string),
};

let fromJs: ResourceIo.podcastShallow => t;

let toJs: t => ResourceIo.podcastShallow;

let query: unit => Future.t(Belt.Result.t(array(t), Errors.t));
