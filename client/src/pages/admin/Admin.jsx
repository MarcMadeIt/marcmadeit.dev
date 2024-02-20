import React, { useState } from "react";
import "./Admin.scss";
import CreateBlog from "./createBlog/CreateBlog.jsx";
import Settings from "./settings/Settings.jsx";
import Preview from "./preview/Preview.jsx";
import { Link } from "react-router-dom";
import { FaHouse } from "react-icons/fa6";

function Admin() {
  const [currentLayout, setCurrentLayout] = useState("preview");

  const switchLayout = (layout) => {
    setCurrentLayout(layout);
  };

  return (
    <div className="admin">
      <Link className="link home-btn" to="/">
        <button>
          <FaHouse size={17} />
          Home
        </button>
      </Link>
      <div className="adm-title">
        <h1>Admin</h1>
      </div>
      <div className="layout-buttons">
        <button
          style={
            currentLayout === "preview"
              ? { borderBottom: "3px solid #06F9EC" }
              : {}
          }
          onClick={() => switchLayout("preview")}
        >
          Preview
        </button>
        <button
          style={
            currentLayout === "createBlog"
              ? { borderBottom: "3px solid #06F9EC" }
              : {}
          }
          onClick={() => switchLayout("createBlog")}
        >
          Create Blog
        </button>
        <button
          style={
            currentLayout === "settings"
              ? { borderBottom: "3px solid #06F9EC" }
              : {}
          }
          onClick={() => switchLayout("settings")}
        >
          Settings
        </button>
      </div>
      <div className="layout-container">
        {currentLayout === "preview" && <Preview />}
        {currentLayout === "createBlog" && <CreateBlog />}
        {currentLayout === "settings" && <Settings />}
      </div>
    </div>
  );
}

export default Admin;
