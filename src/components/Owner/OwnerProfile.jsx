import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";
import Joi from "joi-browser";
import DateFormat from "dateformat";

import config from "../../config";
import auth from "../../services/authService";
import http from "../../services/httpService";
import SelectCountry from "../Common/SelectCountry";

class OwnerProfile extends Component {
  state = {
    data: [],
    notification: [],
    dob_day: DateFormat(new Date(), "d"),
    dob_month: DateFormat(new Date(), "m"),
    dob_year: DateFormat(new Date(), "yyyy")
  };

  async componentDidMount() {
    var user = null;
    if (
      this.props.match.params.id === "undefined" ||
      !this.props.match.params.id
    ) {
      user = auth.getAuthUser();
    } else {
      const { data: result } = await http.get(
        config.apiEndPoint + "auth/user/" + this.props.match.params.id
      );
      user = result;
    }

    const dob_day = DateFormat(user.dob, "d");
    const dob_month = DateFormat(user.dob, "m");
    const dob_year = DateFormat(user.dob, "yyyy");
    this.setState({
      data: user,
      dob_day: dob_day,
      dob_month: dob_month,
      dob_year: dob_year
    });
  }

  schema = {
    last_name: Joi.string()
      .required()
      .error(new Error("Nom requis!")),
    first_name: Joi.string()
      .required()
      .error(new Error("Prénom requis!")),
    dob_day: Joi.string()
      .required()
      .error(new Error("Jour requis!")),
    dob_month: Joi.string()
      .required()
      .error(new Error("Mois requis!")),
    dob_year: Joi.string()
      .required()
      .error(new Error("Anée requis!")),
    company_name: Joi.string()
      .required()
      .error(new Error("Raison sociale requis!")),
    corporate_name: Joi.string()
      .required()
      .error(new Error("Nom de la société requis!")),
    postal_code: Joi.string()
      .required()
      .error(new Error("N° Postal requis!")),
    address_line_2: Joi.string()
      .required()
      .error(new Error("Nom de la rue et numéro requis!")),
    city: Joi.string()
      .required()
      .error(new Error("Ville requis!")),
    country: Joi.string()
      .required()
      .error(new Error("Pays requis!")),
    phone: Joi.string()
      .required()
      .error(new Error("Teléphone requis!")),
    phone_mobile: Joi.string()
      .required()
      .error(new Error("Teléphone mobile requis!")),
    email: Joi.string()
      .required()
      .error(new Error("Adresse email requis!"))
  };

  doSubmit = async () => {
    try {
      const user = auth.getAuthUser();
      const cleanData = this.cleanData(this.state.data);
      if (user.role.role === "owner") {
        const result = await auth.userUpdateProfile(cleanData);
        if (result) this.props.history.push("/owner/dashboard");
        else this.showError("Invalid data!");
      } else if (user.role.role === "student") {
        const result = await auth.userUpdateProfile(cleanData);
        if (result) this.props.history.push("/student/dashboard");
        else this.showError("Invalid data!");
      } else if (user.role.role === "admin") {
        const result = await auth.userUpdateProfile(cleanData, true);
        if (result) this.props.history.push("/admin/member/listing");
        else this.showError("Invalid data!");
      } else if (user.role.role === "superadmin") {
        const result = await auth.userUpdateProfile(cleanData, true);
        if (result) this.props.history.push("/superadmin/member/listing");
        else this.showError("Invalid data!");
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
        last_name: this.state.data.last_name,
        first_name: this.state.data.first_name,
        dob_day: this.state.dob_day,
        dob_month: this.state.dob_month,
        dob_year: this.state.dob_year,
        address_line_2: this.state.data.address_line_2,
        company_name: this.state.data.company_name,
        corporate_name: this.state.data.corporate_name,
        postal_code: this.state.data.postal_code,
        city: this.state.data.city,
        country: this.state.data.country,
        phone: this.state.data.phone,
        phone_mobile: this.state.data.phone_mobile,
        email: this.state.data.email
      },
      this.schema
    );
    if (result.error) {
      this.showError(result.error.message);
    } else {
      this.doSubmit();
    }
  };

  handleDeleteUser = e => {
    // const userId = "";
    // document.getElementsByClassName("animated-page-wrapper").style.transform = "unset";
  };

