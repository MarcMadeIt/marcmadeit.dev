import React from "react";
import "./Audio.scss";

function Audio({ src, alt = "", ...rest }) {
  src =
    src && src.includes("https://")
      ? src
      : `http://localhost:8000/api/podcast/get/${src}`;

  return (
    <audio controls autoPlay>
      <source {...rest} src={src} alt={alt}  type="audio/mpeg" />
    </audio>
  )
}

export default Audio;
