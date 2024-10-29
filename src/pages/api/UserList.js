
import React, { useEffect, useState } from 'react';
import { db } from './firebaseConfig.js';

function UserList({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});

  useEffect(() => {
    const unsubscribe = db.collection('users').onSnapshot(snapshot => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = db.collection('messages')
      .where('receiverId', '==', 'currentUserId') // Remplacez par l'ID de l'utilisateur actuel
      .where('isRead', '==', false)
      .onSnapshot(snapshot => {
        const unreadMessages = snapshot.docs.map(doc => doc.data());
        const counts = unreadMessages.reduce((acc, msg) => {
          acc[msg.senderId] = (acc[msg.senderId] || 0) + 1;
          return acc;
        }, {});
        setUnreadCounts(counts);
      });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {users.map(user => (
        <div key={user.id} onClick={() => onSelectUser(user)}>
          <img src={user.profilePicture} alt={user.name} />
          <span>{user.name}</span>
          {unreadCounts[user.id] > 0 && (
            <span className="notification-bubble">{unreadCounts[user.id]}</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default UserList;
