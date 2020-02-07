import React, { Component } from "react";
import ReactDatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import en from "date-fns/locale/en-US";
import fr from "date-fns/locale/fr";

import "react-datepicker/dist/react-datepicker.css";

class DatePicker extends Component {
  render() {
    const locale = { en: en, fr: fr };
    if (this.props.locale !== "undefined" && this.props.locale !== "") registerLocale('locale', locale[this.props.locale]);
    else registerLocale('locale', locale['en']);
    setDefaultLocale('locale');
    return (
      <div className="row">
        <div className="col-md-3">
          <ReactDatePicker
            name={this.props.inputNameDay || "day"}
            placeholder={this.props.inputPlaceholderDay || "Day"}
            className="form-control text-center input-datepicker"
            selected={this.props.selectedDate || new Date()}
            onChange={this.props.onChange}
            minDate={this.props.minDate || null}
            dateFormat={this.props.dateFormatDay || "dd"}
            withPortal
            fixedHeight
            showMonthDropdown
            showYearDropdown
            readOnly={this.props.readOnly || false}
          />
        </div>
        <div className="col-md-5">
          <ReactDatePicker
            name={this.props.inputNameMonth || "month"}
            placeholder={this.props.inputPlaceholderMonth || "Month"}
            className="form-control text-center input-datepicker"
            selected={this.props.selectedDate || new Date()}
            onChange={this.props.onChange}
            minDate={this.props.minDate || null}
            dateFormat={this.props.dateFormatMonth || "MMMM"}
            withPortal
            fixedHeight
            showMonthDropdown
            showYearDropdown
            readOnly={this.props.readOnly || false}
          />
        </div>
        <div className="col-md-4">
          <ReactDatePicker
            name={this.props.inputNameYear || "year"}
            placeholder={this.props.inputPlaceholderYear || "Year"}
            className="form-control text-center input-datepicker"
            selected={this.props.selectedDate || new Date()}
            onChange={this.props.onChange}
            minDate={this.props.minDate || null}
            dateFormat={this.props.dateFormatYear || "yyyy"}
            withPortal
            fixedHeight
            showMonthDropdown
            showYearDropdown
            readOnly={this.props.readOnly || false}
          />
        </div>
      </div>
    );
  }
}

export default DatePicker;
