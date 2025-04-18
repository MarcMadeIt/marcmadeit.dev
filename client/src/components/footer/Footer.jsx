import React from "react";
import "./Footer.scss";
import {
  FaGithub,
  FaInstagram,
  FaUserShield,
  FaYoutube,
} from "react-icons/fa6";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="footer">
      <div className="footer-item footer-left">
        <Link className="link" to="/blogs">
          <span>Blogs</span>
        </Link>
        <Link className="link" to="/projects">
          <span>Projects</span>
        </Link>
        <Link className="link" to="/podcasts">
          <span>Podcasts</span>
        </Link>
      </div>
      <div className="footer-item footer-center">
        <p>
          <span>©</span>2025 marccode.com
        </p>
      </div>
      <div className="footer-item footer-right">
        <a
          className="icon-footer link"
          href="https://www.instagram.com/marc.made.it/"
        >
          <FaInstagram style={{ fontSize: "32px" }} />
        </a>

        <a className="icon-footer" href="#">
          <FaYoutube style={{ fontSize: "32px" }} />
        </a>
        <a className="icon-footer" href="https://github.com/MarcMadeIt">
          <FaGithub style={{ fontSize: "30px" }} />
        </a>
      </div>
    </div>
  );
}

export default Footer;
