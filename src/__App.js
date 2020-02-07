import React, { Component } from "react";
import { withRouter, Route, Switch } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import TransitionGroup from "react-transition-group/TransitionGroup";
import AnimatedSwitch from "./components/Layout/AnimatedSwitch";

import config from "./config";

import http from "./services/httpService";

import { userUpdate } from "./redux/user/userAction";

import Auth from "./components/Auth";
import Manager from "./components/Manager";

class App extends Component {
  async componentDidMount() {
    const response = await http.get(config.apiEndPoint + "users");
    const user = response.data;
    this.props.handleUserUpdate(user);
  }

  render() {
    return (
      <React.Fragment>
        <Helmet htmlAttributes={{ lang: config.defaultLanguage }}>
          <title>{config.appName}</title>
        </Helmet>
        <Route
          render={({ location }) => (
            <TransitionGroup component="main">
              <AnimatedSwitch key={location.key} location={location}>
                <Route path="/manager" component={Manager} />
                <Route path="/" exact component={Auth} />
              </AnimatedSwitch>
            </TransitionGroup>
          )}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, props) => {
  return state;
};

const mapActionToProps = (dispatch, props) => {
  return bindActionCreators(
    {
      handleUserUpdate: userUpdate
    },
    dispatch
  );
};

export default withRouter(
  connect(
    mapStateToProps,
    mapActionToProps
  )(App)
);
