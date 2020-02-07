import React from "react";

const Input = ({
  id,
  name,
  placeholder,
  className,
  errorClassName,
  error,
  ...rest
}) => {
  return (
    <React.Fragment>
      <input
        id={id}
        name={name}
        placeholder={placeholder}
        className={className}
        {...rest}
      />
      {error && <div className={errorClassName}>{error}</div>}
    </React.Fragment>
  );
};

export default Input;
