import React from "react";
import "./Blog.scss";
import { format } from "date-fns";
import ProfilePic from "../../assets/img/profile/profile-small.png";
import ImageBlog from "../image/ImageBlog";
import { Link } from "react-router-dom";

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
    <Link className="link" to={`/projects/project/${_id}`}>
      <div className="project post">
        <div className="project-image">
          <ImageBlog src={imageinfo} />
        </div>
        <div className="project-content">
          <div className="project-tags">
            {tags.map((tag, index) => (
              <span key={`${_id}-${index}-${tag}`}>{`#${tag}`}</span>
            ))}
          </div>
          <div className="project-title">{title}</div>
          <div className="project-desc">
            <p>{truncatedDesc}</p>
          </div>
          <div className="project-details">
            <div className="by-author">
              <>
                <span>
                  <img src={ProfilePic} alt="alt" />
                </span>
                <span> Made by</span>
                {author && <span>{author.username}</span>}
              </>
            </div>
            <div className="project-time">
              <span>{format(new Date(createdAt), "dd. MMM yyyy")}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Project;
