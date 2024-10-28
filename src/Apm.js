import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';
import RecipeStreaming from './RecipeStreaming';
import RecipeDetails from './RecipeDetails';
import ChefProfile from './ChefProfile';
import Cart from './Cart';
import Checkout from './Checkout';
import PaymentConfirmation from './PaymentConfirmation';
import Login from './Login';
import Signup from './Signup';
import UserProfile from './UserProfile';
import OrderHistory from './OrderHistory';
import LiveChat from './LiveChat';
import Footer from './Footer';

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/streaming">Recipe Streaming</Link></li>
          <li><Link to="/cart">Cart</Link></li>
          <li><Link to="/checkout">Checkout</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Signup</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/orders">Order History</Link></li>
          <li><Link to="/chat">Live Chat</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/streaming" element={<RecipeStreaming />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
        <Route path="/chef/:id" element={<ChefProfile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/chat" element={<LiveChat />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
