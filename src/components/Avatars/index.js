import React, { PropTypes } from "react";
import cx from "classnames";

import Avatar from "../Avatar";

const Avatars = ({ authors, className }) => (
  <div
    className={cx(
      {
        "putainde-Avatars": true,
        "putainde-Avatars--multi": authors.length > 1,
        [`putainde-Avatars--${authors.length}`]: authors.length > 1,
      },
      className,
    )}
  >
    {authors.map(author => {
      return (
        <div key={author} className="putainde-List-avatars-author">
          <Avatar
            author={author}
            className="putainde-List-avatars-author-avatar"
          />
        </div>
      );
    })}
  </div>
);

Avatars.propTypes = {
  className: PropTypes.string,
  authors: PropTypes.arrayOf(PropTypes.string).isRequired,
  size: PropTypes.number,
};

Avatars.contextTypes = {
  i18n: PropTypes.object,
};

export default Avatars;
