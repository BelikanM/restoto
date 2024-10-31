
// src/EC/components/ProductItem/ProductItem.js
import React from 'react';
import './ProductItem.css';

const ProductItem = ({ product }) => (
  <div className="product-item">
    <h2>{product.name}</h2>
    <p>${product.price.toFixed(2)}</p>
    <button>Add to Cart</button>
  </div>
);

export default ProductItem;
