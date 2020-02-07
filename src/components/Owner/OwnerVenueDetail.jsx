import React, { Component } from "react";
import { Link } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";
import Joi from "joi-browser";
import DateFormat from "dateformat";
import { addDays, subDays, addYears } from "date-fns";

import config from "../../config";
import SelectCountry from "../Common/SelectCountry";
import http from "../../services/httpService";
import auth from "../../services/authService";
import DatePicker from "../Common/DatePicker";

class OwnerVenueDetail extends Component {
  state = {
    data: [],
    notification: [],
    billing: [],
    membership_day: DateFormat(new Date(), "d"),
    membership_month: DateFormat(new Date(), "m"),
    membership_year: DateFormat(new Date(), "yyyy"),
    openStatusButton: false,
    historyFrom: ""
  };

  async componentDidMount() {
    const user = auth.getAuthUser();
    var venue = null;
    if (user.role.role === "owner") {
      const { data: result } = await http.get(
        config.apiEndPoint +
          "venue/" +
          user.id +
          "/" +
          this.props.match.params.id
      );
      venue = result;
    } else if (user.role.role === "admin" || user.role.role === "superadmin") {
      const { data: result } = await http.get(
        config.apiEndPoint + "venue/" + this.props.match.params.id
      );
      venue = result;
    }
    const { data: billing } = await http.get(
      config.apiEndPoint + "venue/billing/list/" + this.props.match.params.id
    );
    const venueLastBilling = billing.length ? billing[0] : [];
    const membership_day = DateFormat(venue.membership_start_date, "d");
    const membership_month = DateFormat(venue.membership_start_date, "m");
    const membership_year = DateFormat(venue.membership_start_date, "yyyy");
    const urlQueryParams = new URLSearchParams(this.props.location.search);
    const historyFrom = urlQueryParams.get("list");
    this.setState({
      data: venue,
      billing: venueLastBilling,
      membership_day: membership_day,
      membership_month: membership_month,
      membership_year: membership_year,
      historyFrom: historyFrom
    });
  }

  schema = {
    membership_day: Joi.string()
      .required()
      .error(new Error("Jour requis!")),
    membership_month: Joi.string()
      .required()
      .error(new Error("Mois requis!")),
    membership_year: Joi.string()
      .required()
      .error(new Error("Anée requis!")),
    company_name: Joi.string()
      .required()
      .error(new Error("Raison sociale requis!")),
    address_line_2: Joi.string()
      .required()
      .error(new Error("Nom de la rue et numéro requis!")),
    postal_code: Joi.string()
      .required()
      .error(new Error("N° Postal requis!")),
    city: Joi.string()
      .required()
      .error(new Error("Ville requis!")),
    country: Joi.string()
      .required()
      .error(new Error("Pays requis!")),
    contact_title: Joi.string()
      .required()
      .error(new Error("Field requis!")),
    contact_first_name: Joi.string()
      .required()
      .error(new Error("Prénom requis!")),
    contact_last_name: Joi.string()
      .required()
      .error(new Error("Nom requis!")),
    contact_mobile: Joi.string()
      .required()
      .error(new Error("Teléphone mobile requis!")),
    contact_email: Joi.string()
      .required()
      .error(new Error("Adresse email requis!"))
  };

  doSubmit = async () => {
    const user = auth.getAuthUser();
    const membership_start_date = DateFormat(new Date(this.state.data.membership_start_date),"yyyy-mm-dd");
    this.state.data.membership_start_date = membership_start_date;
    const plusOneYear = addYears(new Date(this.state.data.membership_start_date),1);
    const membershipEndDate = subDays(new Date(plusOneYear),1);
    this.state.data.membership_end_date = DateFormat(membershipEndDate,"yyyy-mm-dd");
    const { data: result } = await http.post(
      config.apiEndPoint + "venue/update/",
      {
        data: this.state.data
      }
    );
    if (result) {
      if (user.role.role === "owner"){
        this.props.history.push("/owner/venue/listing");
      }
      else if (user.role.role === "admin" || user.role.role === "superadmin"){
        if(this.state.historyFrom === "member-on-hold") this.props.history.push("/" + user.role.role + "/member-on-hold/listing");
        else this.props.history.push("/" + user.role.role + "/member/listing");
      }
    } else this.showError("Invalid data!");
  };

