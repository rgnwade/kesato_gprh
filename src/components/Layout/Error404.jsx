import React, { Component } from "react";

class Error404 extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="box-error404 d-flex flex-column align-items-center justify-content-center">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>oops, sorry we can't find that page!</p>
          <p>something went wrong or the page doesn't exist anymore.</p>
          <a href="/" className="text-uppercase">
            Go to homepage
          </a>
        </div>
      </React.Fragment>
    );
  }
}

export default Error404;
