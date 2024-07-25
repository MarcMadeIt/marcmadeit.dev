import React, { useState } from "react";
import "./Audio.scss";
import { FaBackward, FaForward, FaPause, FaPlay } from "react-icons/fa6";

function Audio({ src, alt = "", ...rest }) {
  const [isPlaying, setIsplaying] = useState(false);


  const togglePlayPause = () => {
    setIsplaying(!isPlaying)
  }



  src =
    src && src.includes("https://")
      ? src
      : `http://localhost:8000/api/podcast/get/${src}`;

  return (
    <div className="audio">
      <audio {...rest} src={src} alt={alt}  type="audio/mpeg" />
      <button><FaBackward /> <span>15</span></button>
      <button onClick={togglePlayPause} className="play-pause-btn">{isPlaying ? <FaPause /> : <FaPlay className="play" /> } </button>
      <button><span>15</span><FaForward /></button>

      {/* current time */}
      <div className="current">0:00</div>

      {/* Progress bar */}
      <div>
        <input type="range" className="progress" />
      </div>

      {/* duration */}
      <div className="duration">2:49</div>
    </div>
  )
}

export default Audio;
