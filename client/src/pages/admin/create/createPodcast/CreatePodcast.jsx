import Select from "react-select";
import "./CreatePodcast.scss";
import { useState } from "react";
import { Navigate } from "react-router-dom";

function CreatePodcast() {
  const options = [
    { value: "Business", label: "Business" },
    { value: "Innovation", label: "Innovation" },
    { value: "TechNews", label: "TechNews" },
    { value: "Frontend", label: "Frontend" },
    { value: "Backend", label: "Backend" },
    { value: "Motivation", label: "Motivation" },
    { value: "DailyTalk", label: "DailyTalk" },
  ];

  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  const validateFile = (file, types) => {
    const validTypes = types;
    return validTypes.includes(file.type);
  };

  const createNewPodcast = async (ev) => {
    ev.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("desc", desc);
      formData.append("tags", JSON.stringify(tags.map((tag) => tag.value)));
      if (imageFile) formData.append("image", imageFile);
      if (audioFile) formData.append("audio", audioFile);

      const response = await fetch(`${apiUrl}/podcasts/create`, {
        method: "POST",
        body: formData,
        credentials: "include",
      }).catch((error) => {
        console.error("Fetch Error:", error);
        throw error;
      });

      if (response.ok) {
        const createdPodcast = await response.json();
        console.log("Created Podcast:", createdPodcast);
        setRedirect(true);
      } else {
        const errorMessage = await response.text();
        console.error("Failed to create podcast:", errorMessage);
        // Display an error message to the user
      }
    } catch (error) {
      console.error("Error creating podcast:", error);
    } finally {
      setLoading(false);
    }
  };

  if (redirect) {
    return <Navigate to={"/podcasts"} />;
  }

  return (
    <div className="create-podcast">
      <div className="form-create">
        <form onSubmit={createNewPodcast} encType="multipart/form-data">
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
            Choose image file
          </label>
          <span className="file-info">
            {imageFile ? imageFile.name : "No image file selected"}
          </span>
          <label className="file-input-label">
            <input
              name="file"
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
            Choose audio file
          </label>
          <span className="file-info">
            {audioFile ? audioFile.name : "No audio file selected"}
          </span>
          <button className="submit-button" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Podcast"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePodcast;
