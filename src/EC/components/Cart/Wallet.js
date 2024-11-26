import React, { useState } from "react";
import TronWeb from "tronweb";

const Wallet = () => {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [privateKey, setPrivateKey] = useState("");
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");

  // Configuration de TronWeb
  const tronWeb = new TronWeb({
    fullHost: "https://api.trongrid.io", // Utilisez TestNet ou MainNet
  });

  // Générer un portefeuille
  const createWallet = () => {
    const wallet = tronWeb.createAccount();
    wallet.then(({ address, privateKey }) => {
      setAddress(address.base58);
      setPrivateKey(privateKey);
    });
  };

  // Récupérer le solde
  const getBalance = async () => {
    try {
      const balance = await tronWeb.trx.getBalance(address);
      setBalance(tronWeb.fromSun(balance)); // Convertir Sun en TRX
    } catch (error) {
      console.error("Erreur de récupération du solde :", error);
    }
  };

  // Envoyer des TRX
  const sendTRX = async () => {
    try {
      const tx = await tronWeb.trx.sendTransaction(receiver, tronWeb.toSun(amount), privateKey);
      console.log("Transaction réussie :", tx);
    } catch (error) {
      console.error("Erreur d'envoi :", error);
    }
  };

  return (
    <div>
      <h2>Portefeuille TRX</h2>
      <button onClick={createWallet}>Créer un portefeuille</button>
      {address && (
        <div>
          <p>Adresse : {address}</p>
          <p>Clé privée : {privateKey}</p>
          <button onClick={getBalance}>Voir le solde</button>
          <p>Solde : {balance} TRX</p>
        </div>
      )}

      <h3>Envoyer des TRX</h3>
      <input
        type="text"
        placeholder="Adresse du destinataire"
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
      />
      <input
        type="number"
        placeholder="Montant"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={sendTRX}>Envoyer</button>
    </div>
  );
};

export default Wallet;
