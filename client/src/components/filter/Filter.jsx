import React, { useEffect } from "react";
import "./Filter.scss";
import { FaSearch } from "react-icons/fa";
import { FaArrowDownShortWide, FaArrowDownWideShort } from "react-icons/fa6";

function Filter() {
  useEffect(() => {
    const hiddenContent = document.getElementById("filter-options");
    const toggleButton = document.getElementById("fil-dropdown-btn");

    function openFilter() {
      if (hiddenContent.style.display === "none") {
        hiddenContent.style.display = "block";
      } else {
        hiddenContent.style.display = "none";
      }
    }

    function closeFilterIfOutside(event) {
      if (
        !hiddenContent.contains(event.target) &&
        event.target !== toggleButton
      ) {
        hiddenContent.style.display = "none";
      }
    }

    toggleButton.addEventListener("click", openFilter);
    document.addEventListener("click", closeFilterIfOutside);

    // Clean up event listeners on unmount
    return () => {
      toggleButton.removeEventListener("click", openFilter);
      document.removeEventListener("click", closeFilterIfOutside);
    };
  }, []); // Empty dependency array to run effect only once

  function filterObjects(c) {
    var x, i;
    x = document.getElementsByClassName("port-item");
    if (c === "all") c = "";
    for (i = 0; i < x.length; i++) {
      removeClass(x[i], "show1");
      if (x[i].className.indexOf(c) > -1) addClass(x[i], "show1");
    }
  }

  function addClass(element, name) {
    var i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
      if (arr1.indexOf(arr2[i]) === -1) {
        element.className += " " + arr2[i];
      }
    }
  }

  function removeClass(element, name) {
    var i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
      while (arr1.indexOf(arr2[i]) > -1) {
        arr1.splice(arr1.indexOf(arr2[i]), 1);
      }
    }
    element.className = arr1.join(" ");
  }

  const search = () => {
    const searchBox = document
      .getElementById("search-item")
      .value.toUpperCase();
    const cardList = document.getElementById("card-list");
    const cardItem = document.querySelectorAll(".port-item");
    const cardName = cardList.getElementsByTagName("h2");

    for (let i = 0; i < cardName.length; i++) {
      let match = cardItem[i].getElementsByTagName("h2")[0];

      if (match) {
        let textvalue = match.textContent || match.innerHTML;
        if (textvalue.toUpperCase().indexOf(searchBox) > -1) {
          cardItem[i].style.display = "";
        } else {
          cardItem[i].style.display = "none";
        }
      }
    }
  };

  return (
    <div className="filter">
      <div className="search-content">
        <form action="">
          <FaSearch size={14} />
          <input
            className="form-control"
            type="text"
            placeholder="Search after project..."
            onKeyUp={search}
            id="search-item"
          />
        </form>
      </div>
      <div className="dropdown">
        <button className="fil-dropdown-btn" id="fil-dropdown-btn">
          <FaArrowDownWideShort /> Filters
        </button>
        <ul
          className="fil-dropdown-menu"
          id="filter-options"
          style={{ display: "none" }}
        >
          <li>
            <a
              className="fil-dropdown-item"
              onClick={() => filterObjects("all")}
            >
              Show all
            </a>
          </li>
          <li>
            <a
              className="fil-dropdown-item"
              onClick={() => filterObjects("buttons")}
            >
              Buttons
            </a>
          </li>
          <li>
            <a
              className="fil-dropdown-item"
              onClick={() => filterObjects("cards")}
            >
              Cards
            </a>
          </li>
          <li>
            <a
              className="fil-dropdown-item"
              onClick={() => filterObjects("forms")}
            >
              Forms
            </a>
          </li>
          <li>
            <a
              className="fil-dropdown-item"
              onClick={() => filterObjects("images")}
            >
              Image
            </a>
          </li>
          <li>
            <a
              className="fil-dropdown-item"
              onClick={() => filterObjects("texts")}
            >
              Text
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Filter;
