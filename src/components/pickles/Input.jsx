import React from "react";
import { Input as InputA } from "antd";
// this is a custom button wrapper thingy i've written. its a reusable component.
const Input = ({ style, placeholder = "", value, setValue }) => {
  return (
    <InputA
      onChange={e => {
        setValue(e.target.value);
      }}
      style={{
        padding: "0.5rem 1rem",
        fontSize: "1rem",
        borderRadius: "0.5rem",
        border: "#FFCC00 2px solid",
        background: "#111",
        color: "white",
        height: "2.5rem",
        ...style,
      }}
      id="input"
      placeholder={placeholder}
      value={value}
    ></InputA>
  );
};

export default Input;
