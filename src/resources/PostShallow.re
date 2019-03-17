open Belt;

type t = {
  title: string,
  date: string,
  slug: string,
  author: string,
};

let fromJs = (postShallow: ResourceIo.postShallow) => {
  title: postShallow##title,
  date: postShallow##date,
  slug: postShallow##slug,
  author: postShallow##author,
};

let toJs = (postShallow): ResourceIo.postShallow => {
  "title": postShallow.title,
  "date": postShallow.date,
  "slug": postShallow.slug,
  "author": postShallow.author,
};

let query = _ => {
  Request.make(~url=Environment.apiUrl ++ "/posts/all.json", ())
  ->Future.mapOk(payload => Array.map(payload, fromJs));
};
