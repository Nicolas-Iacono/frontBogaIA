import React from "react";
import PropTypes from "prop-types";

const Form = ({ onSubmit, children, className = "" }) => {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault(); // Evita el comportamiento por defecto del form
        onSubmit(event);
      }}
      className={className}
    >
      {children}
    </form>
  );
};

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Form;
