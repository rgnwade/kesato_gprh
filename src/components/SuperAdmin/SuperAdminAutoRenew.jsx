import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";

import config from "../../config";
import http from "../../services/httpService";
import auth from "../../services/authService";

class SuperAdminAutoRenew extends Component {
  state = {
    data: [],
    notification: []
  };

  async componentDidMount() {
    const { data: result } = await http.get(
      config.apiEndPoint + "setting/autorenew"
    );
    Object.assign(result, JSON.parse(result.value));
    this.setState({ data: result });
  }

  schema = {};

  doSubmit = async () => {
    try {
      const result = await http.post(config.apiEndPoint + "setting/update", {
        data: this.state.data
      });
      if (result) {
        this.props.history.push("/superadmin/dashboard");
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
    this.doSubmit();
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
        <section className="section-content container px-6">
          <h2 className="head-title text-uppercase">Renouvellement automatique</h2>
          <div className="box-listing">
            <div className="text-with-search d-flex justify-content-between align-items-center">
              <h3 className="text-title mb-0 text-uppercase">
                <span>rappel</span>{" "}
                <i className="fa fa-angle-right" aria-hidden="true" />
              </h3>
            </div>
            <div className="box-listing-detail">
              <form className="my-form" onSubmit={this.handleSubmit}>
                {this.state.notification.message && (
                  <div className="alert alert-warning">
                    {this.state.notification.message}
                  </div>
                )}
                <div className="row mx-min5">
                  <div className="col-md-12 pd-x-5">
                    <div className="form-group in-group">
                      <label className="text-bold">Rappel (Jours)</label>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="+ 30 Jours"
                        name="value"
                        onChange={this.handleChange}
                        value={data.value || 0}
                      />
                    </div>
                  </div>
                </div>
                <div className="box-form-button my-form text-center d-flex justify-content-end w-100 mw-100 mt-4">
                  <button
                    type="submit"
                    className="btn btn-purple text-uppercase px-5 mr-3 btn-back-liste"
                  >
                    enregistrer
                  </button>
                  <Link
                    to="/superadmin/dashboard"
                    className="btn btn-transaprent-border-purple text-uppercase px-5 btn-back-liste"
                  >
                    retour
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default SuperAdminAutoRenew;
