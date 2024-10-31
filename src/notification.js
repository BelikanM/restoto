// src/notification.js

const API_URL = 'http://localhost:3000/api'; // Remplacez par l'URL de votre API

// Fonction pour récupérer les messages non lus
export const fetchUnreadMessages = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/messages/unread?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Ajoutez ici d'autres en-têtes si nécessaire, comme des tokens d'authentification
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch unread messages');
    }

    const data = await response.json();
    return data.messages; // Assurez-vous que votre API renvoie un tableau de messages dans 'data.messages'
  } catch (error) {
    console.error('Error fetching unread messages:', error);
    return []; // Retourne un tableau vide en cas d'erreur
  }
};

// Fonction pour envoyer une notification push
export const sendPushNotification = async (subscription, message) => {
  const payload = JSON.stringify({ title: 'New Message', body: message });

  try {
    await fetch('YOUR_SERVER_ENDPOINT', { // Remplacez par l'URL de votre serveur de notification
      method: 'POST',
      body: payload,
      headers: {
        'Content-Type': 'application/json',
        // Ajoutez ici d'autres en-têtes si nécessaire, comme des tokens d'authentification
      },
    });
    console.log('Notification sent successfully!');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

// Fonction pour gérer la récupération et l'envoi des notifications
export const handleNotifications = async (userId, subscription) => {
  const unreadMessages = await fetchUnreadMessages(userId);
  
  if (unreadMessages.length > 0) {
    unreadMessages.forEach(message => {
      sendPushNotification(subscription, message.content); // Assurez-vous que 'message.content' est la propriété qui contient le texte du message
    });
  } else {
    console.log('No unread messages.');
  }
};
