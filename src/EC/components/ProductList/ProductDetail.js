
// ProductDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc } from "firebase/firestore";

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "file", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleAddToCart = () => {
    console.log("Adding product to cart:", product);
    addToCart(product);
  };

  return (
    <div className="p-4">
      <div className="bg-white p-4 shadow-md rounded">
        <img src={product.imageUrl} alt={product.name} className="w-full h-96 object-cover mb-4 rounded" />
        <h2 className="text-2xl font-semibold">{product.name}</h2>
        <p className="text-gray-600">{product.description}</p>
        <p className="text-lg font-bold mt-2">Price: ${product.price}</p>
        <p className="text-gray-600">Stock: {product.stock}</p>
        <p className="text-gray-600">Seller: {product.email}</p>
        <p className="text-gray-600">Phone: {product.phoneNumber}</p>
        <button
          onClick={handleAddToCart}
          className="mt-4 bg-blue-500 text-white p-2 rounded"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
