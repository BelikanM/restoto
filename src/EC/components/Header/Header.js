
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
  const [audioBlob, setAudioBlob] = useState(null); // Pour gérer les blobs audio
  const [showMenu, setShowMenu] = useState(false); // État pour le menu hamburger
  const [mediaRecorder, setMediaRecorder] = useState(null); // Pour gérer l'enregistrement audio
  const [isRecording, setIsRecording] = useState(false); // État d'enregistrement
  const [users, setUsers] = useState([]); // Pour stocker les utilisateurs
  const [filteredUsers, setFilteredUsers] = useState([]); // Pour stocker les utilisateurs filtrés
  const [mentioning, setMentioning] = useState(false); // État pour vérifier si l'utilisateur est en train de mentionner

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const unsubscribeMessages = onSnapshot(collection(db, "conversations"), (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(messagesData);
    });

    // Récupération des utilisateurs pour la mention
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeMessages();
      unsubscribeUsers();
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

  const startRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);

    recorder.ondataavailable = (event) => {
      setAudioBlob(event.data);
    };

    recorder.start();
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setIsRecording(false);
  };

  const envoyerAudio = async () => {
    if (!audioBlob || !user) return;

    const audioFile = new File([audioBlob], 'message.wav', { type: 'audio/wav' });
    const storageRef = ref(storage, `audio/${audioFile.name}`);
    await uploadBytes(storageRef, audioFile);
    const audioURL = await getDownloadURL(storageRef);

    await addDoc(collection(db, "conversations"), {
      audioURL,
      userId: user.uid,
      displayName: user.displayName,
      profilePhotoUrl: user.photoURL,
      timestamp: serverTimestamp(),
    });

    setAudioBlob(null); // Réinitialiser le blob audio après l'envoi
  };

  const handleMessageChange = (e) => {
    const value = e.target.value;
    setNouveauMessage(value);

    // Vérifier si l'utilisateur tape '@'
    if (value.endsWith('@')) {
      setMentioning(true);
      setFilteredUsers(users); // Afficher tous les utilisateurs
    } else if (mentioning) {
      // Filtrer les utilisateurs selon l'entrée
      const searchTerm = value.split('@').pop().toLowerCase();
      const filtered = users.filter(user => user.displayName.toLowerCase().startsWith(searchTerm));
      setFilteredUsers(filtered);
    }
  };

  const selectUser = (user) => {
    // Ajouter la mention dans le message
    const updatedMessage = `${nouveauMessage.split('@')[0]}@${user.displayName} `;
    setNouveauMessage(updatedMessage);
    setFilteredUsers([]); // Effacer les utilisateurs filtrés
    setMentioning(false); // Arrêter la mention
  };

  const renderMessageText = (text) => {
    if (!text) return null; // Vérifiez si le texte est défini

    const parts = text.split(/(@\w+)/g); // Séparer le texte par les mentions
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        return (
          <span key={index} className="text-blue-500 font-bold">{part}</span> // Mettre en couleur les mentions
        );
      }
      return <span key={index}>{part}</span>;
    });
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
                  <p>{renderMessageText(message.text)}</p> {/* Appel de la fonction pour rendre le texte */}
                  {message.audioURL && (
                    <audio controls>
                      <source src={message.audioURL} type="audio/wav" />
                      Votre navigateur ne supporte pas l'audio.
                    </audio>
                  )}
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
              onChange={handleMessageChange}
              className="flex-grow p-2 border rounded"
            />
            {mentioning && filteredUsers.length > 0 && (
              <div className="absolute bg-white border border-gray-300 rounded mt-1 z-10">
                {filteredUsers.map(user => (
                  <div 
                    key={user.id} 
                    onClick={() => selectUser(user)} 
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {user.displayName}
                  </div>
                ))}
              </div>
            )}
            <button onClick={envoyerMessage} className="p-2 bg-blue-500 text-white rounded flex items-center">
              <FaPaperPlane />
            </button>
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
              <div className="flex items-center">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className="p-2 bg-yellow-500 text-white rounded flex items-center"
                >
                  <FaMicrophone /> {isRecording ? 'Arrêter l\'enregistrement' : 'Enregistrer un message'}
                </button>
                {audioBlob && (
                  <button
                    onClick={envoyerAudio}
                    className="p-2 bg-blue-500 text-white rounded flex items-center ml-2"
                  >
                    Envoyer Audio
                  </button>
                )}
              </div>
            </div>
          )}
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
