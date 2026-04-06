import React, { useEffect, useRef } from 'react';
import './Navbar.css';

export default function Navbar() {
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY > 50) {
          navRef.current.classList.add('scrolled');
        } else {
          navRef.current.classList.remove('scrolled');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="navbar" ref={navRef}>
      <div className="nav-inner">
        <a href="#" className="nav-logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="#e8660a" strokeWidth="1.5" fill="none"/>
            <path d="M14 6l6 3.5v7L14 20l-6-3.5v-7L14 6z" fill="#e8660a" opacity="0.3"/>
            <path d="M14 10l3 1.75v3.5L14 17l-3-1.75v-3.5L14 10z" fill="#e8660a"/>
          </svg>
          <span className="logo-text">FINLYTICS</span>
        </a>
        <div className="nav-links">
          <a href="#product" className="nav-link">Product</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="#resources" className="nav-link">Resources</a>
          <a href="#signup" className="nav-cta">Sign Up</a>
        </div>
      </div>
    </nav>
  );
}
