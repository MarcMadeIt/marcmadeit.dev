import React from "react";
import "./Image.scss";

function Image({ src, alt = "", ...rest }) {
  src =
    src && src.includes("https://")
      ? src
      : `http://localhost:8000/api/all/get/${src}`;

  return <img {...rest} src={src} alt={alt} />;
}

export default Image;
