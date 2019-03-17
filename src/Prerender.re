open Belt;

module Emotion = {
  [@bs.module "emotion-server"]
  external renderStylesToString: string => string = "renderStylesToString";
};

let index = Node.Fs.readFileSync("./build/prerender/__source.html", `utf8);

[@bs.module "fs"] external mkdirSync: string => unit = "mkdirSync";

module Sitemap = {
  let make = posts => {
    let posts =
      posts
      ->List.map(((path, _, _)) => {
          let path = String.concat("/", path);
          let path = Js.String.endsWith(path, "/") ? path : path ++ "/";
          {j|<url>
    <loc>https://putaindecode.io/$path</loc>
</url>
|j};
        })
      ->List.reduce("", (++));
    {j|<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
$posts
</urlset>|j};
  };
};

module Feed = {
  type page =
    | Podcast((Podcast.t, PodcastShallow.t))
    | Post((Post.t, PostShallow.t));
  let getDate =
    fun
    | Podcast((_, {date}))
    | Post((_, {date})) => date;
  let make = (~podcasts, ~posts) => {
    let all =
      Array.concat(
        podcasts->Array.map(((item, shallow)) => Podcast((item, shallow))),
        posts->Array.map(((item, shallow)) => Post((item, shallow))),
      )
      ->SortArray.stableSortBy((a, b) => b->getDate > a->getDate ? (-1) : 1)
      ->Array.sliceToEnd(-10)
      ->Array.reverse;
    let rss =
      Rss.make({
        "title": "Putain de code",
        "description": "Blog participatif de la communauté dev",
        "feed_url": "https://putaindecode.io/feed.xml",
        "site_url": "https://putaindecode.io",
      });
    all->Array.forEach(item =>
      rss->Rss.item(
        switch (item) {
        | Podcast(({title, body}, {slug})) => {
            "title": title,
            "description": body,
            "guid": slug,
            "url": "https://putaindecode.io/podasts/" ++ slug,
          }
        | Post(({title, body}, {slug})) => {
            "title": title,
            "description": body,
            "guid": slug,
            "url": "https://putaindecode.io/articles/" ++ slug,
          }
        },
      )
    );
    Node.Fs.writeFileAsUtf8Sync("./build/feed.xml", rss->Rss.toXml);
  };
};

let posts = Blog.Posts.get()->Future.mapOk(Blog.Posts.Json.make);
let podcasts = Blog.Podcasts.get()->Future.mapOk(Blog.Podcasts.Json.make);

exception Error;

let values =
  Future.all2((posts, podcasts))
  ->Future.map(((posts, podcasts)) =>
      switch (posts, podcasts) {
      | (Ok(posts), Ok(podcasts)) =>
        let home =
          Blog.Home.get(
            ~posts=posts->Array.map(((_, item)) => item),
            ~podcasts=podcasts->Array.map(((_, item)) => item),
          )
          ->Blog.Home.Json.make;
        (posts, podcasts, home);
      | _ => raise(Error)
      }
    );

values
->Future.map(((posts, podcasts, home)) =>
    [
      (
        [],
        {...App.default, home: RequestStatus.Done(Ok(home))},
        "Putain de code",
      ),
      (["404.html"], App.default, "Putain de code"),
      (
        [],
        {...App.default, home: RequestStatus.Done(Ok(home))},
        "Putain de code",
      ),
      (
        ["articles"],
        {
          ...App.default,
          articleList:
            Done(Ok(posts->Array.map(((_, shallow)) => shallow))),
        },
        "Articles - Putain de code",
      ),
      (
        ["podcasts"],
        {
          ...App.default,
          podcastList:
            Done(Ok(podcasts->Array.map(((_, shallow)) => shallow))),
        },
        "Podcasts - Putain de code",
      ),
    ]
    ->List.concat(
        posts
        ->List.fromArray
        ->List.map(((post, postShallow: PostShallow.t)) =>
            (
              ["articles", postShallow.slug],
              {
                ...App.default,
                articles:
                  App.default.articles
                  ->Map.String.set(postShallow.slug, Done(Ok(post))),
              },
              post.title,
            )
          ),
      )
    ->List.concat(
        podcasts
        ->List.fromArray
        ->List.map(((podcast, podcastShallow: PodcastShallow.t)) =>
            (
              ["podcasts", podcastShallow.slug],
              {
                ...App.default,
                podcasts:
                  App.default.podcasts
                  ->Map.String.set(podcastShallow.slug, Done(Ok(podcast))),
              },
              podcast.title,
            )
          ),
      )
  )
->Future.map(pages => {
    pages->List.forEach(((path, initialData, title)) => {
      let prerendered =
        Emotion.renderStylesToString(
          ReactDOMServerRe.renderToString(
            <App url={path, search: "", hash: ""} initialData />,
          ),
        );
      let data =
        Js.Json.stringifyAny(initialData)
        ->Option.map(string =>
            string->Js.String.replaceByRe([%re "/</g"], {js|\\u003c|js}, _)
          );
      try (
        if (!String.concat("/", path)->Js.String.endsWith(".html", _)) {
          mkdirSync("./build/" ++ String.concat("/", path));
        }
      ) {
      | _ => ()
      };
      Node.Fs.writeFileAsUtf8Sync(
        "./build/"
        ++ String.concat("/", path)
        ++ (
          String.concat("/", path)->Js.String.endsWith(".html", _) ?
            "" : "/index.html"
        ),
        index
        ->Js.String.replace(
            {|<div id="root"></div>|},
            {j|<div id="root">$prerendered</div><script id="data">window.initialData = $data</script>|j},
            _,
          )
        ->Js.String.replace(
            {|<title>Putain de code</title>|},
            {j|<title>$title | Putain de code</title><meta property="og:title" content="$title | @bloodyowl" />|j},
            _,
          ),
      );
    });
    Node.Fs.writeFileAsUtf8Sync("./build/sitemap.xml", Sitemap.make(pages));
  });

values->Future.map(((posts, podcasts, _)) => {
  posts
  ->Array.forEach(((post, postShallow)) =>
      post.oldSlug
      ->Option.map(oldSlug => {
          ("build/fr/articles/" ++ oldSlug)
          ->Js.String.split("/", _)
          ->Array.reduce("", (acc, item) => {
              try (
                {
                  mkdirSync(
                    Node.Path.join([|
                      Node.Process.cwd(),
                      acc ++ "/" ++ item,
                    |]),
                  );
                }
              ) {
              | _ => ()
              };
              acc ++ "/" ++ item;
            })
          ->ignore;
          let slug = postShallow.slug;
          Node.Fs.writeFileAsUtf8Sync(
            Node.Path.join([|
              Node.Process.cwd(),
              "build/fr/articles",
              oldSlug,
              "index.html",
            |]),
            {j|<!DOCTYPE html><meta http-equiv="refresh" content="0;URL=/articles/$slug">|j},
          );
        })
      ->ignore
    )
  ->ignore;
  podcasts->Array.forEach(((podcast, podcastShallow)) =>
    podcast.oldSlug
    ->Option.map(oldSlug => {
        ("build/fr/articles/" ++ oldSlug)
        ->Js.String.split("/", _)
        ->Array.reduce("", (acc, item) => {
            try (
              {
                mkdirSync(
                  Node.Path.join([|Node.Process.cwd(), acc ++ "/" ++ item|]),
                );
              }
            ) {
            | _ => ()
            };
            acc ++ "/" ++ item;
          })
        ->ignore;
        let slug = podcastShallow.slug;
        Node.Fs.writeFileAsUtf8Sync(
          Node.Path.join([|
            Node.Process.cwd(),
            "build/fr/articles",
            oldSlug,
            "index.html",
          |]),
          {j|<!DOCTYPE html><meta http-equiv="refresh" content="0;URL=/podcasts/$slug">|j},
        );
      })
    ->ignore
  );
  Feed.make(~podcasts, ~posts);
});
