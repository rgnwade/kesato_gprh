import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";

import config from "../../config";
import auth from "../../services/authService";
import http from "../../services/httpService";
import number from "../../helpers/number";

class AdminBillingCart extends Component {
  state = {
    data: [],
    setting: []
  };

  async componentDidMount() {
    const { data: billing } = await http.get(
      config.apiEndPoint + "billing/" + this.props.match.params.id
    );
    const { data: setting } = await http.get(
      config.apiEndPoint + "setting/list"
    );
    this.setState({ data: billing, setting:setting });
  }

  render() {
    const user = auth.getAuthUser();
    if (!user) return <Redirect to="/not-found" />;

    const { data } = this.state;
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
        <FormattedMessage id="admin">
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
            <div id="box_cotisation_panier" className="col-md-10 offset-md-1">
              <div className="box-form with-shadow">
                <div className="bg-white box-pdd box-border">
                  <h2 className="form-title text-center">Cotisation membre</h2>
                  <div className="my-form box-form-pdd w-90">
                    <div className="box-table-cart">
                      <div className="box-cart-head">
                        <div className="row">
                          <div className="col-md-5">
                            <small>Produits</small>
                          </div>
                          <div className="col-md-2 text-center">
                            <small>Quantité</small>
                          </div>
                          <div className="col-md-2">
                            <small>Prix unitaire</small>
                          </div>
                          <div className="col-md-3">
                            <small>Prix total</small>
                          </div>
                        </div>
                      </div>
                      {data.billing_items &&
                        data.billing_items.length > 0 &&
                        data.billing_items.map((item, index) => {
                          return (
                            <div
                              key={index}
                              className="box-cart-row bg-superlight-grey"
                            >
                              <div className="row align-items-center">
                                <div className="col-md-5">
                                  <div className="img-and-des d-flex align-items-center">
                                    <div className="thumb-cart" />
                                    <div className="text-body ml-2">
                                      <h3 className="text-bold">
                                        {item.item_label}
                                      </h3>
                                      <small>
                                        Code produit : {item.item_code}
                                      </small>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-2">
                                  <input
                                    type="text"
                                    className="form-control text-center"
                                    value={item.quantity}
                                  />
                                </div>
                                <div className="col-md-2">
                                  <input
                                    type="text"
                                    className="form-control text-right"
                                    value={number.formatedPrice(
                                      item.price,
                                      this.state.setting.commerce_base_currency, config.locale.code
                                    )}
                                  />
                                </div>
                                <div className="col-md-2">
                                  <input
                                    type="text"
                                    className="form-control text-right"
                                    value={number.formatedPrice(
                                      item.price,
                                      this.state.setting.commerce_base_currency, config.locale.code
                                    )}
                                  />
                                </div>
                                <div className="col-md-1 pl-0">
                                  <button
                                    type="button"
                                    className="btn bg-transparent p-0 hide"
                                  >
                                    <i
                                      className="fa fa-trash"
                                      aria-hidden="true"
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                      <div className="box-cart-summary">
                        <div className="row">
                          <div className="col-md-5">
                            <form
                              action=""
                              method="post"
                              className="form-promotion hide"
                            >
                              <div className="position-relative">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Insérez votre code promo ici"
                                />
                                <button
                                  type="submit"
                                  className="btn bg-transparent"
                                >
                                  Appliquer
                                </button>
                              </div>
                            </form>
                          </div>
                          <div className="col-md-4">
                            <div className="text-right">
                              <small className="text-bold d-blovk">
                                Sous-total
                              </small>
                              <small className="text-bold text-uppercase d-block">
                                TVA
                              </small>
                              <p className="text-bold text-uppercase mt-1 mb-0">
                                total ttc
                              </p>
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="text-right">
                              <small className="text-bold d-blovk">
                                {number.formatedPrice(cartSubTotal, this.state.setting.commerce_base_currency, config.locale.code)}
                              </small>
                              <small className="text-bold text-uppercase d-block">
                                {number.formatedPrice(cartTax, this.state.setting.commerce_base_currency, config.locale.code)}
                              </small>
                              <p className="text-bold text-uppercase mt-1 mb-0">
                                {number.formatedPrice(cartTotal, this.state.setting.commerce_base_currency, config.locale.code)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="box-cart-footer">
                        <div className="box-form-button pt-4 mx-auto text-center mb-5">
                          <Link
                            to={
                              "/" +
                              user.role.role +
                              "/billing/invoice/" +
                              this.props.match.params.id
                            }
                            className="btn btn-purple text-uppercase mr-3 px-4 btn_back_compte"
                          >
                            voir la facture
                          </Link>
                        </div>
                        <div className="box-form-button pt-4 mx-auto text-center">
                          <Link
                            to={"/" + user.role.role + "/billing/listing"}
                            className="btn btn-transaprent-border-purple text-uppercase mr-3 px-4 btn_back_compte"
                          >
                            retour
                          </Link>
                        </div>
                      </div>
                    </div>
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

export default AdminBillingCart;
