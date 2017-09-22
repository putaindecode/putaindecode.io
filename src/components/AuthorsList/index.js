import React, { PropTypes } from "react"
import { Link } from "react-router"

// import getAuthorUri from "../getAuthorUri"
import getLang from "../../i18n/getLang"
import getI18n from "../../i18n/get"

const AuthorsList = ({ authors }, context) => {
  const { metadata } = context
  const lang = getLang(context)
  const i18n = getI18n(context)
  return (
    <span>
    {
      authors.map((authorKey, index) => {
        const author = metadata.contributors.getContributor(authorKey)
        let glue = ""
        // 2 authors or more : X, Y and Z
        if (authors.length > 1 && index === authors.length - 2) {
          glue = " " + i18n.and + " "
        }
        else if (index !== authors.length - 1) {
          glue = ", "
        }
        return (
          [
            <Link
              key={author}
              to={ `/${ lang }/author/${ encodeURIComponent(author.login) }` }
            >
              { author.login }
            </Link>,
            <span key={ `${author}-glue` }>{ glue }</span>,
          ]
        )
      })
    }
    </span>
  )
}

AuthorsList.contextTypes = {
  metadata: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

AuthorsList.propTypes = {
  authors: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default AuthorsList
