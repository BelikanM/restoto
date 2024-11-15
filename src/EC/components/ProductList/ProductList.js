
import React, { useState, useEffect } from 'react';
import { db, auth, storage } from './firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaEnvelope } from 'react-icons/fa'; // Icône Gmail

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const filteredProducts = currentUser
    ? products.filter(product => product.ownerId !== currentUser.uid) // Montre les produits des autres utilisateurs
    : products;

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
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="p-4">
              <ProductCard 
                product={product} 
                currentUser={currentUser} 
              />
            </div>
          ))
        ) : (
          <p className="text-center">Aucun produit disponible.</p>
        )}
      </Slider>
    </div>
  );
};

const ProductCard = ({ product, currentUser }) => {
  const handleEmailContact = () => {
    const subject = `Intérêt pour votre produit: ${product.name}`;
    const body = `
      Bonjour ${product.ownerName || 'le vendeur'},

      J'ai vu votre produit "${product.name}" et je souhaite en avoir plus de détails.
      Merci de me contacter.

      Cordialement,
      ${currentUser ? currentUser.displayName : 'Un client'}
    `;
    window.open(`mailto:${product.ownerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <div className="border p-4 rounded shadow-sm flex flex-col items-center">
      <div className="flex items-center mb-2">
        <img
          src={product.ownerPhotoUrl} // Assurez-vous que vous avez le champ `ownerPhotoUrl` dans votre produit
          alt="Profile"
          className="w-10 h-10 rounded-full mr-3"
        />
        <p className="font-medium">{product.ownerName}</p> {/* Assurez-vous d'avoir `ownerName` dans votre produit */}
      </div>
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover mb-4"
      />
      <h2 className="text-lg font-semibold text-center">{product.name}</h2>
      <p className="text-gray-700 text-center">{product.description}</p>
      <p className="text-gray-500">{product.price} XOF</p>
      {/* Afficher le bouton uniquement si l'utilisateur courant n'est pas le propriétaire du produit */}
      {currentUser && currentUser.uid !== product.ownerId && (
        <button
          className="bg-red-500 text-white px-4 py-2 rounded mt-2 flex items-center"
          onClick={handleEmailContact}
        >
          <FaEnvelope className="mr-2" /> Contacter par Gmail
        </button>
      )}
    </div>
  );
};

export default ProductList;
