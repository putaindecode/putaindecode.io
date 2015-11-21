import pkg from "../package.json"
import i18n from "i18n"
import contributors from "../contributors.json"

export default {
  baseUrl: __BASE_URL__,
  pkg,
  i18n,
  contributors: {
    ...contributors,
    getContributor: (contributor) => {
      return (
        contributors.map[contributor]
        ? contributors.map[contributor]
        : {
          login: contributor,
          name: contributor,
        }
      )
    },
  },
}
