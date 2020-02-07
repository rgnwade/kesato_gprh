import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";
import Joi from "joi-browser";
import _ from "lodash";

import config from "../../config";
import SelectCountry from "../Common/SelectCountry";
import http from "../../services/httpService";
import auth from "../../services/authService";

class RegisterStudentProfile3 extends Component {
  state = {
    data: [],
    billingAddress: [],
    tempData: [],
    notification: []
  };

  async componentDidMount() {
    const user = auth.getAuthUser();
    const studentData = localStorage.getItem("studentData");
    if(studentData){
      const studentDataJSON = JSON.parse(studentData);
      user.company_name = user.company_name || studentDataJSON.tempData.company_name;
      user.address_line_1 = user.address_line_1 || studentDataJSON.tempData.address_line_1;
      user.address_line_2 = user.address_line_2 || studentDataJSON.tempData.address_line_2;
      user.postal_code = user.postal_code || studentDataJSON.tempData.postal_code;
      user.city = user.city || studentDataJSON.tempData.city;
      user.country = user.country || studentDataJSON.tempData.country || "CH";
      const { data: result } = await http.get(
        config.apiEndPoint + "billing-address/list/" + studentDataJSON.data.id
      );
      this.setState({ data: user, tempData: studentDataJSON.tempData, billingAddress: result });
    }
  }

  schema = {
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
      const cleanData = this.cleanData(this.state.data);
      const result = await auth.userUpdateProfile(cleanData);
      if (result) {
        const studentData = localStorage.getItem("studentData");
        if (studentData) {
          const studentDataJSON = JSON.parse(studentData);
          const { data } = this.state;
          studentDataJSON.data = _.assign({}, studentDataJSON.data, data);
          window.localStorage.setItem("studentData", JSON.stringify(studentDataJSON));
        }
        this.props.history.push("/auth/student/profile/4");
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

  handleAddBillingAddress = () => {
    const tempData = {
      company_name: this.state.data.company_name,
      address_line_1: this.state.data.address_line_1,
      address_line_2: this.state.data.address_line_2,
      postal_code: this.state.data.postal_code,
      city: this.state.data.city,
      country: this.state.data.country
    };
    const studentData = localStorage.getItem("studentData");
    const studentDataJSON = JSON.parse(studentData);
    studentDataJSON.tempData = tempData;
    window.localStorage.setItem("studentData", JSON.stringify(studentDataJSON));
    setTimeout(() => {
      this.props.history.push("/auth/student/create/billing-address/add");
    }, 100);
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
    const { data, billingAddress } = this.state;

    return (
      <React.Fragment>
        <FormattedMessage id="student">
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
                    Création d'un compte étudiant
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
                    <div className="form-group in-group">
                      <label className="text-bold">Adresse</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Raison sociale"
                        name="company_name"
                        value={data.company_name}
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
                    <div>
                      <label className="text-bold">Adresse de facturation</label>
                      <div id="radio_addrs">
                        {billingAddress &&
                          billingAddress.length > 1 &&
                          billingAddress.map((item, index) => {
                            if(index === 0) return;
                            return (
                              <div
                                key={index}
                                className="radio-custom mrg-bot-5 d-flex mb-2"
                              >
                                <input
                                  type="radio"
                                  name="billing_address_id"
                                  checked={true}
                                  value={item.id}
                                />
                                <label className="billing-address">
                                  {item.type === "default"
                                    ? "Gérant"
                                    : ""}{" "}
                                  {item.address_line_1} -{" "}
                                  {item.address_line_2}
                                </label>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                    {billingAddress && billingAddress.length < 2 && 
                      (
                        <div className="checkbox-custom">
                          <input type="checkbox" onChange={this.handleAddBillingAddress} />
                          <label>Ajouter une nouvelle adresse de facturation</label>
                        </div>
                      )
                    }
                    <div className="box-form-button pt-3 mx-auto text-center d-flex">
                      {user &&
                        user.role.role !== "admin" &&
                        user.role.role !== "superadmin" && (
                          <Link
                            to="/auth/student/profile/2"
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

export default RegisterStudentProfile3;
