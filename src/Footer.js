// Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaHome, FaUser } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <nav className="footer-nav">
        <Link to="/search" className="footer-icon">
          <FaSearch />
        </Link>
        <Link to="/" className="footer-icon home-icon">
          <FaHome />
        </Link>
        <Link to="/profile" className="footer-icon">
          <FaUser />
        </Link>
      </nav>
    </footer>
  );
};

export default Footer;
