import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";

import config from "../../config";
import http from "../../services/httpService";
import auth from "../../services/authService";
import number from "../../helpers/number";

class StudentCourseAdd extends Component {
  state = {
    data: [],
    course: [],
    courseSelected: [],
    courseOptionPrice: 300,
    coursePackage: 1,
    coursePackageItems: 1,
    courseIncludeRevision: false,
    setting: [],
    notification: []
  };

  async componentDidMount() {
    const { data: setting } = await http.get(
      config.apiEndPoint + "setting/list"
    );
    const user = auth.getAuthUser();
    const { data: result } = await http.get(
      config.apiEndPoint + "course/list/"
    );
    this.setState({ data: user, course: result, setting: setting });
  }

  doSubmit = async () => {
    try {
      const user = auth.getAuthUser();
      const cleanData = this.cleanData();
      const option = {
        id: this.state.coursePackage,
        price: this.state.courseOptionPrice,
      };

      const { data: result } = await http.post(
        `${config.apiEndPoint}course/checkout`,
        { user: user, data: cleanData, option: option }
      );

      if (result) {
        localStorage.removeItem('studentData');

        this.props.history.push(`/student/billing/detail/payment/${result}`);
      } else {
        this.showError('Invalid data!');
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        this.showError(ex.response.data);
      }
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.state.courseSelected.length < this.state.coursePackageItems) {
      this.showError("Veuillez choisir " + this.state.coursePackageItems + " thème" + (this.state.coursePackageItems > 1 ? "s" : ""));
    } else {
      this.doSubmit();
    }
  };

  handleChange = e => {
    const data = { ...this.state.data };
    data[e.currentTarget.name] = e.currentTarget.value;
    this.setState({ data: data });
  };

  handleCourseOptionChange = e => {
    this.setState({ courseOptionPrice: parseInt(e.currentTarget.value) });
  };

  hadleCourseSelect = e => {
    if (e.currentTarget.checked) {
      this.setCourseOption(e.currentTarget.value);
    } else {
      this.unsetCourseOption(e.currentTarget.value);
    }
  };

  setCourseOptions = (ids = null, state = true) => {
    const { course } = this.state;
    let courseSelected = [];

    course.map(item => {
      courseSelected.push(item);
    });

    if (state) {
      this.setState({ courseSelected: courseSelected });
    }

    return ! state ? courseSelected : null;
  };

  setCourseOption = (id, state = true) => {
    const { course, coursePackageItems, courseSelected } = this.state;
    let courseData = {};

    course.map(item => {
      if (item.id === parseInt(id)) {
        courseData = item;
      }
    });

    if (courseSelected.length < coursePackageItems) {
      courseSelected.push(courseData);

      if (state) {
        this.setState({ courseSelected: courseSelected });
      }
    }

    return ! state ? courseSelected : null;
  };

  unsetCourseOption = id => {
    const { courseSelected } = this.state;
    let indexRemove = 0;

    courseSelected.map((item, index) => {
      if(item.id === parseInt(id)) {
        indexRemove = index;
      }
    });

    courseSelected.splice(indexRemove, 1);

    this.setState({ courseSelected: courseSelected });
  };
  
  handleCoursePackage(coursePackage, coursePackageItems, courseOptionPrice, courseIncludeRevision) {
    const state = this.state;
    state.coursePackage = coursePackage;
    state.coursePackageItems = coursePackageItems;
    state.courseIncludeRevision = courseIncludeRevision;
    state.courseOptionPrice = courseOptionPrice;
    state.courseSelected = coursePackageItems < 4 ? [] : this.setCourseOptions(null, false);
    state.notification.message = false;

    this.setState(state);
  }

  showError(message) {
    const notification = { ...this.state.notification };
    notification.message = message;
    this.setState({ notification });
  }

  cleanData() {
    var cleanData = [];

    const {courseSelected} = this.state;
    courseSelected.map(item => {
      cleanData.push(item);
    });

    return cleanData;
  }

