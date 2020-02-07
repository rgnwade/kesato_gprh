import React, { Component } from "react";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";
import DateFormat from "dateformat";

import config from "../../config";
import http from "../../services/httpService";
import auth from "../../services/authService";
import DataTable from "../Common/DataTable";

class OwnerBillingListing extends Component {
  state = {
    column: [
      {
        name: "N° de membre",
        key: "id",
        sortable: true,
        className: "text-blue"
      },
      {
        name: "Nom de l'établissement",
        key: "company_name",
        sortable: true,
        className: "text-blue"
      },
      {
        name: "Date d'inscription",
        key: "created_at",
        sortable: true,
        className: "text-black"
      },
      {
        name: "Date d'échéance",
        key: "membership_start_date",
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
    const user = auth.getAuthUser();
    const { data: result } = await http.get(
      config.apiEndPoint + "venue/user/" + user.id
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
        data.company_name = item.company_name;
        data.created_at = DateFormat(item.created_at, "dd.mm.yyyy");
        data.membership_start_date = DateFormat(
          item.membership_start_date,
          "dd.mm.yyyy"
        );
        if (item.status === "0")
          data.status = `<span class="btn bg-red text-white">Refusé</span>`;
        else if (item.status === "1")
          data.status = `<span class="btn bg-warning text-white">En Attente</span>`;
        else if (item.status === "2")
          data.status = `<span class="btn bg-strong-purple text-white">Résillé</span>`;
        else
          data.status = `<span class="btn bg-stabilo text-white">Validé</span>`;
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
        <FormattedMessage id="managerBilling">
          {title => (
            <Helmet>
              <title>
                {ChangeCase.titleCase(title)} | {config.appName}
              </title>
            </Helmet>
          )}
        </FormattedMessage>
        <section className="section-content container">
          <h2 className="head-title text-uppercase">gérer mes factures</h2>
          <div className="box-listing">
            <div id="listing_">
              <div className="text-with-search d-flex justify-content-between align-items-center">
                <h3 className="text-title mb-0 text-uppercase">
                  <span className="text-uppercase">gérer mes factures</span>{" "}
                  <i className="fa fa-angle-right" aria-hidden="true" />
                </h3>
                <form
                  className="my-form form-search-listing"
                  onSubmit={this.handleSubmit}
                >
                  <div className="position-relative">
                    <input
                      type="text"
                      name="keyword"
                      ref="keyword"
                      className="form-control"
                      placeholder="Rechercher par nom"
                      onChange={this.handleChange}
                    />
                    <button type="submit" className="btn">
                      <i className="fa fa-search" aria-hidden="true" />
                    </button>
                  </div>
                </form>
              </div>
              <DataTable
                column={this.state.column}
                data={this.state.data}
                rowLink="/owner/venue/billing/"
              />
              <div className="box-form-button my-form pt-5 text-center d-flex justify-content-end w-100 mw-100">
                <Link
                  to="/owner/dashboard"
                  className="btn btn-transaprent-border-purple text-uppercase mr-3 px-5"
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

export default OwnerBillingListing;
