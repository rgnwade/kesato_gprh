import React, { Component } from "react";
import { Link } from "react-router-dom";

class DataTable extends Component {
  render() {
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
                            <Link
                              to={this.props.rowLink + row.id}
                              className={"listing-row " + column.className}
                            >
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: row[column.key]
                                }}
                              />
                            </Link>
                          </td>
                        );
                      })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default DataTable;
