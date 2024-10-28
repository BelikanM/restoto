// Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaInfo, FaEnvelope, FaFileAlt, FaLock } from 'react-icons/fa';

function Footer() {
  return (
    <footer>
      <nav>
        <ul>
          <li><Link to="/about"><FaInfo /> À propos</Link></li>
          <li><Link to="/contact"><FaEnvelope /> Contact</Link></li>
          <li><Link to="/terms"><FaFileAlt /> Conditions d'utilisation</Link></li>
          <li><Link to="/privacy"><FaLock /> Politique de confidentialité</Link></li>
        </ul>
      </nav>
      <p>&copy; 2024 Cafétéria en Ligne. Tous droits réservés.</p>
    </footer>
  );
}

export default Footer;
