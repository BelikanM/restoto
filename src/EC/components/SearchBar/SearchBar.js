
import React, { useEffect, useState } from 'react';
import { db } from './firebaseConfig';
import { collection, onSnapshot } from "firebase/firestore";

const currencyOptions = [
  { symbol: '$', code: 'USD' },
  { symbol: '€', code: 'EUR' },
  { symbol: '£', code: 'GBP' },
  { symbol: 'CFA', code: 'XOF' } // Franc CFA
];

const ScrollingBanner = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    const fetchProducts = () => {
      const q = collection(db, "file");
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const productsData = [];
        querySnapshot.forEach((doc) => {
          productsData.push({ id: doc.id, ...doc.data() });
        });
        setProducts(productsData);
        setCurrentIndex(0); // Reset index to show the first product when products change
      });

      return () => unsubscribe(); // Clean up the subscription on unmount
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
      const currencySymbol = currencyOptions.find(c => c.code === currentProduct.currency)?.symbol || '$'; // Default to USD if not found
      setDisplayText(`${currentProduct.name}: ${description} • Price: ${currencySymbol}${currentProduct.price}`);
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
