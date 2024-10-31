// components/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HomeIcon,
  MenuIcon,
  ShoppingCartIcon,
  UserIcon,
  LoginIcon,
  ChatIcon, // Assurez-vous d'importer une icône appropriée pour le chat
  XIcon,
} from '@heroicons/react/outline';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <div className="text-2xl font-bold text-yellow-400 flex-shrink-0">
          <Link to="/" className="flex items-center space-x-2">
            <span role="img" aria-label="logo">🍽️</span>
            <span>MonResto</span>
          </Link>
        </div>

        {/* Navigation Links - Desktop */}
        <nav className="hidden lg:flex space-x-6 text-lg">
          <NavItem to="/" icon={<HomeIcon className="w-5 h-5" />} label="Accueil" />
          <NavItem to="/menu" icon={<MenuIcon className="w-5 h-5" />} label="Menu" />
          <NavItem to="/cart" icon={<ShoppingCartIcon className="w-5 h-5" />} label="Panier" />
          <NavItem to="/profile" icon={<UserIcon className="w-5 h-5" />} label="Profil" />
          <NavItem to="/login" icon={<LoginIcon className="w-5 h-5" />} label="Connexion" />
          <NavItem to="/signup" icon={<UserIcon className="w-5 h-5" />} label="Inscription" />
          <NavItem to="/chat" icon={<ChatIcon className="w-5 h-5" />} label="Chat" /> {/* Nouveau lien */}
        </nav>

        {/* Menu Button - Mobile */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-yellow-400 focus:outline-none"
          >
            {isMenuOpen ? <XIcon className="w-8 h-8" /> : <MenuIcon className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-gray-800 p-4 rounded-lg shadow-md mt-2">
          <nav className="space-y-4">
            <NavItem to="/" label="Accueil" onClick={() => setIsMenuOpen(false)} />
            <NavItem to="/menu" label="Menu" onClick={() => setIsMenuOpen(false)} />
            <NavItem to="/cart" label="Panier" onClick={() => setIsMenuOpen(false)} />
            <NavItem to="/profile" label="Profil" onClick={() => setIsMenuOpen(false)} />
            <NavItem to="/login" label="Connexion" onClick={() => setIsMenuOpen(false)} />
            <NavItem to="/signup" label="Inscription" onClick={() => setIsMenuOpen(false)} />
            <NavItem to="/chat" label="Chat" onClick={() => setIsMenuOpen(false)} /> {/* Nouveau lien */}
          </nav>
        </div>
      )}
    </header>
  );
};

// Sous-composant pour les liens de navigation
const NavItem = ({ to, icon, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center space-x-2 text-lg hover:text-yellow-400"
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export default Header;
