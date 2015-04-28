export default function getAuthorUri(author, type) {
  if((!type || type === "homepage") && author.url) {
    return author.url
  }
  else if(type === "twitter") {
    return "https://twitter.com/" + author.twitter
  }

  // fallback to github if not url available
  return "https://github.com/" + author.login
}
