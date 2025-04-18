import "./Podcast.scss";
import { format } from "date-fns";
import Image from "../image/Image";
import ProfilePic from "../../assets/img/profile/profile-small.png";
import { Link } from "react-router-dom";

function truncateText(text, limit) {
  if (typeof text !== "string") {
    return "";
  }

  const words = text.split(" ");
  return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
}

function Podcast({ _id, title, desc, tags = [], imageinfo, createdAt, author, onClick}) {
  const truncatedDesc = truncateText(desc, 4);

  return (
      <div className="podcast" onClick={onClick}>
        <div className="podcast-image">
            <Image src={imageinfo} />
        </div>
        <div className="podcast-content">
            <div className="podcast-title">
                <h3>{title}</h3>
            </div>
            <div className="podcast-desc">
            <span>{truncatedDesc}</span>
            </div>
            <div className="podcast-tags">
                {tags.map((tag, index) => (
                    <span key={`${_id}-${index}-${tag}`}>{`#${tag}`}</span>
                ))}
            </div>
        <div className="podcast-info">
        <div className="by-author">
              <>
                <span>
                  <img src={ProfilePic} alt="alt" />
                </span>
                <span> Made by</span>
                {author && <span>{author.username}</span>}
              </>
            </div>
            <div className="podcast-time">
              <span>{format(new Date(createdAt), "dd. MMM yyyy")}</span>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Podcast;

