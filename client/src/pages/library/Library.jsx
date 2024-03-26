import React from "react";
import "./Library.scss";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Card from "../../components/card/Card";
import Filter from "../../components/filter/Filter.jsx";

function Library() {
  return (
    <div className="library">
      <Header />
      <div className="library-title">
        <h2>Library</h2>
      </div>
      <div className="library-filter">
        <Filter />
      </div>
      <div className="library-content">
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
      <Footer />
    </div>
  );
}

export default Library;
