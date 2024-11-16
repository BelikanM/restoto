
import React, { useEffect, useState } from 'react';
import { db } from './firebaseConfig';
import { collection, getDocs } from "firebase/firestore";

const ScrollingBanner = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "file"));
      const productsData = [];
      querySnapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() });
      });
      setProducts(productsData);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (products.length > 0) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
      }
    }, 3000); // Change the product every 3 seconds

    return () => clearInterval(interval);
  }, [products]);

  useEffect(() => {
    if (products.length > 0) {
      const currentProduct = products[currentIndex];
      const description = truncateDescription(currentProduct.description);
      setDisplayText(`${currentProduct.name}: ${description} • Price: $${currentProduct.price}`);
    }
  }, [currentIndex, products]);

  const truncateDescription = (description) => {
    const sentences = description.split('. ');
    return sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '...' : '');
  };

  return (
    <div className="bg-blue-500 text-white p-4 text-center">
      <h2 className="text-xl font-bold">{displayText}</h2>
    </div>
  );
};

export default ScrollingBanner;
