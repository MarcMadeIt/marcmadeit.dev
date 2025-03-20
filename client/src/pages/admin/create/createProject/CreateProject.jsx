import Select from "react-select";
import "./CreateProject.scss";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

function CreateProject() {
  const options = [
    { value: "HTML", label: "HTML" },
    { value: "CSS", label: "CSS" },
    { value: "JavaScript", label: "JavaScript" },
    { value: "TypeScript", label: "TypeScript" },
    { value: "Redux", label: "Redux" },
    { value: "ReactJS", label: "ReactJS" },
    { value: "NodeJS", label: "NodeJS" },
    { value: "NextJS", label: "NextJS" },
    { value: "NestJS", label: "NestJS" },
    { value: "Django", label: "Django" },
    { value: "ExpressJS", label: "ExpressJS" },
    { value: "MongoDB", label: "MongoDB" },
    { value: "NeonDB", label: "NeonDB" },
    { value: "AWS S3", label: "AWS S3" },
    { value: "Azure", label: "Azure" },
    { value: "Supabase", label: "Supabase" },
    { value: "Tailwind", label: "Tailwind" },
    { value: "MySQL", label: "MySQL" },
    { value: "Prisma", label: "Prisma" },
    { value: "GraphQL", label: "GraphQL" },
    { value: "PostgreSQL", label: "PostgreSQL" },
    { value: "MySQL", label: "MySQL" },
  ];

  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [link, setLink] = useState("");
  const [github, setGithub] = useState("");
  const [file, setFile] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  const createNewProject = async (ev) => {
    ev.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("desc", desc);
      formData.append("link", link);
      formData.append("github", github);
      formData.append("tags", JSON.stringify(tags.map((tag) => tag.value)));
      formData.append("file", file[0]);

      const response = await axios.post(`${apiUrl}/projects/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.status === 200 || response.status === 201) {
        console.log("Created project:", response.data);
        setRedirect(true);
      } else {
        console.error("Failed to create project:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating project:", error);
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
            name="github"
            type="github"
            placeholder="Link to the Github Repository..."
            value={github}
            onChange={(ev) => setGithub(ev.target.value)}
          />
          <input
            className="link-project"
            name="link"
            type="link"
            placeholder="Link to the Project site..."
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
