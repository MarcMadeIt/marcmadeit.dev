import React, { useEffect, useState } from "react";
import "./Preview.scss";
import { FaPodcast } from "react-icons/fa6";
import { IoDocumentAttachOutline, IoEaselOutline } from "react-icons/io5";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

function Preview() {
  const [blogCount, setBlogCount] = useState(null);
  const [projectCount, setProjectCount] = useState(null);
  const [podcastCount, setPodcastCount] = useState(null);

  const fetchCounts = async () => {
    try {
      const response = await fetch(`${apiUrl}/counts`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setBlogCount(data.blogCount);
        setProjectCount(data.projectCount);
        setPodcastCount(data.podcastCount);
      } else {
        console.error("Failed to fetch counts");
      }
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

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
