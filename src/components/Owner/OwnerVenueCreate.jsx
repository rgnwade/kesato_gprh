import React, { Component } from "react";
import { Route } from "react-router-dom";
import TransitionGroup from "react-transition-group/TransitionGroup";
import AnimatedSwitch from "../Layout/AnimatedSwitch";

import OwnerVenueCreateStep1 from "./OwnerVenueCreateStep1.jsx";
import OwnerVenueCreateStep2 from "./OwnerVenueCreateStep2.jsx";
import OwnerVenueCreateStep3 from "./OwnerVenueCreateStep3.jsx";
import OwnerVenueCreateStep4 from "./OwnerVenueCreateStep4.jsx";
import OwnerVenueCreateStep5 from "./OwnerVenueCreateStep5.jsx";
import OwnerVenueCreateAddBillingAddress from "./OwnerVenueCreateAddBillingAddress.jsx";
import OwnerVenueCreateCart from "./OwnerVenueCreateCart.jsx";
import OwnerVenueCreateConfirm from "./OwnerVenueCreateConfirm.jsx";
import Error404 from "../Layout/Error404";

class OwnerVenueCreate extends Component {
  state = {
    data: [],
    dataList: [],
    notification: [],
    fillUsingManagerDetail: false
  };

  initDataCreate = () => {
    localStorage.setItem("createVenueData", JSON.stringify(this.state));
  };

  render() {
    return (
      <React.Fragment>
        <Route
          render={({ location }) => (
            <TransitionGroup component="main">
              <AnimatedSwitch key={location.key} location={location}>
                <Route
                  path="/owner/venue/create"
                  exact
                  render={props => (
                    <OwnerVenueCreateStep1
                      {...props}
                      data={this.state.data}
                      handleStep={this.handleStep1}
                      initDataCreate={this.initDataCreate}
                    />
                  )}
                />
                <Route
                  path="/owner/venue/create/step/2"
                  exact
                  render={props => (
                    <OwnerVenueCreateStep2
                      {...props}
                      data={this.state.data}
                      handleStep={this.handleStep2}
                      initDataCreate={this.initDataCreate}
                    />
                  )}
                />
                <Route
                  path="/owner/venue/create/step/3"
                  exact
                  render={props => (
                    <OwnerVenueCreateStep3
                      {...props}
                      handleStep={this.handleStep3}
                      initDataCreate={this.initDataCreate}
                    />
                  )}
                />
                <Route
                  path="/owner/venue/create/step/4"
                  exact
                  render={props => (
                    <OwnerVenueCreateStep4
                      {...props}
                      handleStep={this.handleStep4}
                      initDataCreate={this.initDataCreate}
                    />
                  )}
                />
                <Route
                  path="/owner/venue/create/step/5"
                  exact
                  render={props => (
                    <OwnerVenueCreateStep5
                      {...props}
                      handleStep={this.handleStep5}
                      initDataCreate={this.initDataCreate}
                    />
                  )}
                />
                <Route
                  path="/owner/venue/create/cart"
                  exact
                  render={props => (
                    <OwnerVenueCreateCart
                      {...props}
                      handleStep={this.handleStepCart}
                      initDataCreate={this.initDataCreate}
                    />
                  )}
                />
                <Route
                  path="/owner/venue/create/confirm"
                  exact
                  render={props => (
                    <OwnerVenueCreateConfirm
                      {...props}
                      handleStep={this.handleStepCart}
                      initDataCreate={this.initDataCreate}
                    />
                  )}
                />
                <Route
                  path="/owner/venue/create/billing-address/add"
                  exact
                  component={OwnerVenueCreateAddBillingAddress}
                />
                <Route component={Error404} />
              </AnimatedSwitch>
            </TransitionGroup>
          )}
        />
      </React.Fragment>
    );
  }
}

export default OwnerVenueCreate;
