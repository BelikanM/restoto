
import React, { useState, useEffect } from 'react';
import { db, auth } from './firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    const unsubscribeProducts = onSnapshot(collection(db, 'products'), (productSnapshot) => {
      const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productList);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeProducts();
    };
  }, []);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  const addToCart = (product, quantity) => {
    setCart(prevCart => [...prevCart, { ...product, quantity }]);
  };

  const handlePurchase = () => {
    console.log('Achat validé:', cart);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="container mx-auto p-4">
      {!currentUser ? (
        <button
          onClick={handleGoogleSignIn}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Connexion avec Google
        </button>
      ) : (
        <div className="text-center mb-4">
          <p>Bienvenue, {currentUser.displayName}</p>
          <img src={currentUser.photoURL} alt="Profile" className="w-10 h-10 rounded-full mx-auto" />
        </div>
      )}
      <h1 className="text-2xl font-bold mb-4 text-center">Produits</h1>
      <Slider {...sliderSettings} className="mb-8">
        {products.map(product => (
          <div key={product.id} className="p-4">
            <ProductCard 
              product={product} 
              user={currentUser}
              addToCart={addToCart} 
            />
          </div>
        ))}
      </Slider>
      <Cart cart={cart} handlePurchase={handlePurchase} />
    </div>
  );
};

const ProductCard = ({ product, user, addToCart }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="border p-4 rounded shadow-sm flex flex-col items-center">
      {user ? (
        <div className="flex items-center mb-2">
          <img
            src={user.photoURL}
            alt="Profile"
            className="w-10 h-10 rounded-full mr-3"
          />
          <p className="font-medium">{user.displayName}</p>
        </div>
      ) : (
        <p className="italic text-gray-500">Chargement...</p>
      )}
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover mb-4"
      />
      <h2 className="text-lg font-semibold text-center">{product.name}</h2>
      <p className="text-gray-700 text-center">{product.description}</p>
      <p className="text-gray-500">{product.price} XOF</p>
      <div className="flex items-center mt-2">
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="border p-1 w-16 mr-2"
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => addToCart(product, quantity)}
        >
          Ajouter
        </button>
      </div>
    </div>
  );
};

const Cart = ({ cart, handlePurchase }) => (
  <div className="mt-8">
    <h2 className="text-xl font-bold mb-4 text-center">Panier</h2>
    <div className="flex overflow-x-auto space-x-4 p-4">
      {cart.map((item, index) => (
        <div key={index} className="border p-4 rounded shadow-sm min-w-max flex-shrink-0">
          <h3 className="font-semibold">{item.name}</h3>
          <p>Quantité: {item.quantity}</p>
          <p>Total: {item.price * item.quantity} XOF</p>
        </div>
      ))}
    </div>
    <div className="text-center">
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handlePurchase}
      >
        Valider l'achat
      </button>
    </div>
  </div>
);

export default ProductList;
