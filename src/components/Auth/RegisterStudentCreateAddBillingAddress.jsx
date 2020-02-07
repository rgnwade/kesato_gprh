import React, { Component } from "react";
import { Link } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";
import Joi from "joi-browser";

import config from "../../config";
import SelectCountry from "../Common/SelectCountry";
import http from "../../services/httpService";
import auth from "../../services/authService";

class OwnerVenueCreateAddBillingAddress extends Component {
  state = {
    data: { country: "CH" },
    notification: []
  };

  schema = {
    email: Joi.string()
      .email({ minDomainAtoms: 2 })
      .required()
      .email()
      .error(new Error("Adresse email invalide!")),
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

  doSubmit = async () => {
    try {
      const cleanData = this.cleanData(this.state.data);
      const { data: result } = await http.post(
        config.apiEndPoint + "billing-address/create",
        { data: cleanData }
      );
      if (result) {
        this.props.history.push("/auth/student/profile/3");
      } else {
        this.showError("Invalid data!");
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400)
        this.showError(ex.response.data);
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const result = Joi.validate(
      {
        email: this.state.data.email,
        billed_to: this.state.data.billed_to,
        address_line_1: this.state.data.address_line_1,
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

  cleanData(data) {
    const cleanData = { ...data };
    const user = auth.getAuthUser();
    cleanData.user_id = user.id;
    cleanData.type = "additional";
    return cleanData;
  }

  render() {
    const { data } = this.state;

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
                    Ajout d'une adresse de facturation
                  </h2>
                  <br />
                  <br />
                  <form className="my-form" onSubmit={this.handleSubmit}>
                    {this.state.notification.message && (
                      <div className="alert alert-warning">
                        {this.state.notification.message}
                      </div>
                    )}
                    <div className="form-group in-group">
                      <label className="text-bold">
                        Adresse de facturation
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Email*"
                        name="email"
                        value={data.email}
                        onChange={this.handleChange}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Raison sociale"
                        name="billed_to"
                        value={data.billed_to}
                        onChange={this.handleChange}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nom de la société"
                        name="billing_label"
                        value={data.billing_label}
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
                    <div className="box-form-button pt-4 mx-auto text-center d-flex">
                      <Link
                        to="/auth/student/profile/3"
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

export default OwnerVenueCreateAddBillingAddress;
