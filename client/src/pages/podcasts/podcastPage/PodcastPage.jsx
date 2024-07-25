import React, { useEffect, useState } from "react";
import "./PodcastPage.scss";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import Header from "../../../components/header/Header.jsx";
import Footer from "../../../components/footer/Footer.jsx";
import ProfilePic from "../../../assets/img/profile/profile-small.png";

import Image from "../../../components/image/Image.jsx";
import { RingLoader } from "react-spinners";
import Audio from "../../../components/audio/Audio.jsx";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

function PodcastPage() {
  const [podcastInfo, setPodcastInfo] = useState(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);

      fetch(`${apiUrl}/podcast/get/${id}`)
        .then((response) => {
          console.log(response);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((podcastInfo) => {
            setPodcastInfo(podcastInfo);
        })
        .catch((error) => {
          console.error("Error fetching blog:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <RingLoader loading={loading} color="#06F9EC" size={100} />
      </div>
    );
  }
  return (
    <div className="page">
      <Header />
      <div className="podcastpage">
        <div className="podcastpage-header">
            <div className="podcastpage-left">
            
                <div className="podcastpage-title">
                    <h3>{podcastInfo.title}</h3>
                </div>
                <div className="podcastpage-tags">
                    {podcastInfo.tags.map((tag) => (
                        <span key={tag}>#{tag}</span>
                    ))}
                
                </div>
                <div className="podcastpage-audioplayer">
                    <Audio src={podcastInfo.audioinfo} />
                </div>
            </div>
            <div className="podcastpage-right">
                <div className="podcastpage-image">
                    <Image className="podcastpage-img" src={podcastInfo.imageinfo} />
                </div>
            </div>
        </div>

        <div className="podcastpage-details">
        <div className="time">
            <span>{format(new Date(podcastInfo.createdAt), "dd. MMM yyyy")}</span>
          </div>
          {podcastInfo.author && (
            <div className="by-author">
              <span>
                <img src={ProfilePic} alt="" />
              </span>
              <span> Made by</span>
              &nbsp;
              <span>{podcastInfo.author.username}</span>
            </div>
          )}
          
        </div>
        <div className="podcastpage-summary">
          <p>{podcastInfo.desc}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PodcastPage;
