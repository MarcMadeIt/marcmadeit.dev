import React from "react";
import ProfileImage from "../../assets/img/profile/profile-small.png";
import FlagImage from "../../assets/img/content/denmark.png";
import "./About.scss";
import { BiLogoMongodb, BiLogoTypescript } from "react-icons/bi";

function About() {
  return (
    <div className="about">
      <div className="about-one">
        <div className="about-img">
          <img src={ProfileImage} alt="" />
        </div>
      </div>
      <div className="about-two">
        <div className="about-header">
          <h1>Who made this?</h1>
        </div>
        <div className="about-content">
          <div className="about-details">
            <h2>
              Marc Møller <hr /> 31 years <hr /> Denmark{" "}
              <img src={FlagImage} alt="" />
            </h2>
          </div>
          <div className="prof">
            <h2 className="prof-title">Fullstack Developer</h2>

            <div className="skills">
              <div className="skills-item">#React</div>
              <div className="skills-item">#Next</div>
              <div className="skills-item">#Node</div>
              <div className="skills-item">#Nest</div>
              <div className="skills-item">#MySQL</div>
              <div className="skills-item">#PostgresSQL</div>
              <div className="skills-item">#Express</div>
              <div className="skills-item">#MongoDB</div>
              <div className="skills-item">#NeonDB</div>
              <div className="skills-item">#Prisma</div>
              <div className="skills-item">#CSS</div>{" "}
              <div className="skills-item">#SASS</div>
              <div className="skills-item">#Tailwind</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
