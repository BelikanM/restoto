
import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, onSnapshot } from "firebase/firestore";
import { FaEnvelope, FaWhatsapp, FaSearch } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix pour les icônes de marqueur
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const ProductList = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const fetchProducts = () => {
      const unsubscribe = onSnapshot(collection(db, "file"), (querySnapshot) => {
        const productsData = [];
        querySnapshot.forEach((doc) => {
          productsData.push({ id: doc.id, ...doc.data() });
        });
        setProducts(productsData);
        setFilteredProducts(productsData);
      });
      return unsubscribe;
    };

    fetchProducts();
  }, []);

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (minPrice) {
      filtered = filtered.filter(product => parseFloat(product.price) >= parseFloat(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter(product => parseFloat(product.price) <= parseFloat(maxPrice));
    }

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    filterProducts();
  }, [searchTerm, minPrice, maxPrice, products]);

  // Géolocalisation de l'utilisateur
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error(error);
        },
        { enableHighAccuracy: true }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, []);

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-col md:flex-row items-center">
        <input
          type="text"
          placeholder="Search by name or description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded mb-2 md:mb-0"
        />
        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="p-2 border rounded mb-2 md:mb-0 md:ml-2"
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="p-2 border rounded mb-2 md:mb-0 md:ml-2"
        />
        <button
          onClick={filterProducts}
          className="p-2 bg-blue-500 text-white rounded md:ml-2 flex items-center"
        >
          <FaSearch />
        </button>
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto" style={{ maxHeight: '80vh' }}>
        {filteredProducts.map((product) => {
          const [priceValue, currency] = product.price.split(' ');

          return (
            <div key={product.id} className="bg-white p-4 shadow-md rounded">
              <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover mb-4 rounded" />
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-lg font-bold mt-2">Price: {currency} {priceValue}</p>
              <p className="text-gray-600">Stock: {product.stock}</p>
              <p className="text-gray-600">Seller: {product.email}</p>
              <p className="text-gray-600">Phone: {product.phoneNumber}</p>
              
              {/* Carte avec marqueur pour le produit */}
              {product.location && (
                <MapContainer center={[product.location.lat, product.location.lng]} zoom={13} style={{ height: '150px', width: '100%', marginTop: '10px' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[product.location.lat, product.location.lng]}>
                    <Popup>
                      {product.quarter}, {product.city}, {product.country}
                    </Popup>
                  </Marker>
                </MapContainer>
              )}

              {/* Affiche la position de l'utilisateur sur la carte */}
              {userLocation && (
                <MapContainer center={userLocation} zoom={13} style={{ height: '150px', width: '100%', marginTop: '10px' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={userLocation}>
                    <Popup>
                      Votre position actuelle
                    </Popup>
                  </Marker>
                </MapContainer>
              )}

              <div className="flex space-x-2 mt-4">
                <a
                  href={`mailto:${product.email}?subject=Inquiry about ${encodeURIComponent(product.name)}&body=I'm interested in your product:%0A%0AName: ${encodeURIComponent(product.name)}%0ADescription: ${encodeURIComponent(product.description)}%0APrice: ${currency} ${priceValue}%0AImage: ${encodeURIComponent(product.imageUrl)}`}
                  className="flex items-center justify-center w-full bg-blue-500 text-white p-2 rounded"
                >
                  <FaEnvelope className="mr-2" /> Email Seller
                </a>
                <a
                  href={`https://wa.me/${product.phoneNumber}?text=I am interested in your product:%0A%0AName: ${encodeURIComponent(product.name)}%0ADescription: ${encodeURIComponent(product.description)}%0APrice: ${currency} ${priceValue}%0AImage: ${encodeURIComponent(product.imageUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full bg-green-500 text-white p-2 rounded"
                >
                  <FaWhatsapp className="mr-2" /> WhatsApp
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;

