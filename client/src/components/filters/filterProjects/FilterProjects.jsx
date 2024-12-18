import React, { useState } from "react";
import "../Filters.scss";
import { FaSearch } from "react-icons/fa";
import { FaArrowDownWideShort } from "react-icons/fa6";

const options = [
  { value: "HTML", label: "HTML" },
  { value: "CSS", label: "CSS" },
  { value: "JavaScript", label: "JavaScript" },
  { value: "TypeScript", label: "TypeScript" },
  { value: "ReactJS", label: "ReactJS" },
  { value: "NodeJS", label: "NodeJS" },
  { value: "NextJS", label: "NextJS" },
  { value: "ExpressJS", label: "ExpressJS" },
  { value: "MongoDB", label: "MongoDB" },
  { value: "AWS S3", label: "AWS S3" },
  { value: "MySQL", label: "MySQL" },
  { value: "PostgreSQL", label: "PostgreSQL" },
];

function FilterProjects({ onSearch, onFilter }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterClick = (filter) => {
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
            {options.map((option) => (
              <li key={option.value}>
                <button
                  className="fil-dropdown-item"
                  onClick={() => handleFilterClick(option.value)}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default FilterProjects;
