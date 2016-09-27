import React, { PropTypes } from "react"

// import getI18n from "../../i18n/get"
import Contributors from "../../components/Contributors"
import WithHeroHeader from "../WithHeroHeader"

const AdventCalendar = (props) => (
  <WithHeroHeader { ...props } meta={ false } tags={ false }>
    <div className="r-Grid">
      <div className="r-Grid-cell r-minM--8of12 putainde-Post-contents">
        <div className="putainde-Post-md">
          <div
            dangerouslySetInnerHTML={{ __html: props.body }}
          />
        </div>

        <footer className="putainde-Post-footer">

          <Contributors filename={props.__filename} />

        </footer>
      </div>
    </div>
  </WithHeroHeader>
)

AdventCalendar.propTypes = {
  __url: PropTypes.string.isRequired,
  __filename: PropTypes.string.isRequired,
  head: PropTypes.object.isRequired,
  body: PropTypes.string.isRequired,
  rawBody: PropTypes.string.isRequired,
}

AdventCalendar.contextTypes = {
  metadata: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default AdventCalendar
