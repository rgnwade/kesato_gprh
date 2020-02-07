import React, { Component } from "react";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";
import DateFormat from "dateformat";

import config from "../../config";
import http from "../../services/httpService";
// import DataTableCustomLink from "../Common/DataTableCustomLink";
import DataTableBilling from "../Common/DataTableBilling";

class AdminBillingListing extends Component {
  state = {
    column: [
      {
        name: "N° de facture",
        key: "order_number",
        sortable: true,
        className: "text-blue"
      },
      {
        name: "Nom de l'etablissement",
        key: "etablissement",
        sortable: true,
        className: "text-blue"
      },
      {
        name: "Date de la facture",
        key: "create_at",
        sortable: true,
        className: "text-black text-center"
      },
      {
        name: "Date d'échéance",
        key: "payment_due",
        sortable: true,
        className: "text-black text-center"
      },
      {
        name: "Date de paiement",
        key: "payment_at",
        sortable: true,
        className: "text-black text-center"
      },
      {
        name: "Statut",
        key: "status",
        sortable: false,
        className: "text-black"
      }
    ],
    data: null,
    searchParam: {
      keyword: "",
      type: "",
      status: "",
      limit: 20,
      page: 1
    },
    payment_day: DateFormat(new Date(), "d"),
    payment_month: DateFormat(new Date(), "m"),
    payment_year: DateFormat(new Date(), "yyyy"),
    payment_provider_id: "1",
    billingPaid: null,
    showModal: false
  };

  async componentDidMount() {
    this.dataTableSearch();
  }

  handleSubmit = e => {
    e.preventDefault();
    const searchParam = this.state.searchParam;
    searchParam.keyword = this.refs.keyword.value;
    this.setState({ searchParam: searchParam });
    this.dataTableSearch();
  };

  handleChange = e => {
    const searchParam = this.state.searchParam;
    searchParam.keyword = this.refs.keyword.value;
    this.setState({ searchParam: searchParam });
    this.dataTableSearch();
  };

  handleFilterStatus = status => {
    const searchParam = this.state.searchParam;
    searchParam.status = status;
    this.setState({ searchParam: searchParam });
    this.dataTableSearch();
  };

  handlePayment = billingId => {
    var {
      showModal,
      billingPaid,
      payment_provider_id,
      payment_day,
      payment_month,
      payment_year
    } = this.state;
    showModal = true;
    billingPaid = billingId;
    payment_provider_id = "1";
    payment_day = DateFormat(new Date(), "d");
    payment_month = DateFormat(new Date(), "m");
    payment_year = DateFormat(new Date(), "yyyy");
    this.setState({
      showModal: showModal,
      billingPaid: billingPaid,
      payment_provider_id: payment_provider_id,
      payment_day: payment_day,
      payment_month: payment_month,
      payment_year: payment_year
    });
  };

  handleCloseModal = () => {
    var { showModal } = this.state;
    showModal = false;
    this.setState({ showModal: showModal });
  };

  handleChangePayment = e => {
    if (e.currentTarget.name === "payment_day") {
      this.setState({ payment_day: e.currentTarget.value });
    } else if (e.currentTarget.name === "payment_month") {
      this.setState({ payment_month: e.currentTarget.value });
    } else if (e.currentTarget.name === "payment_year") {
      this.setState({ payment_year: e.currentTarget.value });
    } else if (e.currentTarget.name === "payment_provider_id") {
      this.setState({ payment_provider_id: e.currentTarget.value });
    }
  };

  handleAddPayment = async () => {
    const param = {};
    param.billing_id = this.state.billingPaid;
    param.payment_provider_id = this.state.payment_provider_id;
    param.payment_at = DateFormat(
      new Date(
        this.state.payment_year,
        parseInt(this.state.payment_month) - 1,
        this.state.payment_day
      ),
      "yyyy-mm-dd"
    );
    const { data: result } = await http.post(
      config.apiEndPoint + "billing/payment/update",
      { param: param }
    );
    if (result) this.props.history.push("/admin/billing/listing");
  };

  cleanData = rawData => {
    if (rawData.length) {
      return rawData.map(function(item) {
        const data = {};
        data.id = item.id;
        data.order_number = item.order_number;
        data.etablissement = item.etablissement;
        data.link = "/admin/billing/detail/" + item.order_number;
        data.create_at = DateFormat(item.created_at, "dd.mm.yyyy");
        data.payment_due = DateFormat(item.payment_due, "dd.mm.yyyy");
        data.payment_at =
          item.payment_at === null || item.payment_at === ""
            ? "-"
            : DateFormat(item.payment_at, "dd.mm.yyyy");
        if (item.status === "pending_payment")
          data.status = `<span class="btn btn-warning text-white">En Suspens</span>`;
        else if (item.status === "completed")
          data.status = `<span class="btn bg-success text-white">Payé</span>`;
        else
          data.status = `<span class="btn bg-danger text-white">En Retard</span>`;
        data.status_value = item.status;
        return data;
      });
    }
    return null;
  };

  dataTableSearch = async () => {
    const { data: result } = await http.post(
      config.apiEndPoint + "billing/list",
      { param: this.state.searchParam }
    );
    this.setState({ data: this.cleanData(result) });
  };