  handleChange = e => {
    if (e.currentTarget.name === "dob_day") {
      this.setState({ dob_day: e.currentTarget.value });
    } else if (e.currentTarget.name === "dob_month") {
      this.setState({ dob_month: e.currentTarget.value });
    } else if (e.currentTarget.name === "dob_year") {
      this.setState({ dob_year: e.currentTarget.value });
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

  cleanData(data) {
    const cleanData = {};
    cleanData.id = data.id;
    cleanData.title = data.title;
    cleanData.first_name = data.first_name;
    cleanData.last_name = data.last_name;
    cleanData.dob = DateFormat(
      new Date(
        this.state.dob_year,
        parseInt(this.state.dob_month) - 1,
        this.state.dob_day
      ),
      "yyyy-mm-dd"
    );
    cleanData.phone = data.phone;
    cleanData.phone_mobile = data.phone_mobile;
    cleanData.company_name = data.company_name;
    cleanData.corporate_name = data.corporate_name;
    cleanData.address_line_1 = data.address_line_1;
    cleanData.address_line_2 = data.address_line_2;
    cleanData.postal_code = data.postal_code;
    cleanData.city = data.city;
    cleanData.country = data.country;
    return cleanData;
  }

  render() {
    const user = auth.getAuthUser();
    if (!user) return <Redirect to="/not-found" />;
    const { data } = this.state;

    return (
      <React.Fragment>
        <FormattedMessage id="manager">
          {title => (
            <Helmet>
              <title>
                {ChangeCase.titleCase(title)} | {config.appName}
              </title>
            </Helmet>
          )}
        </FormattedMessage>
        <section id="section_1" className="section-content container">
          <div className="row m-0">
            <div className="col-md-10 offset-md-1">
              <h2 className="head-title mb-4">Compte Gérant</h2>
              <div className="box-form with-shadow">
                <div className="bg-white box-pdd box-border">
                  <div className="box-form-pdd">
                    <form className="my-form" onSubmit={this.handleSubmit}>
                      {this.state.notification.message && (
                        <div className="alert alert-warning">
                          {this.state.notification.message}
                        </div>
                      )}
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group in-group">
                            <div className="d-flex">
                              <div className="radio-custom text-right mr-3">
                                <input
                                  type="radio"
                                  name="title"
                                  checked={data.title === "mrs" && "checked"}
                                  value="mrs"
                                  onChange={this.handleChange}
                                />
                                <label>Madame</label>
                              </div>
                              <div className="radio-custom text-right mr-3">
                                <input
                                  type="radio"
                                  name="title"
                                  checked={data.title === "mr" && "checked"}
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
                                  name="last_name"
                                  onChange={this.handleChange}
                                  value={data.last_name}
                                />
                              </div>
                              <div className="col-md-1 pd-x-5 d-flex align-items-center">
                                <i
                                  className="fa fa-pencil"
                                  aria-hidden="true"
                                />
                              </div>
                            </div>
                            <div className="row mx-min5 mrg-bot-10">
                              <div className="col-md-11 pd-x-5">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Prénom*"
                                  name="first_name"
                                  onChange={this.handleChange}
                                  value={data.first_name}
                                />
                              </div>
                              <div className="col-md-1 pd-x-5 d-flex align-items-center">
                                <i
                                  className="fa fa-pencil"
                                  aria-hidden="true"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="form-group in-group">
                            <label className="text-bold">Adresse</label>
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
                                <i
                                  className="fa fa-pencil"
                                  aria-hidden="true"
                                />
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
                                <i
                                  className="fa fa-pencil"
                                  aria-hidden="true"
                                />
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
                                <i
                                  className="fa fa-pencil"
                                  aria-hidden="true"
                                />
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
                                <i
                                  className="fa fa-pencil"
                                  aria-hidden="true"
                                />
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
                              </div>
                              <div className="col-md-1 pd-x-5 d-flex align-items-center">
                                <i
                                  className="fa fa-pencil"
                                  aria-hidden="true"
                                />
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
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group in-group">
                            <label className="text-bold">
                              Date du début de l'adhésion
                            </label>
                            <div className="row mx-min5 mrg-bot-10">
                              <div className="col-md-11 pd-x-5">
                                <div className="row">
                                  <div className="col-md-4">
                                    <input
                                      type="number"
                                      className="form-control"
                                      placeholder="Jour*"
                                      min="1"
                                      max="31"
                                      name="dob_day"
                                      value={this.state.dob_day}
                                      onChange={this.handleChange}
                                    />
                                  </div>
                                  <div className="col-md-4">
                                    <input
                                      type="number"
                                      className="form-control"
                                      placeholder="Mois*"
                                      min="1"
                                      max="12"
                                      name="dob_month"
                                      value={this.state.dob_month}
                                      onChange={this.handleChange}
                                    />
                                  </div>
                                  <div className="col-md-4">
                                    <input
                                      type="number"
                                      className="form-control"
                                      placeholder="Anée*"
                                      min="1900"
                                      name="dob_year"
                                      value={this.state.dob_year}
                                      onChange={this.handleChange}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-1 pd-x-5 d-flex align-items-center">
                                <i
                                  className="fa fa-pencil"
                                  aria-hidden="true"
                                />
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
                                  placeholder="Teléphone fixe*"
                                  name="phone"
                                  value={data.phone}
                                  onChange={this.handleChange}
                                />
                              </div>
                              <div className="col-md-1 pd-x-5 d-flex align-items-center">
                                <i
                                  className="fa fa-pencil"
                                  aria-hidden="true"
                                />
                              </div>
                            </div>
                            <div className="row mx-min5 mrg-bot-10">
                              <div className="col-md-11 pd-x-5">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Teléphone mobile*"
                                  name="phone_mobile"
                                  value={data.phone_mobile}
                                  onChange={this.handleChange}
                                />
                              </div>
                              <div className="col-md-1 pd-x-5 d-flex align-items-center">
                                <i
                                  className="fa fa-pencil"
                                  aria-hidden="true"
                                />
                              </div>
                            </div>
                            <div className="row mx-min5 mrg-bot-10">
                              <div className="col-md-11 pd-x-5">
                                <input
                                  type="email"
                                  className="form-control"
                                  placeholder="Adresse email*"
                                  name="email"
                                  value={data.email}
                                  onChange={this.handleChange}
                                  readOnly
                                />
                              </div>
                              <div className="col-md-1 pd-x-5 d-flex align-items-center" />
                            </div>
                          </div>
                          <div className="form-group hide">
                            <label className="text-bold">
                              Login et mot de please
                            </label>
                            <div className="row mx-min5 mrg-bot-10">
                              <div className="col-md-11 pd-x-5">
                                <input
                                  type="email"
                                  className="form-control"
                                  placeholder="Email"
                                />
                                <small>
                                  <Link
                                    to="/owner/profile"
                                    className="color-link"
                                  >
                                    Générer un nouveau mot de passe
                                  </Link>
                                </small>
                              </div>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="box-form-button my-form">
                              {user.role.role === "owner" && (
                                <Link
                                  to="/owner/venue/create"
                                  className="btn btn-purple text-uppercase px-4"
                                >
                                  ajouter un etablissement
                                </Link>
                              )}
                              {(user.role.role === "admin" ||
                                user.role.role === "superadmin") &&
                                false && (
                                  <button
                                    type="button"
                                    className="btn btn-delete mt-2 mr-3 px-4"
                                    onClick={this.handleDeleteUser}
                                  >
                                    Supprimer ce gérant
                                  </button>
                                )}
                            </div>
                          </div>
                          <div className="box-form-button my-form text-center d-flex w-100 mw-100 mt-5">
                            {(user.role.role === "admin" ||
                              user.role.role === "superadmin") && (
                              <Link
                                to={"/" + user.role.role + "/member/listing"}
                                className="btn btn-transaprent-border-purple text-uppercase mr-3 px-4 btn_back_compte"
                              >
                                annuler
                              </Link>
                            )}
                            {(user.role.role === "owner" ||
                              user.role.role === "student") && (
                              <Link
                                to={"/" + user.role.role + "/dashboard"}
                                className="btn btn-transaprent-border-purple text-uppercase mr-3 px-4 btn_back_compte"
                              >
                                annuler
                              </Link>
                            )}
                            <button
                              type="submit"
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
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default OwnerProfile;
