
import React, { useState, useEffect } from 'react';
import { FaUpload } from 'react-icons/fa';
import { db, storage } from './firebase'; // Assurez-vous que le chemin est correct
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsData);
    };

    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = '';
      if (image) {
        const imageRef = ref(storage, `products/${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      const docRef = await addDoc(collection(db, 'products'), {
        name: productName,
        price: parseFloat(price),
        currency: currency,
        stock: parseInt(stock),
        description: description,
        category: category,
        imageUrl: imageUrl,
      });

      setProducts([...products, {
        id: docRef.id,
        name: productName,
        price: parseFloat(price),
        currency: currency,
        stock: parseInt(stock),
        description,
        category,
        imageUrl
      }]);
      setProductName('');
      setPrice('');
      setCurrency('EUR');
      setStock('');
      setDescription('');
      setCategory('');
      setImage(null);
      alert('Product added successfully');
    } catch (error) {
      console.error('Error adding product: ', error);
    }
  };

  const handleDelete = async (productId, imageUrl) => {
    try {
      await deleteDoc(doc(db, 'products', productId));

      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      }

      setProducts(products.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product: ', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      {/* Product Form */}
      <div className="bg-white shadow-md rounded-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Publish a Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Product Name"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 flex">
            <input
              type="number"
              placeholder="Price"
              className="w-full p-2 border border-gray-300 rounded-md mr-2"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <select
              className="p-2 border border-gray-300 rounded-md"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="XOF">XOF (Franc CFA)</option>
            </select>
          </div>
          <div className="mb-4">
            <input
              type="number"
              placeholder="Stock"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <textarea
              placeholder="Description"
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Category"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center cursor-pointer">
              <FaUpload className="mr-2" />
              <span>Upload Image</span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Product List */}
      <div className="bg-white shadow-md rounded-md p-6">
        <h2 className="text-xl font-bold mb-4">Product List</h2>
        {products.map(product => (
          <div key={product.id} className="border p-4 mb-4 rounded-md shadow-md">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p>Price: {product.price} {product.currency}</p>
            <p>Stock: {product.stock}</p>
            <p>Category: {product.category}</p>
            <p>Description: {product.description}</p>
            {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-full h-auto mt-2" />}
            <button
              onClick={() => handleDelete(product.id, product.imageUrl)}
              className="mt-4 bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;
