export default function getLang(context) {
  const {
    location,
    metadata,
  } = context
  const {
    i18n,
  } = metadata
  const firstURIlevel = location.pathname.split("/")[1]
  return i18n[firstURIlevel] ? firstURIlevel : "fr"
}
