import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";
import Joi from "joi-browser";

import config from "../../config";
import http from "../../services/httpService";

class StudentBillingDetailPayment extends Component {
  state = {
    data: null,
    notification: [],
    confirmed: false,
  };

  async componentDidMount () {
    const script = document.createElement("script");

    script.src = "https://pptest.payengine.de/bridge/1.0/payengine.min.js";

    script.type = 'text/javascript';
    script.async = true;

    document.body.appendChild(script);

    const { data: result } = await http.get(
      config.apiEndPoint + "venue/billing/" + this.props.match.params.id
    );

    this.setState({ data: result });
  }

  schema = {
    cardHolder: Joi.string()
      .min(3)
      .required()
      .error(new Error("Nom invalide !")),
    cardNumber: Joi.string()
      .creditCard()
      .required()
      .error(new Error("Numéro de carte invalide !")),
    verification: Joi.string()
      .required()
      .error(new Error("CCV requis !")),
    expiryMonth: Joi.string()
      .required()
      .error(new Error("Mois requis !")),
    expiryYear: Joi.string()
      .required()
      .error(new Error("Année requise !")),
  };

  handleSubmit = e => {
    e.preventDefault();

    // TODO: Switch to controlled input later

    const result = Joi.validate(
      {
        cardHolder: document.getElementById( "aep_cardholder" ).value,
        cardNumber: document.getElementById( "aep_credit_card_number" ).value,
        verification: document.getElementById( "aep_verification" ).value,
        expiryMonth: document.getElementById( "aep_expiry_month" ).value,
        expiryYear: document.getElementById( "aep_expiry_year" ).value,
      },
      this.schema
    );

    if (result.error) {
      this.showError(result.error.message);

      return;
    }

    this.setState({ notification: [] });

    // TODO: It should have a loader
    // this.setState({ loading: true });

    const PayEngine = window.PayEngine;

    PayEngine.setPublishableKey(config.payment.development.merchantId);

    const paymentData = result.value;

    PayEngine.createPaymentInstrument('creditcard', paymentData, null, this.controlCreditcard);
  };

  controlCreditcard = (error, result) => {
    if (error) {
      this.showError('Les informations entrées n\'ont pas l\'air correctes');

      return;
    }

    const { paymentInstrumentId } = result;
    const that = this;

    http.get(
      `${config.apiEndPoint}billing/${this.props.match.params.id}/card/${paymentInstrumentId}`
    ).then(function (result) {
      const { data } = result;

      if (true === data.status) {
        that.setState({ confirmed: true });
      }
    });
  };

  showError = message => {
    const notification = { ...this.state.notification };

    notification.message = message;

    this.setState({ notification });
  };

  render() {
    const { data } = this.state;

    if (this.state.confirmed === true) {
      return <Redirect to='/auth/student/profile/confirm' />
    }

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
        <section id="box_main_payment" className="section-content container">
          <div className="row m-0">
            <div className="col-md-6 offset-md-3 p-0">
              <div className="box-form with-shadow">
                <div className="bg-white box-border">
                  <div className="box-pdd">
                    <h2 className="form-title text-center">
                      Paiement de la facture
                    </h2>
                  </div>
                  <div className="box-pdd">
                    Montant : { data && `${data.total_price} ${data.currency}` }
                  </div>
                  <form action="" method="post" className="my-form">
                    <div className="px-60">
                      <label className="text-bold">
                        Choisir son mode de paiement
                      </label>
                    </div>
                    {/*
                    <div className="bg-e3 px-60 py-25">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <div className="d-flex flex-column">
                            <div className="radio-custom mb-0">
                              <input
                                type="radio"
                                name="radio-group"
                                id="paypal"
                              />
                              <label for="paypal">
                                <span className="text-bold">Paypal</span>
                              </label>
                              <div className="pl-38">
                                {/* <small>
                                  Un moyen de paiement simple et sécurisé
                                </small> * /}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 offset-md-3">
                          <img
                            src={require("../../assets/images/paypal.svg")}
                            alt=""
                            className="img-fluid payment-icon"
                          />
                        </div>
                      </div>
                    </div>
                    */}
                    <div className="px-60 py-25">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <div className="d-flex flex-column">
                            <div className="radio-custom mb-0">
                              <input
                                type="radio"
                                name="radio-group"
                                id="visa"
                                checked="checked"
                              />
                              <label for="visa">
                                <span className="text-bold">
                                  Visa / MasterCard
                                </span>
                              </label>
                              <div className="pl-38">
                                {/* <small>
                                  Un moyen de paiement simple et sécurisé
                                </small> */}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 offset-md-3">
                          <div className="d-flex">
                            <img
                              src={require("../../assets/images/mastercard.svg")}
                              alt=""
                              className="img-fluid payment-icon"
                            />
                            <img
                              src={require("../../assets/images/visa.svg")}
                              alt=""
                              className="img-fluid payment-icon"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/*
                    <div className="bg-e3 px-60 py-25">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <div className="d-flex flex-column">
                            <div className="radio-custom mb-0">
                              <input
                                type="radio"
                                name="radio-group"
                                id="postcard"
                              />
                              <label for="postcard">
                                <span className="text-bold">
                                  Postcard / Twint
                                </span>
                              </label>
                              <div className="pl-38">
                                {/* <small>
                                  Un moyen de paiement simple et sécurisé
                                </small> * /}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 offset-md-3">
                          <img
                            src="assets/dist/svg/PayPal.svg"
                            alt=""
                            className="img-fluid payment-icon"
                          />
                        </div>
                      </div>
                    </div>
                    */}
                    {this.state.notification.message && (
                      <div className="alert alert-warning">
                        {this.state.notification.message}
                      </div>
                    )}
                    <div className="px-60 mt-5">
                      <div className="form-group in-group">
                        <input
                          id="aep_cardholder"
                          type="text"
                          className="form-control"
                          placeholder="Nom du titulaire de la carte"
                          required="required"
                        />
                        <input
                          id="aep_credit_card_number"
                          type="text"
                          className="form-control"
                          placeholder="Numéro de carte de crédit"
                          maxLength="19"
                        />
                        <div className="row mrg-bot-10">
                          <div className="col-md-7">
                            <div className="row mx-min5">
                              <div className="col-md-6 pd-x-5">
                                <input
                                  id="aep_expiry_month"
                                  type="text"
                                  className="form-control"
                                  placeholder="Mois"
                                />
                              </div>
                              <div className="col-md-6 pd-x-5">
                                <input
                                  id="aep_expiry_year"
                                  type="text"
                                  className="form-control"
                                  placeholder="Année"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3 offset-md-2">
                            <input
                              id="aep_verification"
                              type="text"
                              className="form-control"
                              placeholder="CCV"
                              maxLength="4"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="box-pdd">
                      <div className="box-form-button pt-4 mx-auto text-center d-flex">
                        <Link
                          to={
                            "/owner/venue/billing/" + (data && (data.item_id || 0))
                          }
                          className="btn btn-transaprent-border-purple text-uppercase w-50 mr-2"
                        >
                          retour
                        </Link>
                        <button
                          // to="/owner/billing/detail/payment-confirm"
                          onClick={this.handleSubmit}
                          id="btn_next_detail"
                          data-next="0"
                          className="btn btn-purple text-uppercase w-50"
                        >
                          suivant
                        </button>
                      </div>
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

export default StudentBillingDetailPayment;
