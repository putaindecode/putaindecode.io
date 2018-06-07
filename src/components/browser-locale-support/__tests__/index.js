import test from "tape";

import supportLocale from "..";

test("browser locale support", t => {
  t.equal(
    supportLocale({
      locale: "fr",
      supportedLocales: ["fr"],
      locales: ["fr"],
    }),
    true,
    "should support an available locale",
  );

  t.equal(
    supportLocale({
      locale: "en",
      supportedLocales: ["fr"],
      locales: ["fr"],
    }),
    false,
    "should not support an unavailable locale",
  );

  t.equal(
    supportLocale({
      locale: "en",
      supportedLocales: ["fr"],
      locales: ["fr", "en"],
    }),
    false,
    "should not support an available locale that is not supported",
  );

  t.equal(
    supportLocale({
      locale: "en",
      supportedLocales: ["fr", "en"],
      locales: ["fr", "en"],
    }),
    true,
    "should support an available locale that is supported",
  );

  t.equal(
    supportLocale({
      locale: "en",
      supportedLocales: ["fr", "en"],
      locales: ["en-GB"],
    }),
    true,
    "should support an short locale if a longer one match",
  );

  t.equal(
    supportLocale({
      locale: "en-GB",
      supportedLocales: ["fr", "en"],
      locales: ["en"],
    }),
    false,
    "should not support an long locale if a short match",
  );

  t.end();
});
