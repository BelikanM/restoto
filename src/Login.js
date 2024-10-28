// src/Home.js
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import ListeUsers from './ListeUsers';
import UserProfile from './UserProfile';
import FollowingList from './FollowingList';

const Home = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        navigate('/login'); // Redirige vers la page de connexion si non connecté
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  if (!currentUser) return null; // Affiche rien en attendant la vérification

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-6">Accueil</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <UserProfile currentUser={currentUser} />
        <ListeUsers currentUser={currentUser} />
        <FollowingList currentUser={currentUser} />
      </div>
    </div>
  );
};

export default Home;
