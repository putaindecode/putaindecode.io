import invariant from "invariant";

export default function getLang(context) {
  const {
    location,
    metadata: { i18n },
  } = context;

  invariant(location, "'location' is required from the context");
  invariant(i18n, "'metadata.i18n' is required from the context");

  const firstURIlevel = location.pathname.replace(/^\//, "").split("/")[0];
  return i18n[firstURIlevel] ? firstURIlevel : "fr";
}
