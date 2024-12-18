import React, { useState } from "react";
import "../Filters.scss";
import { FaSearch } from "react-icons/fa";
import { FaArrowDownWideShort } from "react-icons/fa6";

function FilterPodcasts({ onSearch, onFilter }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterClick = (filter) => {
    setFilter(filter);
    onFilter(filter);
    setIsDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  return (
    <div className="filter">
      <div className="search-content">
        <label>
          <FaSearch size={14} />
          <input
            className="form-control"
            type="text"
            placeholder="Search after project..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </label>
      </div>
      <div className="dropdown">
        <button
          className="fil-dropdown-btn"
          id="fil-dropdown-btn"
          onClick={toggleDropdown}
        >
          <FaArrowDownWideShort /> Filters
        </button>
        {isDropdownVisible && (
          <ul className="fil-dropdown-menu" id="filter-options">
            <li>
              <button
                className="fil-dropdown-item"
                onClick={() => handleFilterClick("all")}
              >
                Show all
              </button>
            </li>
            <li>
              <button
                className="fil-dropdown-item"
                onClick={() => handleFilterClick("DailyTalk")}
              >
                DailyTalk
              </button>
            </li>
            {/* <li>
              <button className="fil-dropdown-item" onClick={() => handleFilterClick("Innovation")}>
              Innovation
              </button>
            </li>
            <li>
              <button className="fil-dropdown-item" onClick={() => handleFilterClick("Motivation")}>
                Motivation
              </button>
            </li>
            <li>
              <button className="fil-dropdown-item" onClick={() => handleFilterClick("Business")}>
                Business
              </button>
            </li> */}
            <li>
              <button
                className="fil-dropdown-item"
                onClick={() => handleFilterClick("Frontend")}
              >
                Frontend
              </button>
            </li>
            {/* <li>
              <button className="fil-dropdown-item" onClick={() => handleFilterClick("Backend")}>
                Backend
              </button>
            </li>
            <li>
              <button className="fil-dropdown-item" onClick={() => handleFilterClick("TechNews")}>
                TechNews
              </button>
            </li> */}
          </ul>
        )}
      </div>
    </div>
  );
}

export default FilterPodcasts;
