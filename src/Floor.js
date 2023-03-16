import React from "react";
import "./Floor.css";
function Floor(props) {
  return (
    <div className="floor">
      <div>{props.floor}</div>
    </div>
  );
}

export default Floor;
