import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";
import Joi from "joi-browser";

import config from "../../config";
import http from "../../services/httpService";
import auth from "../../services/authService";

class SuperAdminProductDetail extends Component {
  state = {
    data: [],
    notification: []
  };

  async componentDidMount() {
    const { data: result } = await http.get(
      config.apiEndPoint + "product/" + this.props.match.params.id
    );
    this.setState({ data: result });
  }

  schema = {
    name: Joi.string()
      .required()
      .error(new Error("Nom requis!")),
    price: Joi.required().error(new Error("Prix requis!"))
  };

  doSubmit = async () => {
    try {
      const cleanData = this.cleanData(this.state.data);
      const result = await http.post(config.apiEndPoint + "product/update", {
        data: cleanData
      });
      if (result) {
        this.props.history.push("/superadmin/product/listing");
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
        name: this.state.data.name,
        price: this.state.data.price
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
    cleanData.name = data.name;
    cleanData.description = data.description;
    cleanData.price = data.price;
    cleanData.status = data.status;
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
        <section className="section-content container px-6">
          <h2 className="head-title text-uppercase">GESTION PRODUIT MEMBRE</h2>
          <div className="box-listing">
            <div className="text-with-search d-flex justify-content-between align-items-center">
              <h3 className="text-title mb-0 text-uppercase">
                <span>{data.name}</span>{" "}
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
                  <div className="col-md-6 pd-x-5">
                    <div className="form-group in-group">
                      <label className="text-bold">Désignation produit</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Frais d'inscription"
                        name="name"
                        onChange={this.handleChange}
                        value={data.name}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 pd-x-5">
                    <div className="row mx-min5">
                      <div className="col-md-6 pd-x-5">
                        <div className="form-group in-group">
                          <label className="text-bold">Prix</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="100.00"
                            name="price"
                            onChange={this.handleChange}
                            value={data.price}
                          />
                        </div>
                      </div>
                      {/* <div className="col-md-4 pd-x-5">
                        <div className="form-group in-group">
                          <label className="text-bold">Prix affiché</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="CHF 0.00"
                          />
                        </div>
                      </div> */}
                      <div className="col-md-6 pd-x-5">
                        <div className="form-group in-group">
                          <label className="text-bold">Statut</label>
                          <div className="custom-select-option position-relative">
                            <select name="" id="" className="form-control">
                              <option value="0">Actif</option>
                              <option value="1">Non Actif</option>
                            </select>
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
                </div>
                <div className="row mx-min5">
                  <div className="col-md-12 pd-x-5">
                    <div className="form-group in-group">
                      <label className="text-bold">La description</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Frais d'inscription"
                        name="description"
                        onChange={this.handleChange}
                        value={data.description}
                      />
                    </div>
                  </div>
                </div>
                <div className="box-form-button my-form text-center d-flex justify-content-end w-100 mw-100 mt-4">
                  <Link
                    to="/superadmin/product/listing"
                    className="btn btn-transaprent-border-purple mr-3 text-uppercase px-5 btn-back-liste"
                  >
                    retour
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-purple text-uppercase px-5 btn-back-liste"
                  >
                    enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default SuperAdminProductDetail;
