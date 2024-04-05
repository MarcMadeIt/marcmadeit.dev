import React from "react";
import Header from "../../components/header/Header";
import "./Projects.scss";
import Card from "../../components/card/Card";

function Projects() {
  return (
    <div className="projects">
      <Header />

      <div className="projects-title">
        <h2>Projects</h2>
      </div>
      <div className="projects-content">
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
}

export default Projects;
