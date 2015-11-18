export default function getLang(context) {
  const {
    location,
    metadata,
  } = context
  const {
    i18n,
    baseUrl,
  } = metadata
  const firstURIlevel = location.pathname
    .replace(baseUrl.pathname, "")
    .split("/")[0]
  return i18n[firstURIlevel] ? firstURIlevel : "en"
}
