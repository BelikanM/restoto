
// src/components/ProductList/SendEmail.js
import React, { useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from './firebaseConfig'; // Assurez-vous que le chemin est correct

const SendEmail = ({ to, subject, message, onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSendEmail = async () => {
    const sendEmail = httpsCallable(functions, 'sendEmail');
    setIsLoading(true);
    try {
      const result = await sendEmail({ to, subject, message });
      if (result.data.success) {
        onSuccess();
      } else {
        onError(result.data.error);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      onError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSendEmail}
      className={`bg-blue-500 text-white px-4 py-2 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={isLoading}
    >
      {isLoading ? 'Envoi...' : 'Envoyer le message'}
    </button>
  );
};

export default SendEmail;
