
// src/EC/components/ProductList.js
import React, { useEffect, useState } from 'react';
import { db } from '../../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FaApple, FaTshirt, FaSoap } from 'react-icons/fa'; // Import des icônes

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({}); // Pour stocker les produits ajoutés au panier
  const [activeCategory, setActiveCategory] = useState(null); // Pour gérer la catégorie active
  const [showPaymentForm, setShowPaymentForm] = useState(false); // Contrôle l'affichage du formulaire de paiement
  const [paymentInfo, setPaymentInfo] = useState({ name: '', cardNumber: '' }); // Informations de paiement
  const [license, setLicense] = useState(null); // Pour stocker la licence d'achat
  const categories = ['Alimentaire', 'Vestimentaire', 'Cosmétique'];

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, 'user_products'); // Nouvelle collection
      const productsSnapshot = await getDocs(productsCollection);
      const allProducts = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(allProducts);
    };

    fetchProducts();
  }, []);

  // Fonction pour ajouter un produit au panier
  const handleAddToCart = (productId, quantity) => {
    if (quantity > 0) {
      setCart(prevCart => ({
        ...prevCart,
        [productId]: {
          quantity: quantity,
          product: products.find(product => product.id === productId),
        },
      }));
    }
  };

  // Gérer l'affichage des catégories
  const toggleCategory = (category) => {
    if (activeCategory === category) {
      setActiveCategory(null); // Fermer la catégorie
    } else {
      setActiveCategory(category); // Ouvrir la catégorie
    }
  };

  // Fonction pour afficher le produit dans une popup
  const handleBuyNow = (product) => {
    setShowPaymentForm(true);
  };

  // Fonction pour valider le paiement
  const handleValidatePayment = () => {
    // Générer un code de licence aléatoire
    const licenseCode = `GA-${Math.floor(10000000 + Math.random() * 90000000)}`;
    setLicense({ code: licenseCode, user: paymentInfo.name });
    setShowPaymentForm(false); // Fermer le formulaire de paiement
  };

  return (
    <div className="container mx-auto p-4">
      {categories.map(category => (
        <div key={category}>
          <h2 
            className="text-xl font-bold mt-4 cursor-pointer flex items-center" 
            onClick={() => toggleCategory(category)}
          >
            {category === 'Alimentaire' && <FaApple className="mr-2" />}
            {category === 'Vestimentaire' && <FaTshirt className="mr-2" />}
            {category === 'Cosmétique' && <FaSoap className="mr-2" />}
            {category}
          </h2>
          {activeCategory === category && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
              {products.filter(product => product.category === category).map(product => (
                <div key={product.id} className="border p-4 rounded shadow">
                  <h3 className="font-bold">{product.title}</h3>
                  <p>Prix: {product.price} {product.currency}</p>
                  <p>Catégorie: {product.category}</p>
                  <p>Stock: {product.stock}</p>
                  {product.imageUrl && (
                    <img src={product.imageUrl} alt={product.title} className="w-full h-48 object-cover rounded mt-2" />
                  )}
                  
                  {/* Champ pour spécifier la quantité */}
                  <input
                    type="number"
                    min="1"
                    placeholder="Quantité"
                    className="border border-gray-300 p-2 rounded mb-2 w-full"
                    onChange={(e) => handleAddToCart(product.id, parseInt(e.target.value))}
                  />
                  
                  {/* Bouton pour ajouter au panier */}
                  <button 
                    onClick={() => handleBuyNow(product)} 
                    className="bg-green-500 text-white p-2 rounded w-full"
                  >
                    Ajouter au Panier
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      
      {/* Affichage du panier */}
      <div className="mt-4">
        <h2 className="text-xl font-bold">Panier</h2>
        {Object.keys(cart).length > 0 ? (
          <ul>
            {Object.keys(cart).map(productId => {
              const item = cart[productId];
              const totalPrice = item.quantity * item.product.price;
              return (
                <li key={productId} className="border p-2 mt-2 rounded">
                  <h3 className="font-bold">{item.product.title}</h3>
                  <p>Quantité: {item.quantity}</p>
                  <p>Prix total: {totalPrice} {item.product.currency}</p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Votre panier est vide.</p>
        )}
      </div>

      {/* Formulaire de paiement simulé */}
      {showPaymentForm && (
        <div className="bg-gray-100 p-4 rounded shadow mt-4">
          <h2 className="text-xl font-bold">Informations de Paiement</h2>
          <input
            type="text"
            placeholder="Nom"
            value={paymentInfo.name}
            onChange={(e) => setPaymentInfo({ ...paymentInfo, name: e.target.value })}
            className="border border-gray-300 p-2 rounded mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Numéro de Carte"
            value={paymentInfo.cardNumber}
            onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
            className="border border-gray-300 p-2 rounded mb-2 w-full"
          />
          <button 
            onClick={handleValidatePayment} 
            className="bg-blue-500 text-white p-2 rounded"
          >
            Valider
          </button>
        </div>
      )}

      {/* Afficher la licence d'achat si validée */}
      {license && (
        <div className="bg-green-100 p-4 rounded mt-4">
          <h2 className="text-xl font-bold">Licence d'Achat</h2>
          <p>Code: {license.code}</p>
          <p>Nom: {license.user}</p>
          <button 
            onClick={() => {
              // Simuler le téléchargement du PDF
              alert('Téléchargement de la licence en PDF (simulation)');
            }} 
            className="bg-blue-500 text-white p-2 rounded"
          >
            Télécharger PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
