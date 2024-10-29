import React, { useEffect, useState } from "react";
import "./ViewBlogs.scss";
import { Link } from "react-router-dom";
import { FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";
import { format } from "date-fns";
import ImageBlog from "../../../../components/image/Image.jsx";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

function truncateText(text, limit) {
  const words = text && typeof text === "string" ? text.split(" ") : [];
  return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
}

function ViewBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  useEffect(() => {
    fetch(`${apiUrl}/blog/getbyuser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((blogs) => {
        setBlogs(blogs);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (blogId) => {
    try {
      const response = await fetch(`${apiUrl}/blog/get/${blogId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        setBlogs((prevBlogs) =>
          prevBlogs.filter((blog) => blog._id !== blogId)
        );
        setDeleteConfirmation(null);
      } else {
        console.error("Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const openDeleteConfirmation = (blogId) => {
    setDeleteConfirmation({
      blogId,
      message: "Are you sure you want to delete this blog?",
    });
  };

  return (
    <div className="viewblogs">
      <div className="viewblogs-title">
        <h3>Overview</h3>
        <p>Blogs</p>
      </div>

      <div className="viewblogs-cont">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {Array.isArray(blogs) ? (
              blogs.map((blogInfo) => (
                <li key={blogInfo._id}>
                  <div className="viewblogs-details">
                    <div className="viewblogs-img">
                      <ImageBlog src={blogInfo.imageinfo} />
                    </div>
                    <div className="viewblogs-desc">
                      <p>{truncateText(blogInfo.title, 4)}</p>
                      <span>
                        {format(new Date(blogInfo.createdAt), "dd. MMM yyyy")}
                      </span>
                    </div>
                  </div>
                  <div className="viewblogs-buttons">
                    <Link
                      className="blodpage-edit"
                      to={`/blog/edit/${blogInfo._id}`}
                    >
                      <button>
                        <FaPencilAlt />
                      </button>
                    </Link>

                    <button
                      className="delete-btn"
                      onClick={() => openDeleteConfirmation(blogInfo._id)}
                    >
                      <FaRegTrashAlt />
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p>No blogs available</p>
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
                onClick={() => handleDelete(deleteConfirmation.blogId)}
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

export default ViewBlogs;
