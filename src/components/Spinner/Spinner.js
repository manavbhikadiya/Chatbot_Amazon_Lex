import React from "react";
import "./Spinner.css";

const Spinner = () => {
  return (
    <div className="reply">
      <div className="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default Spinner;

