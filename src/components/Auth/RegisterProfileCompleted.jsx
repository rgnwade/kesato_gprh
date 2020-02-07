import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";

import config from "../../config";
import auth from "../../services/authService";

class RegisterProfileCompleted extends Component {
  state = {
    data: [],
    notification: []
  };

  render() {
    if (!auth.getAuthUser("owner")) return <Redirect to="/auth/login/owner" />;

    return (
      <React.Fragment>
        <FormattedMessage id="manager">
          {title => (
            <Helmet>
              <title>
                {ChangeCase.titleCase(title)} | {config.appName}
              </title>
            </Helmet>
          )}
        </FormattedMessage>
        <section className="section-content container">
          <div className="row m-0">
            <div className="col-md-6 offset-md-3 p-0">
              <div className="box-form with-shadow">
                <div className="bg-white box-pdd box-border">
                  <h2 className="form-title text-center">
                    Information sur le MEMBER GPRH
                  </h2>
                  <div className="position-relative text-center">
                    <ul className="box-progress">
                      <li className="active" />
                      <li className="active" />
                      <li className="active" />
                    </ul>
                  </div>
                  <div className="box-in-form text-center">
                    <p className="title">Félicitation!</p>
                    <p className="title">
                      Merci de cliquer sur le lien pour terminer votre
                      inscription et pour ajouter votre ètablissement.
                    </p>
                    <br />
                    <Link
                      to="/owner/dashboard"
                      className="btn btn-purple text-uppercase mt-4"
                    >
                      Ajouter mon etablissement
                    </Link>
                    <p />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default RegisterProfileCompleted;
