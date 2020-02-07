import React, { Component } from "react";
import { Route } from "react-router-dom";
import TransitionGroup from "react-transition-group/TransitionGroup";
import AnimatedSwitch from "../Layout/AnimatedSwitch";

import HeaderGuest from "../Layout/HeaderGuest";
import Login from "./Login";
import LoginAdmin from "./LoginAdmin";
import Logout from "./Logout";
import Register from "./Register";
import RegisterProfile2 from "./RegisterProfile2";
import RegisterStudentProfile2 from "./RegisterStudentProfile2";
import RegisterProfile3 from "./RegisterProfile3";
import RegisterStudentProfile3 from "./RegisterStudentProfile3";
import RegisterStudentProfile4 from "./RegisterStudentProfile4";
import RegisterStudentProfile5 from "./RegisterStudentProfile5";
import RegisterStudentConfirm from "./RegisterStudentConfirm";
import RegisterStudentCreateAddBillingAddress from "./RegisterStudentCreateAddBillingAddress";
import RegisterProfileCompleted from "./RegisterProfileCompleted";
import RegisterConfirm from "./RegisterConfirm";
import RegisterEmailConfirmation from "./RegisterEmailConfirmation";
import Error404 from "../Layout/Error404";

class Auth extends Component {
  render() {
    return (
      <React.Fragment>
        <HeaderGuest />
        <Route
          render={({ location }) => (
            <TransitionGroup component="main">
              <AnimatedSwitch key={location.key} location={location}>
                <Route
                  path="/auth/login/owner"
                  exact
                  render={() => <Login userRole="owner" />}
                />
                <Route
                  path="/auth/login/student"
                  exact
                  render={() => <Login userRole="student" />}
                />
                <Route
                  path="/auth/login/admin"
                  exact
                  render={() => <LoginAdmin userRole="admin" />}
                />
                <Route
                  path="/auth/login/superadmin"
                  exact
                  render={() => <LoginAdmin userRole="superadmin" />}
                />
                <Route
                  path="/auth/register/owner"
                  exact
                  render={() => (
                    <Register userRole="owner" backLink="/auth/login/owner" />
                  )}
                />
                <Route
                  path="/auth/register/student"
                  exact
                  render={() => (
                    <Register
                      userRole="student"
                      backLink="/auth/login/student"
                    />
                  )}
                />
                <Route
                  path="/auth/register/:role/confirm/:token"
                  exact
                  component={RegisterConfirm}
                />
                <Route
                  path="/auth/register/:role/confirmation/:token"
                  exact
                  component={RegisterEmailConfirmation}
                />
                <Route
                  path="/auth/user/profile/2"
                  exact
                  component={RegisterProfile2}
                />
                <Route
                  path="/auth/student/profile/2"
                  exact
                  component={RegisterStudentProfile2}
                />
                <Route
                  path="/auth/user/profile/3"
                  exact
                  component={RegisterProfile3}
                />
                <Route
                  path="/auth/student/profile/3"
                  exact
                  component={RegisterStudentProfile3}
                />
                <Route
                  path="/auth/student/profile/4"
                  exact
                  component={RegisterStudentProfile4}
                />
                <Route
                  path="/auth/student/profile/5"
                  exact
                  component={RegisterStudentProfile5}
                />
                <Route
                  path="/auth/student/profile/confirm"
                  exact
                  component={RegisterStudentConfirm}
                />
                <Route
                  path="/auth/student/create/billing-address/add"
                  exact
                  component={RegisterStudentCreateAddBillingAddress}
                />
                <Route
                  path="/auth/user/profile/complete"
                  exact
                  component={RegisterProfileCompleted}
                />
                <Route path="/auth/logout" exact component={Logout} />
                <Route component={Error404} />
              </AnimatedSwitch>
            </TransitionGroup>
          )}
        />
      </React.Fragment>
    );
  }
}

export default Auth;
