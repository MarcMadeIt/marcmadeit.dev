import React, { useContext, useState } from "react";
import "./Settings.scss";
import {
  IoChevronBack,
  IoChevronForward,
  IoDocumentAttachOutline,
  IoPaperPlaneOutline,
  IoPersonOutline,
  IoRadioOutline,
} from "react-icons/io5";
import AccountSet from "./accountSet/AccountSet.jsx";
import ViewBlogs from "./viewBlogs/ViewBlogs.jsx";
import ViewLibrary from "./viewLibrary/ViewLibrary.jsx";
import Extra from "./extra/Exstra.jsx";
import { UserContext } from "../../../data/userContext";

const apiUrl = process.env.BASE_URL || "http://localhost:8000";

function Settings() {
  const { userInfo, setUserInfo } = useContext(UserContext);

  function logout() {
    fetch(`${apiUrl}/logout`, {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
  }

  const [currentLayout, setCurrentLayout] = useState("mainMenu");

  const switchLayout = (layout) => {
    setCurrentLayout(layout);
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
              onClick={() => switchLayout("viewLibrary")}
            >
              <div className="set-item-left">
                <IoPaperPlaneOutline fontSize={20} />
                <span>View & Edit Library</span>
              </div>
              <IoChevronForward fontSize={25} />
            </button>
            <button className="set-item" onClick={() => switchLayout("extra")}>
              <div className="set-item-left">
                <IoRadioOutline fontSize={20} />
                <span>New</span>
              </div>
              <IoChevronForward fontSize={25} />
            </button>
            <button className="btn-setting-logout" onClick={logout}>
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
          {currentLayout === "viewLibrary" && <ViewLibrary />}
          {currentLayout === "extra" && <Extra />}
        </div>
      </div>
    </>
  );
}

export default Settings;
