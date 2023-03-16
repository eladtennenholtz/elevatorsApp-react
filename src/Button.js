import React from "react";
import "./Button.css";
function Button(props) {
  function labelType(label) {
    if (label === "Call") {
      return "green";
    } else if (label === "Waiting") {
      return "red";
    } else {
      return "#e6e6e6";
    }
  }
  return (
    <div>
      {labelType(props.label) === "#e6e6e6" ? (
        <button
          style={{ backgroundColor: labelType(props.label), color: "green" }}
          onClick={props.onClick}
        >
          {props.label}
        </button>
      ) : (
        <button
          style={{ backgroundColor: labelType(props.label) }}
          onClick={props.onClick}
        >
          {props.label}
        </button>
      )}
    </div>
  );
}

export default Button;
