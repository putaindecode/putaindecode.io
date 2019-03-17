type t = {
  title: string,
  date: string,
  slug: string,
  author: string,
};

let fromJs: ResourceIo.postShallow => t;

let toJs: t => ResourceIo.postShallow;

let query: unit => Future.t(Belt.Result.t(array(t), Errors.t));
