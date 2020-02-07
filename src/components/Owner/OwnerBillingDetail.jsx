import React, { Component } from "react";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";
import DateFormat from "dateformat";

import config from "../../config";
import http from "../../services/httpService";
import DataTableBilling from "../Common/DataTableBilling";

class OwnerBillingDetail extends Component {
  state = {
    column: [
      {
        name: "No de factures",
        key: "order_number",
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
        name: "Date de paiement",
        key: "payment_at",
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
    venue: null
  };

  async componentDidMount() {
    const { data: venue } = await http.get(
      config.apiEndPoint + "venue/" + this.props.match.params.id
    );
    const { data: result } = await http.get(
      config.apiEndPoint + "venue/billing/list/" + this.props.match.params.id
    );
    this.setState({ venue: venue, data: this.cleanData(venue, result) });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.dataTableSearch();
  };

  handleChange = e => {
    this.dataTableSearch();
  };

  cleanData = (venue, rawData) => {
    if (venue && rawData.length) {
      return rawData.map(function(item) {
        const data = {};
        data.id = item.id;
        data.order_number = item.order_number;
        data.venue_id = venue.id;
        data.company_name = venue.company_name;
        data.created_at = DateFormat(item.created_at, "dd.mm.yyyy");
        data.membership_start_date = DateFormat(
          item.membership_start_date,
          "dd.mm.yyyy"
        );
        data.payment_at =
          item.payment_at && item.payment_at !== ""
            ? DateFormat(item.payment_at, "dd.mm.yyyy")
            : "-";
        if (item.status === "pending_payment")
          data.status = `<span class="btn bg-warning text-white">En Suspens</span>`;
        else if (item.status === "completed")
          data.status = `<span class="btn bg-stabilo text-white">Payé</span>`;
        else
          data.status = `<span class="btn bg-stabilo text-white">En Retard</span>`;
        data.status_value = item.status;
        return data;
      });
    }
    return null;
  };

  // dataTableSearch = async () => {
  //   const { data: result } = await http.post(
  //     config.apiEndPoint + "venue/user/" + user.id + "/search",
  //     {
  //       keyword: this.refs.keyword.value
  //     }
  //   );
  //   this.setState({ data: this.cleanData(result) });
  // };

  render() {
    const { venue, data } = this.state;

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
                <h3 className="text-title mb-0">
                  <span className="text-uppercase">
                    gérer mes etablissements
                  </span>{" "}
                  <i className="fa fa-angle-right" aria-hidden="true" />{" "}
                  <span>{venue && venue.company_name}</span>
                </h3>
                <form
                  className="my-form form-search-listing"
                  onSubmit={this.handleSubmit}
                >
                  {/* <div className="position-relative">
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
                  </div> */}
                </form>
              </div>
              <DataTableBilling
                column={this.state.column}
                data={data}
                rowLink="/owner/venue/billing/detail/"
              />
              <div className="box-form-button my-form pt-5 text-center d-flex justify-content-end w-100 mw-100">
                <Link
                  to="/owner/billing/listing"
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

export default OwnerBillingDetail;
