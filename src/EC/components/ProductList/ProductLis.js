
import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productCollection = collection(db, 'products');
      const productSnapshot = await getDocs(productCollection);
      const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productList);
    };

    fetchProducts();
  }, []);

  const addToCart = (product, quantity) => {
    setCart([...cart, { ...product, quantity: parseInt(quantity, 10) }]);
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
      <h1 className="text-2xl font-bold mb-4 text-center">Produits</h1>
      <Slider {...sliderSettings} className="mb-8">
        {products.map(product => (
          <div key={product.id}>
            <ProductCard product={product} addToCart={addToCart} />
          </div>
        ))}
      </Slider>
      <Cart cart={cart} handlePurchase={handlePurchase} />
    </div>
  );
};

const ProductCard = ({ product, addToCart }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="border p-4 rounded shadow-sm flex flex-col items-center">
      <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover mb-4" />
      <h2 className="text-lg font-semibold text-center">{product.name}</h2>
      <p className="text-gray-700 text-center">{product.description}</p>
      <p className="text-gray-500">{product.price} XOF</p>
      <div className="flex items-center mt-2">
        <input
          type="number"
          min="1"
          max={product.stock}
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
