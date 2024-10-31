
// src/EC/e-commerce.js
import React from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ProductList from './components/ProductList/ProductList';
import Cart from './components/Cart/Cart';
import Checkout from './components/Checkout/Checkout';
import UserProfile from './components/UserProfile/UserProfile';
import OrderHistory from './components/OrderHistory/OrderHistory';
import SearchBar from './components/SearchBar/SearchBar';
import NotFound from './components/NotFound/NotFound';

const ECommerce = () => {
  return (
    <div>
      <Header />
      <SearchBar />
      <ProductList />
      <Cart />
      <Checkout />
      <UserProfile />
      <OrderHistory />
      <Footer />
    </div>
  );
};

export default ECommerce;
