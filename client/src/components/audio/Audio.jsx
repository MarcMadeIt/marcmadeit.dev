import React, { useEffect, useRef, useState } from "react";
import "./Audio.scss";
import { FaBackward, FaForward, FaPause, FaPlay } from "react-icons/fa6";

function Audio({ src, alt = "", ...rest }) {
  // use state
  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // use references
  const audioPlayer = useRef();
  const progressBar = useRef();
  const animation = useRef();

  useEffect(() => {
    const audioElement = audioPlayer.current;

    const handleLoadedMetadata = () => {
      const seconds = Math.floor(audioElement.duration);
      setDuration(seconds);
      progressBar.current.max = seconds;

      if (isPlaying) {
        audioElement.play();
        animation.current = requestAnimationFrame(whilePlaying);
      }
    };

    const handleTimeUpdate = () => {
      progressBar.current.value = audioElement.currentTime;
      updateSeekBeforeWidth(audioElement.currentTime);
      setCurrentTime(audioElement.currentTime);
    };

    audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioElement.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audioElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audioElement.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [isPlaying]);

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioPlayer.current.play();
      animation.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animation.current);
    }
  };

  const changeRange = () => {
    audioPlayer.current.currentTime = progressBar.current.value;
    changePlayerCurrentTime();
  };

  const whilePlaying = () => {
    progressBar.current.value = audioPlayer.current.currentTime;
    updateSeekBeforeWidth(audioPlayer.current.currentTime);
    animation.current = requestAnimationFrame(whilePlaying);
  };

  const updateSeekBeforeWidth = (currentTime) => {
    if (duration && !isNaN(duration)) {
      const percentage = (currentTime / duration) * 100;
      // Add 3% offset
      progressBar.current.style.setProperty('--seek-before-width', `${Math.min(percentage + 3, 100)}%`);
    }
  };

  const changePlayerCurrentTime = () => {
    if (duration && !isNaN(duration)) {
      const currentTime = audioPlayer.current.currentTime;
      updateSeekBeforeWidth(currentTime);
      setCurrentTime(currentTime);
    }
  };

  src = src && src.includes("https://") ? src : `http://localhost:8000/api/podcast/get/${src}`;

  return (
    <div className="audio">
      <audio
        ref={audioPlayer}
        {...rest}
        src={src}
        alt={alt}
        type="audio/mpeg"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        autoPlay
      />
      <button><FaBackward /> <span>15</span></button>
      <button onClick={togglePlayPause} className="play-pause-btn">
        {isPlaying ? <FaPause /> : <FaPlay className="play" />}
      </button>
      <button><span>15</span><FaForward /></button>

      {/* current time */}
      <div className="current">{calculateTime(currentTime)}</div>

      {/* Progress bar */}
      <div>
        <input type="range" className="progress" defaultValue={0} ref={progressBar} onChange={changeRange} />
      </div>

      {/* duration */}
      <div className="duration">{(duration && !isNaN(duration)) && calculateTime(duration)}</div>
    </div>
  );
}

export default Audio;
