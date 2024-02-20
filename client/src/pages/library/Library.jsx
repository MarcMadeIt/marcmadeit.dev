import React from "react";
import "./Library.scss";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

function Library() {
  return (
    <div className="library">
      <Header />
      <div className="library-title">
        <h2>Library</h2>
      </div>
      <Footer />
    </div>
  );
}

export default Library;
