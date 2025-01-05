import React, { useContext, useEffect, useState } from "react";
import "./Home.scss";
import Blog from "../../components/blog/Blog.jsx";
import ContactPop from "../../function/contactPop/ContactPop.jsx";
import Footer from "../../components/footer/Footer.jsx";
import Hero from "../../components/hero/Hero.jsx";
import { Link } from "react-router-dom";
import { FaUserLock } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { RingLoader } from "react-spinners";
import About from "../../components/about/About.jsx";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext.jsx";
import { FaHandshake } from "react-icons/fa6";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

function Home() {
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const { user, handleLogout } = useContext(AuthContext);
  const maxBlogsToShow = 2;
  const limitedBlogs = Array.isArray(blogs)
    ? blogs.slice(0, maxBlogsToShow)
    : [];

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${apiUrl}/blogs`)
      .then((response) => {
        setBlogs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      });
  }, []);

  const onLogout = async () => {
    try {
      await handleLogout();
      console.log("Bruger er logget ud!");
    } catch (error) {
      console.error("Fejl under logout:", error);
    }
  };

  return (
    <div className="home">
      {/* Admin Section */}
      {user && (
        <div className="admin">
          <Link to="/admin">
            <button>
              <FaUserLock size={17} />
              Admin
            </button>
          </Link>
          <button onClick={onLogout}>
            <IoLogOut size={17} />
            Logout
          </button>
        </div>
      )}

      {/* Hero Section */}
      <div className="home-hero">
        <Hero />
      </div>

      {/* About Section */}
      <div className="home-about">
        <About />
      </div>

      {/* Blogs Section */}
      <div className="home-blogs">
        <div className="home-blogs-title">
          <h2>Latest Blog</h2>
        </div>
        <div className="home-blogs-content">
          {loading && (
            <div className="loading-container loading-front">
              <RingLoader loading={loading} color="#06F9EC" size={100} />
            </div>
          )}
          {limitedBlogs.length > 0 &&
            limitedBlogs.map((blog) => (
              <Blog
                _id={blog._id}
                key={blog._id}
                title={blog.title}
                desc={blog.desc}
                tags={blog.tags}
                imageinfo={blog.imageinfo}
                author={blog.author}
                createdAt={blog.createdAt}
              />
            ))}
        </div>

        {/* View All Posts */}
        <div className="home-blogs-button" id="contact">
          <Link to="/blogs">
            <button className="btn">View All Posts</button>
          </Link>
        </div>

        {/* Contact Section */}
        <div className="section home-contact">
          <FaHandshake className="icon-contact" />
          <div className="home-contact-content">
            <h2>Make some work together?</h2>
            <h3>Let me contact you</h3>
          </div>
          <ContactPop />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;
