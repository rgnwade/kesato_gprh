import React, { Component } from "react";
import { Link } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import OwlCarousel from "react-owl-carousel";
import ChangeCase from "change-case";

import config from "../../config";
import http from "../../services/httpService";
import auth from "../../services/authService";

import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

class OwnerDashboard extends Component {
  state = {
    data: []
  };

  async componentDidMount() {
    const user = auth.getAuthUser();
    const { data: result } = await http.get(
      config.apiEndPoint + "venue/user/" + user.id
    );
    if (result) {
      this.setState({ data: result });
    }
  }

  render() {
    const { data } = this.state;
    var reviewedVenue = 0;
    if (data && data.length > 0) {
      data.map(function(item) {
        if (item.status === "0") reviewedVenue++;
        return true;
      });
    }

    const blogGalleryOptions = {
      loop: true,
      nav: false,
      dots: false,
      margin: 30,
      responsive: {
        0: {
          items: 1
        },
        600: {
          items: 2
        },
        1000: {
          items: 3
        }
      }
    };

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
        <section className="section-content container px-6">
          <h2 className="head-title text-uppercase">
            <FormattedMessage id="dashboard" />
          </h2>
          <div className="banner-top">
            <img
              src={require("../../assets/images/dashboard.png")}
              alt=""
              className="img-fluid o-cover w-100"
            />
          </div>
          <p className="text-bold text-center pt-4">
            Bienvenu dans votre espace membre. Pour terminer votre inscription
            vouz devez ajouter un établissement.
          </p>
          <div className="dash-status mt-5">
            <div className="row">
              <div className="col-md-3">
                <p className="text-bold mb-1 d-flex align-items-center text-uppercase">
                  STATUT DU MEMBRE :{" "}
                  <span className="round-color lightgreen d-inline-block ml-2" />
                </p>
                <p className="color-mediumgrey mb-1">Actif</p>
              </div>
              {data && data.length > 0 && (
                <div className="col-md-9">
                  <p className="text-bold mb-1 d-flex align-items-center text-uppercase">
                    statut etablissement :{" "}
                    <span className="round-color bg-warning d-inline-block ml-2" />
                  </p>
                  <p className="color-mediumgrey mb-1">
                    {reviewedVenue} établissement en attente de <br />{" "}
                    validation par le comité du GPRH
                  </p>
                </div>
              )}
              {data && data.length === 0 && (
                <div className="col-md-9">
                  <p className="text-bold mb-1 d-flex align-items-center text-uppercase">
                    statut etablissement :{" "}
                  </p>
                  <p className="color-mediumgrey mb-1">
                    Vouz n'avez aucun établissement enregistrer
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="hr-border" />

          <div className="dash-main-menu py-2">
            <div className="row">
              <div className="col-md-4">
                <Link
                  to="/owner/venue/create"
                  className="btn btn-main text-uppercase btn-dash-menu bg-white text-center text-bold d-block"
                >
                  ajouter un establissement
                </Link>
              </div>
              {data && data.length > 0 && (
                <div className="col-md-4">
                  <Link
                    to="/owner/venue/listing"
                    className="btn btn-main text-uppercase btn-dash-menu bg-white text-center text-bold d-block"
                  >
                    gérer mes establissements
                  </Link>
                </div>
              )}
              {data && data.length > 0 && (
                <div className="col-md-4">
                  <Link
                    to="/owner/billing/listing"
                    className="btn btn-main text-uppercase btn-dash-menu bg-white text-center text-bold d-block"
                  >
                    gérer mes factures
                  </Link>
                </div>
              )}
              {data && data.length === 0 && (
                <div className="col-md-4">
                  <Link
                    to="#"
                    className="btn disabled btn-main text-uppercase btn-dash-menu bg-white text-center text-bold d-block"
                    onClick={e => e.preventDefault()}
                  >
                    gérer mes establissements
                  </Link>
                </div>
              )}
              {data && data.length === 0 && (
                <div className="col-md-4">
                  <Link
                    to="#"
                    className="btn disabled btn-main text-uppercase btn-dash-menu bg-white text-center text-bold d-block"
                    onClick={e => e.preventDefault()}
                  >
                    gérer mes factures
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="hr-border" />

          <div className="dash-carousel pt-4 position-relative">
            <div className="row align-items-center mb-4">
              <div className="col-md-6">
                <p className="text-bold mb-0">Les dernières news du GPRH</p>
              </div>
              <div className="col-md-6 d-flex justify-content-end">
                <button
                  type="button"
                  id="btn_prev"
                  className="btn mr-2 bg-transparent"
                  onClick={() => this.refs.blogGallery.prev()}
                >
                  <i className="fa fa-angle-left" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  id="btn_next"
                  className="btn bg-transparent"
                  onClick={() => this.refs.blogGallery.next()}
                >
                  <i className="fa fa-angle-right" aria-hidden="true" />
                </button>
              </div>
            </div>

            <OwlCarousel
              ref="blogGallery"
              className="owl-theme"
              {...blogGalleryOptions}
            >
              <div className="dash-item">
                <img
                  src={require("../../assets/images/dash-1.png")}
                  alt=""
                  className="img-fluid"
                />
                <div className="box-des bg-white">
                  <p className="text-bold mb-2">Dolore magna aliqua</p>
                  <p className="des mb-3">
                    Lorem ipsum dolor sit amet elit turpis, consectetur
                    adipiscing.
                  </p>
                  <p className="times-des">
                    <i className="fa fa-clock-o" aria-hidden="true" /> 2m ago
                  </p>
                </div>
              </div>
              <div className="dash-item">
                <img
                  src={require("../../assets/images/dash-2.png")}
                  alt=""
                  className="img-fluid"
                />
                <div className="box-des bg-white">
                  <p className="text-bold mb-2">Morbi elefend a libero</p>
                  <p className="des mb-3">
                    Lorem ipsum dolor sit amet elit turpis, consectetur
                    adipiscing.
                  </p>
                  <p className="times-des">
                    <i className="fa fa-clock-o" aria-hidden="true" /> 1h ago
                  </p>
                </div>
              </div>
              <div className="dash-item">
                <img
                  src={require("../../assets/images/dash-3.png")}
                  alt=""
                  className="img-fluid"
                />
                <div className="box-des bg-white">
                  <p className="text-bold mb-2">Morbi elefend a libero</p>
                  <p className="des mb-3">
                    Lorem ipsum dolor sit amet elit turpis, consectetur
                    adipiscing.
                  </p>
                  <p className="times-des">
                    <i className="fa fa-clock-o" aria-hidden="true" /> 3h ago
                  </p>
                </div>
              </div>
              <div className="dash-item">
                <img
                  src={require("../../assets/images/dash-2.png")}
                  alt=""
                  className="img-fluid"
                />
                <div className="box-des bg-white">
                  <p className="text-bold mb-2">Morbi elefend a libero</p>
                  <p className="des mb-3">
                    Lorem ipsum dolor sit amet elit turpis, consectetur
                    adipiscing.
                  </p>
                  <p className="times-des">
                    <i className="fa fa-clock-o" aria-hidden="true" /> 1h ago
                  </p>
                </div>
              </div>
            </OwlCarousel>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default OwnerDashboard;
