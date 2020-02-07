import React, { Component } from "react";
import { withRouter, Route, Switch } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";

import config from "./config";

// import http from "./services/httpService";

import { userUpdate } from "./redux/user/action";

import Auth from "./components/Auth";
import Home from "./components/Home";
import Owner from "./components/Owner";
import Student from "./components/Student";
import Admin from "./components/Admin";
import SuperAdmin from "./components/SuperAdmin";
import Error404 from "./components/Layout/Error404";

class App extends Component {
  // async componentDidMount() {
  //   const response = await http.get(config.apiEndPoint2 + "users");
  //   const user = response.data;
  //   this.props.handleUserUpdate(user);
  // }

  render() {
    return (
      <React.Fragment>
        <Helmet htmlAttributes={{ lang: config.defaultLanguage }}>
          <title>{config.appName}</title>
        </Helmet>
        <Switch>
          <Route path="/auth" component={Auth} />
          <Route path="/owner" component={Owner} />
          <Route path="/student" component={Student} />
          <Route path="/admin" component={Admin} />
          <Route path="/superadmin" component={SuperAdmin} />
          <Route path="/" exact component={Home} />
          <Route component={Error404} />
        </Switch>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, props) => {
  return state;
};

const mapDistpatchToProps = (dispatch, props) => {
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
    mapDistpatchToProps
  )(App)
);
