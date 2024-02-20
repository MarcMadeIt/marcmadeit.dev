import React from "react";
import "./ImageBlog.scss";

function ImageBlog({ src, alt = "", ...rest }) {
  src =
    src && src.includes("https://")
      ? src
      : `http://localhost:8000/api/blog/get/${src}`;

  return <img {...rest} src={src} alt={alt} />;
}

export default ImageBlog;
