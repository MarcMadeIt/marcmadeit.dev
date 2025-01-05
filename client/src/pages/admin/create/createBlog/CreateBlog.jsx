import Select from "react-select";
import "./CreateBlog.scss";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../../../../components/editor/Editor";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

function CreateBlog() {
  const options = [
    { value: "Tips & Tricks", label: "Tips & Tricks" },
    { value: "Inspiration", label: "Inspiration" },
    { value: "New Trends", label: "New Trends" },
    { value: "CSS", label: "CSS" },
    { value: "Webdesign", label: "WD" },
    { value: "JavaScript", label: "JS" },
    { value: "TypeScript", label: "TS" },
    { value: "ReactJS", label: "ReactJS" },
    { value: "NextJS", label: "NextJS" },
    { value: "Backend", label: "Backend" },
    { value: "Frontend", label: "Frontend" },
  ];

  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createNewBlog = async (ev) => {
    ev.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("desc", desc);
      formData.append("content", content);
      formData.append("tags", JSON.stringify(tags.map((tag) => tag.value)));
      formData.append("file", file[0]);

      const response = await axios.post(`${apiUrl}/blogs/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.status >= 200 && response.status < 300) {
        console.log("Created Blog:", response.data);
        setRedirect(true);
      } else {
        console.error("Failed to create blog:", response.data);
      }
    } catch (error) {
      setError("Failed to create the blog. Please try again.");
      console.error("Error creating blog:", error);
    } finally {
      setLoading(false);
    }
  };

  if (redirect) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <div className="create-blog">
      <div className="form-create">
        <form onSubmit={createNewBlog} encType="multipart/form-data">
          <Select
            isMulti
            name="tags"
            options={options}
            placeholder="Select tags..."
            className="react-select-container"
            classNamePrefix="react-select"
            value={tags}
            onChange={(selectedOptions) => setTags(selectedOptions)}
          />
          <input
            className="title-blog"
            name="title"
            type="title"
            placeholder="Title on the new blog..."
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
          />
          <textarea
            className="desc-blog"
            placeholder="Description/summary to the new blog..."
            name="desc"
            id=""
            value={desc}
            onChange={(ev) => setDesc(ev.target.value)}
          ></textarea>
          <div className="text-editor">
            <Editor onChange={setContent} value={content} />
          </div>
          <label className="file-input-label">
            <input
              name="file"
              type="file"
              hidden
              onChange={(ev) => setFile(ev.target.files)}
              accept="image/*"
            />
            Choose file
          </label>
          <span className="file-info">
            {file.length > 0 ? file[0].name : "No file selected"}
          </span>
          <button className="submit-button" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Blog"}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default CreateBlog;
