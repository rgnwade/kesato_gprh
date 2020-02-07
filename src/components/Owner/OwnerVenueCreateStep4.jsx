import React, { Component } from "react";
import { Link } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";
import Joi from "joi-browser";
import _ from "lodash";
import { addDays } from "date-fns";

import config from "../../config";
import SelectCountry from "../Common/SelectCountry";
import DatePicker from "../Common/DatePicker";
import http from "../../services/httpService";
import auth from "../../services/authService";

class OwnerVenueCreateStep4 extends Component {
  state = {
    data: [],
    billingAddress: [],
    selectedDate: addDays(new Date(), 1),
    notification: []
  };

  async componentDidMount() {
    const user = auth.getAuthUser();
    const { data: result } = await http.get(
      config.apiEndPoint + "billing-address/list/" + user.id
    );
    const createVenueData = localStorage.getItem("createVenueData");
    if (createVenueData) {
      const venueData = JSON.parse(createVenueData);
      this.setState({
        data: venueData.data,
        billingAddress: result,
        selectedDate: venueData.data.membership_start_date
      });
    }
  }

  schema = {
    company_name: Joi.string()
      .required()
      .error(new Error("Raison sociale requis!")),
    corporate_name: Joi.string()
      .required()
      .error(new Error("Nom de la société requis!")),
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

  doSubmit = () => {
    const createVenueData = localStorage.getItem("createVenueData");
    if (createVenueData) {
      const venueData = JSON.parse(createVenueData);
      const { data } = this.state;
      data.membership_start_date = this.state.selectedDate;
      venueData.data = _.assign({}, venueData.data, data);
      localStorage.setItem("createVenueData", JSON.stringify(venueData));
      this.props.history.push("/owner/venue/create/step/5");
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const result = Joi.validate(
      {
        contact_title: this.state.data.contact_title,
        contact_first_name: this.state.data.contact_first_name,
        contact_last_name: this.state.data.contact_last_name,
        contact_mobile: this.state.data.contact_mobile,
        contact_email: this.state.data.contact_email,
        company_name: this.state.data.company_name,
        corporate_name: this.state.data.corporate_name,
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

  handleChange = e => {
    const data = { ...this.state.data };
    data[e.currentTarget.name] = e.currentTarget.value;
    this.setState({ data: data });
  };

  handleChangeDatePicker = date => {
    this.setState({ selectedDate: date });
  };

  showError(message) {
    const notification = { ...this.state.notification };
    notification.message = message;
    this.setState({ notification });
  }

  render() {
    const { data, billingAddress } = this.state;

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
            <div id="box_lay_6" className="col-md-6 offset-md-3 p-0">
              <div id="box_main_form_recap" className="box-form with-shadow">
                <div className="bg-white box-pdd box-border">
                  <h2 className="form-title text-center">
                    Ajout d'un établissement
                  </h2>
                  <div className="position-relative text-center">
                    <ul className="bar-progress">
                      <li className="active">
                        <div className="icon">
                          <i className="fa fa-user-o" aria-hidden="true" />
                        </div>
                        <p>Coordonnées</p>
                      </li>
                      <li className="active">
                        <div className="icon">
                          <i className="fa fa-envelope-o" aria-hidden="true" />
                        </div>
                        <p>Contact</p>
                      </li>
                      <li className="active">
                        <div className="icon">
                          <i
                            className="fa fa-calendar-check-o"
                            aria-hidden="true"
                          />
                        </div>
                        <p>Information</p>
                      </li>
                      <li className="active">
                        <div className="icon">
                          <i className="fa fa-eye" aria-hidden="true" />
                        </div>
                        <p>Récapitulatif</p>
                      </li>
                      <li>
                        <div className="icon">
                          <i className="fa fa-cart-plus" aria-hidden="true" />
                        </div>
                        <p>Cotisation</p>
                      </li>
                    </ul>
                  </div>
                  <form
                    className="my-form box-form-pdd"
                    onSubmit={this.handleSubmit}
                  >
                    {this.state.notification.message && (
                      <div className="alert alert-warning">
                        {this.state.notification.message}
                      </div>
                    )}
                    <p
                      className="text-bold text-center mb-4"
                      style={{ fontSize: "18px" }}
                    >
                      Récapitulatif
                    </p>

                    <div className="form-group">
                      <label className="text-bold">Type d'établissement</label>
                      <div className="d-flex">
                        <div className="radio-custom text-right mr-3">
                          <input
                            type="radio"
                            name="venue_type_id"
                            checked={data.venue_type_id === "1"}
                            value="1"
                            onChange={this.handleChange}
                          />
                          <label htmlFor="resto">Restaurant</label>
                        </div>
                        <div className="radio-custom text-right mr-3">
                          <input
                            type="radio"
                            name="venue_type_id"
                            checked={data.venue_type_id === "2"}
                            value="2"
                            onChange={this.handleChange}
                          />
                          <label htmlFor="cafe">Café</label>
                        </div>
                        <div className="radio-custom text-right">
                          <input
                            type="radio"
                            name="venue_type_id"
                            checked={data.venue_type_id === "3"}
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
                            value={data.company_name}
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
                            placeholder="Nom de la société*"
                            name="corporate_name"
                            value={data.corporate_name}
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
                            value={data.address_line_1}
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
                            value={data.address_line_2}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div className="col-md-1 pd-x-5 d-flex align-items-center">
                          <i className="fa fa-pencil" aria-hidden="true" />
                        </div>
                      </div>
                      <div className="row mx-min5 mrg-bot-10">
                        <div className="col-md-4 pd-x-5">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="N° Postal*"
                            name="postal_code"
                            value={data.postal_code}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div className="col-md-7 pd-x-5">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Ville*"
                            name="city"
                            value={data.city}
                            onChange={this.handleChange}
                          />
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
                              defaultValue={data.country}
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
                        <div className="col-md-1 pd-x-5 d-flex align-items-center">
                          <i className="fa fa-pencil" aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="text-bold">
                        Adresse de facturation
                      </label>
                      <div id="radio_addrs">
                        {billingAddress &&
                          billingAddress.length > 0 &&
                          billingAddress.map((item, index) => {
                            return (
                              <div
                                key={index}
                                className="radio-custom mrg-bot-10 d-flex mb-2"
                              >
                                <input
                                  type="radio"
                                  name="billing_address_id"
                                  checked={
                                    data.billing_address_id === item.id ||
                                    parseInt(data.billing_address_id) ===
                                    item.id
                                  }
                                  onChange={this.handleChange}
                                  value={item.id}
                                />
                                <label className="billing-address">
                                  {item.type === "default"
                                    ? "Gérant"
                                    : "Etablissement"}{" "}
                                  - {item.address_line_1} -{" "}
                                  {item.address_line_2}
                                </label>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    <div className="form-group in-group">
                      <label className="text-bold">
                        Date du début de l'adhésion
                      </label>
                      <div className="row mx-min5 mrg-bot-10">
                        <div className="col-md-11 pd-x-5">
                          <DatePicker
                            inputNameDay="membership_day"
                            inputNameMonth="membership_month"
                            inputNameYear="membership_year"
                            inputPlaceholderDay="Jour*"
                            inputPlaceholderMonth="Mois*"
                            inputPlaceholderYear="Anée*"
                            selectedDate={this.state.selectedDate}
                            minDate={addDays(new Date(), 1)}
                            dateFormatDay="dd"
                            dateFormatMonth="MMMM"
                            dateFormatYear="yyyy"
                            onChange={this.handleChangeDatePicker}
                            locale="fr"
                          />
                        </div>
                        <div className="col-md-1 pd-x-5 d-flex align-items-center">
                          <i className="fa fa-pencil" aria-hidden="true" />
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
                          <label>Madame</label>
                        </div>
                        <div className="radio-custom text-right mr-3">
                          <input
                            type="radio"
                            name="contact_title"
                            checked={data.contact_title === "mr"}
                            value="mr"
                            onChange={this.handleChange}
                          />
                          <label>Monsieur</label>
                        </div>
                      </div>
                      <div className="row mx-min5 mrg-bot-10">
                        <div className="col-md-11 pd-x-5">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Nom*"
                            name="contact_last_name"
                            value={data.contact_last_name}
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
                            value={data.contact_first_name}
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
                            value={data.contact_phone}
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
                            value={data.contact_mobile}
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
                            value={data.contact_email}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div className="col-md-1 pd-x-5 d-flex align-items-center">
                          <i className="fa fa-pencil" aria-hidden="true" />
                        </div>
                      </div>
                    </div>

                    <div className="box-form-button pt-4 mx-auto text-center d-flex">
                      <Link
                        to="/owner/venue/create/step/3"
                        className="btn btn-transaprent-border-purple text-uppercase w-50 mr-2"
                      >
                        retour
                      </Link>
                      <button
                        type="submit"
                        onClick={this.props.handleStep}
                        className="btn btn-purple text-uppercase w-50"
                      >
                        suvant
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default OwnerVenueCreateStep4;
