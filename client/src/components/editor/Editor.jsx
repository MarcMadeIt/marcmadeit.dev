import React, { useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "./Editor.scss";
import "react-quill/dist/quill.snow.css";

function Editor({ value, onChange }) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ["link", "image"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  const observer = useRef(null);

  useEffect(() => {
    const targetNode = document.getElementById("Quill-react");

    if (targetNode) {
      observer.current = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          // Handle mutations here
        });
      });

      const config = { attributes: true, childList: true, subtree: true };

      observer.current.observe(targetNode, config);

      return () => {
        // Cleanup - disconnect the observer when the component unmounts
        observer.current.disconnect();
      };
    }
  }, []); // Run the effect only once during component mount

  return (
    <ReactQuill
      id="Quill-react"
      className="editor"
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
    />
  );
}

export default Editor;
