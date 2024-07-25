import React from "react";
import "./AudioPlayer.scss";
import Audio from "../../components/audio/Audio";

const AudioPlayer = ({ podcast }) => {
  return (
    <div className="audio-player">
      <div className="audio-player-content">
        <div className="audio-player-left">
        <img src={podcast.imageinfo} alt={podcast.title} />
        <div className="audio-player-details">
          <h3>{podcast.title}</h3>
          <p>{podcast.desc}</p>
        </div>
        </div>
        <div className="audio-player-right">
        <Audio src={podcast.audioinfo} />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;