  handleSubmit = e => {
    e.preventDefault();
    const result = Joi.validate(
      {
        membership_day: this.state.membership_day,
        membership_month: this.state.membership_month,
        membership_year: this.state.membership_year,
        contact_title: this.state.data.contact_title,
        contact_first_name: this.state.data.contact_first_name,
        contact_last_name: this.state.data.contact_last_name,
        contact_mobile: this.state.data.contact_mobile,
        contact_email: this.state.data.contact_email,
        company_name: this.state.data.company_name,
        address_line_2: this.state.data.address_line_2,
        postal_code: this.state.data.postal_code,
        city: this.state.data.city,
        country: this.state.data.country
      },
      this.schema
    );
    if (result.error) {
      this.showError(result.error.message);
    } else {
      this.doSubmit();
    }
  };

  openChangeVenueStatus = e => {
    this.setState({ openStatusButton: true });
  };

  handleChangeVenueStatus = status => {
    const { data } = this.state;
    data.status = status;
    this.setState({ openStatusButton: false, data: data });
  };

  handleChangeDatePicker = date => {
    const data = { ...this.state.data };
    data.membership_start_date = date;
    this.setState({ data: data });
  };

  handleChangeAutoRenew = e => {
    const data = { ...this.state.data };
    if (e.currentTarget.checked) {
      data.auto_renew = "1";
    } else {
      data.auto_renew = "0";
    }
    this.setState({ data: data });
  };

  handleChange = e => {
    if (e.currentTarget.name === "membership_day") {
      this.setState({ membership_day: e.currentTarget.value });
    } else if (e.currentTarget.name === "membership_month") {
      this.setState({ membership_month: e.currentTarget.value });
    } else if (e.currentTarget.name === "membership_year") {
      this.setState({ membership_year: e.currentTarget.value });
    } else {
      const data = { ...this.state.data };
      data[e.currentTarget.name] = e.currentTarget.value;
      this.setState({ data: data });
    }
  };

  showError(message) {
    const notification = { ...this.state.notification };
    notification.message = message;
    this.setState({ notification });
  }

