
// src/EC/components/SearchBar/SearchBar.js
import React from 'react';
import './SearchBar.css';

const SearchBar = () => {
  return (
    <div className="search-bar">
      <input type="text" placeholder="Search products..." />
      <button>Search</button>
    </div>
  );
};

export default SearchBar;
