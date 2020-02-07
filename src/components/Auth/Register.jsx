import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";
import Joi from "joi-browser";

import config from "../../config";
import auth from "../../services/authService";

class Register extends Component {
  state = {
    data: { email: "", password: "", passwordRepeat: "" },
    errors: {}
  };

  schema = {
    email: Joi.string()
      .email({ minDomainAtoms: 2 })
      .required()
      .email()
      .error(new Error("Adresse email invalide!")),
    password: Joi.string()
      .min(6)
      .required()
      .error(new Error("Mot de passe requis et minimum 6 caractères")),
    passwordRepeat: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .error(new Error("Le mot de passe ne correspond pas"))
  };

  doSubmit = async () => {
    try {
      const user = auth.getAuthUser();
      var signup = null;
      if (
        user &&
        (user.role.role === "admin" || user.role.role === "superadmin")
      ) {
        signup = await auth.signupByAdmin(
          this.state.data.email,
          this.state.data.password,
          this.props.userRole,
          false,
          user.id
        );
      } else {
        signup = await auth.signup(
          this.state.data.email,
          this.state.data.password,
          this.props.userRole
        );
      }
      if (signup) {
        if (
          user &&
          (user.role.role === "admin" || user.role.role === "superadmin")
        ) {
          localStorage.setItem("newUser", signup);
          this.props.history.push("/admin/owner/profile/2");
        } else {
          if(this.props.userRole == "owner"){
            window.location = "/auth/register/owner/confirm/" + signup;
          }
          else{
            window.location = "/auth/register/student/confirm/" + signup;
          }
        }
      } else {
        this.showError(
          "Email déjà enregistré. Veuillez utiliser une autre adresse e-mail."
        );
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
        password: this.state.data.password,
        passwordRepeat: this.state.data.passwordRepeat
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
    const data = { ...this.state.data };
    const errors = { ...this.state.errors };
    errors.message = message;
    this.setState({ data, errors });
  }

  render() {
    const user = auth.getAuthUser();
    if (user && user.role.role !== "admin" && user.role.role !== "superadmin")
      return <Redirect to={"/" + user.role.role + "/dashboard"} />;

    return (
      <React.Fragment>
        <FormattedMessage id="register">
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
                    Création d'un compte
                  </h2>
                  <form
                    className="my-form box-form-pdd"
                    onSubmit={this.handleSubmit}
                  >
                    {this.state.errors.message && (
                      <div className="alert alert-warning">
                        {this.state.errors.message}
                      </div>
                    )}
                    <div className="form-group">
                      <input
                        name="email"
                        ref="email"
                        autoFocus
                        type="email"
                        className="form-control"
                        placeholder="Entrez votre adresse email"
                        value={this.state.data.email}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        name="password"
                        ref="password"
                        type="password"
                        className="form-control"
                        placeholder="Choisissez un mot de passe"
                        value={this.state.data.password}
                        onChange={this.handleChange}
                      />
                      <small className="d-flex align-items-center text-with-icon">
                        <i className="fa fa-info mr-2" aria-hidden="true" /> Le Mot de passe doit contenir au moins 6 caractères
                      </small>
                    </div>
                    <div className="form-group">
                      <input
                        name="passwordRepeat"
                        ref="passwordRepeat"
                        type="password"
                        className="form-control"
                        placeholder="Répétez votre mot de passe"
                        value={this.state.data.passwordRepeat}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="box-form-button pt-3 mx-auto">
                      <button
                        type="submit"
                        className="btn btn-purple text-uppercase w-100 mb-2"
                      >
                        créer un compte
                      </button>
                      <Link
                        to={this.props.backLink}
                        className="btn btn-transaprent-border-purple text-uppercase w-100"
                      >
                        annuler
                      </Link>
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

export default Register;
