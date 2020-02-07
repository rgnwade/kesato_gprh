import React, { Component } from "react";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";

import config from "../../config";

class OwnerVenueCreateStep5 extends Component {
  state = {};

  handleCreateFinish = e => {
    e.preventDefault();
    const createVenueData = localStorage.getItem("createVenueData");
    if (createVenueData) {
      const venueData = JSON.parse(createVenueData);
      venueData.dataList.push(venueData.data);
      venueData.data = [];
      localStorage.setItem("createVenueData", JSON.stringify(venueData));
      this.props.history.push("/owner/venue/create/cart");
    }
  };

  handleCreateAgain = e => {
    e.preventDefault();
    const createVenueData = localStorage.getItem("createVenueData");
    if (createVenueData) {
      const venueData = JSON.parse(createVenueData);
      venueData.dataList.push(venueData.data);
      venueData.data = [];
      localStorage.setItem("createVenueData", JSON.stringify(venueData));
      this.props.history.push("/owner/venue/create");
    }
  };

  render() {
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
            <div id="box_lay_6" className="col-md-6 offset-md-3 p-0">
              <div id="box_recap_conf" className="box-form with-shadow">
                <div className="bg-white box-pdd box-border py-5">
                  <h2 className="form-title text-center">
                    Ajout d'un établissement
                  </h2>
                  <div className="box-form-pdd">
                    <div className="text-center mt-6">
                      <label className="text-bold">
                        Souhaitez vous ajouter un établissement supplémentaire ?
                      </label>
                    </div>
                    <div className="box-form-button pt-4 mx-auto text-center d-flex">
                      <button
                        type="button"
                        onClick={this.handleCreateAgain}
                        id="btn_next_recap_conf"
                        data-next="0"
                        className="btn btn-purple text-uppercase w-50 mr-2"
                      >
                        oui
                      </button>
                      <button
                        type="button"
                        onClick={this.handleCreateFinish}
                        id="btn_next_recap_conf"
                        data-next="0"
                        className="btn btn-purple text-uppercase w-50"
                      >
                        non
                      </button>
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

export default OwnerVenueCreateStep5;
