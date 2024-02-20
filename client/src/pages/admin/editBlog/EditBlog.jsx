import React, { useEffect } from "react";
import "./EditBlog.scss";
import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Select from "react-select";
import Editor from "../../../components/editor/Editor";

const apiUrl = import.meta.env.REACT_APP_BASE_URL || "http://localhost:8000";

function EditBlog() {
  const options = [
    { value: "HTML", label: "HTML" },
    { value: "CSS", label: "CSS" },
    { value: "JS", label: "JS" },
    { value: "ReactJS", label: "ReactJS" },
  ];

  const { id } = useParams();
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  const fetchBlogInfo = () => {
    fetch(`${apiUrl}/api/blog/get/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((blogInfo) => {
        setTitle(blogInfo.title);
        setContent(blogInfo.content);
        setTags(blogInfo.tags.map((tag) => ({ value: tag, label: tag })));
        setFiles(blogInfo.files);
        setDesc(blogInfo.desc);
      })
      .catch((error) =>
        console.error("Error fetching blog info:", error.message)
      );
  };

  useEffect(() => {
    if (id) {
      fetchBlogInfo();
    }
  }, [id]);

  const updateBlog = async (ev) => {
    ev.preventDefault();

    const data = new FormData();
    data.set("title", title);
    data.set("content", content);
    data.set("desc", desc);
    data.set("id", id);

    if (tags && Array.isArray(tags)) {
      tags.forEach((tag, index) => {
        data.set(`tags[${index}]`, tag.value);
      });
    }

    if (files?.[0]) {
      data.set("file", files?.[0]);
    }

    console.log("FormData:", data);

    try {
      const response = await fetch(`http://localhost:8000/api/blog/put/${id}`, {
        method: "PUT",
        body: data,
        credentials: "include",
      });

      if (response.ok) {
        // Redirect after the update is successful
        setRedirect(true);
      } else {
        console.error("Failed to update blog");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };
  // Check if redirect is true and id is available before navigating
  if (redirect && id) {
    return <Navigate to={"/blog/" + id} />;
  }

  return (
    <div className="edit-blog">
      <h3>Update the blog</h3>
      <div className="form-edit">
        <form onSubmit={updateBlog}>
          <Select
            isMulti
            options={options}
            placeholder="Select tags..."
            className="react-select-container"
            classNamePrefix="react-select"
            value={tags}
            onChange={(selectedOptions) => setTags(selectedOptions)}
            getOptionValue={(option) => option.value}
            getOptionLabel={(option) => option.label}
          />
          <input
            className="title-blog"
            type="title"
            placeholder="Title on the new blog..."
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
          />
          <textarea
            className="desc-blog"
            placeholder="Description/summary to the new blog..."
            name=""
            id=""
            value={desc}
            onChange={(ev) => setDesc(ev.target.value)}
          ></textarea>
          <div className="text-editor">
            <Editor onChange={setContent} value={content} />
          </div>
          <label className="file-input-label">
            <input
              type="file"
              hidden
              onChange={(ev) => setFiles(ev.target.files)}
            />
            Choose file
          </label>
          <span className="file-info">
            {files && files.length > 0 ? files[0].name : "No file selected"}
          </span>
          <button className="submit-button" type="submit">
            Update Blog
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditBlog;
