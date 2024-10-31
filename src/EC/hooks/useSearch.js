
// src/EC/hooks/useSearch.js
import { useState, useEffect } from 'react';

const useSearch = (items) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query === '') {
      setResults([]);
      return;
    }

    // Correction de la syntaxe ici
    const filteredResults = items.filter(item => 
      item.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filteredResults);
  }, [query, items]);

  return { query, setQuery, results };
};

export default useSearch;
