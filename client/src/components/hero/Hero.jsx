import { Link } from "react-router-dom";
import "./Hero.scss";
import logoImage from "../../assets/img/logo/logo1.png";

function Hero() {
  return (
    <div className="hero">
      <div className="hero-nav">
        <div className="logo">
          <img className="header-logo" src={logoImage} alt="" />
        </div>
        <div className="navbar">
          <ul>
            <Link className="link" to="/blogs">
              <li>Blogs</li>
            </Link>
            <Link className="link" to="/projects">
              <li>Projects</li>
            </Link>
            <Link className="link" to="/podcasts">
              <li>Podcasts</li>
            </Link>
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
