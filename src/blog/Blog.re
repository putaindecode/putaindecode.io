open Node;
open Belt;

[@bs.module "fs"] external mkdirSync: string => unit = "mkdirSync";

{
  HighlightJs.(hjs->registerLanguage("reason", reason));
};

let remarkable =
  Remarkable.make(
    "full",
    {
      "html": true,
      "linkify": true,
      "highlight":
        Some(
          (code, lang) =>
            try (
              {
                HighlightJs.highlight(~lang, code)##value;
              }
            ) {
            | _ => ""
            },
        ),
    },
  );

let createDir = () => {
  let paths = [
    "build",
    "build/api",
    "build/api/posts",
    "build/api/podcasts",
    "build/api/home",
  ];
  paths->List.forEach(item =>
    try (
      {
        mkdirSync(Path.join([|Process.cwd(), item|]));
      }
    ) {
    | _ => ()
    }
  );
};

module Posts = {
  let parse = ((path, item)) => {
    let front = FrontMatter.parse(item);
    let post: Post.t = {
      body: Remarkable.render(remarkable, front##body),
      title: front##attributes##title,
      date: front##attributes##date,
      slug: front##attributes##slug,
      oldSlug: front##attributes##oldSlug,
      author: front##attributes##author,
    };
    let postShallow: PostShallow.t = {
      title: front##attributes##title,
      date: front##attributes##date,
      slug: front##attributes##slug,
      author: front##attributes##author,
    };
    Js.log("Article " ++ path ++ ": OK");
    (post, postShallow);
  };
  let get = () => {
    Glob.glob(Path.join([|Process.cwd(), "articles/**/**/*.md"|]))
    ->Future.mapOk(SortArray.String.stableSort)
    ->Future.mapOk(Array.reverse)
    ->Future.mapOk(files =>
        files->Array.map(item => (item, Fs.readFileAsUtf8Sync(item)))
      )
    ->Future.mapOk(posts => posts->Array.map(parse));
  };
  module Json = {
    let make = posts => {
      createDir();
      posts->Array.forEach(((post, postShallow: PostShallow.t)) => {
        let dir = Js.String.split("/", postShallow.slug);
        dir
        ->Array.reduce("", (acc, item) => {
            try (
              {
                mkdirSync(
                  Path.join([|Process.cwd(), "build/api/posts/" ++ acc|]),
                );
              }
            ) {
            | _ => ()
            };
            acc ++ "/" ++ item;
          })
        ->ignore;
        Fs.writeFileAsUtf8Sync(
          Path.join([|
            Process.cwd(),
            "build/api/posts/",
            postShallow.slug ++ ".json",
          |]),
          post->Post.toJs->Js.Json.stringifyAny->Option.getWithDefault(""),
        );
      });
      Fs.writeFileAsUtf8Sync(
        Path.join([|Process.cwd(), "build/api/posts/", "all.json"|]),
        posts
        ->Array.map(((_, postShallow)) => PostShallow.toJs(postShallow))
        ->Js.Json.stringifyAny
        ->Option.getWithDefault(""),
      );
      posts;
    };
  };
};

module Podcasts = {
  let parse = ((path, item)) => {
    let front = FrontMatter.parse(item);
    let podcast: Podcast.t = {
      body: Remarkable.render(remarkable, front##body),
      title: front##attributes##title,
      date: front##attributes##date,
      slug: front##attributes##slug,
      oldSlug: front##attributes##oldSlug,
      participants: front##attributes##participants,
      soundcloudTrackId: front##attributes##soundcloudTrackId,
    };
    let podcastShallow: PodcastShallow.t = {
      title: front##attributes##title,
      date: front##attributes##date,
      slug: front##attributes##slug,
      participants: front##attributes##participants,
    };
    Js.log("Podcast " ++ path ++ ": OK");
    (podcast, podcastShallow);
  };
  let get = () => {
    Glob.glob(Path.join([|Process.cwd(), "podcasts/**/**/*.md"|]))
    ->Future.mapOk(SortArray.String.stableSort)
    ->Future.mapOk(Array.reverse)
    ->Future.mapOk(files =>
        files->Array.map(item => (item, Fs.readFileAsUtf8Sync(item)))
      )
    ->Future.mapOk(posts => posts->Array.map(parse));
  };
  module Json = {
    let make = podcasts => {
      createDir();
      podcasts->Array.forEach(((podcast, podcastShallow: PodcastShallow.t)) => {
        let dir = Js.String.split("/", podcastShallow.slug);
        dir
        ->Array.reduce("", (acc, item) => {
            try (
              {
                mkdirSync(
                  Path.join([|Process.cwd(), "build/api/podcasts/" ++ acc|]),
                );
              }
            ) {
            | _ => ()
            };
            acc ++ "/" ++ item;
          })
        ->ignore;
        Fs.writeFileAsUtf8Sync(
          Path.join([|
            Process.cwd(),
            "build/api/podcasts/",
            podcastShallow.slug ++ ".json",
          |]),
          podcast
          ->Podcast.toJs
          ->Js.Json.stringifyAny
          ->Option.getWithDefault(""),
        );
      });
      Fs.writeFileAsUtf8Sync(
        Path.join([|Process.cwd(), "build/api/podcasts/", "all.json"|]),
        podcasts
        ->Array.map(((_, podcastShallow)) =>
            PodcastShallow.toJs(podcastShallow)
          )
        ->Js.Json.stringifyAny
        ->Option.getWithDefault(""),
      );
      podcasts;
    };
  };
};

module Home = {
  open Home;
  let get =
      (~posts: array(PostShallow.t), ~podcasts: array(PodcastShallow.t)) => {
    {
      latestPosts:
        posts
        ->SortArray.stableSortBy((a, b) => b.date > a.date ? (-1) : 1)
        ->Array.sliceToEnd(-7)
        ->Array.reverse,
      postTotalCount: posts->Array.length,
      latestPodcasts:
        podcasts
        ->SortArray.stableSortBy((a, b) => b.date > a.date ? (-1) : 1)
        ->Array.sliceToEnd(-4)
        ->Array.reverse,
      podcastTotalCount: podcasts->Array.length,
    };
  };
  module Json = {
    let make = home => {
      createDir();
      Fs.writeFileAsUtf8Sync(
        Path.join([|Process.cwd(), "build/api/home/", "home.json"|]),
        home->Home.toJs->Js.Json.stringifyAny->Option.getWithDefault(""),
      );
      home;
    };
  };
};
