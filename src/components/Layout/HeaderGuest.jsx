import React, { Component } from "react";
import { Link } from "react-router-dom";

import config from "../../config";

class HeaderGuest extends Component {
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
              <div className="header-menu" />
            </div>
            <div className="col-md-2">
              <div className="header-pic text-right">
                {/* <img src={require("../../assets/images/image.png")} alt="" /> */}
              </div>
            </div>
          </div>
        </header>
      </React.Fragment>
    );
  }
}

export default HeaderGuest;
