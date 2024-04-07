import React, { useState, useEffect } from "react";
import "./Project.scss";
import Image from "../../assets/img/content/dashboard.png";
import { FaArrowRight } from "react-icons/fa6";

function Project() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 568); // Change 768 to your desired breakpoint
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
      return (
        <>
          <span>NextJS</span>
          <span>MongoDB</span>
        </>
      );
    } else {
      // Render all tags
      return (
        <>
          <span>NextJS</span>
          <span>MongoDB</span>
          <span>NodeJS</span>
        </>
      );
    }
  };

  return (
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
          <div className="project-tags">{renderTags()}</div>
          <div className="project-btn">
            <a className="link" href="/">
              <button>
                View Project <FaArrowRight />
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Project;
