import React, { PropTypes } from "react";
import Helmet from "react-helmet";

import getLang from "./i18n/getLang";
import getI18n from "./i18n/get";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GoogleAnalyticsTracker from "./components/GoogleAnalyticsTracker";

const Layout = ({ children, params }, context) => {
  const i18n = getI18n(context);
  const locale = getLang(context);

  return (
    <div className="r-VerticalRhythm" lang={locale}>
      <GoogleAnalyticsTracker params={params}>
        <Helmet
          meta={[
            { property: "og:site_name", content: i18n.title },
            { name: "twitter:site", content: `@${i18n.twitterUsername}` },
          ]}
        />
        <Header />
        {children}
        <Footer />
      </GoogleAnalyticsTracker>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  params: PropTypes.object,
};

Layout.contextTypes = {
  metadata: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default Layout;
