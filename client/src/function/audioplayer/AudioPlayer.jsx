import React, { useState, useEffect } from "react";
import "./AudioPlayer.scss";
import Audio from "../../components/audio/Audio";
import { FaChevronDown } from "react-icons/fa6";

const AudioPlayer = ({ podcast }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`audio-player ${isVisible ? "show" : ""} ${isExpanded ? "expanded" : ""}`}>
      <div className="audio-player-content">
        <div className="audio-player-left" onClick={toggleExpand}>
          <img src={podcast.imageinfo} alt={podcast.title} />
          <div className="audio-player-details">
            <h3>{podcast.title}</h3>
            <p>{podcast.desc}</p>
          </div>
        </div>
        <div className="audio-player-right">
        <Audio src={podcast.audioinfo}  expanded={isExpanded} />
        </div>
      </div>
      {isExpanded && (
        <button className="toggle-button" onClick={toggleExpand}>
         <FaChevronDown />
        </button>
      )}
    </div>
  );
};

export default AudioPlayer;

