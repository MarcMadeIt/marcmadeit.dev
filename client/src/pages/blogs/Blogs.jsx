import React, { useEffect, useState } from "react";
import "./Blogs.scss";
import Blog from "../../components/blog/Blog";
import Footer from "../../components/footer/Footer.jsx";
import Header from "../../components/header/Header.jsx";
import Pagination from "../../function/pagination/Pagination.jsx";
import { RingLoader } from "react-spinners";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchPosts = async (page = currentPage) => {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/blog/getlimit?page=${page}`);
        const data = await response.json();
        setBlogs(data.blogs);
        setTotalCount(data.totalCount);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPosts();
  }, [currentPage]);

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      {loading && (
        <div className="loading-container">
          <RingLoader loading={loading} color="#06F9EC" size={100} />
        </div>
      )}
      <div className="blogs">
        <Header />
        <div className="blogs-content">
          {blogs.map((blog) => (
            <Blog
              key={blog._id}
              _id={blog._id}
              title={blog.title}
              desc={blog.desc}
              tags={blog.tags}
              imageinfo={blog.imageinfo}
              author={blog.author}
              createdAt={blog.createdAt}
            />
          ))}
        </div>
        <Pagination
          postsPerPage={postsPerPage}
          handlePagination={handlePagination}
          currentPage={currentPage}
          totalCount={totalCount}
        />
        <Footer />
      </div>
    </div>
  );
}

export default Blogs;
