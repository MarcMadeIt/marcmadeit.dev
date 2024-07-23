import React from "react";
import "./Blog.scss";
import { format } from "date-fns";
import ProfilePic from "../../assets/img/profile/profile-small.png";
import ImageBlog from "../image/ImageBlog";
import { Link } from "react-router-dom";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function truncateText(text, limit) {
  if (typeof text !== "string") {
    return "";
  }

  const words = text.split(" ");
  return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
}

function Blog({ _id, title, desc, tags = [], imageinfo, createdAt, author }) {
  const truncatedDesc = truncateText(desc, 17);

  return (
    <Link className="link" to={`/blogs/blog/${_id}`}>
      <div className="blog post">
        <div className="blog-image">
          {imageinfo ? <ImageBlog src={imageinfo} /> : <Skeleton height={200} />}
        </div>
        <div className="blog-content">
          <div className="blog-tags">
            {tags.length ? tags.map((tag, index) => (
              <span key={`${_id}-${index}-${tag}`}>{`#${tag}`}</span>
            )) : <Skeleton width={100} />}
          </div>
          <div className="blog-title">
            {title || <Skeleton width={200} />}
          </div>
          <div className="blog-desc">
            <p>{desc ? truncatedDesc : <Skeleton count={2} />}</p>
          </div>
          <div className="blog-details">
            <div className="by-author">
              {author ? (
                <>
                  <span>
                    <img src={ProfilePic} alt="alt" />
                  </span>
                  <span> Made by</span>
                  <span>{author.username}</span>
                </>
              ) : (
                <Skeleton width={150} />
              )}
            </div>
            <div className="blog-time">
              {createdAt ? <span>{format(new Date(createdAt), "dd. MMM yyyy")}</span> : <Skeleton width={80} />}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Blog;
