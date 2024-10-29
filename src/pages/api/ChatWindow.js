
import React, { useEffect, useState } from 'react';
import { db } from './firebaseConfig';
import firebase from 'firebase/app'; // Ajoutez cette ligne

function ChatWindow({ selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (selectedUser) {
      const unsubscribe = db
        .collection('messages')
        .where('participants', 'array-contains', selectedUser.id)
        .orderBy('timestamp')
        .onSnapshot(snapshot => {
          const messagesData = snapshot.docs.map(doc => doc.data());
          setMessages(messagesData);
        });

      return () => unsubscribe();
    }
  }, [selectedUser]);

  useEffect(() => {
    const markAsRead = async () => {
      const snapshot = await db.collection('messages')
        .where('senderId', '==', selectedUser.id)
        .where('receiverId', '==', 'currentUserId')
        .where('isRead', '==', false)
        .get();

      snapshot.forEach(doc => {
        doc.ref.update({ isRead: true });
      });
    };

    if (selectedUser) {
      markAsRead();
    }
  }, [selectedUser]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      db.collection('messages').add({
        text: newMessage,
        senderId: 'currentUserId', // Remplacez par l'ID de l'utilisateur actuel
        receiverId: selectedUser.id,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        isRead: false
      });
      setNewMessage('');
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatWindow;

