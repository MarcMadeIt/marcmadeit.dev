import React, { useContext, useEffect, useState } from "react";
import "./Home.scss";
import Blog from "../../components/blog/Blog.jsx";
import ContactPop from "../../function/contactPop/ContactPop.jsx";
import Footer from "../../components/footer/Footer.jsx";
import Hero from "../../components/hero/Hero.jsx";
import { Link } from "react-router-dom";
import HomeImage from "../../assets/img/content/cat.png";
import { UserContext } from "../../data/userContext.jsx";
import { FaUserLock } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";

function Home() {
  const [blogs, setBlogs] = useState([]);
  const maxBlogsToShow = 2;
  const limitedBlogs = Array.isArray(blogs)
    ? blogs.slice(0, maxBlogsToShow)
    : [];

  useEffect(() => {
    fetch("http://localhost:8000/api/blog/get")
      .then((response) => response.json())
      .then((blogs) => {
        setBlogs(blogs);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
      });
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

      <div className="home-blogs">
        <div className="home-blogs-title">
          <h2>Latest Blog Post </h2>
        </div>
        <div className="home-blogs-content">
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
            <button>View All Posts</button>
          </Link>
        </div>
      </div>
      <div className="section home-contact" id="contact">
        <h2>Elevating Web Development Together!</h2>
        <ContactPop />
      </div>
      <Footer />
    </div>
  );
}

export default Home;
