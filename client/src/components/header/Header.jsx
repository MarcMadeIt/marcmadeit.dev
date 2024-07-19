import "./Header.scss";
import logoImageName from "../../assets/img/logo/LOGO-name.png";
import logoImage from "../../assets/img/logo/logo1.png";
import { Link, useLocation } from "react-router-dom";
import { MdArrowBackIosNew } from "react-icons/md";
import Sidebar from "../sidebar/Sidebar.jsx";

function Header() {
  const location = useLocation();

  const isOnSingleBlogPage = location.pathname.includes("/blogs/blog");

  return (
    <div className="header">
      {isOnSingleBlogPage ? (
        <span>
          <Link to={"/blogs"} className="link">
            <MdArrowBackIosNew fontSize={30} />
          </Link>
        </span>
      ) : (
        <span>
          <Link to={"/"} className="link">
            <MdArrowBackIosNew fontSize={30} />
          </Link>
        </span>
      )}

      <Link to={"/"} className="link">
        <img className="header-logo-name" src={logoImageName} alt="" />
        <img className="header-logo" src={logoImage} alt="" />
      </Link>
      <div className="navbar-sidebar">
        <Sidebar />
      </div>
    </div>
  );
}

export default Header;
