import React, { Component } from "react";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";

import config from "../../config";
import auth from "../../services/authService";
import http from "../../services/httpService";
import number from "../../helpers/number";

class OwnerVenueCreateCart extends Component {
  state = {
    data: [],
    product: [],
    setting: []
  };

  async componentDidMount() {
    const { data: product } = await http.get(
      config.apiEndPoint + "product/list"
    );
    const { data: setting } = await http.get(
      config.apiEndPoint + "setting/list"
    );
    const createVenueData = localStorage.getItem("createVenueData");
    if (createVenueData) {
      const venueData = JSON.parse(createVenueData);
      this.setState({ data: venueData.dataList, product: product, setting: setting });
    }
  }

  handleCheckout = async e => {
    e.preventDefault();
    const user = auth.getAuthUser();
    const venueData = this.state.data.map(item => {
      if (
        typeof item.venue_document !== "undefined" &&
        item.venue_document.length > 0
      ) {
        item.venue_document = JSON.stringify(item.venue_document);
      } else {
        item.venue_document = "";
      }
      return item;
    });
    const { data: result } = await http.post(
      config.apiEndPoint + "venue/checkout",
      { user: user, data: venueData }
    );
    if (result) {
      localStorage.removeItem("createVenueData");
      this.props.history.replace("/owner/venue/create/confirm");
    }
  };

  render() {
    const { data, product } = this.state;
    var cartSubTotal = 0;
    var cartTax = 0;
    var cartTotal = 0;
    if (product.length > 0) {
      cartSubTotal =
        data.length * product[0].price + data.length * product[1].price;
      cartTax = 0.1 * cartSubTotal;
      cartTotal = cartSubTotal + cartTax;
    }
    return (
      <React.Fragment>
        <FormattedMessage id="createVenue">
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
                  <h2 className="form-title text-center">
                    Ajout d'un établissement
                  </h2>
                  <div className="position-relative text-center">
                    <ul className="bar-progress">
                      <li className="active">
                        <div className="icon">
                          <i className="fa fa-user-o" aria-hidden="true" />
                        </div>
                        <p>Coordonnées</p>
                      </li>
                      <li className="active">
                        <div className="icon">
                          <i className="fa fa-envelope-o" aria-hidden="true" />
                        </div>
                        <p>Contact</p>
                      </li>
                      <li className="active">
                        <div className="icon">
                          <i
                            className="fa fa-calendar-check-o"
                            aria-hidden="true"
                          />
                        </div>
                        <p>Information</p>
                      </li>
                      <li className="active">
                        <div className="icon">
                          <i className="fa fa-eye" aria-hidden="true" />
                        </div>
                        <p>Récapitulatif</p>
                      </li>
                      <li className="active">
                        <div className="icon">
                          <i className="fa fa-cart-plus" aria-hidden="true" />
                        </div>
                        <p>Cotisation</p>
                      </li>
                    </ul>
                  </div>
                  <div className="my-form box-form-pdd w-90">
                    <h3 className="form-sub-title">Votre panier</h3>
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
                      <div className="box-cart-row bg-superlight-grey">
                        <div className="row align-items-center">
                          <div className="col-md-5">
                            <div className="img-and-des d-flex align-items-center">
                              <div className="thumb-cart" />
                              <div className="text-body ml-2">
                                <h3 className="text-bold">
                                  {product.length > 0 && product[0].name}
                                </h3>
                                <p className="mb-0">
                                  {product.length > 0 && product[0].description}
                                </p>
                                <small>
                                  Code produit :{" "}
                                  {product.length > 0 && product[0].code}
                                </small>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-2">
                            <input
                              type="text"
                              className="form-control text-center"
                              value={data.length}
                            />
                          </div>
                          <div className="col-md-2">
                            <input
                              type="text"
                              className="form-control text-right"
                              value={
                                product.length > 0 &&
                                number.formatedPrice(product[0].price, this.state.setting.commerce_base_currency, config.locale.code)
                              }
                            />
                          </div>
                          <div className="col-md-2">
                            <input
                              type="text"
                              className="form-control text-right"
                              value={
                                product.length > 0 &&
                                number.formatedPrice(data.length * product[0].price, this.state.setting.commerce_base_currency, config.locale.code)
                              }
                            />
                          </div>
                          <div className="col-md-1 pl-0">
                            <button
                              type="button"
                              className="btn bg-transparent p-0 hide"
                            >
                              <i className="fa fa-trash" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      {data.length > 0 &&
                        data.map((item, index) => {
                          return (
                            <div className="box-cart-row bg-superlight-grey">
                              <div className="row align-items-center">
                                <div className="col-md-5">
                                  <div className="img-and-des d-flex align-items-center">
                                    <div className="thumb-cart" />
                                    <div className="text-body ml-2">
                                      <h3 className="text-bold">
                                        {product.length > 0 && product[1].name}
                                      </h3>
                                      <p className="mb-0">
                                        {product.length > 0 &&
                                          item.company_name}
                                      </p>
                                      <small>
                                        Code produit :{" "}
                                        {product.length > 0 && product[1].code}
                                      </small>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-2">
                                  <input
                                    type="text"
                                    className="form-control text-center"
                                    value="1"
                                  />
                                </div>
                                <div className="col-md-2">
                                  <input
                                    type="text"
                                    className="form-control text-right"
                                    value={
                                      product.length > 0 &&
                                      number.formatedPrice(
                                        product[1].price,
                                        this.state.setting.commerce_base_currency, config.locale.code
                                      )
                                    }
                                  />
                                </div>
                                <div className="col-md-2">
                                  <input
                                    type="text"
                                    className="form-control text-right"
                                    value={
                                      product.length > 0 &&
                                      number.formatedPrice(
                                        product[1].price,
                                        this.state.setting.commerce_base_currency, config.locale.code
                                      )
                                    }
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
                        <div className="checkbox-custom text-center">
                          <input
                            type="checkbox"
                            id="ajouter"
                            checked="checked"
                          />
                          <label for="ajouter">
                            J'ai lu et j'accepte les conditions générales du
                            GPRH
                          </label>
                        </div>
                        <div className="box-form-button pt-4 mx-auto text-center">
                          <button
                            onClick={this.handleCheckout}
                            type="button"
                            id="btn_next_cotisation"
                            data-next="0"
                            className="btn btn-purple text-uppercase w-50"
                          >
                            valider mon inscription
                          </button>
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

export default OwnerVenueCreateCart;
