import React, { useState } from "react";
import "./Preview.scss";
import { FaPodcast } from "react-icons/fa6";
import { IoDocumentAttachOutline, IoEaselOutline } from "react-icons/io5";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

function Preview() {
  const [blogCount, setBlogCount] = useState(null);
  const [projectCount, setProjectCount] = useState(null);
  const [podcastCount, setPodcastCount] = useState(null);


  const fetchBlogCount = async () => {
    try {
      const response = await fetch(`${apiUrl}/blog/count`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const { blogCount } = data;
        setBlogCount(blogCount);
      } else {
        console.error("Failed to fetch blog count");
      }
    } catch (error) {
      console.error("Error fetching blog count:", error);
    }
  };

  fetchBlogCount();

  const fetchProjectCount = async () => {
    try {
      const response = await fetch(`${apiUrl}/project/count`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        const { projectCount } = data;
        setProjectCount(projectCount);
      } else {
        console.error("Failed to fetch project count");
      }
    } catch (error) {
      console.error("Error fetching project count:", error);
    }
  };

  fetchProjectCount();

  const fetchPodcastCount = async () => {
    try {
      const response = await fetch(`${apiUrl}/podcast/count`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const { podcastCount } = data;
        setPodcastCount(podcastCount);
      } else {
        console.error("Failed to fetch podcast count");
      }
    } catch (error) {
      console.error("Error fetching podcast count:", error);
    }
  };

  fetchPodcastCount();

  return (
    <div className="preview">
      <div className="preview-title">
        <h3>Preview</h3>
      </div>
      <div className="pre-blogs">
      <IoDocumentAttachOutline fontSize={25} />
        <p>Total Blogs</p>
        <span>{blogCount}</span>
      </div>
      <div className="pre-blogs">
      <IoEaselOutline size={25} />
        <p>Total Projects</p>
        <span>{projectCount}</span>
      </div>
      <div className="pre-blogs">
      <FaPodcast fontSize={25} />
        <p>Total Podcasts</p>
        <span>{podcastCount}</span>
      </div>
    </div>
  );
}

export default Preview;
