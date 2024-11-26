// src/components/GoogleAuth.js
import React, { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Assurez-vous que le chemin est correct

const GoogleAuth = () => {
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user); // Sauvegarder l'utilisateur connecté dans l'état
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <h3>Bienvenue, {user.displayName}</h3>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <button onClick={handleLogin}>Se connecter avec Google</button>
      )}
    </div>
  );
};

export default GoogleAuth;
