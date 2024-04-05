import React from "react";
import Header from "../../components/header/Header";
import "./Projects.scss";
import Project from "../../components/project/Project.jsx";

function Projects() {
  return (
    <div className="projects">
      <Header />

      <div className="projects-title">
        <h2>Projects</h2>
      </div>
      <div className="projects-content">
        <Project />
        <Project />
        <Project />
        <Project />
      </div>
    </div>
  );
}

export default Projects;
