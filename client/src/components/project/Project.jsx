import React from "react";
import "./Project.scss";
import { format } from "date-fns";
import Image from "../../assets/img/content/dashboard.png";
import { FaArrowRight } from "react-icons/fa6";

function truncateText(text, limit) {
  if (typeof text !== "string") {
    return "";
  }

  const words = text.split(" ");
  return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
}

function Project({
  _id,
  title,
  desc,
  tags = [],
  imageinfo,
  createdAt,
  author,
}) {
  const truncatedDesc = truncateText(desc, 17);

  return (
    <a className="link" href="/">
      <div className="project">
        <div className="project-image">
          <img src={Image} alt="" />
        </div>
        <div className="project-content">
          <div className="project-title">
            <h2>Dashboard</h2>
          </div>
          <div className="project-desc">
            <span>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Enim
              quisquam nihil voluptatibus illum recusandae fugiat voluptates
              dolorum ducimus minus consectetur?
            </span>
          </div>
          <div className="project-info">
            <div className="project-btn">
              <button>
                View Project <FaArrowRight />
              </button>
            </div>
            <div className="project-tags">
              <span>NextJS</span>
              <span>MongoDB</span>
              <span>NodeJS</span>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

export default Project;
