import React, { useContext, useState } from "react";
import "./Settings.scss";
import {
  IoChevronBack,
  IoChevronForward,
  IoDocumentAttachOutline,
  IoEaselOutline,
  IoFileTrayFullOutline,
  IoPersonOutline,
} from "react-icons/io5";
import AccountSet from "./accountSet/AccountSet.jsx";
import ViewBlogs from "./viewBlogs/ViewBlogs.jsx";
import ViewProjects from "./viewProjects/ViewProjects.jsx";
import ViewPodcasts from "./viewPodcasts/ViewPodcasts.jsx";
import { FaPodcast } from "react-icons/fa6";
import { AuthContext } from "../../../context/AuthContext.jsx";

const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
function Settings() {
  const { user, handleLogout } = useContext(AuthContext);

  const [currentLayout, setCurrentLayout] = useState("mainMenu");

  const switchLayout = (layout) => {
    setCurrentLayout(layout);
  };

  const onLogout = async () => {
    try {
      await handleLogout();
      console.log("Bruger er logget ud!");
    } catch (error) {
      console.error("Fejl under logout:", error);
    }
  };

  return (
    <>
      <div className="settings">
        {currentLayout === "mainMenu" && (
          <div className="set-content">
            <button
              className="set-item"
              onClick={() => switchLayout("accountSet")}
            >
              <div className="set-item-left">
                <IoPersonOutline fontSize={20} />
                <span>Account Settings</span>
              </div>
              <IoChevronForward fontSize={25} />
            </button>
            <button
              className="set-item"
              onClick={() => switchLayout("viewBlogs")}
            >
              <div className="set-item-left">
                <IoDocumentAttachOutline fontSize={20} />
                <span>View & Edit Blogs</span>
              </div>
              <IoChevronForward fontSize={25} />
            </button>
            <button
              className="set-item"
              onClick={() => switchLayout("viewProjects")}
            >
              <div className="set-item-left">
                <IoEaselOutline fontSize={20} />
                <span>View & Edit Projects</span>
              </div>
              <IoChevronForward fontSize={25} />
            </button>
            <button
              className="set-item"
              onClick={() => switchLayout("viewPodcasts")}
            >
              <div className="set-item-left">
                <FaPodcast fontSize={20} />
                <span>View & Edit Podcasts</span>
              </div>
              <IoChevronForward fontSize={25} />
            </button>
            <button
              className="set-item"
              onClick={() => switchLayout("viewLibrary")}
            >
              <div className="set-item-left">
                <IoFileTrayFullOutline fontSize={20} />
                <span>View & Edit Library</span>
              </div>
              <IoChevronForward fontSize={25} />
            </button>

            <button className="btn-setting-logout" onClick={onLogout}>
              Log out
            </button>
          </div>
        )}
        {currentLayout !== "mainMenu" && (
          <div className="back-button" onClick={() => switchLayout("mainMenu")}>
            <IoChevronBack fontSize={28} />
          </div>
        )}
        <div className="layout-container">
          {currentLayout === "accountSet" && <AccountSet />}
          {currentLayout === "viewBlogs" && <ViewBlogs />}
          {currentLayout === "viewProjects" && <ViewProjects />}
          {currentLayout === "viewPodcasts" && <ViewPodcasts />}
        </div>
      </div>
    </>
  );
}

export default Settings;
