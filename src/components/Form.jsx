import React from "react";

function Form(props) {
  const { children, ...other } = props;
  return (
    <>
      <form {...other}>{children}</form>
    </>
  );
}

export default Form;
