import React, { Component } from "react";
import { Redirect, Route } from "react-router-dom";
import TransitionGroup from "react-transition-group/TransitionGroup";
import AnimatedSwitch from "../Layout/AnimatedSwitch";

import HeaderOwner from "../Layout/HeaderOwner";
import OwnerDashboard from "./OwnerDashboard";
import OwnerVenueListing from "./OwnerVenueListing";
import OwnerVenueDetail from "./OwnerVenueDetail";
import OwnerVenueCreate from "./OwnerVenueCreate.jsx";
import OwnerBillingListing from "./OwnerBillingListing";
import OwnerBillingDetail from "./OwnerBillingDetail";
import OwnerBillingDetailInvoice from "./OwnerBillingDetailInvoice";
import OwnerBillingDetailPayment from "./OwnerBillingDetailPayment";
import OwnerBillingDetailPaymentConfirm from "./OwnerBillingDetailPaymentConfirm";
import OwnerProfile from "./OwnerProfile";
import Error404 from "../Layout/Error404";

import auth from "../../services/authService";

class Owner extends Component {
  render() {
    if (!auth.isAuthorizedUser("owner"))
      return <Redirect to="/auth/login/owner" />;

    return (
      <React.Fragment>
        <HeaderOwner />
        <Route
          render={({ location }) => (
            <TransitionGroup component="main">
              <AnimatedSwitch key={location.key} location={location}>
                <Route
                  path="/owner/dashboard"
                  exact
                  component={OwnerDashboard}
                />
                <Route
                  path="/owner/venue/listing"
                  exact
                  component={OwnerVenueListing}
                />
                <Route
                  path="/owner/venue/detail/:id"
                  exact
                  component={OwnerVenueDetail}
                />
                <Route
                  path="/owner/venue/create"
                  component={OwnerVenueCreate}
                />
                <Route
                  path="/owner/billing/listing"
                  exact
                  component={OwnerBillingListing}
                />
                <Route
                  path="/owner/venue/billing/:id"
                  exact
                  component={OwnerBillingDetail}
                />
                <Route
                  path="/owner/venue/billing/invoice/:id"
                  exact
                  component={OwnerBillingDetailInvoice}
                />
                <Route
                  path="/owner/billing/detail/payment/:id"
                  exact
                  component={OwnerBillingDetailPayment}
                />
                <Route
                  path="/owner/billing/detail/payment-confirm"
                  exact
                  component={OwnerBillingDetailPaymentConfirm}
                />
                <Route path="/owner/profile" exact component={OwnerProfile} />
                <Route path="/owner" exact component={OwnerDashboard} />
                <Route component={Error404} />
              </AnimatedSwitch>
            </TransitionGroup>
          )}
        />
      </React.Fragment>
    );
  }
}

export default Owner;
