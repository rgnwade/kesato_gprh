import React, { Component } from "react";

class Footer extends Component {
  render() {
    return (
      <React.Fragment>
        <footer className="footer">
          <div className="container">
            <div className="row">
              <div className="col-md-1">
                <div className="footer-logo text-uppercase">gprh</div>
              </div>
              <div className="col-md-5">
                <div className="footer-menu d-flex">
                  <ul>
                    <li>
                      <a href="/">Home</a>
                    </li>
                    <li>
                      <a href="/">Discovery</a>
                    </li>
                    <li>
                      <a href="/">Photo</a>
                    </li>
                    <li>
                      <a href="/">Contact</a>
                    </li>
                  </ul>
                  <ul>
                    <li>
                      <a href="/">About</a>
                    </li>
                    <li>
                      <a href="/">Help</a>
                    </li>
                    <li>
                      <a href="/">Terms</a>
                    </li>
                    <li>
                      <a href="/">Guidelines</a>
                    </li>
                  </ul>
                  <ul>
                    <li>
                      <a href="/">Testimonials</a>
                    </li>
                    <li>
                      <a href="/">Advertise</a>
                    </li>
                    <li>
                      <a href="/">Integrations</a>
                    </li>
                    <li>
                      <a href="/">Careers</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-3 pr-0">
                <div className="footer-newsletter">
                  <form action="" className="position-relative">
                    <input type="email" className="form-control" />
                    <button type="submit" className="btn icon-input">
                      <i className="fa fa-paper-plane" aria-hidden="true" />
                    </button>
                  </form>
                  <p>Stay in touch with us for the freshest products!</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="footer-menu footer-socmed">
                  <ul>
                    <li>
                      <a href="/">
                        <i className="fa fa-instagram" aria-hidden="true" />
                      </a>
                    </li>
                    <li>
                      <a href="/">
                        <i className="fa fa-twitter" aria-hidden="true" />
                      </a>
                    </li>
                    <li>
                      <a href="/">
                        <i className="fa fa-facebook" aria-hidden="true" />
                      </a>
                    </li>
                    <li>
                      <a href="/">
                        <i className="fa fa-globe" aria-hidden="true" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </React.Fragment>
    );
  }
}

export default Footer;
