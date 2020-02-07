import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";
import _ from "lodash";

import config from "../../config";
import http from "../../services/httpService";
import auth from "../../services/authService";
import number from "../../helpers/number";

class StudentCourseAdd extends Component {
  state = {
    data: [],
    course: [],
    courseSelected: [],
    courseOptionPrice: 750,
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
      const { data: result } = await http.post(
        config.apiEndPoint + "course/register",
        { user: user, data: cleanData }
      );
      if (result) {
        localStorage.removeItem("studentData");
        this.props.history.push("/auth/student/profile/confirm");
      } else {
        this.showError("Invalid data!");
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400)
        this.showError(ex.response.data);
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.state.courseSelected.length < 1) {
      this.showError('Thème requis!');
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
  }

  hadleCourseSelect = e => {
    const { course, courseSelected } = this.state;
    if (e.currentTarget.checked) {
      var courseData = {};
      course.map(item => {
        if(item.id === parseInt(e.currentTarget.value)) courseData = item;
      });
      courseSelected.push(courseData);
    }
    else{
      var indexRemove = 0;
      courseSelected.map((item, index) => {
        if(item.id === parseInt(e.currentTarget.value)) indexRemove = index;
      });
      courseSelected.splice(indexRemove, 1);
    }
    this.setState({ courseSelected: courseSelected });
  };

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
    })
    return cleanData;
  }

  render() {
    const user = auth.getAuthUser();
    if (!user) return <Redirect to="/not-found" />;
    const { data, course, courseSelected, courseOptionPrice } = this.state;

    var cartSubTotal = courseOptionPrice;
    var cartTax = 0;
    var cartTotal = 0;
    if (courseSelected.length > 0) {
      courseSelected.map((item) => {
        cartSubTotal += item.price;
      });
    }
    cartTax = 0.1 * cartSubTotal;
    cartTotal = cartSubTotal + cartTax;

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
                    Ajout d'une fromation
                  </h2>
                  <form
                    className="my-form box-form-pdd"
                    onSubmit={this.handleSubmit}
                  >
                    {this.state.notification.message && (
                      <div className="alert alert-warning">
                        {this.state.notification.message}
                      </div>
                    )}
                    <div className="form-group">
                      <div className="row">
                        <div className="col-md-10 offset-md-1">
                          <label className="text-bold">Choix des options de formation</label>
                          <small className="mt-0">Nous vous proposons plusieurs types de formation. <br />Par théme, par forfait ou en option.</small>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <table className="table table-no-border table-td-grey">
                        <thead>
                          <tr>
                            <th scope="col" className="w-75"><span className="text-bold">Thèmes</span></th>
                            <th scope="col"><span className="text-bold">Prix</span></th>
                          </tr>
                        </thead>
                          <tbody>
                            {course &&
                            course.length > 0 &&
                            course.map((item, index) => {
                              return (
                                <tr>
                                  <td className="d-flex">
                                    <div className="checkbox-custom multi-line w-195">
                                      <input 
                                        type="checkbox" 
                                        value={item.id} 
                                        onChange={this.hadleCourseSelect}
                                      />
                                      <label className="course-label"><span>{item.name}</span></label>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center radius20">
                                      <i className="fa fa-info" aria-hidden="true"></i>
                                    </div>
                                  </td>
                                  <td>
                                    <span className="color-black">{
                                        number.formatedPrice(item.price, this.state.setting.commerce_base_currency, config.locale.code)
                                      }
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}

                            <tr>
                              <th scope="col" className="w-75"><span className="text-bold">Options</span></th>
                              <th scope="col"><span className="text-bold">Prix</span></th>
                            </tr>

                            <tr>
                              <td className="d-flex">
                                <div className="radio-custom multi-line w-195">
                                  <input 
                                    type="radio" 
                                    name="course-option" 
                                    value="750"
                                    onChange={this.handleCourseOptionChange} 
                                    checked={this.state.courseOptionPrice === 750 && true} 
                                  />
                                  <label className="course-label"><span>Option - Comptabilité + révision</span></label>
                                </div>
                                <div className="d-flex align-items-center justify-content-center radius20">
                                  <i className="fa fa-info" aria-hidden="true"></i>
                                </div>
                              </td>
                              <td>
                                <span className="color-black">{
                                    number.formatedPrice(750, this.state.setting.commerce_base_currency, config.locale.code)
                                  }
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="d-flex">
                                <div className="radio-custom multi-line w-195">
                                  <input 
                                    type="radio" 
                                    name="course-option" 
                                    value="450"
                                    onChange={this.handleCourseOptionChange} 
                                    checked={this.state.courseOptionPrice === 450 && true} 
                                  />
                                  <label className="course-label"><span>Option - Salaire + révision</span></label>
                                </div>
                                <div className="d-flex align-items-center justify-content-center radius20">
                                  <i className="fa fa-info" aria-hidden="true"></i>
                                </div>
                              </td>
                              <td>
                                <span className="color-black">{
                                    number.formatedPrice(450, this.state.setting.commerce_base_currency, config.locale.code)
                                  }
                                </span>
                              </td>
                            </tr>
                            <tr>
                                <td colspan="2"><hr className="hr-full-width border-w-1" /></td>
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
                                <td colspan="2"><hr className="hr-full-width border-w-1" /></td>
                            </tr>
                            
                            <tr>
                                <td className="text-right pb-0">
                                    <small className="text-bold w-90 fnt-80 mt-0">Sous-total</small>
                                </td>
                                <td className="text-right pb-0">
                                    <small className="text-bold fnt-80 mt-0">{number.formatedPrice(cartSubTotal, this.state.setting.commerce_base_currency, config.locale.code)}</small>
                                </td>
                            </tr>
                            <tr>
                              <td className="text-right py-0">
                                <small className="text-bold w-90 fnt-80 mt-0">TVA</small>
                              </td>
                              <td className="text-right py-0">
                                <small className="text-bold fnt-80 mt-0">{number.formatedPrice(cartTax, this.state.setting.commerce_base_currency, config.locale.code)}</small>
                              </td>
                            </tr>
                            <tr>
                              <td className="text-right">
                                <small className="text-bold w-90 text-uppercase">total ttc</small>
                              </td>
                              <td className="text-right">
                                <small className="text-bold text-uppercase">{number.formatedPrice(cartTotal, this.state.setting.commerce_base_currency, config.locale.code)}</small>
                              </td>
                            </tr>
                            
                            <tr>
                              <td colspan="2">
                                <div className="checkbox-custom mt-3">
                                  <input type="checkbox" id="accepte" checked={true} />
                                  <label for="accepte">J'ai lu et j'accepte les conditions générales du GPRH</label>
                                </div>
                              </td>
                            </tr>
                          
                          </tbody>
                      </table>
                    </div>
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
