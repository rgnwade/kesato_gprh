import React, { Component } from "react";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";

import config from "../../config";
import http from "../../services/httpService";
import DataTableCustomLink from "../Common/DataTableCustomLink";

class AdminMemberOnHoldListing extends Component {
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
      status: "0",
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
          data.link = "/admin/user/detail/" + item.ref_id + "?list=member-on-hold";
          data.type = "Gérant";
        } else if (item.type === "student") {
          data.link = "/admin/user/detail/" + item.ref_id + "?list=member-on-hold";
          data.type = "Etudiant";
        } else {
          data.link = "/admin/venue/detail/" + item.ref_id + "?list=member-on-hold";
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
              </div>
              <div className="listing-filter mb-5">
                <div className="row">
                  <div className="col-md-9"> </div>
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

export default AdminMemberOnHoldListing;
