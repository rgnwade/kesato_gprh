import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";
import Joi from "joi-browser";

import config from "../../config";
import SelectCountry from "../Common/SelectCountry";
import auth from "../../services/authService";

class RegisterProfile3 extends Component {
  state = {
    data: [],
    notification: []
  };

  async componentDidMount() {
    const user = auth.getAuthUser();
    if (
      user &&
      (user.role.role === "admin" || user.role.role === "superadmin")
    ) {
      const newUserId = localStorage.getItem("newUser");
      if (newUserId !== null && newUserId !== "") {
        const data = { ...this.state.data };
        data.id = newUserId;
        data.country = "CH";
        this.setState({ data: data });
      }
    } else {
      user.country = "CH";
      this.setState({ data: user });
    }
  }

  schema = {
    company_name: Joi.string()
      .required()
      .error(new Error("Raison sociale requis!")),
    // corporate_name: Joi.string()
    //   .required()
    //   .error(new Error("Nom de la société requis!")),
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
      .error(new Error("Pays requis!"))
  };

  doSubmit = async () => {
    try {
      const user = auth.getAuthUser();
      const cleanData = this.cleanData(this.state.data);
      if (
        user &&
        (user.role.role === "admin" || user.role.role === "superadmin")
      ) {
        const result = await auth.userUpdateProfile(cleanData, true);
        if (result) {
          localStorage.removeItem("newUser");
          this.props.history.push("/admin/dashboard");
        } else {
          this.showError("Invalid data!");
        }
      } else {
        const result = await auth.userUpdateProfile(cleanData);
        if (result) {
          this.props.history.push("/auth/user/profile/complete");
        } else {
          this.showError("Invalid data!");
        }
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
        company_name: this.state.data.company_name,
        // corporate_name: this.state.data.corporate_name,
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
    const cleanData = {};
    cleanData.id = data.id;
    cleanData.company_name = data.company_name;
    // cleanData.corporate_name = data.corporate_name;
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
        <section className="section-content container">
          <div className="row m-0">
            <div className="col-md-6 offset-md-3 p-0">
              <div className="box-form with-shadow">
                <div className="bg-white box-pdd box-border">
                  <h2 className="form-title text-center">
                    Information sur le MEMBER GPRH
                  </h2>
                  <div className="position-relative text-center">
                    <ul className="box-progress">
                      <li className="active" />
                      <li className="active" />
                      <li />
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
                        placeholder="Nom de la société"
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
                          defaultValue={
                            data.country &&
                            data.country !== null &&
                            data.country !== ""
                              ? data.country
                              : "CH"
                          }
                          handleChange={this.handleChange}
                        />
                        <div className="arrow-down">
                          <i className="fa fa-angle-down" aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                    <div className="box-form-button pt-3 mx-auto text-center d-flex">
                      {user &&
                        user.role.role !== "admin" &&
                        user.role.role !== "superadmin" && (
                          <Link
                            to="/auth/user/profile/2"
                            className="btn btn-transaprent-border-purple text-uppercase w-50 mr-2"
                          >
                            retour
                          </Link>
                        )}
                      <button
                        type="submit"
                        className="btn btn-purple text-uppercase w-100"
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

export default RegisterProfile3;
