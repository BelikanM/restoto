
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, where } from "firebase/firestore";
import { FaPaperPlane } from 'react-icons/fa';

const db = getFirestore();

const PrivateChat = ({ currentUser, otherUserId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [nouveauMessage, setNouveauMessage] = useState('');

  useEffect(() => {
    const chatQuery = query(
      collection(db, "privateConversations"),
      where('participants', 'array-contains', currentUser.uid)
    );

    const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(msg => msg.participants.includes(otherUserId));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [currentUser.uid, otherUserId]);

  const envoyerMessage = async () => {
    if (nouveauMessage.trim() === '') return;

    await addDoc(collection(db, "privateConversations"), {
      text: nouveauMessage,
      participants: [currentUser.uid, otherUserId],
      displayName: currentUser.displayName,
      profilePhotoUrl: currentUser.photoURL,
      timestamp: serverTimestamp(),
    });

    setNouveauMessage('');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-md w-96">
        <button onClick={onClose} className="text-red-500 float-right">Fermer</button>
        <h3 className="text-lg font-bold mb-4">Chat Privé</h3>
        <div className="overflow-y-auto mb-4" style={{ maxHeight: '300px' }}>
          {messages.map((message) => (
            <div key={message.id} className="mb-2">
              <p className="font-bold">{message.displayName}</p>
              <p>{message.text}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Tapez votre message..."
            value={nouveauMessage}
            onChange={(e) => setNouveauMessage(e.target.value)}
            className="flex-grow p-2 border rounded"
          />
          <button
            onClick={envoyerMessage}
            className="p-2 bg-blue-500 text-white rounded flex items-center"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivateChat;
