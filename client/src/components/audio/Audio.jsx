import React from "react";
import "./Audio.scss";

function Audio({ src, alt = "", ...rest }) {
  src =
    src && src.includes("https://")
      ? src
      : `http://localhost:8000/api/podcast/get/${src}`;

  return <img {...rest} src={src} alt={alt} />;
}

export default Audio;