  render() {
    const user = auth.getAuthUser();
    if (!user) return <Redirect to="/not-found" />;
    const { data, course, courseSelected, courseOptionPrice } = this.state;

    var cartSubTotal = courseOptionPrice;
    var cartTax = 0.1 * cartSubTotal;
    var cartTotal = cartSubTotal + cartTax;

    var selectedCourse = [];
    if(courseSelected.length > 0){
      courseSelected.map((item, index) => {
        selectedCourse.push(item.id);
      })
    }

    return (
      <React.Fragment>
        <FormattedMessage id="student">
          {title => (
            <Helmet>
              <title>
                {ChangeCase.titleCase(title)} | {config.appName}
              </title>
            </Helmet>
          )}
        </FormattedMessage>
        <section className="section-content container">
          <div className="row m-0">
            <div className="col-md-6 offset-md-3 p-0">
              <div className="box-form with-shadow">
                <div className="bg-white box-pdd box-border">
                  <h2 className="form-title text-center">
                    Ajout d'une formation
                  </h2>
                  <form
                    className="my-form box-form-pdd"
                    onSubmit={this.handleSubmit}
                  >
                    <div className="form-group">
                      <div className="row">
                        <div className="col-md-12">
                          <label className="text-bold text-uppercase">Nos Formations</label>
                          <small className="mt-0">Nous vous proposons plusieurs types de formation. <br />Par théme, par forfait ou en option.</small>
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-md-12">
                          {course &&
                            course.length > 0 &&
                            course.map((item, index) => {
                              return (
                                <small key={index} className="mt-0">{item.name}</small>
                              );
                            })
                          }
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="row">
                        <div className="col-md-12">
                          <label className="text-bold text-uppercase">1. Je Choisi Mon Type De Formation</label>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <button type="button" onClick={() => this.handleCoursePackage(1, 1, 300, false)} className={"btn btn-secondary btn-course-package " + (this.state.coursePackage === 1 ? "active" : "")}>1 Theme<br />{this.state.setting.commerce_base_currency} 300,-</button>
                        </div>
                        <div className="col-md-6 mb-3">
                          <button type="button" onClick={() => this.handleCoursePackage(2, 2, 600, false)} className={"btn btn-secondary btn-course-package " + (this.state.coursePackage === 2 ? "active" : "")}>2 Themes<br />{this.state.setting.commerce_base_currency} 600,-</button>
                        </div>
                        <div className="col-md-6 mb-3">
                          <button type="button" onClick={() => this.handleCoursePackage(3, 4, 750, false)} className={"btn btn-secondary btn-course-package " + (this.state.coursePackage === 3 ? "active" : "")}>Forfait<br />4 Themes<br />{this.state.setting.commerce_base_currency} 750,-</button>
                        </div>
                        <div className="col-md-6 mb-3">
                          <button type="button" onClick={() => this.handleCoursePackage(4, 4, 1800, true)} className={"btn btn-secondary btn-course-package " + (this.state.coursePackage === 4 ? "active" : "")}>Forfait<br />4 Theme + Revision<br />{this.state.setting.commerce_base_currency} 1800,-</button>
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="row">
                        <div className="col-md-12">
                          <label className="text-bold text-uppercase">2. Je Choisi Mon Theme</label>
                        </div>
                      </div>
                      <table className="table table-no-border table-td-grey">
                        <tbody>
                          {course &&
                          course.length > 0 &&
                          course.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td colSpan="2">
                                  <div className="d-flex">  
                                    <div className="checkbox-custom multi-line" style={{width: "calc(100% - 10px)"}}>
                                      <input 
                                        type="checkbox" 
                                        value={item.id} 
                                        onChange={this.hadleCourseSelect}
                                        checked={(selectedCourse.indexOf(item.id) > -1) ? true : false}
                                      />
                                      <label className="course-label d-flex"><div>{item.name}</div></label>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center radius20">
                                      <i className="fa fa-info" aria-hidden="true"></i>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}

                          <tr>
                              <td colSpan="2"><hr className="hr-full-width border-w-1" /></td>
                          </tr>
                          
                          <tr className="hide">
                              <td>
                                  <div className="form-promotion">
                                      <div className="position-relative">
                                          <input type="text" className="form-control" placeholder="Insérez votre code promo ici" />
                                          <button type="submit" className="btn bg-transparent">Appliquer</button>
                                      </div>
                                  </div>
                              </td>
                              <td className="fnt-80 pl-2">
                                  <small className="d-block mt-0">Besoin d'aide?</small>
                                  <small className="mt-0">+41 22 300 00 01</small>
                              </td>
                          </tr>
                          <tr className="hide">
                              <td colSpan="2"><hr className="hr-full-width border-w-1" /></td>
                          </tr>
                          
                          <tr>
                              <td className="text-right pb-0 w-50">
                                  <small className="text-bold w-90 fnt-80 mt-0">Sous-total</small>
                              </td>
                              <td className="text-right pb-0">
                                  <small className="text-bold fnt-80 mt-0">{number.formatedPrice(cartSubTotal, this.state.setting.commerce_base_currency, config.locale.code)}</small>
                              </td>
                          </tr>
                          <tr>
                            <td className="text-right py-0 w-50">
                              <small className="text-bold w-90 fnt-80 mt-0">TVA</small>
                            </td>
                            <td className="text-right py-0">
                              <small className="text-bold fnt-80 mt-0">{number.formatedPrice(cartTax, this.state.setting.commerce_base_currency, config.locale.code)}</small>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-right w-50">
                              <small className="text-bold w-90 text-uppercase">total ttc</small>
                            </td>
                            <td className="text-right">
                              <small className="text-bold text-uppercase">{number.formatedPrice(cartTotal, this.state.setting.commerce_base_currency, config.locale.code)}</small>
                            </td>
                          </tr>
                          
                          <tr>
                            <td colSpan="2">
                              <div className="checkbox-custom mt-3">
                                <input type="checkbox" id="accepte" defaultChecked={true} />
                                <label htmlFor="accepte">J'ai lu et j'accepte les conditions générales du GPRH</label>
                              </div>
                            </td>
                          </tr>
                        
                        </tbody>
                      </table>
                    </div>
                    {this.state.notification.message && (
                      <div className="alert alert-warning">
                        {this.state.notification.message}
                      </div>
                    )}
                    <div className="box-form-button pt-3 mx-auto text-center d-flex">
                      <Link
                        to="/student/dashboard"
                        className="btn btn-transaprent-border-purple text-uppercase w-50 mr-2"
                      >
                        retour
                      </Link>
                      <button
                        type="submit"
                        onClick={this.props.handleStep}
                        className="btn btn-purple text-uppercase w-50"
                      >
                        suvant
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
        </div>
      </section>
      </React.Fragment>
    );
  }
}

export default StudentCourseAdd;
