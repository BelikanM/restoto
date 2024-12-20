
import React, { useState, useEffect } from 'react';
import { auth, db, storage } from './firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, query, where, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FaGoogle, FaEnvelope, FaWhatsapp } from 'react-icons/fa';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [productName, setProductName] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [productDescription, setProductDescription] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productStock, setProductStock] = useState('');
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchProducts(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(lowercasedSearchTerm) ||
        product.description.toLowerCase().includes(lowercasedSearchTerm) ||
        product.phoneNumber.includes(lowercasedSearchTerm) ||
        product.email.toLowerCase().includes(lowercasedSearchTerm) ||
        product.price.toLowerCase().includes(lowercasedSearchTerm) ||
        product.stock.toString().includes(lowercasedSearchTerm)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const fetchProducts = (userId) => {
    const q = query(collection(db, "file"), where("userId", "==", userId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productsData = [];
      querySnapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() });
      });
      setProducts(productsData);
      setFilteredProducts(productsData);
    });
    return unsubscribe;
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setProductImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName || !productImage || !phoneNumber || !email || !productPrice || !productStock) return;

    const storageRef = ref(storage, `products/${productImage.name}`);
    await uploadBytes(storageRef, productImage);
    const imageUrl = await getDownloadURL(storageRef);

    await addDoc(collection(db, 'file'), {
      userId: user.uid,
      name: productName,
      description: productDescription,
      imageUrl,
      phoneNumber,
      email,
      price: `${productPrice} ${currency}`,
      stock: productStock,
    });

    setProductName('');
    setProductDescription('');
    setProductImage(null);
    setPhoneNumber('');
    setEmail('');
    setProductPrice('');
    setProductStock('');
  };

  const handleDelete = async (productId) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "file", productId));
      } catch (error) {
        console.error("Error deleting product: ", error);
      }
    }
  };

  const handleUpdate = async (productId) => {
    const newName = prompt("Enter new product name");
    const newDescription = prompt("Enter new product description");
    const newPhoneNumber = prompt("Enter new phone number");
    const newEmail = prompt("Enter new email");
    const newPrice = prompt("Enter new product price");
    const newStock = prompt("Enter new product stock");
    if (newName && newDescription && newPhoneNumber && newEmail && newPrice && newStock) {
      await updateDoc(doc(db, "file", productId), {
        name: newName,
        description: newDescription,
        phoneNumber: newPhoneNumber,
        email: newEmail,
        price: `${newPrice} ${currency}`,
        stock: newStock,
      });
    }
  };

  return (
    <div className="p-4">
      {!user ? (
        <button
          onClick={handleGoogleSignIn}
          className="bg-blue-500 text-white p-2 rounded flex items-center"
        >
          <FaGoogle className="mr-2" /> Sign in with Google
        </button>
      ) : (
        <div>
          <div className="flex items-center mb-4">
            <img src={user.photoURL} alt={user.displayName} className="w-12 h-12 rounded-full mr-4" />
            <span className="text-lg font-semibold">{user.displayName}</span>
          </div>
          <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded mb-6 space-y-4">
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Product Name"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="file"
              onChange={handleFileChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <textarea
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="Product Description"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone Number"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              placeholder="Price"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="JPY">JPY</option>
              <option value="GBP">GBP</option>
              <option value="CHF">CHF</option>
              <option value="XOF">Franc CFA</option>
            </select>
            <input
              type="number"
              value={productStock}
              onChange={(e) => setProductStock(e.target.value)}
              placeholder="Stock"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">
              Publish
            </button>
          </form>

          {/* Search Input */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />

          {/* Conteneur de produits avec défilement */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-96">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white p-4 shadow-md rounded">
                <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover mb-4 rounded" />
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-lg font-bold mt-2">Price: {product.price}</p>
                <p className="text-gray-600">Stock: {product.stock}</p>
                <div className="flex space-x-2 mt-4">
                  <a
                    href={`mailto:${product.email}?subject=Inquiry about ${product.name}&body=I am interested in the product: ${product.name}%0ADescription: ${product.description}%0AImage: ${product.imageUrl}%0APrice: ${product.price}%0AStock: ${product.stock}`}
                    className="flex items-center justify-center w-full bg-blue-500 text-white p-2 rounded"
                  >
                    <FaEnvelope className="mr-2" /> Email Seller
                  </a>
                  <a
                    href={`https://wa.me/${product.phoneNumber}?text=I am interested in your product: ${product.name}%0ADescription: ${product.description}%0AImage: ${product.imageUrl}%0APrice: ${product.price}%0AStock: ${product.stock}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full bg-green-500 text-white p-2 rounded"
                  >
                    <FaWhatsapp className="mr-2" /> WhatsApp
                  </a>
                </div>
                <div className="flex mt-4 space-x-2">
                  <button onClick={() => handleUpdate(product.id)} className="flex-1 bg-yellow-500 text-white p-2 rounded">
                    Modify
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="flex-1 bg-red-500 text-white p-2 rounded">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
