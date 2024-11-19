import React, { useContext, useEffect, useState } from "react";
import "./Home.scss";
import Blog from "../../components/blog/Blog.jsx";
import ContactPop from "../../function/contactPop/ContactPop.jsx";
import Footer from "../../components/footer/Footer.jsx";
import Hero from "../../components/hero/Hero.jsx";
import { Link } from "react-router-dom";
import { UserContext } from "../../data/userContext.jsx";
import { FaUserLock } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { RingLoader } from "react-spinners";
import Skills from "../../components/about/About.jsx";
import About from "../../components/about/About.jsx";
import { FaPhone } from "react-icons/fa6";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

function Home() {
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const maxBlogsToShow = 2;
  const limitedBlogs = Array.isArray(blogs)
    ? blogs.slice(0, maxBlogsToShow)
    : [];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      fetch(`${apiUrl}/blog/get`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((blogs) => {
          setBlogs(blogs);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching blogs:", error);
          setLoading(false);
        });
    }, 2000); // 2 seconds delay
  }, []);

  const { userInfo, handleLogout } = useContext(UserContext);

  const username = userInfo?.username;

  return (
    <div className="home">
      {username && (
        <div className="admin">
          <Link to="/admin">
            <button>
              <FaUserLock size={17} />
              Admin
            </button>
          </Link>
          <button onClick={handleLogout}>
            <IoLogOut size={17} />
            Logout
          </button>
        </div>
      )}
      <div className="home-hero">
        <Hero />
      </div>
      <div className="home-about" id="contact">
        <About />
      </div>

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

        <div className="home-blogs-button">
          <Link to="/blogs">
            <button className="btn">View All Posts</button>
          </Link>
        </div>
        <div className="section home-contact">
          <h2>Make some work together?</h2>

          <h3>Let me contact you</h3>
          <ContactPop />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
