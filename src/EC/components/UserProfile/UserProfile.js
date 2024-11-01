
import React, { useState, useEffect } from 'react';
import { db, auth, storage } from './firebaseConfig';
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ProductForm = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const userSnapshot = await getDocs(collection(db, 'users'));
        const userData = userSnapshot.docs.map(doc => doc.data()).find(u => u.uid === user.uid);
        setUserProfile(userData);
      }
    };

    const fetchProducts = async () => {
      const productCollection = collection(db, 'products');
      const productSnapshot = await getDocs(productCollection);
      const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productList);
    };

    fetchUserProfile();
    fetchProducts();
  }, []);

  const handleImageUpload = async (file) => {
    const storageRef = ref(storage, `products/${file.name}`);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);
    return imageUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('Vous devez être connecté pour publier un produit.');
        return;
      }

      const imageUrl = image ? await handleImageUpload(image) : '';
      await addDoc(collection(db, 'products'), {
        name: productName,
        description,
        price: parseFloat(price),
        category,
        imageUrl,
        userId: user.uid,
        userName: user.displayName,
        userProfileUrl: userProfile?.profileUrl || ''
      });

      setProductName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setImage(null);
      setError('');
      fetchProducts(); // Mettre à jour la liste des produits
    } catch (error) {
      setError('Erreur lors de la publication du produit.');
    }
  };

  const handleDelete = async (productId) => {
    await deleteDoc(doc(db, 'products', productId));
    setProducts(products.filter(product => product.id !== productId));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Publier un Produit</h2>
      {error && <p className="text-red-500">{error}</p>}
      {userProfile && (
        <div className="flex items-center mb-4">
          <img src={userProfile.profileUrl} alt="Profile" className="w-12 h-12 rounded-full mr-3" />
          <p>{auth.currentUser.displayName}</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom du produit"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          required
        />
        <input
          type="number"
          placeholder="Prix"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          required
        />
        <input
          type="text"
          placeholder="Catégorie"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          required
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full p-2 border rounded mb-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Publier
        </button>
      </form>
      <h3 className="text-xl font-bold mt-6 mb-4">Vos Produits</h3>
      <div>
        {products.map(product => (
          <div key={product.id} className="border p-4 rounded mb-4 flex justify-between items-center">
            <div>
              <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded mr-4" />
              <h4 className="font-semibold">{product.name}</h4>
              <p>{product.userName}</p>
            </div>
            <button
              onClick={() => handleDelete(product.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductForm;
