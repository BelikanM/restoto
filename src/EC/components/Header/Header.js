
// src/EC/components/Header/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import useSearch from '../../hooks/useSearch';
import './Header.css';  // Assurez-vous d'ajouter des styles si nécessaire

const Header = () => {
  const pages = ["Produits", "Panier", "Checkout", "Historique des commandes"]; // Liste des pages
  const { query, setQuery, results } = useSearch(pages);

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center flex-wrap">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold">
            Moutouki
          </Link>
        </div>

        {/* Barre de recherche */}
        <div className="relative flex flex-grow mx-4 mt-2">
          <input 
            type="text" 
            placeholder="Rechercher des produits ou pages..." 
            className="flex-grow p-2 rounded-l-lg focus:outline-none" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="bg-blue-500 p-2 rounded-r-lg text-white hover:bg-blue-700">
            🔍
          </button>
          {results.length > 0 && (
            <div className="absolute z-10 bg-white text-black mt-1 rounded shadow-lg">
              {results.map((result, index) => (
                <Link 
                  key={index} 
                  to={`/${result.toLowerCase().replace(/\s+/g, '-')}`} 
                  className="block px-4 py-2 hover:bg-blue-100"
                  onClick={() => setQuery('')} // Réinitialiser la recherche après un clic
                >
                  {result}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Navigation principale */}
        <nav className="w-full md:w-auto mt-2">
          <ul className="flex flex-col md:flex-row md:space-x-6">
            <li>
              <Link to="/products" className="hover:text-blue-300">Produits</Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-blue-300">Panier</Link>
            </li>
            <li>
              <Link to="/checkout" className="hover:text-blue-300">Checkout</Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-blue-300">Historique des commandes</Link>
            </li>
          </ul>
        </nav>

        {/* Icônes utilisateur */}
        <div className="flex items-center space-x-4 mt-2">
          <Link to="/wishlist" className="hover:text-blue-300" title="Wishlist">❤️</Link>
          <Link to="/cart" className="hover:text-blue-300" title="Panier">🛒</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
