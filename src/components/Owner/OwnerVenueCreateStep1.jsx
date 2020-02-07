import React, { Component } from "react";
import { Link } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";
import Joi from "joi-browser";
import _ from "lodash";

import config from "../../config";
import SelectCountry from "../Common/SelectCountry";
import http from "../../services/httpService";
import auth from "../../services/authService";

class OwnerVenueCreateStep1 extends Component {
  state = {
    data: { venue_type_id: "1", country: "CH" },
    billingAddress: [],
    tempData: [],
    notification: []
  };

  async componentDidMount() {
    const user = auth.getAuthUser();
    const { data: result } = await http.get(
      config.apiEndPoint + "billing-address/list/" + user.id
    );
    const createVenueData = localStorage.getItem("createVenueData");
    let venueData = null;
    if (createVenueData) venueData = JSON.parse(createVenueData);
    if (venueData && venueData.length > 0) {
      venueData.data.venue_type_id = venueData.data.venue_type_id || venueData.tempData.venue_type_id;
      venueData.data.company_name = venueData.data.company_name || venueData.tempData.company_name;
      venueData.data.corporate_name = venueData.data.corporate_name || venueData.tempData.corporate_name;
      venueData.data.address_line_2 = venueData.data.address_line_2 || venueData.tempData.address_line_2;
      venueData.data.postal_code = venueData.data.postal_code || venueData.tempData.postal_code;
      venueData.data.city = venueData.data.city || venueData.tempData.city;
      venueData.data.country = venueData.data.country || venueData.tempData.country;
      this.setState({ data: venueData.data, tempData: venueData.tempData, billingAddress: result });
    } else {
      this.props.initDataCreate();
      const data = { ...this.state.data };
      data.billing_address_id = result[0].id.toString();
      this.setState({ data: data, billingAddress: result });
    }
  }

  schema = {
    company_name: Joi.string()
      .required()
      .error(new Error("Raison sociale requis!")),
    corporate_name: Joi.string()
      .required()
      .error(new Error("Nom de l’établissement requis!")),
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
      .error(new Error("Pays requis!"))
  };

  doSubmit = () => {
    const createVenueData = localStorage.getItem("createVenueData");
    if (createVenueData) {
      const venueData = JSON.parse(createVenueData);
      const { data } = this.state;
      venueData.data = _.assign({}, venueData.data, data);
      window.localStorage.setItem("createVenueData", JSON.stringify(venueData));
      this.props.history.push("/owner/venue/create/step/2");
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const result = Joi.validate(
      {
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

  showError(message) {
    const notification = { ...this.state.notification };
    notification.message = message;
    this.setState({ notification });
  }

  handleAddBillingAddress = () => {
    const tempData = {
      venue_type_id: this.state.data.venue_type_id,
      company_name: this.state.data.company_name,
      corporate_name: this.state.data.corporate_name,
      address_line_2: this.state.data.address_line_2,
      postal_code: this.state.data.postal_code,
      city: this.state.data.city,
      country: this.state.data.country
    };
    const createVenueData = localStorage.getItem("createVenueData");
    const venueData = JSON.parse(createVenueData);
    venueData.tempData = tempData;
    window.localStorage.setItem("createVenueData", JSON.stringify(venueData));
    setTimeout(() => {
      this.props.history.push("/owner/venue/create/billing-address/add");
    }, 100);
  };

  render() {
    const { data, tempData, billingAddress } = this.state;

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
              <div id="box_main_form" className="box-form with-shadow">
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
                      <li>
                        <div className="icon">
                          <i className="fa fa-envelope-o" aria-hidden="true" />
                        </div>
                        <p>Contact</p>
                      </li>
                      <li>
                        <div className="icon">
                          <i
                            className="fa fa-calendar-check-o"
                            aria-hidden="true"
                          />
                        </div>
                        <p>Information</p>
                      </li>
                      <li>
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
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Raison sociale*"
                        name="company_name"
                        value={data.company_name}
                        onChange={this.handleChange}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nom de l’établissement*"
                        name="corporate_name"
                        value={data.corporate_name}
                        onChange={this.handleChange}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Compléments d'adresse"
                        name="address_line_1"
                        value={data.address_line_1}
                        onChange={this.handleChange}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nom de la rue et numéro*"
                        name="address_line_2"
                        value={data.address_line_2}
                        onChange={this.handleChange}
                      />
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
                        <div className="col-md-8 pd-x-5">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Ville*"
                            name="city"
                            value={data.city}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div className="custom-select-option position-relative">
                        <SelectCountry
                          id="country"
                          name="country"
                          defaultValue={data.country}
                          handleChange={this.handleChange}
                        />
                        <div className="arrow-down">
                          <i className="fa fa-angle-down" aria-hidden="true" />
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
                                className="radio-custom mrg-bot-5 d-flex mb-2"
                              >
                                <input
                                  type="radio"
                                  name="billing_address_id"
                                  checked={
                                    (typeof data.billing_address_id ===
                                      "undefined" &&
                                      index === 0 &&
                                      true) ||
                                    data.billing_address_id ===
                                      item.id.toString()
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
                      <div
                        style={{ marginTop: "30px" }}
                        className="checkbox-custom"
                      >
                        <input
                          type="checkbox"
                          onChange={this.handleAddBillingAddress}
                        />
                        <label>
                          Ajouter une nouvelle adresse de facturation
                        </label>
                      </div>
                    </div>
                    <div className="box-form-button pt-4 mx-auto text-center d-flex">
                      <Link
                        to="/owner/dashboard"
                        className="btn btn-transaprent-border-purple text-uppercase w-50 mr-2"
                      >
                        retour
                      </Link>
                      <button
                        type="submit"
                        onClick={this.handleSubmit}
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

export default OwnerVenueCreateStep1;
