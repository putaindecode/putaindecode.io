open Belt;

type t = {
  title: string,
  date: string,
  slug: string,
  participants: array(string),
};

let fromJs = (podcastShallow: ResourceIo.podcastShallow) => {
  title: podcastShallow##title,
  date: podcastShallow##date,
  slug: podcastShallow##slug,
  participants: podcastShallow##participants,
};

let toJs = (podcastShallow): ResourceIo.podcastShallow => {
  "title": podcastShallow.title,
  "date": podcastShallow.date,
  "slug": podcastShallow.slug,
  "participants": podcastShallow.participants,
};

let query = _ => {
  Request.make(~url=Environment.apiUrl ++ "/podcasts/all.json", ())
  ->Future.mapOk(payload => Array.map(payload, fromJs));
};
