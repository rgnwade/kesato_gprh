import React, { Component } from "react";
import { Redirect, Route } from "react-router-dom";
import TransitionGroup from "react-transition-group/TransitionGroup";
import AnimatedSwitch from "../Layout/AnimatedSwitch";

import HeaderSuperAdmin from "../Layout/HeaderSuperAdmin";
import SuperAdminDashboard from "./SuperAdminDashboard";
import SuperAdminAdminListing from "./SuperAdminAdminListing";
import SuperAdminAdminDetail from "./SuperAdminAdminDetail";
import SuperAdminProductListing from "./SuperAdminProductListing";
import SuperAdminProductCreate from "./SuperAdminProductCreate";
import SuperAdminProductDetail from "./SuperAdminProductDetail";
import SuperAdminCourseListing from "./SuperAdminCourseListing";
import SuperAdminCourseCreate from "./SuperAdminCourseCreate";
import SuperAdminCourseDetail from "./SuperAdminCourseDetail";
import SuperAdminReminder from "./SuperAdminReminder";
import SuperAdminAutoRenew from "./SuperAdminAutoRenew";

import auth from "../../services/authService";

class SuperAdmin extends Component {
  render() {
    if (!auth.isAuthorizedUser("superadmin"))
      return <Redirect to="/auth/login/superadmin" />;

    return (
      <React.Fragment>
        <HeaderSuperAdmin />
        <Route
          render={({ location }) => (
            <TransitionGroup component="main">
              <AnimatedSwitch key={location.key} location={location}>
                <Route
                  path="/superadmin/dashboard"
                  exact
                  component={SuperAdminDashboard}
                />
                <Route
                  path="/superadmin/admin/listing"
                  exact
                  component={SuperAdminAdminListing}
                />
                <Route
                  path="/superadmin/admin/detail/:id"
                  exact
                  component={SuperAdminAdminDetail}
                />
                <Route
                  path="/superadmin/product/listing"
                  exact
                  component={SuperAdminProductListing}
                />
                <Route
                  path="/superadmin/product/create"
                  exact
                  component={SuperAdminProductCreate}
                />
                <Route
                  path="/superadmin/product/detail/:id"
                  exact
                  component={SuperAdminProductDetail}
                />
                <Route
                  path="/superadmin/course/listing"
                  exact
                  component={SuperAdminCourseListing}
                />
                <Route
                  path="/superadmin/course/create"
                  exact
                  component={SuperAdminCourseCreate}
                />
                <Route
                  path="/superadmin/course/detail/:id"
                  exact
                  component={SuperAdminCourseDetail}
                />
                <Route
                  path="/superadmin/reminder"
                  exact
                  component={SuperAdminReminder}
                />
                <Route
                  path="/superadmin/autorenew"
                  exact
                  component={SuperAdminAutoRenew}
                />
                <Route
                  path="/superadmin"
                  exact
                  component={SuperAdminDashboard}
                />
              </AnimatedSwitch>
            </TransitionGroup>
          )}
        />
      </React.Fragment>
    );
  }
}

export default SuperAdmin;
