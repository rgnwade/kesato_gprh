import React, { Component } from "react";
import { Link } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";

import config from "../../config";

class SuperAdminDashboard extends Component {
  render() {
    return (
      <React.Fragment>
        <FormattedMessage id="superAdmin">
          {title => (
            <Helmet>
              <title>
                {ChangeCase.titleCase(title)} | {config.appName}
              </title>
            </Helmet>
          )}
        </FormattedMessage>
        <section className="section-content container px-6">
          <h2 className="head-title text-uppercase">back office super admin</h2>
          <div className="box-listing-menu">
            <p className="text-bold text-center mb-5 sub-title">
              Bienvenu dans votre espace SUPER ADMIN
            </p>
            <div className="row">
              <div className="col-md-8 offset-md-2">
                <div className="row">
                  <div className="col-md-6">
                    <Link
                      to="/superadmin/admin/listing"
                      className="btn w-100 noradius"
                    >
                      gestion des admins
                    </Link>
                    <Link
                      to="/superadmin/product/listing"
                      className="btn w-100 noradius"
                    >
                      Ajouter des produits membre
                    </Link>
                    <Link
                      to="/superadmin/dashboard"
                      className="btn disabled w-100 noradius hide"
                    >
                      Ajouter des produits élèves
                    </Link>
                    <Link
                      to="/superadmin/course/listing"
                      className="btn w-100 noradius"
                    >
                      Session de cours
                    </Link>
                    <Link
                      to="/superadmin/reminder"
                      className="btn w-100 noradius"
                    >
                      Réglage des rappels
                    </Link>
                    <Link
                      to="/superadmin/autorenew"
                      className="btn w-100 noradius"
                    >
                      Renouvellement automatique
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

export default SuperAdminDashboard;
