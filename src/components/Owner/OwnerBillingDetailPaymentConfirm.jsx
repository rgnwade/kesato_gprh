import React, { Component } from "react";
import { Link } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";

import config from "../../config";

class OwnerBillingDetailPaymentConfirm extends Component {
  state = {};

  render() {
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
        <section id="notif_last" className="section-content container">
          <div className="row m-0">
            <div className="col-md-6 offset-md-3 p-0">
              <div id="box_termine" className="box-form with-shadow">
                <div className="bg-white box-pdd box-border py-5">
                  <h2 className="form-title text-center">
                    Merci pour votre paiement
                  </h2>
                  <div className="text-center mt-6">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Aenean dapibus tortor nisl, sit amet ultrices ligula
                      scelerisque at.
                    </p>
                  </div>
                  <div className="box-form-button pt-4 mx-auto text-center d-flex">
                    <Link
                      to="/owner/billing/listing"
                      className="btn mx-auto btn-purple text-uppercase"
                    >
                      Retour sur la console
                    </Link>
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

export default OwnerBillingDetailPaymentConfirm;
