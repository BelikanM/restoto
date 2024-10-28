// src/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUpload, faComment } from '@fortawesome/free-solid-svg-icons';
import './NavBar.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <span className="logo-text">Starviews</span>
          <span className="logo-star">&#9733;</span>
        </Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">
            <FontAwesomeIcon icon={faHome} />
          </Link>
        </li>
        <li>
          <Link to="/upload">
            <FontAwesomeIcon icon={faUpload} />
          </Link>
        </li>
        <li>
          <Link to="/chat">
            <FontAwesomeIcon icon={faComment} />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
