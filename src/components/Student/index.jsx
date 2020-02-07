import React, { Component } from "react";
import { Redirect, Route } from "react-router-dom";
import TransitionGroup from "react-transition-group/TransitionGroup";
import AnimatedSwitch from "../Layout/AnimatedSwitch";

import HeaderOwner from "../Layout/HeaderStudent";
import StudentDashboard from "./StudentDashboard";
import StudentProfile from "./StudentProfile";
import StudentCourseAdd from "./StudentCourseAdd";
import Error404 from "../Layout/Error404";

import auth from "../../services/authService";
import StudentBillingDetailPayment from "../Student/StudentBillingDetailPayment";

class Student extends Component {
  render() {
    if (!auth.isAuthorizedUser("student"))
      return <Redirect to="/auth/login/student" />;

    return (
      <React.Fragment>
        <HeaderOwner />
        <Route
          render={({ location }) => (
            <TransitionGroup component="main">
              <AnimatedSwitch key={location.key} location={location}>
                <Route
                  path="/student/dashboard"
                  exact
                  component={StudentDashboard}
                />
                <Route path="/student/profile" exact component={StudentProfile} />
                <Route
                  path="/student/course/add"
                  exact
                  component={StudentCourseAdd}
                />
                <Route
                  path="/student/billing/detail/payment/:id"
                  exact
                  component={StudentBillingDetailPayment}
                />
                <Route path="/student" exact component={StudentDashboard} />
                <Route component={Error404} />
              </AnimatedSwitch>
            </TransitionGroup>
          )}
        />
      </React.Fragment>
    );
  }
}

export default Student;
