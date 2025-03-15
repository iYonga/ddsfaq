import React from "react";
// this is a custom button wrapper thingy i've written. its a reusable component.
const Button = ({ label, trigger = () => {} }) => {
  return (
    <button
      onClick={() => {
        trigger();
      }}
      style={{
        padding: "0.5rem 1rem",
        fontSize: "1rem",
        borderRadius: "0.5rem",
        border: "#FFCC00 2px solid",
        background: "#111",
        cursor: "pointer",
      }}
      id="button"
    >
      {label}
    </button>
  );
};

export default Button;
