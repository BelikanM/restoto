// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
// Importez d'autres composants nécessaires
import Home from './pages/Home';
import Menu from './pages/Menu';
// Supprimez l'importation de Order
// import Order from './pages/Order';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
// Supprimez l'importation de TrackOrder si ce n'est pas fait
// import TrackOrder from './pages/TrackOrder'; // Commenté ou supprimé
import Login from './pages/Login';
import Signup from './pages/Signup';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        {/* Supprimez la ligne pour la commande */}
        {/* <Route path="/order" element={<Order />} /> */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        {/* Supprimez la ligne pour le suivi de commande */}
        {/* <Route path="/track-order" element={<TrackOrder />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
};

export default App;
