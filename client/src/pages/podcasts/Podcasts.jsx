import React, { useEffect, useState } from "react";
import "./Podcasts.scss";
import Header from "../../components/header/Header.jsx";
import Footer from "../../components/footer/Footer.jsx";
import FilterPodcasts from "../../components/filters/filterPodcasts/FilterPodcasts";
import Podcast from "../../components/podcast/Podcast.jsx";
import Pagination from "../../function/pagination/Pagination.jsx";
import { RingLoader } from "react-spinners";
import AudioPlayer from "../../function/audioplayer/AudioPlayer.jsx";

const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function Podcasts() {
  const [podcasts, setPodcasts] = useState([]);
  const [filteredPodcasts, setFilteredPodcasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(4);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPodcast, setCurrentPodcast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchPodcasts = async (page = currentPage) => {
      setLoading(true);
      try {
        const response = await fetch(
          `${apiUrl}/podcasts/limit?page=${page}&limit=${postsPerPage}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPodcasts(data.podcasts || []);
        setTotalCount(data.totalCount);
        setFilteredPodcasts(data.podcasts || []);
      } catch (error) {
        console.error("Error fetching podcasts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, [currentPage]);

  useEffect(() => {
    filterAndSearchPodcasts();
  }, [podcasts, searchTerm, filter]);

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePodcastClick = (podcast) => {
    setCurrentPodcast(podcast);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilter = (filter) => {
    setFilter(filter);
  };

  const filterAndSearchPodcasts = () => {
    let filtered = podcasts;
    if (filter !== "all") {
      filtered = filtered.filter((podcast) => podcast.tags.includes(filter));
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (podcast) =>
          podcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          podcast.desc.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredPodcasts(filtered);
  };

  return (
    <>
      {loading && (
        <div className="loading-container">
          <RingLoader loading={loading} color="#06F9EC" size={100} />
        </div>
      )}
      <div className="podcasts">
        <Header />
        <div className="podcasts-title">
          <h2>My Podcasts</h2>
        </div>
        <div className="podcasts-filter">
          <FilterPodcasts onSearch={handleSearch} onFilter={handleFilter} />
        </div>
        <div className="podcasts-content">
          {filteredPodcasts.length === 0 && !loading ? (
            <p className="no-podcasts-message">No podcasts found.</p>
          ) : (
            filteredPodcasts.map((podcast) => (
              <Podcast
                key={podcast._id}
                _id={podcast._id}
                title={podcast.title}
                desc={podcast.desc}
                tags={podcast.tags}
                imageinfo={podcast.imageinfo}
                createdAt={podcast.createdAt}
                onClick={() => handlePodcastClick(podcast)}
              />
            ))
          )}
        </div>
        <Pagination
          postsPerPage={postsPerPage}
          handlePagination={handlePagination}
          currentPage={currentPage}
          totalCount={totalCount}
        />
        <Footer />
        {currentPodcast && <AudioPlayer podcast={currentPodcast} />}
      </div>
    </>
  );
}

export default Podcasts;
