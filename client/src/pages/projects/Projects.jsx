import React, { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import "./Projects.scss";
import Project from "../../components/project/Project";
import Footer from "../../components/footer/Footer";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${apiUrl}/project/get`);
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="projects">
      <Header />
      <div className="projects-title">
        <h2>My Projects</h2>
      </div>
      <div className="projects-content">
        {projects.map((project) => (
          <Project
            key={project._id}
            _id={project._id}
            title={project.title}
            desc={project.desc}
            tags={project.tags}
            link={project.link}
            imageinfo={project.imageinfo}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default Projects;
