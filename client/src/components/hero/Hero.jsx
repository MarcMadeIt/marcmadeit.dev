import { Link } from "react-router-dom";
import "./Hero.scss";

function Hero() {
  return (
    <div className="hero">
      <div className="hero-nav">
        <div className="logo">
          <img
            className="header-logo"
            src="src/assets/img/logo/logo-mmi-single.png"
            alt=""
          />
        </div>
        <div className="navbar">
          <ul>
            <Link className="link" to="/blogs">
              <li>Blogs</li>
            </Link>
            <Link className="link" to="/library">
              <li>Library</li>
            </Link>
            <li>Socials</li>
            <a className="link" href="#contact">
              <li>Contact</li>
            </a>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Hero;
