import React from "react";
import "./styles/Footer.css";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <footer>
        <div
          style={{
            zIndex: "2",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {" "}
          {/* Back to Top button */}
          <button
            className="foitem"
            style={{
              justifySelf: "end",
              border: "1px soild black",
              borderRadius: "20px",
            }}
            onClick={scrollToTop}
          >
            Top
          </button>
        </div>
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
