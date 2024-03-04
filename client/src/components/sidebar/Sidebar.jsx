import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SlMenu } from "react-icons/sl";
import { FaGithub, FaInstagram, FaTimes, FaYoutube } from "react-icons/fa";
import "./Sidebar.scss";

function Sidebar() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <>
      <span className="menu-icon" onClick={toggleSidebar}>
        {sidebarVisible ? <FaTimes fontSize={30} /> : <SlMenu fontSize={30} />}
      </span>
      <div className={`sidebar ${sidebarVisible ? "active" : ""}`}>
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
          <Link className="link" to="/#contact">
            <li>About</li>
          </Link>
        </ul>
        <div>
          <div className="navbar-socials">
            <a
              className="item-socials link"
              href="https://www.instagram.com/marc.made.it/"
            >
              <span>
                <FaInstagram style={{ fontSize: "30px" }} />
              </span>
              <p>@Marc.Made.It</p>
            </a>

            <a className="item-socials link" href="#">
              <span>
                <FaYoutube style={{ fontSize: "30px" }} />
              </span>
              <p>@MarcMadeIt</p>
            </a>
            <a
              className="item-socials link"
              href="https://github.com/MarcMadeIt"
            >
              <span>
                <FaGithub style={{ fontSize: "28px" }} />
              </span>
              <p>@MarcMadeIt</p>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
