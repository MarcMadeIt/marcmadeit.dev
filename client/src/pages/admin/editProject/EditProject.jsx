import React, { useEffect } from "react";
import "./EditProject.scss";
import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Select from "react-select";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

function EditProject() {
  const options = [
    { value: "HTML", label: "HTML" },
    { value: "CSS", label: "CSS" },
    { value: "JavaScript", label: "JavaScript" },
    { value: "TypeScript", label: "TypeScript" },
    { value: "ReactJS", label: "ReactJS" },
    { value: "NodeJS", label: "NodeJS" },
    { value: "NextJS", label: "NextJS" },
    { value: "ExpressJS", label: "ExpressJS" },
    { value: "MongoDB", label: "MongoDB" },
    { value: "AWS S3", label: "AWS S3" },
    { value: "MySQL", label: "MySQL" },
    { value: "PostgreSQL", label: "PostgreSQL" },
  ];

  const { id } = useParams();
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState("");
  const [link, setLink] = useState("");
  const [github, setGithub] = useState("");
  const [redirect, setRedirect] = useState(false);

  const fetchProjectInfo = () => {
    fetch(`${apiUrl}/project/get/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((projectInfo) => {
        setTitle(projectInfo.title);
        setLink(projectInfo.link);
        setGithub(projectInfo.github);
        setTags(projectInfo.tags.map((tag) => ({ value: tag, label: tag })));
        setFile(projectInfo.file);
        setDesc(projectInfo.desc);
      })
      .catch((error) =>
        console.error("Error fetching project info:", error.message)
      );
  };

  useEffect(() => {
    if (id) {
      fetchProjectInfo();
    }
  }, [id]);

  const updateProject = async (ev) => {
    ev.preventDefault();

    const data = new FormData();
    data.set("title", title);
    data.set("file", file);
    data.set("github", github);
    data.set("link", link);
    data.set("desc", desc);
    data.set("id", id);

    if (tags && Array.isArray(tags)) {
      tags.forEach((tag, index) => {
        data.set(`tags[${index}]`, tag.value);
      });
    }

    if (file?.[0]) {
      data.set("file", file?.[0]);
    }

    console.log("FormData:", data);

    try {
      const response = await fetch(`${apiUrl}/project/put/${id}`, {
        method: "PUT",
        body: data,
        credentials: "include",
      });

      if (response.ok) {
        // Redirect after the update is successful
        setRedirect(true);
      } else {
        console.error("Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };
  // Check if redirect is true and id is available before navigating
  if (redirect && id) {
    return <Navigate to={"/project/" + id} />;
  }

  return (
    <div className="edit-project">
      <h3>Update the Project</h3>
      <div className="form-edit">
        <form onSubmit={updateProject}>
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
            className="title-project"
            type="title"
            placeholder="Title on the project..."
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
          />
          <textarea
            className="desc-project"
            placeholder="Description/summary to the project..."
            name=""
            id=""
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
              type="file"
              hidden
              onChange={(ev) => setFile(ev.target.files)}
            />
            Choose file
          </label>
          <span className="file-info">
            {file && file.length > 0 ? file[0].name : "No file selected"}
          </span>
          <button className="submit-button" type="submit">
            Update Project
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProject;
