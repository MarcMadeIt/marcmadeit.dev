import React, { useEffect } from "react";
import "./EditPodcast.scss";
import { useState } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import Select from "react-select";

const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function EditPodcast() {
  const options = [
    { value: "Business", label: "Business" },
    { value: "Innovation", label: "Innovation" },
    { value: "TechNews", label: "TechNews" },
    { value: "Frontend", label: "Frontend" },
    { value: "Backend", label: "Backend" },
    { value: "Motivation", label: "Motivation" },
    { value: "DailyTalk", label: "DailyTalk" },
  ];

  const { id } = useParams();
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [audioFile, setAudioFile] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fetchPodcastInfo = () => {
    fetch(`${apiUrl}/podcasts/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((podcastInfo) => {
        setTitle(podcastInfo.title);
        setDesc(podcastInfo.desc);
        setImageFile(podcastInfo.imageinfo);
        setAudioFile(podcastInfo.audioinfo);
        setTags(podcastInfo.tags.map((tag) => ({ value: tag, label: tag })));
      })
      .catch((error) =>
        console.error("Error fetching Podcast info:", error.message)
      );
  };

  useEffect(() => {
    if (id) {
      fetchPodcastInfo();
    }
  }, [id]);

  const validateFile = (file, types) => {
    const validTypes = types;
    return validTypes.includes(file.type);
  };

  const updatePodcast = async (ev) => {
    ev.preventDefault();

    const data = new FormData();
    data.set("title", title);
    data.set("desc", desc);
    if (imageFile) data.set("image", imageFile);
    if (audioFile) data.set("audio", audioFile);
    if (tags && Array.isArray(tags)) {
      tags.forEach((tag, index) => {
        data.set(`tags[${index}]`, tag.value);
      });
    }

    try {
      const response = await fetch(`${apiUrl}/podcasts/${id}`, {
        method: "PATCH",
        body: data,
        credentials: "include",
      });

      if (response.ok) {
        setRedirect(true);
      } else {
        console.error("Failed to update podcast");
        setMessage("Failed to update podcast");
      }
    } catch (error) {
      console.error("Error updating podcast:", error);
      setMessage("Error updating podcast: " + error.message);
    }
  };

  const cancelUpdate = () => {
    navigate(-1); // Navigate back to the previous page
  };

  // Check if redirect is true and id is available before navigating
  if (redirect && id) {
    return <Navigate to={"/podcasts"} />;
  }

  return (
    <div className="edit-podcast">
      <h3>Update Podcast</h3>
      <div className="form-edit">
        <form onSubmit={updatePodcast} encType="multipart/form-data">
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
            className="title-podcast"
            name="title"
            type="title"
            placeholder="Title on podcast..."
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
          />
          <textarea
            className="desc-podcast"
            placeholder="Description of the podcast.."
            name="desc"
            id=""
            value={desc}
            onChange={(ev) => setDesc(ev.target.value)}
          ></textarea>
          <label className="file-input-label">
            <input
              name="image"
              type="file"
              hidden
              onChange={(ev) => {
                const file = ev.target.files[0];
                if (file && validateFile(file, ["image/png", "image/jpeg"])) {
                  setImageFile(file);
                } else {
                  alert("Only .png and .jpeg files are allowed.");
                }
              }}
              accept="image/*"
            />
            Update image file
          </label>
          <span className="file-info">
            {imageFile ? imageFile.name : "No image file selected"}
          </span>
          <label className="file-input-label">
            <input
              name="audio"
              type="file"
              hidden
              onChange={(ev) => {
                const file = ev.target.files[0];
                if (file && validateFile(file, ["audio/mpeg", "audio/x-m4a"])) {
                  setAudioFile(file);
                } else {
                  alert("Only .mp3 and .m4a files are allowed.");
                }
              }}
              accept="audio/*"
            />
            Update audio file
          </label>
          <span className="file-info">
            {audioFile ? audioFile.name : "No audio file selected"}
          </span>
          <button className="submit-button" type="submit">
            Update podcast
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

export default EditPodcast;
