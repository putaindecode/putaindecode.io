type t = {
  title: string,
  date: string,
  body: string,
  slug: string,
  oldSlug: option(string),
  soundcloudTrackId: string,
  participants: array(string),
};

let fromJs: ResourceIo.podcast => t;

let toJs: t => ResourceIo.podcast;

let query: string => Future.t(Belt.Result.t(t, Errors.t));
