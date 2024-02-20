import React from "react";
import "./Footer.scss";
import { FaGithub, FaInstagram, FaYoutube } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="footer">
      <div className="footer-item footer-left">
        <Link className="link">
          <span>Library</span>
        </Link>
        <Link className="link">
          <span>Blog</span>
        </Link>
        <Link className="link">
          <span>Contact</span>
        </Link>
      </div>
      <div className="footer-item footer-center">
        <p>
          <span>©</span> 2024 marcmadeit.dev
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
