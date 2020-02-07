import React, { Component } from "react";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";

import config from "../../config";
import http from "../../services/httpService";
import DataTableCustomLink from "../Common/DataTableCustomLink";

class AdminMemberListing extends Component {
  state = {
    column: [
      {
        name: "N° de membre",
        key: "id",
        sortable: true,
        className: "text-blue"
      },
      {
        name: "Gérant",
        key: "name",
        sortable: true,
        className: "text-blue"
      },
      {
        name: "Etablissement",
        key: "etablissement",
        sortable: true,
        className: "text-black"
      },
      {
        name: "Type",
        key: "type",
        sortable: true,
        className: "text-black"
      },
      {
        name: "Statut",
        key: "status",
        sortable: false,
        className: "text-black"
      }
    ],
    data: null,
    searchParam: {
      keyword: "",
      type: "",
      status: "",
      limit: 20,
      page: 1
    }
  };

  async componentDidMount() {
    this.dataTableSearch();
  }

  handleSubmit = e => {
    e.preventDefault();
    const searchParam = this.state.searchParam;
    searchParam.keyword = this.refs.keyword.value;
    this.setState({ searchParam: searchParam });
    this.dataTableSearch();
  };

  handleChange = e => {
    const searchParam = this.state.searchParam;
    searchParam.keyword = this.refs.keyword.value;
    this.setState({ searchParam: searchParam });
    this.dataTableSearch();
  };

  handleFilterStatus = status => {
    const searchParam = this.state.searchParam;
    searchParam.status = status;
    this.setState({ searchParam: searchParam });
    this.dataTableSearch();
  };

  handleFilterType = type => {
    const searchParam = this.state.searchParam;
    searchParam.type = type;
    this.setState({ searchParam: searchParam });
    this.dataTableSearch();
  };

  cleanData = rawData => {
    if (rawData.length) {
      return rawData.map(function(item) {
        const data = {};
        data.id = item.ref_id;
        data.name = item.name;
        data.etablissement = item.etablissement;
        if (item.type === "owner") {
          data.link = "/admin/user/detail/" + item.ref_id;
          data.type = "Gérant";
        } else if (item.type === "student") {
          data.link = "/admin/user/detail/" + item.ref_id;
          data.type = "Etudiant";
        } else {
          data.link = "/admin/venue/detail/" + item.ref_id;
          data.type = "Etablissement";
        }
        if (item.status === "0")
          data.status = `<span class="btn btn-warning text-white">En Attente</span>`;
        else if (item.status === "1")
          data.status = `<span class="btn bg-success text-white">Actif</span>`;
        else if (item.status === "2")
          data.status = `<span class="btn bg-strong-purple text-white">Résilié</span>`;
        else
          data.status = `<span class="btn bg-danger text-white">Refusé</span>`;
        return data;
      });
    }
    return null;
  };

  dataTableSearch = async () => {
    const { data: result } = await http.post(
      config.apiEndPoint + "member/list",
      { param: this.state.searchParam }
    );
    this.setState({ data: this.cleanData(result) });
  };

