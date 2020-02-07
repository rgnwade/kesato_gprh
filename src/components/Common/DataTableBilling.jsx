import React, { Component } from "react";
import { Link } from "react-router-dom";

import auth from "../../services/authService";

class DataTableBilling extends Component {
  render() {
    const user = auth.getAuthUser();

    return (
      <div className="listing-table">
        <table className="table">
          <thead>
            <tr className="listing-head">
              {this.props.column.map(item => {
                return (
                  <th key={item.key}>
                    <span>
                      {item.name}{" "}
                      {item.sortable && (
                        <i className="fa fa-angle-down" aria-hidden="true" />
                      )}
                    </span>
                  </th>
                );
              })}
              <th key="action">
                <span> </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.props.data &&
              this.props.data.map(row => {
                return (
                  <tr key={row.id}>
                    {this.props.data &&
                      this.props.column.map(column => {
                        return (
                          <td key={row.id + column.key}>
                            <div
                              className={
                                "listing-row cursor-default " + column.className
                              }
                            >
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: row[column.key]
                                }}
                              />
                            </div>
                          </td>
                        );
                      })}
                    <td>
                      <div className="listing-row table-button-action">
                        {user.role.role === "owner" && (
                          <React.Fragment>
                            <Link
                              to={
                                `/${user.role.role}/venue/billing/invoice/${row.id}`
                              }
                              className="btn btn-icon bg-transparent w-100 border-r color-black"
                            >
                              <i
                                className="fa fa-eye invoice"
                                aria-hidden="true"
                              />
                            </Link>
                            <Link
                              to={
                                row.status_value  !== 'completed' ?
                                  `/${user.role.role}/billing/detail/payment/${row.id}` :
                                  `/${user.role.role}/venue/billing/invoice/${row.id}`
                              }
                              className="btn btn-icon bg-transparent w-100 disable"
                              disable=""
                            >
                              <i
                                className="fa fa-database payment"
                                aria-hidden="true"
                              />
                            </Link>
                          </React.Fragment>
                        )}
                        {(user.role.role === "admin" ||
                          user.role.role === "superadmin") && (
                          <React.Fragment>
                            <Link
                              to={
                                "/" + user.role.role + "/billing/cart/" + row.id
                              }
                              className="btn btn-icon bg-transparent w-100 color-black"
                            >
                              <i
                                className="fa fa-eye invoice"
                                aria-hidden="true"
                              />
                            </Link>
                            <button
                              onClick={() => this.props.handlePayment(row.id)}
                              className="btn btn-icon bg-transparent w-100 disable"
                              disable=""
                            >
                              <i
                                className={
                                  "fa fa-database payment " +
                                  (row.status_value === "completed"
                                    ? "active"
                                    : "")
                                }
                                aria-hidden="true"
                              />
                            </button>
                          </React.Fragment>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default DataTableBilling;
