import Select from "react-select";
import "./CreateProject.scss";
import { useState } from "react";
import { Navigate } from "react-router-dom";

function CreateProject() {
  const options = [
    { value: "HTML", label: "HTML" },
    { value: "CSS", label: "CSS" },
    { value: "JS", label: "JavaScript" },
    { value: "ReactJS", label: "ReactJS" },
    { value: "NodeJS", label: "NodeJS" },
    { value: "NextJS", label: "NextJS" },
    { value: "ExpressJS", label: "ExpressJS" },
    { value: "MongoDB", label: "MongoDB" },
    { value: "AWS S3", label: "AWS S3" },
    { value: "MySQL", label: "MySQL" },
    { value: "PostgreSQL", label: "PostgreSQL" },
  ];

  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [link, setLink] = useState("");
  const [file, setFile] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const createNewProject = async (ev) => {
    ev.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("desc", desc);
      formData.append("link", link);
      formData.append("tags", tags.map((tag) => tag.value).join(","));
      formData.append("file", file[0]);

      const response = await fetch(`${apiUrl}/project/create`, {
        method: "POST",
        body: formData,
        credentials: "include",
      }).catch((error) => {
        console.error("Fetch Error:", error);
        throw error;
      });

      if (response.ok) {
        const createdProject = await response.json();
        console.log("Created project:", createdProject);
        setRedirect(true);
      } else {
        const errorMessage = await response.text();
        console.error("Failed to create project:", errorMessage);
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
    <div className="create-project">
      <div className="form-create">
        <form onSubmit={createNewProject} encType="multipart/form-data">
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
            className="title-project"
            name="title"
            type="title"
            placeholder="Title on project..."
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
          />
          <textarea
            className="desc-project"
            placeholder="Description of the project.."
            name="desc"
            type="desc"
            value={desc}
            onChange={(ev) => setDesc(ev.target.value)}
          ></textarea>
          <input
            className="link-project"
            name="link"
            type="link"
            placeholder="Link to the project"
            value={link}
            onChange={(ev) => setLink(ev.target.value)}
          />
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
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateProject;
