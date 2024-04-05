import React from "react";
import "./Project.scss";
import { format } from "date-fns";
import Image from "../../assets/img/content/tiger.jpg";

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
    //<Link className="link" to={`/projects/project/${_id}`}>
    <div className="project">
      <div className="project-image">
        <img src={Image} alt="" />
      </div>
      <div className="project-content">
        <div className="project-title">
          <h3>Dashboard</h3>
          <span>TAG</span>
        </div>
        <div className="project-tags"></div>
        <div className="project-info">
          <button>View Project</button>
          <span>20 feb 2024</span>
        </div>
      </div>
    </div>
    //</Link>
  );
}

export default Project;
