
import React from 'react';
import { FaTrash } from 'react-icons/fa';

const Favoris = ({ favorites, onRemove }) => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Vos Favoris</h2>
      {favorites.length === 0 ? (
        <p className="text-gray-500">Aucun produit favori.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-2 px-4 border-b">Produit</th>
                <th className="py-2 px-4 border-b">Prix</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {favorites.map((favori, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b flex items-center">
                    <img src={favori.imageUrl} alt={favori.name} className="w-12 h-12 object-cover rounded mr-2" />
                    {favori.name}
                  </td>
                  <td className="py-2 px-4 border-b">{favori.price}</td>
                  <td className="py-2 px-4 border-b">
                    <button onClick={() => onRemove(favori.id)} className="text-red-500">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Favoris;
