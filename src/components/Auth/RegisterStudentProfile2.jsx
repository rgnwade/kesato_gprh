import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";
import Joi from "joi-browser";
import _ from "lodash";
import DateFormat from "dateformat";

import config from "../../config";
import auth from "../../services/authService";
import DatePicker from "../Common/DatePicker";

class RegisterStudentProfile2 extends Component {
  state = {
    data: { title: "mrs" },
    selectedDate: new Date(1990, 0, 1),
    tempData: [],
    notification: []
  };

  initDataCreate = () => {
    localStorage.setItem("studentData", JSON.stringify(this.state));
  };

  async componentDidMount() {
    const user = auth.getAuthUser();
    const studentData = localStorage.getItem("studentData");
    if (!studentData) this.initDataCreate();
    if (user.dob !== "undefined" && user.dob !== "" && user.dob !== null) {
      this.setState({ data: user, selectedDate: new Date(user.dob) });
    }
    else this.setState({ data: user });
  }

  schema = {
    last_name: Joi.string()
      .required()
      .error(new Error("Nom requis!")),
    first_name: Joi.string()
      .required()
      .error(new Error("Prénom requis!")),
    phone_mobile: Joi.string()
      .required()
      .error(new Error("Teléphone mobile requis!"))
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
        last_name: this.state.data.last_name,
        first_name: this.state.data.first_name,
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
    const data = { ...this.state.data };
    data[e.currentTarget.name] = e.currentTarget.value;
    this.setState({ data: data });
  };

  handleChangeDatePicker = date => {
    this.setState({ selectedDate: date });
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
    cleanData.dob = DateFormat(this.state.selectedDate, "yyyy-mm-dd");
    cleanData.phone = data.phone;
    cleanData.phone_mobile = data.phone_mobile;
    return cleanData;
  }

  render() {
    if (!auth.getAuthUser()) return <Redirect to="/not-found" />;
    const { data } = this.state;

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
                    <ul className="box-progress student">
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
                      <DatePicker
                        inputNameDay="dob_day"
                        inputNameMonth="dob_month"
                        inputNameYear="dob_year"
                        inputPlaceholderDay="Jour*"
                        inputPlaceholderMonth="Mois*"
                        inputPlaceholderYear="Anée*"
                        selectedDate={this.state.selectedDate}
                        dateFormatDay="dd"
                        dateFormatMonth="MMMM"
                        dateFormatYear="yyyy"
                        onChange={this.handleChangeDatePicker}
                        locale="fr"
                      />
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

export default RegisterStudentProfile2;
