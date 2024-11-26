// src/components/TronWallet.js
import React, { useState, useEffect } from "react";
import TronWeb from "tronweb";
import { auth } from "../firebaseConfig"; // Assurez-vous que le chemin est correct

const TronWallet = ({ user }) => {
  const [tronWeb, setTronWeb] = useState(null);
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (window.tronWeb) {
      setTronWeb(window.tronWeb);
    }
  }, []);

  useEffect(() => {
    if (tronWeb && user) {
      // Initialisation du portefeuille pour l'utilisateur
      const address = user.email; // Vous pouvez personnaliser cela selon les besoins
      setAddress(address);
      checkBalance(address);
    }
  }, [tronWeb, user]);

  const checkBalance = async (address) => {
    try {
      const balance = await tronWeb.trx.getBalance(address);
      setBalance(balance / 1e6); // Convertir de sun (le plus petit unité de TRX) en TRX
    } catch (error) {
      console.error("Erreur lors de la récupération du solde:", error);
    }
  };

  const handleDeposit = async () => {
    try {
      if (tronWeb && user && amount) {
        const tx = await tronWeb.trx.sendTransaction(address, tronWeb.toSun(amount)); // Convertir l'amount en Sun
        alert("Dépôt effectué avec succès!");
        checkBalance(address); // Mettre à jour le solde après dépôt
      }
    } catch (error) {
      console.error("Erreur lors du dépôt:", error);
    }
  };

  const handleWithdrawal = async () => {
    try {
      if (tronWeb && user && amount) {
        const tx = await tronWeb.trx.sendTransaction("adresse_destination", tronWeb.toSun(amount)); // Remplacez par l'adresse de retrait
        alert("Retrait effectué avec succès!");
        checkBalance(address); // Mettre à jour le solde après retrait
      }
    } catch (error) {
      console.error("Erreur lors du retrait:", error);
    }
  };

  return (
    <div>
      <h3>Portefeuille TronWeb</h3>
      <p>Adresse: {address}</p>
      <p>Solde: {balance} TRX</p>

      <div>
        <label>Montant du dépôt/retrait:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleDeposit}>Faire un dépôt</button>
        <button onClick={handleWithdrawal}>Faire un retrait</button>
      </div>
    </div>
  );
};

export default TronWallet;
