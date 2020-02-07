import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./Input";

class Form extends Component {
  state = {
    data: {},
    errors: {}
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  validateProperty = ({ name, value }) => {
    console.log("validate Property");
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleSubmit = e => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    console.log("handle change");
    const errors = { ...this.state.errors };
    // const errorMessage = this.validateProperty(input);
    const errorMessage = "";
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data, errors });
  };

  renderButton(label, className = "btn btn-primary") {
    return (
      <button disabled={this.validate()} className={className}>
        {label}
      </button>
    );
  }

  // renderSelect(name, label, options) {
  //   const { data, errors } = this.state;

  //   return (
  //     <Select
  //       name={name}
  //       value={data[name]}
  //       label={label}
  //       options={options}
  //       onChange={this.handleChange}
  //       error={errors[name]}
  //     />
  //   );
  // }

  renderInput(
    id,
    name,
    placeholder,
    type = "text",
    className = "form-control",
    errorClassName = "alert alert-danger"
  ) {
    const { data, errors } = this.state;

    return (
      <Input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        className={className}
        errorClassName={errorClassName}
        value={data[name]}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }
}

export default Form;
