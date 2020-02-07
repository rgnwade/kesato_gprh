import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";

import config from "../../config";
import http from "../../services/httpService";
import auth from "../../services/authService";
import dateFormat from "../../helpers/dateFormat";
import number from "../../helpers/number";

class OwnerBillingDetailInvoice extends Component {
  state = {
    data: {
      billing_address: [],
      billing_items: [],
      user: []
    },
    setting: []
  };

  async componentDidMount() {
    const { data: billing } = await http.get(
      config.apiEndPoint + "billing/" + this.props.match.params.id
    );
    const { data: setting } = await http.get(
      config.apiEndPoint + "setting/list"
    );
    this.setState({ data: billing, setting: setting });
  }

  handlePrint = e => {
    e.preventDefault();
    window.print();
  };

  render() {
    const user = auth.getAuthUser();
    if (!user) return <Redirect to="/not-found" />;

    const { data } = this.state;
    const { billing_address } = data;

    var cartSubTotal = 0;
    var cartTax = 0;
    var cartTotal = 0;
    if (data.billing_items && data.billing_items.length > 0) {
      data.billing_items.map(item => {
        cartSubTotal += item.price;
        return true;
      });
      if (data.tax_amount > 0) {
        cartTax = (data.tax_amount / 100) * cartSubTotal;
        cartTotal = cartSubTotal + cartTax;
      } else cartTotal = cartSubTotal;
    }

    return (
      <React.Fragment>
        <FormattedMessage id="invoice">
          {title => (
            <Helmet>
              <title>
                {ChangeCase.titleCase(title)} | {config.appName}
              </title>
            </Helmet>
          )}
        </FormattedMessage>
        <section id="box_main_payment" className="section-content container">
          <div
            className="modal-lg mx-auto"
            role="document"
          >
            <div className="popup-factures">
              <div className="d-flex">
                <div className="box-left same-height">
                  <div className="big-icon text-center">
                    <i className="fa fa-print" aria-hidden="true" onClick={this.handlePrint} />
                  </div>
                  <div className="big-icon text-center">
                    <i className="fa fa-download" aria-hidden="true" onClick={this.handlePrint} />
                  </div>
                </div>
                <div className="box-right same-height">
                  <div className="bg-white right-pdd py-80">
                    <h2 className="head-title text-uppercase">facture</h2>
                    <div className="current-idenity">
                      <div className="row">
                        <div className="col-md-7">
                          <p className="title text-bold">
                            {data.user.first_name + " " + data.user.last_name}
                          </p>
                          <div className="row">
                            <div className="col-md-4 pr-0">
                              <p>Date</p>
                            </div>
                            <div className="col-md-8">
                              <p>
                                : {dateFormat(data.created_at, "dd mmmm yyyy")}
                              </p>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-4 pr-0">
                              <p>
                                Facture n<sup>o</sup>
                              </p>
                            </div>
                            <div className="col-md-8">
                              <p>: {data.order_number}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-5">
                          <div className="text-right">
                            <p>{billing_address.billed_to}</p>
                            <p>{billing_address.address_line_1}</p>
                            <p>{billing_address.address_line_2}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="transaction-table">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th scope="col">Destination</th>
                            <th scope="col">Prik Unitaire</th>
                            <th scope="col">Quantite</th>
                            <th scope="col">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.billing_items &&
                            data.billing_items.length > 0 &&
                            data.billing_items.map((item, index) => {
                              return (
                                <tr>
                                  <td>
                                    <span className="text-bold">
                                      {item.item_label}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="text-bold">
                                      {number.formatedPrice(item.price, this.state.setting.commerce_base_currency, config.locale.code)}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="text-bold">
                                      {item.quantity}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="text-bold color-orange">
                                      {number.formatedPrice(item.price, this.state.setting.commerce_base_currency, config.locale.code)}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="bg-cream right-pdd pb-50">
                    <div className="transaction-table summary-table">
                      <table className="table table-hover mb-0">
                        <thead>
                          <tr>
                            {/* <th scope="col">AWB</th>
                            <th scope="col">A Reguer avant le</th> */}
                            <th scope="col"> </th>
                            <th scope="col"> </th>
                            <th scope="col">total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <div className="row">
                                {/* <div className="col-md-3">
                                  <span className="text-bold">BAN</span>
                                </div>
                                <div className="col-md-9">
                                  <span className="text-bold">
                                    : 123 456 789
                                  </span>
                                </div> */}
                                <div className="col-md-4">
                                  <span className="text-bold">Sous-total</span>
                                </div>
                                <div className="col-md-8">
                                  <span className="text-bold">
                                    :{" "}
                                    {number.formatedPrice(cartSubTotal, this.state.setting.commerce_base_currency, config.locale.code)}
                                  </span>
                                </div>
                              </div>
                              <div className="row">
                                {/* <div className="col-md-3">
                                  <span className="text-bold">BIC</span>
                                </div>
                                <div className="col-md-9">
                                  <span className="text-bold">: 01 02 03</span>
                                </div> */}
                                <div className="col-md-4">
                                  <span className="text-bold">TVA</span>
                                </div>
                                <div className="col-md-8">
                                  <span className="text-bold">
                                    : {number.formatedPrice(cartTax, this.state.setting.commerce_base_currency, config.locale.code)}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="text-bold big-font">
                                {/* 9 Fev. 18 */}
                              </span>
                            </td>
                            <td>
                              <span className="text-bold bold-font color-orange">
                                {number.formatedPrice(cartTotal, this.state.setting.commerce_base_currency, config.locale.code)}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="foot-print text-right">
                      <ul className="p-0">
                        <li>
                          <p>info@gprh.com</p>
                        </li>
                        <li>
                          <p>(0361) 987654</p>
                        </li>
                        <li>
                          <a
                            href="http://factures-pro.com"
                            className="pr-0"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            www.gprh.com
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="box-form-button pt-4 mx-auto text-center d-flex justify-content-center">
            {user.role.role === "owner" && (
              <Link
                to={
                  "/" +
                  user.role.role +
                  "/venue/billing/" +
                  (data && data.item_id)
                }
                className="btn btn-transaprent-border-purple text-uppercase w-25 mr-2"
              >
                retour
              </Link>
            )}
            {(user.role.role === "admin" ||
              user.role.role === "superadmin") && (
              <Link
                to={
                  "/" +
                  user.role.role +
                  "/billing/cart/" +
                  this.props.match.params.id
                }
                className="btn btn-transaprent-border-purple text-uppercase w-25 mr-2"
              >
                retour
              </Link>
            )}
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default OwnerBillingDetailInvoice;
