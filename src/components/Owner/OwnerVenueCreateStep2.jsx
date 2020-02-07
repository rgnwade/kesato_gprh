import React, { Component } from "react";
import { Link } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";
import Joi from "joi-browser";
import _ from "lodash";

import config from "../../config";
import auth from "../../services/authService";

class OwnerVenueCreateStep2 extends Component {
  state = {
    data: [],
    notification: [],
    fillUsingManagerDetail: false
  };

  componentDidMount() {
    const createVenueData = localStorage.getItem("createVenueData");
    if (createVenueData) {
      const venueData = JSON.parse(createVenueData);
      if (typeof venueData.data.contact_title === "undefined")
        venueData.data.contact_title = "mrs";
      this.setState({
        data: venueData.data,
        fillUsingManagerDetail: venueData.fillUsingManagerDetail
      });
    }
  }

  schema = {
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
      venueData.data = _.assign({}, venueData.data, data);
      venueData.fillUsingManagerDetail = this.state.fillUsingManagerDetail;
      localStorage.setItem("createVenueData", JSON.stringify(venueData));
      this.props.history.push("/owner/venue/create/step/3");
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
        contact_email: this.state.data.contact_email
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
    this.setState({ data: data, fillUsingManagerDetail: false });
  };

  showError(message) {
    const notification = { ...this.state.notification };
    notification.message = message;
    this.setState({ notification });
  }

  handleChangeAutoFill = e => {
    const data = { ...this.state.data };
    var fillUsingManagerDetail = false;
    if (e.currentTarget.checked) {
      const user = auth.getAuthUser();
      data.contact_title = user.title;
      data.contact_first_name = user.first_name;
      data.contact_last_name = user.last_name;
      data.contact_phone = user.phone;
      data.contact_mobile = user.phone_mobile;
      data.contact_email = user.email;
      fillUsingManagerDetail = true;
    } else {
      data.contact_title = "mrs";
      data.contact_first_name = "";
      data.contact_last_name = "";
      data.contact_phone = "";
      data.contact_mobile = "";
      data.contact_email = "";
    }
    this.setState({
      data: data,
      fillUsingManagerDetail: fillUsingManagerDetail
    });
  };

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
              <div id="box_billing_addrs" className="box-form with-shadow">
                <div className="bg-white box-pdd box-border py-5">
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
                    <div className="form-group in-group">
                      <label className="text-bold">
                        Personne á contacter dans l'établissement
                      </label>
                      <div className="checkbox-custom" style={{marginTop: '10px'}}>
                        <input
                          type="checkbox"
                          onChange={this.handleChangeAutoFill}
                          checked={this.state.fillUsingManagerDetail}
                        />
                        <label>Remplir avec les coordonnées du gérant</label>
                      </div>
                      <br />
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
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nom*"
                        name="contact_last_name"
                        value={data.contact_last_name}
                        onChange={this.handleChange}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Prénom*"
                        name="contact_first_name"
                        value={data.contact_first_name}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="form-group in-group">
                      <label className="text-bold">Contact</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Teléphone fixe"
                        name="contact_phone"
                        value={data.contact_phone}
                        onChange={this.handleChange}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Teléphone mobile*"
                        name="contact_mobile"
                        value={data.contact_mobile}
                        onChange={this.handleChange}
                      />
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Adresse email*"
                        name="contact_email"
                        value={data.contact_email}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="box-form-button pt-3 mx-auto text-center d-flex">
                      <Link
                        to="/owner/venue/create"
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

export default OwnerVenueCreateStep2;
