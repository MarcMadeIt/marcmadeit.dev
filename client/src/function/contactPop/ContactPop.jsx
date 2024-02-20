import React, { useState } from "react";
import ContactForm from "../../components/contactForm/ContactForm.jsx";
import "./ContactPop.scss";

function ContactPop() {
  const [isPopupVisible, setPopupVisible] = useState(false);

  const handleButtonClick = () => {
    setPopupVisible(true);
  };

  const handlePopupClose = () => {
    setPopupVisible(false);
  };

  return (
    <div className="contact-popup">
      <button className="contact-btn" onClick={handleButtonClick}>
        Let's talk
      </button>

      {isPopupVisible && (
        <div className="popup-content">
          <div className="popup-item">
            <span className="close" onClick={handlePopupClose}>
              &times;
            </span>
            <ContactForm />
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactPop;
