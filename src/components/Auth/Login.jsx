import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";
import Joi from "joi-browser";

import config from "../../config";
import auth from "../../services/authService";

class Login extends Component {
  state = {
    data: { email: "", password: "" },
    errors: {}
  };

  schema = {
    email: Joi.string()
      .email({ minDomainAtoms: 2 })
      .required()
      .email()
      .error(new Error("adresse email invalide!")),
    password: Joi.string()
      .required()
      .error(new Error("passe requis"))
  };

  doSubmit = async () => {
    try {
      const token = await auth.signin(
        this.refs.email.value,
        this.refs.password.value,
        this.props.userRole
      );
      if (token) {
        const user = auth.getAuthUser();
        // console.log(user);
        if (user) window.location = "/" + user.role.role + "/dashboard";
        else this.showError("Nom d'utilisateur ou mot de passe invalide");
      } else this.showError("Nom d'utilisateur ou mot de passe invalide");
    } catch (ex) {
      if (ex.response && ex.response.status === 400)
        this.showError(ex.response.data);
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const result = Joi.validate(
      { email: this.state.data.email, password: this.state.data.password },
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
    data.password = "";
    errors.message = message;
    this.setState({ data, errors });
  }

  render() {
    const user = auth.getAuthUser();
    if (user) return <Redirect to={"/" + user.role.role + "/dashboard"} />;

    return (
      <React.Fragment>
        <FormattedMessage id="login">
          {title => (
            <Helmet>
              <title>
                {ChangeCase.titleCase(title)} | {config.appName}
              </title>
            </Helmet>
          )}
        </FormattedMessage>
        <section className="section-content container">
          <div className="box-form with-shadow">
            <div className="row m-0">
              <div className="col-md-6 p-0">
                <div className="bg-white box-pdd box-border login-container">
                  <h2 className="form-title text-center">S'identifier</h2>
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
                      {/* <small>Mot de passe oubilé ?</small> */}
                      <small> </small>
                      <div className="checkbox-custom text-right">
                        <input type="checkbox" id="rester" />
                        <label htmlFor="rester">Rester Connecté</label>
                      </div>
                    </div>
                    <div className="box-form-button pt-3 mx-auto">
                      <button
                        type="submit"
                        className="btn btn-purple text-uppercase w-100 mb-2"
                      >
                        Se Connecter
                      </button>
                      {/* <Link
                        to={"/auth/login/" + this.props.userRole}
                        className="btn btn-fb text-uppercase w-100"
                      >
                        <i className="fa fa-facebook" aria-hidden="true" /> Se
                        Connecter avec facebook
                      </Link> */}
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-md-6 p-0">
                <div className="bg-bluegrey box-pdd box-border border-left-none signup-container full-height">
                  <h2 className="form-title text-center">Créer un compte</h2>
                  <form
                    action=""
                    method="post"
                    className="my-form box-form-pdd"
                  >
                    <div className="box-form-button pt-3 mx-auto">
                      <Link
                        to={"/auth/register/" + this.props.userRole}
                        className="btn btn-purple text-uppercase w-100 mb-2"
                      >
                        créer un compte
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

export default Login;
