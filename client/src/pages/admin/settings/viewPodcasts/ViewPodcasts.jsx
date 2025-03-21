import React, { useEffect, useState } from "react";
import "./ViewPodcasts.scss";
import { Link } from "react-router-dom";
import { FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";
import { format } from "date-fns";
import ImageBlog from "../../../../components/image/Image.jsx";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function truncateText(text, limit) {
  const words = text && typeof text === "string" ? text.split(" ") : [];
  return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
}

function ViewPodcasts() {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  useEffect(() => {
    axios
      .get(`${apiUrl}/podcasts`, { withCredentials: true })
      .then((response) => {
        setPodcasts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching podcasts:", error);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (podcastId) => {
    try {
      const response = await axios.delete(`${apiUrl}/podcasts/${podcastId}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setPodcasts((prevPodcasts) =>
          prevPodcasts.filter((podcast) => podcast._id !== podcastId)
        );
        setDeleteConfirmation(null);
      } else {
        console.error("Failed to delete podcast");
      }
    } catch (error) {
      console.error("Error deleting podcast:", error);
    }
  };

  const openDeleteConfirmation = (podcastId) => {
    setDeleteConfirmation({
      podcastId,
      message: "Are you sure you want to delete this podcast?",
    });
  };

  return (
    <div className="viewpodcasts">
      <div className="viewpodcasts-title">
        <h3>Overview</h3>
        <p>Podcasts</p>
      </div>

      <div className="viewpodcasts-cont">
        {loading ? (
          <p>Loading...</p>
        ) : podcasts && podcasts.length > 0 ? (
          <ul>
            {podcasts.map((podcastInfo) => (
              <li key={podcastInfo._id}>
                <div className="viewpodcasts-details">
                  <div className="viewpodcasts-img">
                    <ImageBlog src={podcastInfo.imageinfo} />
                  </div>
                  <div className="viewpodcasts-desc">
                    <p>{truncateText(podcastInfo.title, 4)}</p>
                    <span>
                      {format(new Date(podcastInfo.createdAt), "dd. MMM yyyy")}
                    </span>
                  </div>
                </div>
                <div className="viewpodcasts-buttons">
                  <Link
                    className="podcasts-edit"
                    to={`/podcast/edit/${podcastInfo._id}`}
                  >
                    <button>
                      <FaPencilAlt />
                    </button>
                  </Link>
                  <button
                    className="delete-btn"
                    onClick={() => openDeleteConfirmation(podcastInfo._id)}
                  >
                    <FaRegTrashAlt />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-content">
            <p>No Podcasts, create one!</p>
          </div>
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
                onClick={() => handleDelete(deleteConfirmation.podcastId)}
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

export default ViewPodcasts;
