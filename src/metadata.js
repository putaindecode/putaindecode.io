import pkg from "../package.json";
import i18n from "./i18n";
import contributors from "../cache/contributors.json";

export default {
  pkg,
  i18n,
  contributors: {
    ...contributors,
    getContributor: contributor => {
      return contributors.map[contributor]
        ? contributors.map[contributor]
        : {
            login: contributor,
            name: contributor,
          };
    },
  },
};
