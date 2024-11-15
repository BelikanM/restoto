
import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, getDocs } from "firebase/firestore";
import { FaEnvelope, FaWhatsapp, FaSearch } from 'react-icons/fa';

const ProductList = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "file"));
      const productsData = [];
      querySnapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() });
      });
      setProducts(productsData);
      setFilteredProducts(productsData);
    };

    fetchProducts();
  }, []);

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (minPrice) {
      filtered = filtered.filter(product => product.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter(product => product.price <= parseFloat(maxPrice));
    }

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    filterProducts();
  }, [searchTerm, minPrice, maxPrice, products]);

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-col md:flex-row items-center">
        <input
          type="text"
          placeholder="Search by name or description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded mb-2 md:mb-0"
        />
        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="p-2 border rounded mb-2 md:mb-0 md:ml-2"
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="p-2 border rounded mb-2 md:mb-0 md:ml-2"
        />
        <button
          onClick={filterProducts}
          className="p-2 bg-blue-500 text-white rounded md:ml-2 flex items-center"
        >
          <FaSearch />
        </button>
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto" style={{ maxHeight: '80vh' }}>
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white p-4 shadow-md rounded">
            <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover mb-4 rounded" />
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-lg font-bold mt-2">Price: ${product.price}</p>
            <p className="text-gray-600">Stock: {product.stock}</p>
            <p className="text-gray-600">Seller: {product.email}</p>
            <p className="text-gray-600">Phone: {product.phoneNumber}</p>
            <div className="flex space-x-2 mt-4">
              <a
                href={`mailto:${product.email}?subject=Inquiry about ${encodeURIComponent(product.name)}&body=I'm interested in your product:%0A%0AName: ${encodeURIComponent(product.name)}%0ADescription: ${encodeURIComponent(product.description)}%0APrice: $${product.price}%0AImage: ${product.imageUrl}`}
                className="flex items-center justify-center w-full bg-blue-500 text-white p-2 rounded"
              >
                <FaEnvelope className="mr-2" /> Email Seller
              </a>
              <a
                href={`https://wa.me/${product.phoneNumber}?text=I am interested in your product:%0A%0AName: ${encodeURIComponent(product.name)}%0ADescription: ${encodeURIComponent(product.description)}%0APrice: $${product.price}%0AImage: ${product.imageUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full bg-green-500 text-white p-2 rounded"
              >
                <FaWhatsapp className="mr-2" /> WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
