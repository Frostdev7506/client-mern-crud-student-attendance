import React, { useState } from "react";
import "./styles/Footer.css";

const Footer = () => {
  return (
    <>
      <footer>
        <div className="footer">
          <ul className="fcontainer">
            <li className="foitem">Teacher-portal</li>
            <li className="foitem">About</li>
            <li className="foitem">Contact</li>
          </ul>
        </div>
      </footer>
    </>
  );
};

export default Footer;
