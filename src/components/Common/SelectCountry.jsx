import React, { Component } from "react";

import config from "../../config";
import http from "../../services/httpService";

class SelectCountry extends Component {
  state = {
    data: []
  };

  async componentDidMount() {
    const { data: result } = await http.get(
      config.apiEndPoint + "country/list"
    );
    this.setState({ data: result });
  }

  render() {
    const { data } = this.state;
    return (
      <select
        id={this.props.id}
        name={this.props.name}
        value={this.props.defaultValue}
        className="form-control"
        onChange={this.props.handleChange}
      >
        {data.map((item, index) => {
          return (
            <option key={index} value={item.country_code}>
              {item.country_name}
            </option>
          );
        })}
      </select>
    );
  }
}

export default SelectCountry;
