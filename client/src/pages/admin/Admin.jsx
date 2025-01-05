import React, { useState } from "react";
import "./Admin.scss";
import CreateBlog from "./create/createBlog/CreateBlog.jsx";
import CreateProject from "./create/createProject/CreateProject.jsx";
import CreatePodcast from "./create/createPodcast/CreatePodcast.jsx";
import Settings from "./settings/Settings.jsx";
import Preview from "./preview/Preview.jsx";
import { Link } from "react-router-dom";
import { FaHouse } from "react-icons/fa6";

function RadioButton({ value, label, isSelected, onSelect }) {
  return (
    <label className="radio">
      <input
        type="radio"
        value={value}
        checked={isSelected}
        onChange={() => onSelect(value)}
      />
      {label}
    </label>
  );
}

function Admin() {
  const [currentLayout, setCurrentLayout] = useState("preview");
  const [selectedCreate, setSelectedCreate] = useState(null);

  const switchLayout = (layout) => {
    setCurrentLayout(layout);
  };

  const selectCreate = (value) => {
    setSelectedCreate(value);
  };

  const renderCreateForm = () => {
    switch (selectedCreate) {
      case "blog":
        return <CreateBlog />;
      case "project":
        return <CreateProject />;
      case "podcast":
        return <CreatePodcast />;
      default:
        return null;
    }
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
            currentLayout === "create"
              ? { borderBottom: "3px solid #06F9EC" }
              : {}
          }
          onClick={() => switchLayout("create")}
        >
          Create New
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
              <RadioButton
                value="blog"
                label="Blog"
                isSelected={selectedCreate === "blog"}
                onSelect={selectCreate}
              />
              <RadioButton
                value="project"
                label="Project"
                isSelected={selectedCreate === "project"}
                onSelect={selectCreate}
              />
              <RadioButton
                value="podcast"
                label="Podcast"
                isSelected={selectedCreate === "podcast"}
                onSelect={selectCreate}
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
