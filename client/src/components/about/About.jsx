import React from 'react'
import ProfileImage from '../../assets/img/profile/profile-small.png'
import FlagImage from '../../assets/img/content/denmark.png'
import "./About.scss"
import { BiLogoMongodb, BiLogoTypescript } from "react-icons/bi";

function About() {
  return (
    <div className='about'>
        <div className="about-one">
            <div className="about-img">
                <img src={ProfileImage} alt="" />
            </div>
        </div>
        <div className="about-two">
            <div className="about-header">
                <h1>Who made it?</h1>
            </div>
            <div className="about-content">
                <div className="about-details">
                    <h2>Marc Møller <span>|</span> 31 years <span>|</span> Denmark <img src={FlagImage} alt="" /></h2>
                </div>
                <div className="prof">
                    <h2 className='prof-title'>React Developer</h2>
                    <hr />
                    <div className="skills">
                        <div className="skills-item">#NextJS</div>
                        <div className="skills-item">#TypeScript</div>
                        <div className="skills-item">#JavaScript</div>
                        <div className="skills-item">#MySQL</div>
                        <div className="skills-item">#MongoDB</div>
                        <div className="skills-item">#Express</div>
                        <div className="skills-item">#NodeJS</div>
                        <div className="skills-item">#Sass</div>
                        <div className="skills-item">#Tailwind</div>
                    </div>
                </div>
            </div>
        </div>

    </div>
  )
}

export default About