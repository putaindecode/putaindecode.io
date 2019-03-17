type t = {
  title: string,
  date: string,
  body: string,
  oldSlug: option(string),
  author: string,
};

let fromJs = (post: ResourceIo.post) => {
  title: post##title,
  date: post##date,
  body: post##body,
  oldSlug: post##oldSlug,
  author: post##author,
};

let toJs = (post): ResourceIo.post => {
  "title": post.title,
  "date": post.date,
  "body": post.body,
  "oldSlug": post.oldSlug,
  "author": post.author,
};

let query = slug => {
  Request.make(~url=Environment.apiUrl ++ "/posts/" ++ slug ++ ".json", ())
  ->Future.mapOk(fromJs);
};
