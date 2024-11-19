
import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { FaPaperPlane, FaImage, FaMicrophone, FaSmile, FaBars, FaTimes } from 'react-icons/fa';
import PrivateChat from './PrivateChat'; // Import du composant PrivateChat
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Importer Firebase Storage

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app); // Initialiser Firebase Storage
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const GroupeChat = () => {
  const [messages, setMessages] = useState([]);
  const [nouveauMessage, setNouveauMessage] = useState('');
  const [user, setUser] = useState(null);
  const [privateChatUser, setPrivateChatUser] = useState(null);
  const [file, setFile] = useState(null); // Pour gérer les fichiers à envoyer
  const [showMenu, setShowMenu] = useState(false); // État pour le menu hamburger

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const unsubscribeMessages = onSnapshot(collection(db, "conversations"), (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(messagesData);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeMessages();
    };
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Erreur lors de l'authentification :", error);
    }
  };

  const envoyerMessage = async () => {
    if (nouveauMessage.trim() === '' || !user) return;

    await addDoc(collection(db, "conversations"), {
      text: nouveauMessage,
      userId: user.uid,
      displayName: user.displayName,
      profilePhotoUrl: user.photoURL,
      timestamp: serverTimestamp(),
    });

    setNouveauMessage('');
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Stocker le fichier sélectionné
  };

  const uploadFile = async () => {
    if (!file) return;

    const storageRef = ref(storage, `files/${file.name}`);
    await uploadBytes(storageRef, file);
    const fileURL = await getDownloadURL(storageRef);

    // Envoyer le message avec le lien du fichier
    await addDoc(collection(db, "conversations"), {
      text: `Fichier envoyé : ${file.name}`,
      fileURL,
      userId: user.uid,
      displayName: user.displayName,
      profilePhotoUrl: user.photoURL,
      timestamp: serverTimestamp(),
    });

    setFile(null); // Réinitialiser le fichier après l'envoi
  };

  const supprimerMessage = async (messageId) => {
    await deleteDoc(doc(db, "conversations", messageId));
  };

  const suivreUtilisateur = (message) => {
    setPrivateChatUser(message.userId);
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      {!user ? (
        <button onClick={handleGoogleSignIn} className="p-2 bg-blue-500 text-white rounded w-full">
          Se connecter avec Google
        </button>
      ) : (
        <>
          <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-2xl font-bold">Groupe de Chat</h2>
            <p className="text-red-300">Avertissement : Tous les contenus doivent être liés aux commerces sinon vous êtes banni de la plateforme.</p>
            <button onClick={toggleMenu} className="text-white float-right">
              {showMenu ? <FaTimes /> : <FaBars />}
            </button>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 overflow-y-auto" style={{ maxHeight: '60vh' }}>
            {messages.map((message) => (
              <div key={message.id} className="mb-2 flex items-center">
                <img src={message.profilePhotoUrl || 'default-profile.png'} alt="Profil" className="w-10 h-10 rounded-full mr-2" />
                <div className="bg-white p-3 rounded-lg shadow-sm w-full">
                  <p className="font-bold">{message.displayName || 'Utilisateur inconnu'}</p>
                  <p>{message.text}</p>
                  {message.fileURL && (
                    <a href={message.fileURL} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                      Voir le fichier
                    </a>
                  )}
                  {message.userId === user.uid && (
                    <button onClick={() => supprimerMessage(message.id)} className="text-red-500">
                      Supprimer
                    </button>
                  )}
                  {message.userId !== user.uid && (
                    <button onClick={() => suivreUtilisateur(message)} className="text-green-500">
                      Message privé
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <input
              type="text"
              placeholder="Tapez votre message..."
              value={nouveauMessage}
              onChange={(e) => setNouveauMessage(e.target.value)}
              className="flex-grow p-2 border rounded"
            />
          </div>

          {showMenu && (
            <div className="flex flex-col space-y-2 mb-4">
              <input
                type="file"
                onChange={handleFileChange}
                className="p-2 border rounded"
                accept="image/*,audio/*" // Accepter les fichiers image et audio
              />
              <button
                onClick={uploadFile}
                className="p-2 bg-green-500 text-white rounded flex items-center"
              >
                <FaImage /> Envoyer Fichier
              </button>
            </div>
          )}
          
          <div className="flex items-center space-x-2 mb-4">
            <button
              onClick={envoyerMessage}
              className="p-2 bg-blue-500 text-white rounded flex items-center"
            >
              <FaPaperPlane />
            </button>
          </div>
        </>
      )}

      {privateChatUser && (
        <PrivateChat
          currentUser={user}
          otherUserId={privateChatUser}
          onClose={() => setPrivateChatUser(null)}
        />
      )}
    </div>
  );
};

export default GroupeChat;
