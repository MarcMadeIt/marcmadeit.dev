import React, { useState, useEffect } from "react";
import "./Project.scss";
import { FaArrowRight, FaGithub } from "react-icons/fa6";
import Image from "../image/Image";

function Project({ _id, title, desc, tags = [], imageinfo, link, github }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 568); // Change 568 to your desired breakpoint
    };
    handleResize(); // Call once to set initial state
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const renderTags = () => {
    if (isMobile) {
      // Render only the first two tags in mobile view
      return tags
        .slice(0, 2)
        .map((tag, index) => (
          <span key={`${_id}-${index}-${tag}`}>{`#${tag}`}</span>
        ));
    } else {
      // Render all tags
      return tags.map((tag, index) => (
        <span key={`${_id}-${index}-${tag}`}>{`#${tag}`}</span>
      ));
    }
  };

  const handleGitHubClick = () => {
    window.open(github, "_blank");
  };

  const handleViewProjectClick = () => {
    window.open(link, "_blank");
  };

  return (
    <div className="project">
      <div className="project-image">
        <Image src={imageinfo} />
      </div>
      <div className="project-content">
        <div className="project-title">
          <h3>{title}</h3>
        </div>
        <div className="project-desc">
          <span>{desc}</span>
        </div>
        <div className="project-info">
          <div className="project-tags">{renderTags()}</div>
          <div className="project-btn">
            <button
              className="project-github-btn"
              onClick={handleGitHubClick}
              aria-label="GitHub"
            >
              <FaGithub />
              <span className="source">Get Source</span>
            </button>
            <button
              className="project-link-btn"
              onClick={handleViewProjectClick}
              aria-label="View Project"
            >
              View Project <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Project;
