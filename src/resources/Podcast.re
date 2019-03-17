type t = {
  title: string,
  date: string,
  body: string,
  oldSlug: option(string),
  soundcloudTrackId: string,
  participants: array(string),
};

let fromJs = (podcast: ResourceIo.podcast) => {
  title: podcast##title,
  date: podcast##date,
  body: podcast##body,
  oldSlug: podcast##oldSlug,
  soundcloudTrackId: podcast##soundcloudTrackId,
  participants: podcast##participants,
};

let toJs = (podcast): ResourceIo.podcast => {
  "title": podcast.title,
  "date": podcast.date,
  "body": podcast.body,
  "oldSlug": podcast.oldSlug,
  "soundcloudTrackId": podcast.soundcloudTrackId,
  "participants": podcast.participants,
};

let query = slug => {
  Request.make(~url=Environment.apiUrl ++ "/podcasts/" ++ slug ++ ".json", ())
  ->Future.mapOk(fromJs);
};
