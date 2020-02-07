import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";
import Joi from "joi-browser";
import DateFormat from "dateformat";

import config from "../../config";
import auth from "../../services/authService";

class RegisterProfile2 extends Component {
  state = {
    data: { title: "mrs" },
    dob_day: DateFormat(new Date(), "d"),
    dob_month: DateFormat(new Date(), "m"),
    dob_year: "1980",
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
        this.setState({ data: data });
      }
    } else {
      this.setState({ data: user });
    }
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
    phone_mobile: Joi.string()
      .required()
      .error(new Error("Teléphone mobile requis!"))
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
          this.props.history.push("/admin/owner/profile/3");
        } else {
          this.showError("Invalid data!");
        }
      } else {
        const result = await auth.userUpdateProfile(cleanData);
        if (result) {
          this.props.history.push("/auth/user/profile/3");
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
        last_name: this.state.data.last_name,
        first_name: this.state.data.first_name,
        dob_day: this.state.dob_day,
        dob_month: this.state.dob_month,
        dob_year: this.state.dob_year,
        phone_mobile: this.state.data.phone_mobile
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
    const dob = new Date(
      this.state.dob_year,
      parseInt(this.state.dob_month) - 1,
      this.state.dob_day
    );
    const cleanData = {};
    cleanData.id = data.id;
    cleanData.title = data.title;
    cleanData.first_name = data.first_name;
    cleanData.last_name = data.last_name;
    cleanData.dob = DateFormat(dob, "yyyy-mm-dd");
    cleanData.phone = data.phone;
    cleanData.phone_mobile = data.phone_mobile;
    return cleanData;
  }

  render() {
    if (!auth.getAuthUser()) return <Redirect to="/not-found" />;
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
                      <li />
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
                      <div className="radio-custom text-right">
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
                    <div className="form-group in-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nom*"
                        name="last_name"
                        onChange={this.handleChange}
                        value={data.last_name}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Prénom*"
                        name="first_name"
                        onChange={this.handleChange}
                        value={data.first_name}
                      />
                    </div>
                    <div className="form-group">
                      <label className="text-bold">Date de naissance</label>
                      <div className="row">
                        <div className="col-md-4">
                          <input
                            type="number"
                            className="form-control text-center"
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
                            className="form-control text-center"
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
                            className="form-control text-center"
                            placeholder="Anée*"
                            min="1900"
                            name="dob_year"
                            value={this.state.dob_year}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group in-group">
                      <label className="text-bold">Contact</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Teléphone fixe"
                        name="phone"
                        value={data.phone}
                        onChange={this.handleChange}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Teléphone mobile*"
                        name="phone_mobile"
                        value={data.phone_mobile}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="box-form-button pt-3 mx-auto text-center d-flex">
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

export default RegisterProfile2;
