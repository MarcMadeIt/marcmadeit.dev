import React, { useEffect, useState } from "react";
import "./ViewProjects.scss";
import { Link } from "react-router-dom";
import { FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";
import { format } from "date-fns";
import ImageBlog from "../../../../components/image/ImageBlog.jsx";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

function truncateText(text, limit) {
  const words = text && typeof text === "string" ? text.split(" ") : [];
  return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
}

function ViewProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  useEffect(() => {
    fetch(`${apiUrl}/project/get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((projects) => {
        setProjects(projects);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (projectId) => {
    try {
      const response = await fetch(`${apiUrl}/project/${projectId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project._id !== projectId)
        );
        setDeleteConfirmation(null);
      } else {
        console.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const openDeleteConfirmation = (projectId) => {
    setDeleteConfirmation({
      projectId,
      message: "Are you sure you want to delete this project?",
    });
  };

  return (
    <div className="viewprojects">
      <div className="viewprojects-title">
        <h3>Overview</h3>
        <p>Projects</p>
      </div>

      <div className="viewprojects-cont">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {Array.isArray(projects) ? (
              projects.map((projectInfo) => (
                <li key={projectInfo._id}>
                  <div className="viewprojects-details">
                    <div className="viewprojects-img">
                      <ImageBlog src={projectInfo.imageinfo} />
                    </div>
                    <div className="viewprojects-desc">
                      <p>{truncateText(projectInfo.title, 4)}</p>
                      <span>
                        {format(
                          new Date(projectInfo.createdAt),
                          "dd. MMM yyyy"
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="viewprojects-buttons">
                    <Link
                      className="blodpage-edit"
                      to={`/edit/${projectInfo._id}`}
                    >
                      <button>
                        <FaPencilAlt />
                      </button>
                    </Link>

                    <button
                      className="delete-btn"
                      onClick={() => openDeleteConfirmation(projectInfo._id)}
                    >
                      <FaRegTrashAlt />
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p>No projects available</p>
            )}
          </ul>
        )}
      </div>
      {deleteConfirmation && (
        <div className="delete-popup">
          <div className="delete-content">
            <p>{deleteConfirmation.message}</p>
            <div className="delete-buttons">
              <button
                className="no-opt-btn"
                onClick={() => setDeleteConfirmation(null)}
              >
                No
              </button>
              <button
                className="delete-opt-btn"
                onClick={() => handleDelete(deleteConfirmation.projectId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewProjects;
