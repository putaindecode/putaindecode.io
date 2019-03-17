type post = {
  .
  "title": string,
  "date": string,
  "body": string,
  "slug": string,
  "oldSlug": option(string),
  "author": string,
}
and postShallow = {
  .
  "title": string,
  "date": string,
  "slug": string,
  "author": string,
}
and podcast = {
  .
  "title": string,
  "date": string,
  "body": string,
  "slug": string,
  "oldSlug": option(string),
  "participants": array(string),
  "soundcloudTrackId": string,
}
and podcastShallow = {
  .
  "title": string,
  "date": string,
  "slug": string,
  "participants": array(string),
}
and home = {
  .
  "latestPosts": array(postShallow),
  "postTotalCount": int,
  "latestPodcasts": array(podcastShallow),
  "podcastTotalCount": int,
};
