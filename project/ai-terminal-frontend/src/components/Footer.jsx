import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">FINLYTICS</span>
          <p className="footer-tagline">An AI-powered Bloomberg Terminal for the next generation.</p>
        </div>

        <div className="footer-links-grid">
          <div className="footer-col">
            <h4>Product</h4>
            <a href="#">AI Analysis</a>
            <a href="#">Chart Scanner</a>
            <a href="#">Smart Alerts</a>
            <a href="#">Portfolio Tracker</a>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Careers</a>
            <a href="#">Blog</a>
            <a href="#">Press</a>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <a href="#">Documentation</a>
            <a href="#">API</a>
            <a href="#">Community</a>
            <a href="#">Support</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Finlytics. All rights reserved.</span>
        <div className="footer-legal">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </div>
    </footer>
  );
}
