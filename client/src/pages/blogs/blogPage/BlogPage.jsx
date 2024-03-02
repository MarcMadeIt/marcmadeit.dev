import React, { useEffect, useState } from "react";
import "./BlogPage.scss";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import Header from "../../../components/header/Header.jsx";
import Footer from "../../../components/footer/Footer.jsx";
import ProfilePic from "../../../assets/img/profile/profile-small.png";
//import { UserContext } from "../../../data/userContext.jsx";
//import { FaPencilAlt } from "react-icons/fa";
import ImageBlog from "../../../components/image/ImageBlog.jsx";
import { RingLoader } from "react-spinners";

const apiUrl = import.meta.env.VITE_API_BASE_URL;
function BlogPage() {
  const [blogInfo, setBlogInfo] = useState(null);
  //const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);

      fetch(`${apiUrl}/blog/get/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((blogInfo) => {
          setBlogInfo(blogInfo);
        })
        .catch((error) => {
          console.error("Error fetching blog:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <RingLoader loading={loading} color="#06F9EC" size={100} />
      </div>
    );
  }
  return (
    <div className="blog-page">
      <Header />
      <div className="blogpage-blog">
        <div className="blogpage-title">
          <h3>{blogInfo.title}</h3>
        </div>
        <div className="blogpage-tags">
          {blogInfo.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
          {/*userInfo.id === blogInfo.author._id && (
            <Link className="blodpage-edit" to={`/edit/${blogInfo._id}`}>
              <button>
                <FaPencilAlt />
                Edit blog
              </button>
            </Link>
          )*/}
        </div>

        <div className="blogpage-image">
          <ImageBlog className="blogpage-img" src={blogInfo.imageinfo} />
        </div>
        <div className="blogpage-details">
          {blogInfo.author && (
            <div className="by-author">
              <span>
                <img src={ProfilePic} alt="" />
              </span>
              <span> Made by</span>
              &nbsp;
              <span>{blogInfo.author.username}</span>
            </div>
          )}
          <div className="time">
            <span>{format(new Date(blogInfo.createdAt), "dd. MMM yyyy")}</span>
          </div>
        </div>
        <div className="blogpage-summary">
          <p>{blogInfo.desc}</p>
        </div>
        <hr />
        <div className="blogpage-content">
          <div
            className="blogpage-item"
            dangerouslySetInnerHTML={{ __html: blogInfo.content }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BlogPage;
