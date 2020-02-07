import React, { Component } from "react";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";

import config from "../../config";
import auth from "../../services/authService";

class Logout extends Component {
  componentDidMount() {
    const user = auth.getAuthUser();
    if (user) {
      auth.logout();
      window.location = "/auth/login/" + user.role.role;
    } else window.location = "/auth/login/student";
  }

  render() {
    return (
      <FormattedMessage id="logout">
        {title => (
          <Helmet>
            <title>
              {ChangeCase.titleCase(title)} | {config.appName}
            </title>
          </Helmet>
        )}
      </FormattedMessage>
    );
  }
}

export default Logout;
