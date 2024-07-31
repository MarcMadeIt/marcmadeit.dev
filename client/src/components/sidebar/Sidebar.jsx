import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SlMenu } from "react-icons/sl";
import { FaGithub, FaInstagram, FaYoutube } from "react-icons/fa";
import { CgClose } from "react-icons/cg";
import "./Sidebar.scss";

function Sidebar() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <>
      <span className="menu-icon" onClick={toggleSidebar}>
        {sidebarVisible ? <CgClose fontSize={30} /> : <SlMenu fontSize={30} />}
      </span>
      <div className={`sidebar ${sidebarVisible ? "active" : ""}`}>
        <ul>
          <Link
            className={`link ${location.pathname === "/blogs" ? "active" : ""}`}
            to="/blogs"
          >
            <li>Blogs</li>
          </Link>
          {/* <Link
            className={`link ${
              location.pathname === "/library" ? "active" : ""
            }`}
            to="/library"
          >
            <li>Library</li>
          </Link> */}
          <Link
            className={`link ${
              location.pathname === "/projects" ? "active" : ""
            }`}
            to="/projects"
          >
            <li>Projects</li>
          </Link>
          <Link
            className={`link ${
              location.pathname === "/podcasts" ? "active" : ""
            }`}
            to="/podcasts"
          >
            <li>Podcasts</li>
          </Link>
          <Link
            className={`link ${
              location.pathname === "/#contact" ? "active" : ""
            }`}
            to="/#contact"
          >
            <li>Contact</li>
          </Link>
        </ul>
        <div>
          <div className="navbar-socials">
            <a
              className="item-socials link"
              href="https://www.instagram.com/marc.made.it/"
            >
              <span>
                <FaInstagram />
              </span>
              <p>@Marc.Made.It</p>
            </a>

            <a className="item-socials link" href="#">
              <span>
                <FaYoutube />
              </span>
              <p>@MarcMadeIt</p>
            </a>
            <a
              className="item-socials link"
              href="https://github.com/MarcMadeIt"
            >
              <span>
                <FaGithub />
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
