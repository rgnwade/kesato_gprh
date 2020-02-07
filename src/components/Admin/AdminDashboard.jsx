import React, { Component } from "react";
import { Link } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";

import config from "../../config";

class AdminDashboard extends Component {
  render() {
    return (
      <React.Fragment>
        <FormattedMessage id="admin">
          {title => (
            <Helmet>
              <title>
                {ChangeCase.titleCase(title)} | {config.appName}
              </title>
            </Helmet>
          )}
        </FormattedMessage>
        <section className="section-content container px-6">
          <h2 className="head-title text-uppercase">back office admin</h2>
          <div className="box-listing-menu">
            <p className="text-bold text-center mb-5 sub-title">
              Bienvenu dans votre espace backOffice
            </p>
            <div className="row">
              <div className="col-md-8 offset-md-2">
                <div className="row">
                  <div className="col-md-6">
                    <div className="btn w-100 noradius btn-big cursor-default">
                      gestion des MEMBER GPRH
                    </div>
                    <Link
                      to="/admin/owner/create"
                      className="btn w-100 noradius"
                    >
                      ajouter un gerant
                    </Link>
                    <Link
                      to="/admin/member-on-hold/listing"
                      className="btn w-100 noradius"
                    >
                      MEMBER GPRH en attente
                    </Link>
                    <Link
                      to="/admin/member/listing"
                      className="btn w-100 noradius"
                    >
                      liste des MEMBER GPRH
                    </Link>
                  </div>
                  <div className="col-md-6">
                    <div className="btn w-100 noradius btn-big cursor-default">
                      gestion de la facturation
                    </div>
                    <Link
                      to="/admin/billing/listing"
                      className="btn w-100 noradius"
                    >
                      voir les factures
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

export default AdminDashboard;
