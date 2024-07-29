import React, { useState } from "react";
import "./Filter.scss";
import { FaSearch } from "react-icons/fa";
import { FaArrowDownWideShort } from "react-icons/fa6";

function Filter({ onSearch, onFilter }) {
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
        <button className="fil-dropdown-btn" id="fil-dropdown-btn" onClick={toggleDropdown}>
          <FaArrowDownWideShort /> Filters
        </button>
        {isDropdownVisible && (
          <ul className="fil-dropdown-menu" id="filter-options">
            <li>
              <a className="fil-dropdown-item" onClick={() => handleFilterClick("all")}>
                Show all
              </a>
            </li>
            <li>
              <a className="fil-dropdown-item" onClick={() => handleFilterClick("Learning")}>
                Learning
              </a>
            </li>
            <li>
              <a className="fil-dropdown-item" onClick={() => handleFilterClick("Innovation")}>
              Innovation
              </a>
            </li>
            <li>
              <a className="fil-dropdown-item" onClick={() => handleFilterClick("Business")}>
                Business
              </a>
            </li>
            <li>
              <a className="fil-dropdown-item" onClick={() => handleFilterClick("Frontend")}>
                Frontend
              </a>
            </li>
            <li>
              <a className="fil-dropdown-item" onClick={() => handleFilterClick("Backend")}>
                Backend
              </a>
            </li>
            <li>
              <a className="fil-dropdown-item" onClick={() => handleFilterClick("Coding")}>
                Coding
              </a>
            </li>
            <li>
              <a className="fil-dropdown-item" onClick={() => handleFilterClick("TechNews")}>
                TechNews
              </a>
            </li>
            <li>
              <a className="fil-dropdown-item" onClick={() => handleFilterClick("Motivation")}>
                Motivation
              </a>
            </li>
            <li>
              <a className="fil-dropdown-item" onClick={() => handleFilterClick("Startup")}>
                Startup
              </a>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default Filter;