  render() {
    const user = auth.getAuthUser();
    const { data, billing } = this.state;

    var venueStatus = `<span class="btn bg-warning text-white cursor-default">En Attente</span>`;
    var venueStatusClass = "bg-warning text-white";
    var venueStatusName = "En Attente";
    if (data && data.status === "3") {
      venueStatus = `<span class="btn bg-danger text-white cursor-default">Refusé</span>`;
      venueStatusClass = "bg-danger text-white";
      venueStatusName = "Refusé";
    } else if (data && data.status === "2") {
      venueStatus = `<span class="btn bg-strong-purple text-white cursor-default">Résilié</span>`;
      venueStatusClass = "bg-strong-purple text-white";
      venueStatusName = "Résilié";
    } else if (data && data.status === "1") {
      venueStatus = `<span class="btn bg-success text-white cursor-default">Actif</span>`;
      venueStatusClass = "bg-success text-white";
      venueStatusName = "Actif";
    }

    var paymentStatus = `<span class="btn bg-warning text-white cursor-default">En Attente</span>`;
    if (billing && billing.status === "completed")
      paymentStatus = `<span class="btn bg-success text-white cursor-default">Payé</span>`;
    else if (billing && billing.status === "canceled")
      paymentStatus = `<span class="btn bg-danger text-white cursor-default">En Retaed</span>`;

    const membershipStartDate = data.membership_start_date && data.membership_start_date != "" ? new Date(data.membership_start_date) : new Date();

    var datePickerReadOnly = true;
    if(user && (user.role.role === "admin" || user.role.role === "superadmin")){
      datePickerReadOnly = false;
    }

    var backLink = "";
    if (user.role.role === "owner"){
      backLink = "/owner/venue/listing";
    }
    else if (user.role.role === "admin" || user.role.role === "superadmin"){
      if(this.state.historyFrom === "member-on-hold") backLink = "/" + user.role.role + "/member-on-hold/listing";
      else backLink = "/" + user.role.role + "/member/listing";
    }

    return (
      <React.Fragment>
        <FormattedMessage id="venue">
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
            gérer mes etablissements
          </h2>
          <div className="box-listing">
            <div id="detail">
              <div className="text-with-search d-flex justify-content-between align-items-center">
                <h3 className="text-title mb-0">
                  <span className="text-uppercase">
                    gérer mes etablissements
                  </span>{" "}
                  <i className="fa fa-angle-right" aria-hidden="true" />{" "}
                  <span>{data.company_name}</span>
                </h3>
              </div>
              <div className="box-listing-detail">
                <form className="my-form" onSubmit={this.handleSubmit}>
                  {this.state.notification.message && (
                    <div className="alert alert-warning">
                      {this.state.notification.message}
                    </div>
                  )}
                  <div className="row">
                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="text-bold">
                          Type d'établissement
                        </label>
                        <div className="d-flex">
                          <div className="radio-custom text-right mr-3">
                            <input
                              type="radio"
                              name="venue_type_id"
                              checked={
                                data.venue_type_id === "1" ||
                                data.venue_type_id === 1
                              }
                              value="1"
                              onChange={this.handleChange}
                            />
                            <label htmlFor="resto">Restaurant</label>
                          </div>
                          <div className="radio-custom text-right mr-3">
                            <input
                              type="radio"
                              name="venue_type_id"
                              checked={
                                data.venue_type_id === "2" ||
                                data.venue_type_id === 2
                              }
                              value="2"
                              onChange={this.handleChange}
                            />
                            <label htmlFor="cafe">Café</label>
                          </div>
                          <div className="radio-custom text-right">
                            <input
                              type="radio"
                              name="venue_type_id"
                              checked={
                                data.venue_type_id === "3" ||
                                data.venue_type_id === 3
                              }
                              value="3"
                              onChange={this.handleChange}
                            />
                            <label htmlFor="hotel">Hôtel</label>
                          </div>
                        </div>
                      </div>
                      <div className="form-group in-group">
                        <label className="text-bold">
                          Coordonnées de l'établissment
                        </label>
                        <div className="row mx-min5 mrg-bot-10">
                          <div className="col-md-11 pd-x-5">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Raison sociale*"
                              name="company_name"
                              value={data.company_name || ""}
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="col-md-1 pd-x-5 d-flex align-items-center">
                            <i className="fa fa-pencil" aria-hidden="true" />
                          </div>
                        </div>
                        <div className="row mx-min5 mrg-bot-10">
                          <div className="col-md-11 pd-x-5">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Nom de la société"
                              name="corporate_name"
                              value={data.corporate_name || ""}
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="col-md-1 pd-x-5 d-flex align-items-center">
                            <i className="fa fa-pencil" aria-hidden="true" />
                          </div>
                        </div>
                        <div className="row mx-min5 mrg-bot-10">
                          <div className="col-md-11 pd-x-5">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Compléments d'adresse"
                              name="address_line_1"
                              value={data.address_line_1 || ""}
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="col-md-1 pd-x-5 d-flex align-items-center">
                            <i className="fa fa-pencil" aria-hidden="true" />
                          </div>
                        </div>
                        <div className="row mx-min5 mrg-bot-10">
                          <div className="col-md-11 pd-x-5">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Nom de la rue et numéro*"
                              name="address_line_2"
                              value={data.address_line_2 || ""}
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="col-md-1 pd-x-5 d-flex align-items-center">
                            <i className="fa fa-pencil" aria-hidden="true" />
                          </div>
                        </div>
                        <div className="row mx-min5 mrg-bot-10">
                          <div className="col-md-11 pd-x-5">
                            <div className="row mx-min5 mrg-bot-10">
                              <div className="col-md-4 pd-x-5">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="N° Postal*"
                                  name="postal_code"
                                  value={data.postal_code || ""}
                                  onChange={this.handleChange}
                                />
                              </div>
                              <div className="col-md-8 pd-x-5">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Ville*"
                                  name="city"
                                  value={data.city || ""}
                                  onChange={this.handleChange}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-1 pd-x-5 d-flex align-items-center">
                            <i className="fa fa-pencil" aria-hidden="true" />
                          </div>
                        </div>
                        <div className="row mx-min5 mrg-bot-10">
                          <div className="col-md-11 pd-x-5">
                            <div className="custom-select-option position-relative">
                              <SelectCountry
                                id="country"
                                name="country"
                                defaultValue={data.country || "CH"}
                                handleChange={this.handleChange}
                              />
                              <div className="arrow-down">
                                <i
                                  className="fa fa-angle-down"
                                  aria-hidden="true"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="form-group hide">
                        <label className="text-bold">
                          Adresse de facturation
                        </label>
                        <div className="row mx-min5 mrg-bot-10">
                          <div className="col-md-11 pd-x-5">
                            <div className="radio-custom mb-0">
                              <input
                                type="radio"
                                name="recap-adrs"
                                id="gerant2"
                                defaultChecked
                              />
                              <label htmlFor="gerant2">
                                Gérant - Rue du moulin 34 - 1201 Genève
                              </label>
                            </div>
                          </div>
                          <div className="col-md-1 pd-x-5 d-flex align-items-center">
                            <i className="fa fa-pencil" aria-hidden="true" />
                          </div>
                        </div>
                      </div>
                      <div className="form-group hide">
                        <label className="text-bold">Documents officels</label>
                        <div className="box-upload">
                          <input
                            type="file"
                            name=""
                            multiple=""
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group in-group">
                        <label className="text-bold">
                          Date du début de l'adhésion
                        </label>
                        <div className="row mx-min5 mrg-bot-10">
                          <div className="col-md-11 pd-x-5">
                            <div className="row">
                              <div className="col-md-12">
                                <DatePicker
                                  inputNameDay="membership_day"
                                  inputNameMonth="membership_month"
                                  inputNameYear="membership_year"
                                  inputPlaceholderDay="Jour*"
                                  inputPlaceholderMonth="Mois*"
                                  inputPlaceholderYear="Anée*"
                                  selectedDate={membershipStartDate}
                                  minDate={addDays(new Date(), 1)}
                                  dateFormatDay="dd"
                                  dateFormatMonth="MMMM"
                                  dateFormatYear="yyyy"
                                  onChange={this.handleChangeDatePicker}
                                  locale="fr"
                                  readOnly={datePickerReadOnly}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="form-group in-group">
                        <label className="text-bold">
                          Personne á contacter dans l'établissement
                        </label>
                        <div className="d-flex">
                          <div className="radio-custom text-right mr-3">
                            <input
                              type="radio"
                              name="contact_title"
                              checked={data.contact_title === "mrs"}
                              value="mrs"
                              onChange={this.handleChange}
                            />
                            <label htmlFor="madame">Madame</label>
                          </div>
                          <div className="radio-custom text-right mr-3">
                            <input
                              type="radio"
                              name="contact_title"
                              checked={data.contact_title === "mr"}
                              value="mr"
                              onChange={this.handleChange}
                            />
                            <label htmlFor="monsieur">Monsieur</label>
                          </div>
                        </div>
                        <div className="row mx-min5 mrg-bot-10">
                          <div className="col-md-11 pd-x-5">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Nom*"
                              name="contact_last_name"
                              defaultValue={data.contact_last_name}
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="col-md-1 pd-x-5 d-flex align-items-center">
                            <i className="fa fa-pencil" aria-hidden="true" />
                          </div>
                        </div>
                        <div className="row mx-min5 mrg-bot-10">
                          <div className="col-md-11 pd-x-5">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Prénom*"
                              name="contact_first_name"
                              defaultValue={data.contact_first_name}
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="col-md-1 pd-x-5 d-flex align-items-center">
                            <i className="fa fa-pencil" aria-hidden="true" />
                          </div>
                        </div>
                      </div>
                      <div className="form-group in-group">
                        <label className="text-bold">Contact</label>
                        <div className="row mx-min5 mrg-bot-10">
                          <div className="col-md-11 pd-x-5">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Teléphone fixe"
                              name="contact_phone"
                              defaultValue={data.contact_phone}
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="col-md-1 pd-x-5 d-flex align-items-center">
                            <i className="fa fa-pencil" aria-hidden="true" />
                          </div>
                        </div>
                        <div className="row mx-min5 mrg-bot-10">
                          <div className="col-md-11 pd-x-5">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Teléphone mobile*"
                              name="contact_mobile"
                              defaultValue={data.contact_mobile}
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="col-md-1 pd-x-5 d-flex align-items-center">
                            <i className="fa fa-pencil" aria-hidden="true" />
                          </div>
                        </div>
                        <div className="row mx-min5 mrg-bot-10">
                          <div className="col-md-11 pd-x-5">
                            <input
                              type="email"
                              className="form-control"
                              placeholder="Adresse email*"
                              name="contact_email"
                              defaultValue={data.contact_email}
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="col-md-1 pd-x-5 d-flex align-items-center">
                            <i className="fa fa-pencil" aria-hidden="true" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="box-status mx-auto w-70 mb-3">
                        <div className="status-head text-center">
                          <span>Statut</span>
                        </div>
                        <div className="status-body">
                          {user.role.role === "owner" && (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: venueStatus
                              }}
                            />
                          )}
                          {(user.role.role === "admin" ||
                            user.role.role === "superadmin") && (
                            <div>
                              <div
                                className={
                                  "venue-status-button-container " +
                                  (!this.state.openStatusButton ? "active" : "")
                                }
                              >
                                <button
                                  type="button"
                                  onClick={this.openChangeVenueStatus}
                                  className={
                                    "btn btn-status " +
                                    venueStatusClass +
                                    " mb-2"
                                  }
                                >
                                  {venueStatusName}
                                </button>
                              </div>
                              <div
                                className={
                                  "venue-update-status-button-container " +
                                  (this.state.openStatusButton ? "active" : "")
                                }
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    this.handleChangeVenueStatus("0")
                                  }
                                  className="btn btn-status btn-review border-warning text-warning mb-2"
                                >
                                  En Attente
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    this.handleChangeVenueStatus("1")
                                  }
                                  className="btn btn-status btn-pay border-success text-success mb-2"
                                >
                                  Actif
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    this.handleChangeVenueStatus("2")
                                  }
                                  className="btn btn-status btn-terminated border-strong-purple text-strong-purple mb-2"
                                >
                                  Résilié
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    this.handleChangeVenueStatus("3")
                                  }
                                  className="btn btn-status btn-late border-danger text-danger mb-2"
                                >
                                  En Retard
                                </button>
                              </div>
                            </div>
                          )}
                          <div className="status-des hide">
                            <p className="text-bold mb-2">Information</p>
                            <ul className="mb-0">
                              <li>Lorem ipsum dolor sit amet, consectetur.</li>
                              <li>Ut vestibulum ut metus nec dictum.</li>
                              <li>Cras nec condimentum enim.</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="box-status mx-auto w-70">
                        <div className="status-head text-center">
                          <span>Facture</span>
                        </div>
                        <div className="status-body">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: paymentStatus
                            }}
                          />
                          {user.role.role === "owner" && (
                            <div className="status-des mt-2">
                              <Link
                                to={
                                  "/owner/venue/billing/" +
                                  this.props.match.params.id
                                }
                                className="color-link small-font"
                              >
                                > voir les factures
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 mx-auto w-70">
                        <div>Valable jusqu'au : <strong className="text-bold">{DateFormat(data.membership_end_date, "dd mmmm yyyy")}</strong></div>
                        <div className="checkbox-custom mt-2">
                          <input type="checkbox" checked={data.auto_renew == '1' ? true : false} onChange={this.handleChangeAutoRenew} />
                          <label style={{ cursor:"default" }}>Renouvellement automatique</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="box-form-button my-form text-center d-flex justify-content-end w-100 mw-100">
                    <Link to={backLink} className="btn btn-transaprent-border-purple text-uppercase mr-3 px-5 btn-click-me">retour</Link>
                    <button
                      type="submit"
                      className="btn btn-purple text-uppercase px-5 btn-click-me"
                    >
                      enregistrer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default OwnerVenueDetail;
