import React, { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import "./Projects.scss";
import Project from "../../components/project/Project";
import Footer from "../../components/footer/Footer";
import { RingLoader } from "react-spinners";
import FilterProjects from "../../components/filters/filterProjects/FilterProjects";
import Pagination from "../../function/pagination/Pagination";
import axios from "axios"; // Import axios

const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(4);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

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

  useEffect(() => {
    filterAndSearchProjects();
  }, [projects, searchTerm, filter, currentPage]);

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilter = (filter) => {
    setFilter(filter);
    setCurrentPage(1); // Reset to page 1 when a filter is applied
  };

  const filterAndSearchProjects = () => {
    let filtered = projects;

    // Apply filter
    if (filter !== "all") {
      filtered = filtered.filter((project) => project.tags.includes(filter));
    }

    // Apply search (include tags, title, and desc in search)
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          project.desc.toLowerCase().includes(lowerCaseSearchTerm) ||
          project.tags.some((tag) =>
            tag.toLowerCase().includes(lowerCaseSearchTerm)
          )
      );
    }

    // Apply pagination
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const paginatedProjects = filtered.slice(startIndex, endIndex);

    setFilteredProjects(paginatedProjects);
    setTotalCount(filtered.length);
  };

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
        <div className="projects-filter">
          <FilterProjects onSearch={handleSearch} onFilter={handleFilter} />
        </div>
        <div className="projects-content">
          {filteredProjects.length === 0 && !loading ? (
            <p className="no-projects-message">No projects found.</p>
          ) : (
            filteredProjects.map((project) => (
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
            ))
          )}
        </div>
        <Pagination
          postsPerPage={postsPerPage}
          handlePagination={handlePagination}
          currentPage={currentPage}
          totalCount={totalCount}
        />
        <Footer />
      </div>
    </>
  );
}

export default Projects;
