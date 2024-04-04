import React, { useState } from "react";
import "./Admin.scss";
import CreateBlog from "./createBlog/CreateBlog.jsx";
import CreateProject from "./createProject/CreateProject.jsx";
import Settings from "./settings/Settings.jsx";
import Preview from "./preview/Preview.jsx";
import { Link } from "react-router-dom";
import { FaHouse } from "react-icons/fa6";
import Select from "react-select";

function Admin() {
  const [currentLayout, setCurrentLayout] = useState("preview");
  const [selectedCreate, setSelectedCreate] = useState(null); // State variable to track the selected create type

  const switchLayout = (layout) => {
    setCurrentLayout(layout);
  };

  const selectCreate = (selectedOption) => {
    setSelectedCreate(selectedOption ? selectedOption.value : null);
  };

  const renderCreateForm = () => {
    switch (selectedCreate) {
      case "blog":
        return <CreateBlog />;
      case "project":
        return <CreateProject />;
      default:
        return null;
    }
  };

  const options = [
    { value: "blog", label: "New Blog" },
    { value: "project", label: "New Project" },
  ];

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
            currentLayout === "create"
              ? { borderBottom: "3px solid #06F9EC" }
              : {}
          }
          onClick={() => switchLayout("create")}
        >
          Create
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
        {currentLayout === "create" && (
          <div>
            <div className="create-options">
              <Select
                options={options}
                onChange={selectCreate}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Select type..."
              />
            </div>
            {selectedCreate && renderCreateForm()}
          </div>
        )}
        {currentLayout === "settings" && <Settings />}
      </div>
    </div>
  );
}

export default Admin;
