
import React, { useState, useEffect, useRef } from 'react';
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, where, deleteDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FaPaperPlane, FaTrash, FaCamera, FaMicrophone } from 'react-icons/fa';

const db = getFirestore();
const storage = getStorage();

const PrivateChat = ({ currentUser, otherUserId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [nouveauMessage, setNouveauMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null); // Utilisation de useRef pour mediaRecorder

  useEffect(() => {
    const chatQuery = query(
      collection(db, "privateConversations"),
      where('participants', 'array-contains', currentUser.uid)
    );

    const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(msg => msg.participants.includes(otherUserId));
      setMessages(messagesData);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setError('Erreur de chargement des messages.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser.uid, otherUserId]);

  const envoyerMessage = async () => {
    if (nouveauMessage.trim() === '' && !mediaFile && !audioBlob) return;

    try {
      const messageData = {
        text: nouveauMessage,
        participants: [currentUser.uid, otherUserId],
        displayName: currentUser.displayName,
        profilePhotoUrl: currentUser.photoURL,
        timestamp: serverTimestamp(),
      };

      if (mediaFile) {
        const fileUrl = await uploadMedia(mediaFile);
        messageData.mediaUrl = fileUrl;
        messageData.mediaType = mediaFile.type; // Type de média (audio, image, etc.)
      }

      if (audioBlob) {
        const audioUrl = await uploadAudio(audioBlob);
        messageData.mediaUrl = audioUrl;
        messageData.mediaType = 'audio/wav'; // Spécifiez le type de média
      }

      await addDoc(collection(db, "privateConversations"), messageData);
      setNouveauMessage('');
      setMediaFile(null);
      setAudioBlob(null);
    } catch (err) {
      console.error(err);
      setError('Erreur lors de l\'envoi du message.');
    }
  };

  const uploadMedia = async (file) => {
    const storageRef = ref(storage, `media/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const uploadAudio = async (blob) => {
    const storageRef = ref(storage, `audio/${Date.now()}.wav`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const supprimerMessage = async (id) => {
    try {
      await deleteDoc(doc(db, "privateConversations", id));
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la suppression du message.');
    }
  };

  const startRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder; // Stocker mediaRecorder dans useRef

    mediaRecorder.ondataavailable = (event) => {
      setAudioBlob(event.data);
    };

    mediaRecorder.start();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); // Utiliser la référence pour arrêter l'enregistrement
      setIsRecording(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md" role="dialog" aria-labelledby="chat-title" aria-modal="true">
        <button onClick={onClose} className="text-red-500 float-right" aria-label="Fermer le chat">Fermer</button>
        <h3 id="chat-title" className="text-lg font-bold mb-4">Chat Privé</h3>
        <div className="overflow-y-auto mb-4" style={{ maxHeight: '300px' }}>
          {loading ? (
            <p>Chargement des messages...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="mb-2 flex justify-between items-start">
                <div>
                  <p className="font-bold">{message.displayName}</p>
                  <p>{message.text}</p>
                  {message.mediaUrl && message.mediaType.startsWith('image/') && (
                    <img src={message.mediaUrl} alt="Média" className="max-w-full h-auto" />
                  )}
                  {message.mediaUrl && message.mediaType.startsWith('audio/') && (
                    <audio controls>
                      <source src={message.mediaUrl} type={message.mediaType} />
                      Votre navigateur ne prend pas en charge l'audio.
                    </audio>
                  )}
                </div>
                <button onClick={() => supprimerMessage(message.id)} className="text-red-500 ml-2">
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            placeholder="Tapez votre message..."
            value={nouveauMessage}
            onChange={(e) => setNouveauMessage(e.target.value)}
            className="p-2 border rounded"
            aria-label="Message à envoyer"
          />
          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept="audio/*,image/*"
              onChange={(e) => setMediaFile(e.target.files[0])}
              className="border rounded p-1 hidden"
              id="media-upload"
              aria-label="Sélectionner un fichier média"
            />
            <label htmlFor="media-upload" className="cursor-pointer flex items-center p-2 bg-gray-200 rounded">
              <FaCamera className="mr-1" /> <span>Ajouter un média</span>
            </label>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className="p-2 bg-gray-200 text-black rounded flex items-center"
              aria-label={isRecording ? "Arrêter l'enregistrement audio" : "Enregistrer un message audio"}
            >
              <FaMicrophone />
              {isRecording ? ' Arrêter' : ' Enregistrer'}
            </button>
            <button
              onClick={envoyerMessage}
              className="p-2 bg-blue-500 text-white rounded flex items-center justify-center"
              aria-label="Envoyer le message"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateChat;
