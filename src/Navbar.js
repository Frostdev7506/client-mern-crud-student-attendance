import React, { useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h3>SAA</h3>
      </div>
      <div>
        <h2>Student Attendance App</h2>
      </div>
      <ul className={isOpen ? "navbar-links active" : "navbar-links"}>
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
            Services
          </a>
        </li>
        <li className="navbar-item">
          <a href="#contact" className="navbar-link">
            Contact
          </a>
        </li>
      </ul>
      <div className="navbar-toggle" onClick={toggleNavbar}>
        <span className={isOpen ? "toggle-icon open" : "toggle-icon"}></span>
      </div>
    </nav>
  );
};

export default Navbar;
