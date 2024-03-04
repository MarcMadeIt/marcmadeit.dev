import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SlMenu } from "react-icons/sl";
import { FaTimes } from "react-icons/fa";
import "./Sidebar.scss";

function Sidebar() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  return (
    <>
      <span className="menu-icon" onClick={toggleSidebar}>
        <SlMenu fontSize={30} />
      </span>
      <div className={`sidebar ${sidebarVisible ? "active" : ""}`}>
        {sidebarVisible && (
          <div className="overlay-sidebar" onClick={toggleSidebar}></div>
        )}
        <span className="close-icon" onClick={toggleSidebar}>
          <FaTimes fontSize={30} />
        </span>
        <ul>
          <Link className="link" to="/blogs">
            <li>Blogs</li>
          </Link>
          <Link className="link" to="/library">
            <li>Library</li>
          </Link>
          <Link className="link" to="/socials">
            <li>Socials</li>
          </Link>
          <Link className="link" to="/Socials">
            <li>About</li>
          </Link>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
