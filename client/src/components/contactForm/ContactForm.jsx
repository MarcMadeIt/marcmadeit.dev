import React, { useRef, useState } from "react";
import "./ContactForm.scss";
import { IoCheckmarkCircle } from "react-icons/io5";
import emailjs from "emailjs-com";

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");

  const validateName = () => {
    const nameValue = name.trim();

    if (nameValue.length === 0) {
      setNameError("Name is Required");
      return false;
    }

    if (
      !nameValue.match(
        /^[A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff]+(\s+[A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff]+)+$/
      )
    ) {
      setNameError("Write your full name");
      return false;
    }

    setNameError("");
    return true;
  };

  const validatePhone = () => {
    const phoneValue = phone.trim();

    if (phoneValue.length === 0) {
      setPhoneError("Phone number is Required");
      return false;
    }

    if (phoneValue.length !== 8 && phoneValue.length !== 10) {
      setPhoneError("Number should be 8 or 10 digits");
      return false;
    }

    if (!phoneValue.match(/^[0-9]+$/)) {
      setPhoneError("Should only contain digits");
      return false;
    }

    setPhoneError("");
    return true;
  };

  const validateEmail = () => {
    const emailValue = email.trim();

    if (emailValue.length === 0) {
      setEmailError("Email is Required");
      return false;
    }

    if (
      !emailValue.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/)
    ) {
      setEmailError("Invalid Email");
      return false;
    }

    setEmailError("");
    return true;
  };

  const formRef = useRef();

  const sendMail = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Your existing code for form validation and sending mail
    var isNameValid = validateName();
    var isPhoneValid = validatePhone();
    var isEmailValid = validateEmail();

    if (isNameValid && isPhoneValid && isEmailValid) {
      // Use state variables directly
      var params = {
        from_name: name,
        email: email,
        phone: phone,
        message: message,
      };

      // Mockup for emailjs.send
      console.log("Sending mail with params:", params);

      // Clear form and reset checkmarks
      formRef.current.reset();
      document
        .getElementById("name-check")
        .classList.remove("fa-solid", "fa-circle-check");
      document
        .getElementById("email-check")
        .classList.remove("fa-solid", "fa-circle-check");
      document
        .getElementById("phone-check")
        .classList.remove("fa-solid", "fa-circle-check");

      setName("");
      setEmail("");
      setPhone("");
      setMessage("");

      // Reset error messages
      setNameError("");
      setEmailError("");
      setPhoneError("");
      // Set form submission status and message
      setFormSubmitted(true);
      setSubmissionMessage("Form submitted successfully!");
    }
    emailjs
      .sendForm(
        "service_yy2bypk",
        "template_968580q",
        formRef.current,
        "7bsjMO5YLdWNBa6Oq"
      )
      .then(
        (result) => {
          // console.log(result.text);
          formRef.current.reset();
          setName("");
          setEmail("");
          setPhone("");
          setMessage("");
          setFormSubmitted(true);
          setSubmissionMessage("Form submitted successfully!");
        },
        (error) => {
          // console.log(error.text);

          setFormSubmitted(true);
          setSubmissionMessage("Form submission failed. Please try again.");
        }
      );
  };

  return (
    <div className="contact-form">
      <div className="contact-form-content">
        <form ref={formRef} onSubmit={sendMail}>
          <h3>Contact Form</h3>
          <div className="input-group">
            <input
              type="text"
              id="name"
              name="from_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
            />
            {name.length > 0 &&
            !name.match(
              /^[A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff]+(\s+[A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff]+)+$/
            ) ? (
              <span className="error-message">Write your full name</span>
            ) : null}
            {!nameError &&
              name.length > 0 &&
              name.match(
                /^[A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff]+(\s+[A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff]+)+$/
              ) && (
                <i id="name-check">
                  <IoCheckmarkCircle color={"#06F9EC"} size={"17px"} />
                </i>
              )}
          </div>
          <div className="input-group">
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
            />
            {email.length > 0 &&
            !email.match(
              /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/
            ) ? (
              <span className="error-message">Invalid Email</span>
            ) : null}
            {!emailError &&
              email.length > 0 &&
              email.match(
                /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/
              ) && (
                <i id="email-check">
                  <IoCheckmarkCircle color={"#06F9EC"} size={"17px"} />
                </i>
              )}
          </div>
          <div className="input-group">
            <input
              type="text"
              id="phone"
              name="phone"
              value={phone}
              placeholder="Mobile Number"
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            {phone.length > 0 &&
            (!phone.match(/^[0-9+]+$/) ||
              phone.length < 6 ||
              phone.length > 11) ? (
              <span className="error-message">invalid Phone Number</span>
            ) : null}
            {!phoneError &&
              phone.length >= 6 &&
              phone.length <= 11 &&
              phone.match(/^[0-9+]+$/) && (
                <i id="phone-check">
                  <IoCheckmarkCircle color={"#06F9EC"} size={"17px"} />
                </i>
              )}
          </div>
          <div className="input-group">
            <textarea
              placeholder="What can I help you with?"
              name="message"
              id="message"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          <button type="submit">Send</button>
          {formSubmitted && <p>{submissionMessage}</p>}
        </form>
      </div>
    </div>
  );
}

export default ContactForm;
