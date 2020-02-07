import React, { Component } from "react";
import { Link } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";

import config from "../../config";

class OwnerVenueCreateConfirm extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <FormattedMessage id="createVenue">
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
              <div id="box_termine" className="box-form with-shadow">
                <div className="bg-white box-pdd box-border py-5">
                  <h2 className="form-title text-center">Félicitations!</h2>
                  <div className="text-center mt-6">
                    <p>Vous avez ajouté un nouvel établissement.</p>
                    <p>Le statut de votre établissement sera mis à jour dès que le comité aura étudier votre demande.</p>
                    <p>En attendant, vous pouvez régler votre cotisation dans l’onglet “Gérer mes factures”</p>
                  </div>
                  <div className="box-form-button pt-4 mx-auto text-center d-flex">
                    <Link
                      to="/owner/venue/listing"
                      className="btn mx-auto btn-purple text-uppercase w-50"
                    >
                      oui
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

export default OwnerVenueCreateConfirm;
