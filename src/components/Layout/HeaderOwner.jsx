import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";

import config from "../../config";
import auth from "../../services/authService";

class HeaderOwner extends Component {
  state = {
    user: null
  };

  componentDidMount() {
    const user = auth.getAuthUser();
    this.setState({ user: user });
  }

  render() {
    return (
      <React.Fragment>
        <header className="header">
          <div className="row align-items-center">
            <div className="col-md-2">
              <Link to="/" className="header-logo text-uppercase">
                {config.appName}
              </Link>
            </div>
            <div className="col-md-8">
              <div className="header-menu">
                <ul className="d-flex justify-content-center">
                  <li>
                    <Link to="/owner/dashboard">tableau de bord</Link>
                  </li>
                  <li>
                    <Link to="/owner/venue/listing">
                      gérer mes établissements
                    </Link>
                  </li>
                  <li>
                    <Link to="/owner/billing/listing">gérer mes factures</Link>
                  </li>
                  <li>
                    <Link to="/">contact</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-2">
              <div
                id="header_pic"
                className="header-pic text-right position-relative"
              >
                <button
                  type="button"
                  id="btn_head_pic"
                  className="btn btn-head-pic"
                >
                  <img src={require("../../assets/images/avatar-default.jpg")} alt="" />
                  <div
                    id="popup_account"
                    className="popup-detail-account text-left"
                  >
                    <div className="row mx-min5">
                      <div className="col-md-4 pd-x-5">
                        <div className="round-img">
                          <img
                            src={require("../../assets/images/avatar-default.jpg")}
                            alt=""
                          />
                        </div>
                      </div>
                      <div className="col-md-8 pd-x-5">
                        <div className="des-info">
                          <h3 className="name">
                            {this.state.user &&
                              this.state.user.first_name +
                                " " +
                                this.state.user.last_name}
                          </h3>
                          <p className="text-bold">Gérant</p>
                          <p>
                            N<sup>o</sup> de membre{" "}
                            {this.state.user && this.state.user.id}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="action-button">
                      <Link to="/owner/profile" className="profile-link">
                        Modifier mon profil
                      </Link>
                      <Link to="/auth/logout" className="profile-link">
                        Se déconnecter
                      </Link>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return state;
};

export default withRouter(connect(mapStateToProps)(HeaderOwner));
