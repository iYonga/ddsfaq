import React from "react";

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
