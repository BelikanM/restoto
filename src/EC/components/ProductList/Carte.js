
import React from 'react';

const Carte = ({ product, user, paymentProof, license }) => {
 return (
 <div className="border p-4 rounded shadow-lg mt-4">
 <h2 className="text-xl font-bold ext-xl font-bold mb-2">Détails de la Transaction</h2>
 <p><strong>Licence de paiement :</strong> {license}</p>
 <div className="mt-4">
 <h3 className="font-semibold">Produit</h3>
 <img src={product.imageUrl} alt={product.name} className="w-40 h-40 object-cover mb-2" />
 <p><strong>Nom :</strong> {product.name}</p>
 <p><strong>Description :</strong> {product.description}</p>
 <p><strong>Prix :</strong> {product.price} XOF</p>
 </div>
 <div className="mt-4">
 <h3 className="font-semibold">Informations de l'utilisateur</h3>
 <p><strong>Nom :</strong> {user.displayName}</p>
 <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full" />
 </div>
 <div className="mt-4">
 <h3 className="font-semibold">Preuve de paiement</h3>
 {paymentProof ? (
 <img src={paymentProof} alt="Preuve de paiement" className="w-40 h-40 object-cover mb-2" />
 ) : (
 <p>Aucune preuve de paiement téléchargée.</p>
 )}
 </div>
 </div>
 );
};

export default Carte;
