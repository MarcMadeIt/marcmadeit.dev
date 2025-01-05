import React, { useEffect, useState } from "react";
import "./Preview.scss";
import { FaPodcast } from "react-icons/fa6";
import { IoDocumentAttachOutline, IoEaselOutline } from "react-icons/io5";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_BASE_URL;

function Preview() {
  const [blogCount, setBlogCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [podcastCount, setPodcastCount] = useState(0);

  const fetchCounts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/counts`, {
        withCredentials: true,
      });

      const data = response.data;
      setBlogCount(data.blogs);
      setProjectCount(data.projects);
      setPodcastCount(data.podcasts);
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
      <div className="pre-item">
        <IoDocumentAttachOutline fontSize={25} />
        <p>Total Blogs</p>
        <span>{blogCount}</span>
      </div>
      <div className="pre-item">
        <IoEaselOutline size={25} />
        <p>Total Projects</p>
        <span>{projectCount}</span>
      </div>
      <div className="pre-item">
        <FaPodcast fontSize={25} />
        <p>Total Podcasts</p>
        <span>{podcastCount}</span>
      </div>
    </div>
  );
}

export default Preview;
