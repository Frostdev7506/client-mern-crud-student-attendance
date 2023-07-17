import React, { useState } from "react";
import "./styles/Navbar.css";

const Navbar = ({ token, handleLogin, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogoutClick = () => {
    // Clear the token from local storage and call the logout function
    localStorage.removeItem("token");
    handleLogout();
  };
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h3>SAA</h3>
      </div>
      <div className="navbar-title">
        <h2>Student Attendance</h2>
      </div>
      <div
        className={`navbar-toggle ${isOpen ? "open" : ""}`}
        onClick={toggleNavbar}
      >
        <span className="toggle-icon"></span>
        <span className="toggle-icon"></span>
        <span className="toggle-icon"></span>
      </div>
      <ul className={`navbar-links ${isOpen ? "active" : ""}`}>
        <li className="navbar-item">
          <a href="#home" className="navbar-link">
            Home
          </a>
        </li>
        <li className="navbar-item">
          <a href="#about" className="navbar-link">
            About
          </a>
        </li>
        <li className="navbar-item">
          <a href="#services" className="navbar-link">
            Teacher-portal
          </a>
        </li>
        <li className="navbar-item">
          <a href="#contact" className="navbar-link">
            Contact
          </a>
        </li>
      </ul>
      {token ? (
        <button className="toggle logout" onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <p></p>
      )}
    </nav>
  );
};

export default Navbar;
