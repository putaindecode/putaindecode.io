export function getLocales() {
  return navigator.languages
    ? navigator.languages
    : // only one :(
      navigator.language
      ? [navigator.language]
      : // IE
        navigator.userLanguage
        ? [navigator.userLanguage]
        : [];
}

export function filterSupportedLocales(
  supportedLocales,
  locales = getLocales(),
) {
  return supportedLocales.filter(
    supportedLocale =>
      locales.filter(
        locale =>
          locale === supportedLocale ||
          locale.indexOf(supportedLocale + "-") === 0,
      ).length > 0,
  );
}

export default function supportLocale({ locale, supportedLocales, locales }) {
  return filterSupportedLocales(supportedLocales, locales).includes(locale);
}