  render() {
    const { searchParam } = this.state;

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
        <section className="section-content container">
          <h2 className="head-title text-uppercase">
            gestion de la facturation
          </h2>
          <div className="box-listing">
            <div id="listing_">
              <div className="text-with-search d-flex justify-content-between align-items-center">
                <h3 className="text-title mb-0 text-uppercase">
                  <span className="text-uppercase">voir les factures</span>{" "}
                  <i className="fa fa-angle-right" aria-hidden="true" />
                </h3>
              </div>
              <div className="listing-filter mb-5">
                <div className="row">
                  <div className="col-md-9">
                    <div className="topsection">
                      <span
                        className="text-bold mr-3"
                        style={{ width: "60px", display: "inline-block" }}
                      >
                        Statut :
                      </span>
                      <button
                        type="button"
                        onClick={() => this.handleFilterStatus("")}
                        className={
                          "btn btn-status btn-purple btn-transaprent-border-purple-thin text-uppercase mr-2 " +
                          (searchParam.status === "" ? "active" : "")
                        }
                      >
                        Tous
                      </button>
                      <button
                        type="button"
                        onClick={() => this.handleFilterStatus("completed")}
                        className={
                          "btn btn-status btn-pay border-success text-success mr-2 " +
                          (searchParam.status === "completed" ? "active" : "")
                        }
                      >
                        Payé
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          this.handleFilterStatus("pending_payment")
                        }
                        className={
                          "btn btn-status btn-review border-warning text-warning mr-2 " +
                          (searchParam.status === "pending_payment"
                            ? "active"
                            : "")
                        }
                      >
                        En Suspens
                      </button>
                      <button
                        type="button"
                        onClick={() => this.handleFilterStatus("canceled")}
                        className={
                          "btn btn-status btn-late border-danger text-danger mr-2 " +
                          (searchParam.status === "canceled" ? "active" : "")
                        }
                      >
                        En Retard
                      </button>
                    </div>
                  </div>
                  <div className="col-md-3">
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
                </div>
              </div>
              <DataTableBilling
                column={this.state.column}
                data={this.state.data}
                handlePayment={this.handlePayment}
              />
              <div className="box-form-button my-form pt-5 text-center d-flex justify-content-end w-100 mw-100">
                <Link
                  to="/admin/dashboard"
                  className="btn btn-transaprent-border-purple text-uppercase mr-3 px-5"
                >
                  retour
                </Link>
              </div>
            </div>
          </div>
        </section>
        <div
          className={"popup-modal " + (this.state.showModal ? "active" : "")}
        >
          <div className="modal-box">
            <form className="my-form">
              <h2
                className="form-title text-center"
                style={{ fontSize: "20px", marginBottom: "30px" }}
              >
                Comptabilisation du paiment
              </h2>
              <div className="row">
                <div className="col-md-12">
                  <h3
                    className="text-center"
                    style={{ fontSize: "18px", color: "#999" }}
                  >
                    Date du paiement
                  </h3>
                  <div className="row mb-5">
                    <div className="col-md-4">
                      <input
                        type="number"
                        className="form-control text-center"
                        placeholder="Jour*"
                        min="1"
                        max="31"
                        name="payment_day"
                        value={this.state.payment_day}
                        onChange={this.handleChangePayment}
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="number"
                        className="form-control text-center"
                        placeholder="Mois*"
                        min="1"
                        max="12"
                        name="payment_month"
                        value={this.state.payment_month}
                        onChange={this.handleChangePayment}
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="number"
                        className="form-control text-center"
                        placeholder="Anée*"
                        min="1900"
                        name="payment_year"
                        value={this.state.payment_year}
                        onChange={this.handleChangePayment}
                      />
                    </div>
                  </div>
                  <h3
                    className="text-center"
                    style={{ fontSize: "18px", color: "#999" }}
                  >
                    Type d'encaissement
                  </h3>
                  <div className="row mb-4 justify-content-center">
                    <div className="radio-custom text-right mr-3">
                      <input
                        type="radio"
                        name="payment_provider_id"
                        checked={
                          (this.state.payment_provider_id === "1" ||
                            this.state.payment_provider_id === 1) &&
                          "checked"
                        }
                        value="1"
                        onChange={this.handleChangePayment}
                      />
                      <label>Cash</label>
                    </div>
                    <div className="radio-custom text-right mr-3">
                      <input
                        type="radio"
                        name="payment_provider_id"
                        checked={
                          (this.state.payment_provider_id === "2" ||
                            this.state.payment_provider_id === 2) &&
                          "checked"
                        }
                        value="2"
                        onChange={this.handleChangePayment}
                      />
                      <label>Carte de crédit</label>
                    </div>
                    <div className="radio-custom text-right mr-3">
                      <input
                        type="radio"
                        name="payment_provider_id"
                        checked={
                          (this.state.payment_provider_id === "3" ||
                            this.state.payment_provider_id === 3) &&
                          "checked"
                        }
                        value="3"
                        onChange={this.handleChangePayment}
                      />
                      <label>Virement</label>
                    </div>
                  </div>
                  <div className="box-form-button my-form text-center d-flex w-100 mw-100 mt-5 justify-content-center">
                    <button
                      onClick={this.handleCloseModal}
                      type="button"
                      className="btn btn-transaprent-border-purple text-uppercase px-4 btn_back_compte mr-3"
                    >
                      annuler
                    </button>
                    <button
                      onClick={this.handleAddPayment}
                      type="button"
                      className="btn btn-purple text-uppercase px-4 btn_back_compte"
                    >
                      enregistrer
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AdminBillingListing;
