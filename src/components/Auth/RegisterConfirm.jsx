import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";

import config from "../../config";
import auth from "../../services/authService";
import http from "../../services/httpService";

class RegisterConfirm extends Component {
  state = {
    data: [],
    notification: []
  };

  async componentDidMount() {
    const { data: result } = await http.get(
      config.apiEndPoint +
        "auth/signup/confirmation/" +
        this.props.match.params.token
    );
    this.setState({ data: result });
  }

  handleResendEmail = async () => {
    try {
      const { data: resend } = await http.get(
        config.apiEndPoint +
          "auth/signup/resendemail/" +
          this.props.match.params.token
      );
      if (resend) {
        this.showNotification("L'email de confirmation a été envoyé ");
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400)
        this.showNotification(ex.response.data);
    }
  };

  showNotification(message) {
    const notification = { ...this.state.notification };
    notification.message = message;
    this.setState({ notification });
  }

  render() {
    if (auth.getAuthUser()) return <Redirect to="/owner/dashboard" />;

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
                    {this.props.match.params.role === 'owner' ? "Information sur le MEMBER GPRH" : "Création d'un compte etudiant" }
                  </h2>
                  <div className="position-relative text-center">
                    <ul className="box-progress">
                      <li className="active" />
                      <li className="active" />
                      <li className="active" />
                    </ul>
                  </div>
                  <div className="box-in-form text-center">
                    <p className="title">Félicitation!</p>
                    <small>Dans quelques instants vouz allez recevoir un email dans votre boite de réception.</small>
                    <p className="title">
                      {this.props.match.params.role === 'owner' ? "Merci de cliquer sur le lien pour terminer votre inscription et pour ajouter votre établissement." : "Merci de cliquer sur le lien pour terminer votre inscription." }
                    </p>
                    <small>Si vous ne recevez pas l'email, veuillez cliquer sur le bouton ''envoyer l'email á nouveau'' ci dessous.</small>
                    <br />
                    <button
                      onClick={this.handleResendEmail}
                      type="button"
                      className="btn btn-transaprent-border-purple text-uppercase w-100 mb-2"
                    >
                      Envoyer l'email á nouveau
                    </button>
                    <Link
                      to={"/auth/login/" + this.props.match.params.role}
                      className="btn btn-purple text-uppercase w-100"
                    >
                      Retour à la page de connexion
                    </Link>
                    <p />
                    {this.state.notification.message && (
                      <div className="alert alert-warning">
                        {this.state.notification.message}
                      </div>
                    )}
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

export default RegisterConfirm;
