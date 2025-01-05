import React, { useEffect } from "react";
import "./EditBlog.scss";
import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import Editor from "../../../../components/editor/Editor";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

function EditBlog() {
  const options = [
    { value: "Tips & Tricks", label: "Tips & Tricks" },
    { value: "Inspiration", label: "Inspiration" },
    { value: "CSS", label: "CSS" },
    { value: "Webdesign", label: "WD" },
    { value: "JavaScript", label: "JS" },
    { value: "TypeScript", label: "TS" },
    { value: "ReactJS", label: "ReactJS" },
    { value: "NextJS", label: "ReactJS" },
  ];

  const { id } = useParams();
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [message, setMessage] = useState("");

  const fetchBlogInfo = () => {
    axios
      .get(`${apiUrl}/blogs/${id}`)
      .then((response) => {
        const blogInfo = response.data;
        setTitle(blogInfo.title);
        setContent(blogInfo.content);
        setTags(blogInfo.tags.map((tag) => ({ value: tag, label: tag })));
        setFiles(blogInfo.files);
        setDesc(blogInfo.desc);
      })
      .catch((error) => {
        console.error("Error fetching blog info:", error.message);
        setMessage("Error fetching blog info: " + error.message);
      });
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
      const response = await axios.patch(`${apiUrl}/blogs/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        console.log("Update successful");
        setRedirect(true);
      } else {
        console.error("Update failed:", response.statusText);
        setMessage("Update failed: " + response.statusText);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      setMessage("Error during fetch: " + error.message);
    }
  };

  const cancelUpdate = () => {
    navigate(-1);
  };

  if (redirect && id) {
    return <Navigate to={"/blogs/blog/" + id} />;
  }

  return (
    <div className="edit-blog">
      <h3>Update Blog</h3>
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
          <button type="button" className="btn" onClick={cancelUpdate}>
            Cancel
          </button>
          {message && <div className="error-message">{message}</div>}
        </form>
      </div>
    </div>
  );
}

export default EditBlog;
