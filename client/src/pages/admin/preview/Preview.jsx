import React, { useState, useEffect } from "react";
import "./Preview.scss";

function Preview() {
  const [blogCount, setBlogCount] = useState(null);

  const fetchBlogCount = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/blog/count", {
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

  // Make sure to call the function
  fetchBlogCount();

  return (
    <div className="preview">
      <div className="preview-title">
        <h3>Preview</h3>
      </div>
      <div className="pre-blogs">
        <p>Total Blogs</p>
        <span>{blogCount}</span>
      </div>
      <div className="pre-blogs">
        <p>Total Projects</p>
        <span>0</span>
      </div>
    </div>
  );
}

export default Preview;
