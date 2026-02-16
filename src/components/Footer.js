// src/components/Footer.js
import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-left">Thingoo</div>

        <div className="footer-right">
          <div className="footer-links">
            <span>как работает</span>
            <span>поддержка</span>
          </div>

          <div className="footer-social">
            <span>📷</span>
            <span>in</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
