// TrackOrder.js
import React from 'react';

const TrackOrder = () => {
  // Simuler des données de commande (vous pouvez les récupérer via une API)
  const orderDetails = {
    orderId: '123456',
    status: 'En cours de livraison',
    trackingNumber: 'TRK123456789',
    estimatedDelivery: '28 Octobre 2024',
    shippingAddress: '123 Rue de l\'Exemple, Paris, France',
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Suivi de la commande</h1>
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">Détails de la commande</h2>
        <p><strong>ID de la commande :</strong> {orderDetails.orderId}</p>
        <p><strong>Statut :</strong> {orderDetails.status}</p>
        <p><strong>Numéro de suivi :</strong> {orderDetails.trackingNumber}</p>
        <p><strong>Livraison estimée :</strong> {orderDetails.estimatedDelivery}</p>
        <p><strong>Adresse de livraison :</strong> {orderDetails.shippingAddress}</p>
      </div>
    </div>
  );
};

export default TrackOrder;
