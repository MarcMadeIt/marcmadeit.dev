import React, { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import "./Projects.scss";
import Project from "../../components/project/Project";
import Footer from "../../components/footer/Footer";
import { RingLoader } from "react-spinners";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/projects`);
        if (Array.isArray(response.data)) {
          setProjects(response.data);
        } else {
          console.error("Unexpected API response:", response.data);
          setProjects([]);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <>
      {loading && (
        <div className="loading-container">
          <RingLoader loading={loading} color="#06F9EC" size={100} />
        </div>
      )}
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
              github={project.github}
              tags={project.tags}
              link={project.link}
              imageinfo={project.imageinfo}
            />
          ))}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Projects;
