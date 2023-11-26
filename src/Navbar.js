import React, { useState } from "react";
import "./styles/Navbar.css";

const Navbar = ({ token, handleLogin, handleLogout, isAdminLogin }) => {
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
      {!isAdminLogin ? (
        <ul className={`navbar-links ${isOpen ? "active" : ""}`}>
          <li className="navbar-item">
            <a href="#createAttendance" className="navbar-link">
              Home
            </a>
          </li>
          <li className="navbar-item">
            <a href="#groupchat" className="navbar-link">
              GroupChat
            </a>
          </li>
          <li className="navbar-item">
            <a href="#attendance_list" className="navbar-link">
              Attendance List
            </a>
          </li>
          <li className="navbar-item">
            <a href="#attendance_report" className="navbar-link">
              Attendance Report
            </a>
          </li>
        </ul>
      ) : (
        <ul></ul>
      )}

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

Navbar.defaultProps = {
  isAdminLogin: false, // Set your default value for the token prop
};

export default Navbar;
