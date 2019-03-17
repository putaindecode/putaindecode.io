open Belt;

let posts = Blog.Posts.get()->Future.mapOk(Blog.Posts.Json.make);
let podcasts = Blog.Podcasts.get()->Future.mapOk(Blog.Podcasts.Json.make);

Future.all2((posts, podcasts))
->Future.get(((posts, podcasts)) =>
    switch (posts, podcasts) {
    | (Ok(posts), Ok(podcasts)) =>
      Blog.Home.get(
        ~posts=posts->Array.map(((_, item)) => item),
        ~podcasts=podcasts->Array.map(((_, item)) => item),
      )
      ->Blog.Home.Json.make
      ->ignore
    | _ => ()
    }
  );
