
// ConfirmationPopup.js

import React from 'react';

const ConfirmationPopup = ({ cart, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-4 rounded shadow-lg w-1/2">
      <h2 className="text-xl font-bold mb-4 text-center">Confirmer l'achat</h2>
      <div className="mb-4 space-y-2">
        {cart.map((item, index) => (
          <div key={index} className="border p-2 rounded">
            <h3 className="font-semibold">{item.name}</h3>
            <p>Quantité: {item.quantity}</p>
            <p>Total: {item.price * item.quantity} XOF</p>
          </div>
        ))}
      </div>
      <div className="flex justify-around">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={onConfirm}
        >
          Confirmer
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={onCancel}
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmationPopup;
