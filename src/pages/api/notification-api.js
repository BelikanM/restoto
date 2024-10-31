
// src/api/notification-api.js
export const sendPushNotification = async (subscription, payload) => {
  const response = await fetch('YOUR_SERVER_ENDPOINT', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subscription, payload }),
  });

  if (!response.ok) {
    throw new Error('Failed to send push notification.');
  }
};
