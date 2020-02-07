import React, { Component } from "react";
import { Redirect, Route } from "react-router-dom";
import TransitionGroup from "react-transition-group/TransitionGroup";
import AnimatedSwitch from "../Layout/AnimatedSwitch";

import HeaderAdmin from "../Layout/HeaderAdmin";
import AdminDashboard from "./AdminDashboard";
import AdminMemberListing from "./AdminMemberListing";
import AdminMemberOnHoldListing from "./AdminMemberOnHoldListing";
import AdminBillingListing from "./AdminBillingListing";
import AdminBillingCart from "./AdminBillingCart";
import OwnerBillingDetailInvoice from "../Owner/OwnerBillingDetailInvoice";
import Register from "../Auth/Register";
import RegisterProfile2 from "../Auth/RegisterProfile2";
import RegisterProfile3 from "../Auth/RegisterProfile3";
import OwnerProfile from "../Owner/OwnerProfile";
import OwnerVenueDetail from "../Owner/OwnerVenueDetail";
import Error404 from "../Layout/Error404";

import auth from "../../services/authService";

class Admin extends Component {
  render() {
    if (!auth.isAuthorizedUser("admin"))
      return <Redirect to="/auth/login/admin" />;

    return (
      <React.Fragment>
        <HeaderAdmin />
        <Route
          render={({ location }) => (
            <TransitionGroup component="main">
              <AnimatedSwitch key={location.key} location={location}>
                <Route
                  path="/admin/dashboard"
                  exact
                  component={AdminDashboard}
                />
                <Route
                  path="/admin/owner/create"
                  exact
                  render={props => (
                    <Register
                      {...props}
                      userRole="owner"
                      backLink="/admin/dashboard"
                    />
                  )}
                />
                <Route
                  path="/admin/owner/profile/2"
                  exact
                  render={props => (
                    <RegisterProfile2
                      {...props}
                      userRole="owner"
                      backLink="/admin/dashboard"
                    />
                  )}
                />
                <Route
                  path="/admin/owner/profile/3"
                  exact
                  render={props => (
                    <RegisterProfile3
                      {...props}
                      userRole="owner"
                      backLink="/admin/dashboard"
                    />
                  )}
                />
                <Route
                  path="/admin/member-on-hold/listing"
                  exact
                  component={AdminMemberOnHoldListing}
                />
                <Route
                  path="/admin/member/listing"
                  exact
                  component={AdminMemberListing}
                />
                <Route
                  path="/admin/venue/detail/:id"
                  exact
                  component={OwnerVenueDetail}
                />
                <Route
                  path="/admin/user/detail/:id"
                  exact
                  component={OwnerProfile}
                />
                <Route
                  path="/admin/billing/listing"
                  exact
                  component={AdminBillingListing}
                />
                <Route
                  path="/admin/billing/cart/:id"
                  exact
                  component={AdminBillingCart}
                />
                <Route
                  path="/admin/billing/invoice/:id"
                  exact
                  component={OwnerBillingDetailInvoice}
                />
                <Route path="/admin" exact component={AdminDashboard} />
                <Route component={Error404} />
              </AnimatedSwitch>
            </TransitionGroup>
          )}
        />
      </React.Fragment>
    );
  }
}

export default Admin;
