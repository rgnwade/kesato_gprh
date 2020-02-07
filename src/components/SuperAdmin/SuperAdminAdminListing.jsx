import React, { Component } from "react";
import { Link } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";

import config from "../../config";
import http from "../../services/httpService";
import auth from "../../services/authService";
import DataTable from "../Common/DataTable";

class SuperAdminAdminListing extends Component {
  state = {
    column: [
      {
        name: "N° de membre",
        key: "id",
        sortable: true,
        className: "text-blue"
      },
      {
        name: "Admin",
        key: "name",
        sortable: true,
        className: "text-blue"
      },
      {
        name: "Type",
        key: "role",
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
    data: null
  };

  async componentDidMount() {
    const { data: result } = await http.get(
      config.apiEndPoint + "auth/user/admin/list"
    );
    this.setState({ data: this.cleanData(result) });
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
        data.name = item.first_name + " " + item.last_name;
        data.type = item.role.role;
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
          <h2 className="head-title text-uppercase">Liste de admins</h2>
          <div className="box-listing">
            <div id="listing_">
              <div className="text-with-search d-flex justify-content-between align-items-center">
                <h3 className="text-title mb-0 text-uppercase">
                  <span className="text-uppercase">Liste de admins</span>{" "}
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
                {/* <div className="listing-head">
                  <div className="row">
                    <div className="col-md-2">
                      <span>
                        N° de membre{" "}
                        <i className="fa fa-angle-down" aria-hidden="true" />
                      </span>
                    </div>
                    <div className="col-md-6">
                      <span>
                        ADMIN{" "}
                        <i className="fa fa-angle-down" aria-hidden="true" />
                      </span>
                    </div>
                    <div className="col-md-2">
                      <span>
                        Type{" "}
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
                      <span className="color-link">Mary Poppins</span>
                    </div>
                    <div className="col-md-2">
                      <span className="text-uppercase">admin</span>
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
                      <span className="color-link">Mary Poppins</span>
                    </div>
                    <div className="col-md-2">
                      <span className="text-uppercase">super admin</span>
                    </div>
                    <div className="col-md-2 text-right">
                      <button type="button" className="btn bg-stabilo">
                        Actif
                      </button>
                    </div>
                  </div>
                </div> */}
              </div>
              <DataTable
                column={this.state.column}
                data={this.state.data}
                rowLink="/superadmin/admin/detail/"
              />
              <div className="box-form-button my-form pt-5 text-center d-flex justify-content-end w-100 mw-100">
                <Link
                  to="/superadmin/dashboard"
                  className="btn btn-transaprent-border-purple text-uppercase px-5 mr-3"
                >
                  retour
                </Link>
                {/* <Link
                  to="/superadmin/admin/create"
                  id="btn_to_creation"
                  className="btn btn-purple text-uppercase px-5"
                >
                  creer un nouvel utilisateur
                </Link> */}
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default SuperAdminAdminListing;
