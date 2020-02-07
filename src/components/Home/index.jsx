import React, { Component } from "react";
import { Link } from "react-router-dom";

class Home extends Component {
  render() {
    return (
      <React.Fragment>
        <section className="frontpage position-relative">
          <div className="logo position-absolute">
            <a href="/" className="header-logo text-uppercase color-white">
              GPRH
            </a>
          </div>
          <div className="container pt-2 px-6">
            <div className="content-body">
              <h1 className="toptitle text-center">
                Bienvenue dans la maquette de <br /> votre futur site Internet
              </h1>
              <div className="row my-4">
                <div className="col-md-6">
                  <div className="btn btn-full-width bg-fff noradius cursor-default">
                    <small>Nom du site internet</small>
                    <span>Back office GPRH</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="btn btn-full-width bg-fff noradius cursor-default">
                    <small>Version</small>
                    <span>2.2</span>
                  </div>
                </div>
              </div>
            </div>
            <hr className="hr-full-width" />
            <div className="content-body">
              <div className="box-white text-center mt-6">
                <p className="title">A lire avant de débuter</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                  sit amet varius eros.
                </p>
                <p>
                  Nullam blandit ligula congue urna egestas, sed sagittis lectus
                  blandit consectetur tempor.
                </p>
                <p>
                  Suspendisse a placerat justo, tempor sollicitudin dui.
                  Curabitur placerat aliquet blandit.
                </p>
              </div>
              <p className="static-text text-center">
                Proin et leo ligula. Etiam bibendum dapibus consequat morbi
                massa nisl vestibulum quis eros sit amet :
              </p>
            </div>
            <hr className="hr-full-width w-3" />
            <div className="content-body pt-3">
              {/* <div className="d-flex justify-content-between flex-wrap">
                <Link to="/auth/login/owner" className="btn btn-with-content">
                  <small>Page</small>
                  <small>Créer un compte Gérant</small>
                </Link>
                <Link to="/auth/login/student" className="btn btn-with-content">
                  <small>Page</small>
                  <small>Créer un compte èléves</small>
                </Link>
                <Link to="/admin/dashboard" className="btn btn-with-content">
                  <small>Back Office ADMIN</small>
                </Link>
              </div>
              <div className="d-flex justify-content-between flex-wrap">
                <Link to="/owner/dashboard" className="btn btn-with-content">
                  <small>Page</small>
                  <small>Espace membre gérant</small>
                </Link>
                <Link to="/student/dashboard" className="btn btn-with-content">
                  <small>Page</small>
                  <small>Espace Elèves</small>
                </Link>
                <Link
                  to="/superadmin/dashboard"
                  className="btn btn-with-content"
                >
                  <small>Gestion Super Admin</small>
                </Link>
              </div> */}
              <div className="d-flex justify-content-between flex-wrap">
                <Link to="/owner/dashboard" className="btn btn-with-content">
                  <small>Page</small>
                  <small>Espace membre gérant</small>
                </Link>
                <Link to="/auth/login/student" className="btn btn-with-content">
                  <small>Page</small>
                  <small>Espace membre eléves</small>
                </Link>
                <Link to="/auth/login/admin" className="btn btn-with-content">
                  <small>Back Office ADMIN</small>
                </Link>
                <Link
                  to="/auth/login/superadmin"
                  className="btn btn-with-content"
                >
                  <small>Gestion Super Admin</small>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default Home;
