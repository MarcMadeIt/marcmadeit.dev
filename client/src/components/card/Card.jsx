import React from "react";
import "./Card.scss";

import image from "../../assets/img/content/cat.png";

function Card() {
  return (
    <div className="card">
      <div className="card-image">
        <img src={image} alt="" />
      </div>
      <div className="card-content">
        <div className="card-title">
          <h3>Form - With Validation</h3>
          <span>TAG</span>
        </div>
        <div className="card-tags"></div>
        <div className="card-info">
          <button>Get Source</button>
          <span>20 feb 2024</span>
        </div>
      </div>
    </div>
  );
}

export default Card;
