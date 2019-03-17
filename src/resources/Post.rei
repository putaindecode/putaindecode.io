type t = {
  title: string,
  date: string,
  body: string,
  oldSlug: option(string),
  author: string,
};

let fromJs: ResourceIo.post => t;

let toJs: t => ResourceIo.post;

let query: string => Future.t(Belt.Result.t(t, Errors.t));
