import Select from "react-select";
import "./CreateBlog.scss";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../../../components/editor/Editor";

function CreateBlog() {
  const options = [
    { value: "Tips & Tricks", label: "Tips & Tricks" },
    { value: "Inspiration", label: "Inspiration" },
    { value: "CSS", label: "CSS" },
    { value: "JS", label: "JS" },
    { value: "ReactJS", label: "ReactJS" },
  ];

  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const createNewBlog = async (ev) => {
    ev.preventDefault();

    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("desc", desc);
      formData.append("content", content);
      formData.append("tags", tags.map((tag) => tag.value).join(","));
      formData.append("file", file[0]);

      const response = await fetch(`${apiUrl}/blog/create`, {
        method: "POST",
        body: formData,
        credentials: "include",
      }).catch((error) => {
        console.error("Fetch Error:", error);
        throw error; // Rethrow the error to continue handling it outside the fetch block
      });

      if (response.ok) {
        const createdBlog = await response.json();
        console.log("Created Blog:", createdBlog);
        setRedirect(true);
      } else {
        const errorMessage = await response.text();
        console.error("Failed to create blog:", errorMessage);
        // Display an error message to the user
      }
    } catch (error) {
      console.error("Error creating blog:", error);
    } finally {
      setLoading(false);
    }
  };
  if (redirect) {
    return <Navigate to={"/"} />;
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
          <button className="submit-button" type="submit">
            Create Blog
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateBlog;