  render() {
    const { searchParam } = this.state;

    return (
      <React.Fragment>
        <FormattedMessage id="admin">
          {title => (
            <Helmet>
              <title>
                {ChangeCase.titleCase(title)} | {config.appName}
              </title>
            </Helmet>
          )}
        </FormattedMessage>
        <section className="section-content container">
          <h2 className="head-title text-uppercase">liste des MEMBER GPRH</h2>
          <div className="box-listing">
            <div id="listing_">
              <div className="text-with-search d-flex justify-content-between align-items-center">
                <h3 className="text-title mb-0 text-uppercase">
                  <span className="text-uppercase">liste des MEMBER GPRH</span>{" "}
                  <i className="fa fa-angle-right" aria-hidden="true" />
                </h3>
                <a href={`${config.apiEndPoint}member/export`} className="btn bg-transparent color-link">
                  Export en CSV
                </a>
              </div>
              <div className="listing-filter mb-5">
                <div className="row">
                  <div className="col-md-9">
                    <div className="topsection">
                      <span
                        className="text-bold mr-3"
                        style={{ width: "60px", display: "inline-block" }}
                      >
                        Statut :
                      </span>
                      <button
                        type="button"
                        onClick={() => this.handleFilterStatus("")}
                        className={
                          "btn btn-status btn-purple btn-transaprent-border-purple-thin text-uppercase mr-2 " +
                          (searchParam.status === "" ? "active" : "")
                        }
                      >
                        Tous
                      </button>
                      <button
                        type="button"
                        onClick={() => this.handleFilterStatus("1")}
                        className={
                          "btn btn-status btn-pay border-success text-success mr-2 " +
                          (searchParam.status === "1" ? "active" : "")
                        }
                      >
                        Actif
                      </button>
                      <button
                        type="button"
                        onClick={() => this.handleFilterStatus("0")}
                        className={
                          "btn btn-status btn-review border-warning text-warning mr-2 " +
                          (searchParam.status === "0" ? "active" : "")
                        }
                      >
                        En Attente
                      </button>
                      <button
                        type="button"
                        onClick={() => this.handleFilterStatus("2")}
                        className={
                          "btn btn-status btn-terminated border-strong-purple text-strong-purple mr-2 " +
                          (searchParam.status === "2" ? "active" : "")
                        }
                      >
                        Résilié
                      </button>
                      <button
                        type="button"
                        onClick={() => this.handleFilterStatus("3")}
                        className={
                          "btn btn-status btn-late border-danger text-danger mr-2 " +
                          (searchParam.status === "3" ? "active" : "")
                        }
                      >
                        En Retard
                      </button>
                    </div>
                    <div className="bottomsection mt-2">
                      <span
                        className="text-bold mr-3"
                        style={{ width: "60px", display: "inline-block" }}
                      >
                        Type :
                      </span>
                      <button
                        type="button"
                        onClick={() => this.handleFilterType("")}
                        className={
                          "btn btn-purple btn-status btn-transaprent-border-purple-thin text-uppercase mr-2 " +
                          (searchParam.type === "" ? "active" : "")
                        }
                      >
                        tous
                      </button>
                      <button
                        type="button"
                        onClick={() => this.handleFilterType("owner")}
                        className={
                          "btn btn-purple btn-status btn-transaprent-border-purple-thin text-uppercase mr-2 " +
                          (searchParam.type === "owner" ? "active" : "")
                        }
                      >
                        gerant
                      </button>
                      <button
                        type="button"
                        onClick={() => this.handleFilterType("venue")}
                        className={
                          "btn btn-purple btn-status btn-transaprent-border-purple-thin text-uppercase mr-2 " +
                          (searchParam.type === "venue" ? "active" : "")
                        }
                      >
                        etablissement
                      </button>
                      <button
                        type="button"
                        onClick={() => this.handleFilterType("student")}
                        className={
                          "btn btn-purple btn-status btn-transaprent-border-purple-thin text-uppercase mr-2 " +
                          (searchParam.type === "student" ? "active" : "")
                        }
                      >
                        eleves
                      </button>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <form
                      className="my-form form-search-listing"
                      onSubmit={this.handleSubmit}
                    >
                      <div className="position-relative">
                        <input
                          type="text"
                          name="keyword"
                          ref="keyword"
                          className="form-control"
                          placeholder="Rechercher par nom"
                          onChange={this.handleChange}
                        />
                        <button type="submit" className="btn">
                          <i className="fa fa-search" aria-hidden="true" />
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <DataTableCustomLink
                column={this.state.column}
                data={this.state.data}
              />
              <div className="box-form-button my-form pt-5 text-center d-flex justify-content-end w-100 mw-100">
                <Link
                  to="/admin/dashboard"
                  className="btn btn-transaprent-border-purple text-uppercase mr-3 px-5"
                >
                  retour
                </Link>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default AdminMemberListing;
