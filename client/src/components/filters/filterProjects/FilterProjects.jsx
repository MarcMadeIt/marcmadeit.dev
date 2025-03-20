import React, { useState } from "react";
import "../Filters.scss";
import { FaSearch } from "react-icons/fa";
import { FaArrowDownWideShort } from "react-icons/fa6";

function FilterProjects({ onSearch, onFilter }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const filterOptions = [
    { value: "TypeScript", label: "TypeScript" },
    { value: "NextJS", label: "NextJS" },
    { value: "ReactJS", label: "ReactJS" },
    { value: "NestJS", label: "NestJS" },
    { value: "MongoDB", label: "MongoDB" },
    { value: "Supabase", label: "Supabase" },
    { value: "Azure", label: "Azure" },
    { value: "AWS S3", label: "AWS S3" },
    { value: "Prisma", label: "Prisma" },
    { value: "GraphQL", label: "GraphQL" },
  ];

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
            {filterOptions.map((option) => (
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
