include CssReset

@react.component
let make = (~url: RescriptReactRouter.url, ~config as _, ()) => {
  React.useEffect1(() => {
    let () = window["scrollTo"](. 0, 0)
    None
  }, [url.path->List.toArray->Array.joinWith("/")])

  <>
    <Pages.Head>
      <html lang="fr" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
      />
      <meta name="description" content=`Blog participatif de la communauté dev` />
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="og:site_name" content="Putain de code !" />
      <meta name="twitter:site" content="@putaindecode" />
      <meta property="og:title" content="Putain de code" />
      <meta name="twitter:title" content="Putain de code" />
      <meta property="og:image" content="https://putaindecode.io/public/images/website/share.jpg" />
      <meta
        name="twitter:image" content="https://putaindecode.io/public/images/website/share.jpg"
      />
      <meta property="og:image:width" content="1500" />
      <meta property="og:image:height" content="777" />
      <link
        rel="alternate"
        type_="application/rss+xml"
        href="/api/articles/feeds/desc/feed.xml"
        title="RSS Feed"
      />
      <link rel="shortcut icon" href={Pages.makeBaseUrl("/favicon.ico")} />
      <link
        rel="canonical"
        href={"https://putaindecode.io/" ++ url.path->List.toArray->Array.joinWith("/")}
      />
    </Pages.Head>
    <Header
      url
      gradient=?{switch url.path {
      | list{"articles", slug} => Some(Gradient.fromString(slug))
      | _ => None
      }}
    />
    {switch url.path {
    | list{} => <Homepage />
    | list{"podcasts"} => <PodcastEpisodeList search=url.search />
    | list{"podcasts", slug} => <PodcastEpisode slug />
    | list{"articles"} => <ArticleList search=url.search />
    | list{"articles", slug} =>
      <Article
        slug
        hash={url.hash}
        canonical={"https://putaindecode.io/" ++ url.path->List.toArray->Array.joinWith("/")}
      />
    | _ => <ErrorPage />
    }}
    <FollowUs />
    <Footer />
  </>
}

let getUrlsToPrerender = ({Pages.getAll: getAll}) =>
  Belt.Array.concatMany([
    ["/", "/articles", "/podcasts"],
    getAll("articles")->Array.map(item => "/articles/" ++ item),
    getAll("podcasts")->Array.map(item => "/podcasts/" ++ item),
    ["404.html"],
  ])

let default = Pages.make(
  make,
  {
    siteTitle: "Putain de Code!",
    mode: SPA,
    siteDescription: `Blog participatif de la communauté dev`,
    distDirectory: "build",
    baseUrl: "https://putaindecode.io",
    staticsDirectory: Some("statics"),
    paginateBy: 7,
    variants: [
      {
        subdirectory: None,
        localeFile: None,
        contentDirectory: "contents",
        getUrlsToPrerender: getUrlsToPrerender,
        getRedirectMap: Some(
          ({getAllItems}) =>
            getAllItems("articles")
            ->Belt.Array.keepMap(item =>
              item.meta
              ->Dict.get("oldSlug")
              ->Option.flatMap(oldSlug =>
                switch oldSlug->JSON.Decode.classify {
                | String(oldSlug) => Some(oldSlug)
                | _ => None
                }
              )
              ->Option.map(oldSlug => [
                ("/articles/" ++ (oldSlug ++ ".html"), "/articles/" ++ item.slug),
                ("/articles/" ++ oldSlug, "/articles/" ++ item.slug),
                ("/fr/articles/" ++ (oldSlug ++ ".html"), "/articles/" ++ item.slug),
                ("/fr/articles/" ++ oldSlug, "/articles/" ++ item.slug),
              ])
            )
            ->Belt.Array.concatMany
            ->Dict.fromArray,
        ),
      },
    ],
  },
)
