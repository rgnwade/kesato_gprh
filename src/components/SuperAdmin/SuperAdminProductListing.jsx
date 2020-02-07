import React, { Component } from "react";
import { Link } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";

import config from "../../config";
import http from "../../services/httpService";
import auth from "../../services/authService";
import Number from "../../helpers/number";
import DataTable from "../Common/DataTable";

class SuperAdminProductListing extends Component {
  state = {
    column: [
      {
        name: "No",
        key: "id",
        sortable: true,
        className: "text-blue"
      },
      {
        name: "Designation",
        key: "name",
        sortable: true,
        className: "text-blue"
      },
      {
        name: "Prix",
        key: "price",
        sortable: true,
        className: "text-black"
      },
      {
        name: "Statut",
        key: "status",
        sortable: false,
        className: "text-black"
      }
    ],
    data: null,
    setting: {commerce_base_currency: "CHF"}
  };

  async componentDidMount() {
    const { data: result } = await http.get(
      config.apiEndPoint + "product/list"
    );
    const { data: setting } = await http.get(
      config.apiEndPoint + "setting/list"
    );
    this.setState({ data: this.cleanData(result), setting: setting });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.dataTableSearch();
  };

  handleChange = e => {
    this.dataTableSearch();
  };

  cleanData = rawData => {
    if (rawData.length) {
      return rawData.map(function(item) {
        const data = {};
        data.id = item.id;
        data.name = item.name;
        data.price = Number.formatedPrice(item.price, "CHF", config.locale.code);
        if (item.status === "0")
          data.status = `<span class="btn bg-warning">Inactif</span>`;
        else data.status = `<span class="btn bg-stabilo">Actif</span>`;
        return data;
      });
    }
    return null;
  };

  dataTableSearch = async () => {
    const user = auth.getAuthUser();
    const { data: result } = await http.post(
      config.apiEndPoint + "venue/user/" + user.id + "/search",
      {
        keyword: this.refs.keyword.value
      }
    );
    this.setState({ data: this.cleanData(result) });
  };

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
        <section id="box_listing" className="section-content container px-6">
          <h2 className="head-title text-uppercase">gestion produit membre</h2>
          <div className="box-listing">
            <div id="listing_">
              <div className="text-with-search d-flex justify-content-between align-items-center">
                <h3 className="text-title mb-0 text-uppercase">
                  <span className="text-uppercase">Liste de produits</span>{" "}
                  <i className="fa fa-angle-right" aria-hidden="true" />
                </h3>
              </div>
              <div className="listing-table">
                <div className="text-right mb-2">
                  {/* <button
                    type="button"
                    className="btn bg-transparent color-link"
                  >
                    Export en CSV
                  </button> */}
                </div>
                {/*
                <div className="listing-head">
                  <div className="row">
                    <div className="col-md-2">
                      <span>
                        N° de membre{" "}
                        <i className="fa fa-angle-down" aria-hidden="true" />
                      </span>
                    </div>
                    <div className="col-md-6">
                      <span>
                        Désignation{" "}
                        <i className="fa fa-angle-down" aria-hidden="true" />
                      </span>
                    </div>
                    <div className="col-md-2">
                      <span>
                        Prix{" "}
                        <i className="fa fa-angle-down" aria-hidden="true" />
                      </span>
                    </div>
                    <div className="col-md-2 text-right">
                      <span>
                        Statut{" "}
                        <i className="fa fa-angle-down" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="listing-row">
                  <div className="row align-items-center">
                    <div className="col-md-2">
                      <span className="color-link">14563</span>
                    </div>
                    <div className="col-md-6">
                      <span className="color-link">Frais d'inscripion</span>
                    </div>
                    <div className="col-md-2">
                      <span className="text-uppercase">CHF 0.00</span>
                    </div>
                    <div className="col-md-2 text-right">
                      <button type="button" className="btn bg-stabilo">
                        Actif
                      </button>
                    </div>
                  </div>
                </div>
                <div className="listing-row">
                  <div className="row align-items-center">
                    <div className="col-md-2">
                      <span className="color-link">14563</span>
                    </div>
                    <div className="col-md-6">
                      <span className="color-link">
                        Cotisation annuelle GPRH
                      </span>
                    </div>
                    <div className="col-md-2">
                      <span className="text-uppercase">CHF 990.00</span>
                    </div>
                    <div className="col-md-2 text-right">
                      <button type="button" className="btn bg-stabilo">
                        Actif
                      </button>
                    </div>
                  </div>
                </div>
                <div className="listing-row">
                  <div className="row align-items-center">
                    <div className="col-md-2">
                      <span className="color-link">14563</span>
                    </div>
                    <div className="col-md-6">
                      <span className="color-link">
                        Cotisation annuelle GPRH + Suisse Hotel
                      </span>
                    </div>
                    <div className="col-md-2">
                      <span className="text-uppercase">CHF 1990.00</span>
                    </div>
                    <div className="col-md-2 text-right">
                      <button type="button" className="btn bg-stabilo">
                        Actif
                      </button>
                    </div>
                  </div>
                </div>
                */}
                <DataTable
                  column={this.state.column}
                  data={this.state.data}
                  rowLink="/superadmin/product/detail/"
                />
              </div>
              <div className="box-form-button my-form pt-5 text-center d-flex justify-content-end w-100 mw-100">
                <Link
                  to="/superadmin/product/create"
                  id="btn_to_edit"
                  className="btn btn-purple text-uppercase px-5 mr-3"
                >
                  Ajout D'Un Nouveau produit
                </Link>
                <Link
                  to="/superadmin/dashboard"
                  className="btn btn-transaprent-border-purple text-uppercase px-5"
                >
                  retour
                </Link>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default SuperAdminProductListing;
