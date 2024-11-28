
import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, onSnapshot } from "firebase/firestore";
import { FaEnvelope, FaWhatsapp, FaTrash } from 'react-icons/fa';
import _ from 'lodash'; // Pour faciliter le filtrage

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = () => {
      const unsubscribe = onSnapshot(collection(db, "file"), (querySnapshot) => {
        const productsData = [];
        querySnapshot.forEach((doc) => {
          productsData.push({ id: doc.id, ...doc.data() });
        });
        setProducts(productsData);
        suggestProducts(productsData); // Suggérer des produits lors du chargement
      });
      return unsubscribe;
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  const addToFavorites = (product) => {
    if (!favorites.find(fav => fav.id === product.id)) {
      const updatedFavorites = [...favorites, product];
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Sauvegarder dans localStorage
      alert(`${product.name} a été ajouté à vos favoris.`);
      suggestProducts(products); // Mettre à jour les suggestions après ajout
    } else {
      alert(`${product.name} est déjà dans vos favoris.`);
    }
  };

  const suggestProducts = (allProducts) => {
    if (favorites.length === 0) {
      setRecommendedProducts([]);
      return;
    }

    const favoriteCategories = favorites.map(fav => fav.category); // Obtenir les catégories des favoris

    // Utiliser lodash pour filtrer les produits suggérés
    const suggested = _.uniqBy(allProducts.filter(product => {
      return !favorites.find(fav => fav.id === product.id) && favoriteCategories.includes(product.category);
    }), 'id'); // Éviter les doublons

    // Mettre à jour les produits recommandés
    setRecommendedProducts(suggested); // Afficher tous les produits similaires
  };

  const handleEmail = (email, productName, imageUrl) => {
    const subject = `Intérêt pour ${encodeURIComponent(productName)}`;
    const body = `Je suis intéressé par votre produit ${productName}. Voici l'image: ${imageUrl}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleWhatsApp = (phoneNumber, productName, imageUrl) => {
    const message = `Je suis intéressé par votre produit ${encodeURIComponent(productName)}. Voici l'image: ${imageUrl}`;
    window.location.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  const removeFromFavorites = (id) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Mettre à jour le localStorage
    alert('Produit retiré des favoris.');
    suggestProducts(products); // Mettre à jour les suggestions après suppression
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Produits à la Une</h2>
      <div className="flex overflow-x-auto mb-6">
        {products.map(product => (
          <div 
            key={product.id} 
            className="bg-white p-4 rounded-lg shadow-md m-2 cursor-pointer hover:shadow-lg transition-shadow duration-200" 
            onClick={() => addToFavorites(product)}
          >
            <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover mb-4 rounded" />
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-lg font-bold">{product.price}</p>
            <div className="flex space-x-2 mt-2">
              <button onClick={(e) => {
                e.stopPropagation();
                handleEmail(product.email, product.name, product.imageUrl);
              }} 
              className="bg-blue-500 text-white p-2 rounded">
                <FaEnvelope />
              </button>
              <button onClick={(e) => {
                e.stopPropagation();
                handleWhatsApp(product.phoneNumber, product.name, product.imageUrl);
              }} 
              className="bg-green-500 text-white p-2 rounded">
                <FaWhatsapp />
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4">Vos Favoris</h2>
      <div className="bg-gray-100 rounded-lg p-4 shadow-md">
        {favorites.length === 0 ? (
          <p>Aucun produit favori.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-2 px-4 border-b">Produit</th>
                  <th className="py-2 px-4 border-b">Prix</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {favorites.map((favori, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b flex items-center">
                      <img src={favori.imageUrl} alt={favori.name} className="w-12 h-12 object-cover rounded mr-2" />
                      {favori.name}
                    </td>
                    <td className="py-2 px-4 border-b">{favori.price}</td>
                    <td className="py-2 px-4 border-b flex space-x-2">
                      <button onClick={() => removeFromFavorites(favori.id)} className="text-red-500">
                        <FaTrash />
                      </button>
                      <button onClick={() => handleEmail(favori.email, favori.name, favori.imageUrl)} className="bg-blue-500 text-white p-2 rounded">
                        <FaEnvelope />
                      </button>
                      <button onClick={() => handleWhatsApp(favori.phoneNumber, favori.name, favori.imageUrl)} className="bg-green-500 text-white p-2 rounded">
                        <FaWhatsapp />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4 mt-6">Produits Suggérés</h2>
      {recommendedProducts.length === 0 ? (
        <p>Aucune suggestion disponible.</p>
      ) : (
        <div className="flex overflow-x-auto mb-6">
          {recommendedProducts.map(product => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow-md m-2">
              <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover mb-4 rounded" />
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-lg font-bold">{product.price}</p>
              <div className="flex space-x-2 mt-2">
                <button onClick={() => handleEmail(product.email, product.name, product.imageUrl)} className="bg-blue-500 text-white p-2 rounded">
                  <FaEnvelope />
                </button>
                <button onClick={() => handleWhatsApp(product.phoneNumber, product.name, product.imageUrl)} className="bg-green-500 text-white p-2 rounded">
                  <FaWhatsapp />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductManager;
