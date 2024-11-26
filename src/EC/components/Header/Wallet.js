
import React, { useState, useEffect } from 'react';
import TronWeb from 'tronweb';

const Wallet = ({ user }) => {
  const [tronWeb, setTronWeb] = useState(null);
  const [balance, setBalance] = useState(0);
  const [amountToSend, setAmountToSend] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');

  useEffect(() => {
    // Initialiser TronWeb
    const tronWebInstance = new TronWeb({
      fullHost: 'https://api.tronstack.io', // Remplacez par l'URL de votre nœud Tron
    });
    setTronWeb(tronWebInstance);
  }, []);

  useEffect(() => {
    const getBalance = async () => {
      if (tronWeb && user) {
        const balance = await tronWeb.trx.getBalance(user.address);
        setBalance(balance);
      }
    };
    getBalance();
  }, [tronWeb, user]);

  const handleSend = async () => {
    if (!tronWeb || !user) return;

    try {
      const tx = await tronWeb.trx.sendTransaction(recipientAddress, amountToSend, user.address);
      console.log('Transaction réussie:', tx);
      alert('Transaction réussie');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de TRX:', error);
      alert('Erreur lors de l\'envoi de TRX');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Portefeuille Tron</h2>
      <p>Adresse : {user?.address}</p>
      <p>Solde : {tronWeb ? tronWeb.fromSun(balance) : 'Chargement...'} TRX</p>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Envoyer TRX</h3>
        <input
          type="text"
          placeholder="Adresse du destinataire"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          className="border rounded p-2 mb-2 w-full"
        />
        <input
          type="number"
          placeholder="Montant à envoyer"
          value={amountToSend}
          onChange={(e) => setAmountToSend(e.target.value)}
          className="border rounded p-2 mb-2 w-full"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white rounded p-2 w-full"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default Wallet;
