import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";
import Joi from "joi-browser";

import config from "../../config";
import http from "../../services/httpService";
import auth from "../../services/authService";

class SuperAdminAdminDetail extends Component {
  state = {
    data: [],
    notification: []
  };

  async componentDidMount() {
    const { data: result } = await http.get(
      config.apiEndPoint + "auth/user/" + this.props.match.params.id
    );
    this.setState({ data: result });
  }

  schema = {
    email: Joi.string()
      .required()
      .error(new Error("Nom requis!")),
    first_name: Joi.string()
      .required()
      .error(new Error("Prénom requis!")),
    last_name: Joi.string()
      .required()
      .error(new Error("Nom requis!"))
  };

  doSubmit = async () => {
    try {
      const cleanData = this.cleanData(this.state.data);
      const result = await auth.userUpdateProfile(cleanData);
      if (result) {
        this.props.history.push("/superadmin/admin/listing");
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
        first_name: this.state.data.first_name,
        last_name: this.state.data.last_name
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
    cleanData.first_name = data.first_name;
    cleanData.last_name = data.last_name;
    return cleanData;
  }

  render() {
    if (!auth.getAuthUser("superadmin"))
      return <Redirect to="/auth/login/superadmin" />;
    const { data } = this.state;

    return (
      <React.Fragment>
        <FormattedMessage id="superAdmin">
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
              <h2 className="head-title mb-4">Compte Admin</h2>
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
                        <div className="col-md-12">
                          <div className="form-group in-group">
                            <label className="text-bold">{""}</label>
                            <div className="row mx-min5 mrg-bot-10">
                              <div className="col-md-11 pd-x-5">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Email"
                                  name="email"
                                  value={data.email}
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
                                  type="password"
                                  className="form-control"
                                  placeholder="Mot de passe"
                                  name="password"
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
                          </div>
                          <div className="form-group in-group">
                            <div className="row mx-min5 mrg-bot-10">
                              <div className="col-md-11 pd-x-5">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Nom"
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
                                  placeholder="Prénom"
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
                        </div>
                      </div>
                      <div className="box-form-button my-form text-center justify-content-end d-flex w-100 mw-100 mt-5">
                        <Link
                          to="/superadmin/admin/listing"
                          className="btn btn-transaprent-border-purple text-uppercase mr-3 px-4 btn_back_compte"
                        >
                          annuler
                        </Link>
                        <button
                          type="submit"
                          className="btn btn-purple text-uppercase px-4 btn_back_compte"
                        >
                          enregistrer
                        </button>
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

export default SuperAdminAdminDetail;
