import { useEffect, useState } from "react";
import { db, auth } from "./firebase"; // Assurez-vous que db est correctement exporté
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, where, getDocs } from "firebase/firestore";
import { FaUserPlus } from "react-icons/fa";
import { onAuthStateChanged } from "firebase/auth";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Obtenir l'utilisateur connecté
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Charger les utilisateurs et exclure l'utilisateur connecté
  useEffect(() => {
    if (currentUser) {
      const usersQuery = query(collection(db, "users"), where("uid", "!=", currentUser.uid));
      const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
        setUsers(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      }, (error) => {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
      });

      // Charger les utilisateurs suivis
      const followsQuery = query(collection(db, "follows"), where("followerId", "==", currentUser.uid));
      const unsubscribeFollows = onSnapshot(followsQuery, (snapshot) => {
        setFollowedUsers(snapshot.docs.map(doc => doc.data().followingId));
      }, (error) => {
        console.error("Erreur lors de la récupération des suivis:", error);
      });

      // Cleanup des abonnements
      return () => {
        unsubscribe();
        unsubscribeFollows();
      };
    }
  }, [currentUser]);

  // Fonction pour suivre/désuivre un utilisateur
  const handleFollow = async (userId) => {
    if (followedUsers.includes(userId)) {
      // Supprimer de la collection de suivi
      const followsQuery = query(
        collection(db, "follows"),
        where("followerId", "==", currentUser.uid),
        where("followingId", "==", userId)
      );
      const followSnapshot = await getDocs(followsQuery);
      followSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    } else {
      // Ajouter dans la collection de suivi
      await addDoc(collection(db, "follows"), {
        followerId: currentUser.uid,
        followingId: userId,
      });
    }
  };

  // Filtrer les utilisateurs par le terme de recherche
  const filteredUsers = users.filter((user) =>
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center max-w-screen-lg mx-auto">
      <input
        type="text"
        placeholder="Rechercher un utilisateur..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 border border-gray-300 rounded mb-4 font-bold text-black w-full max-w-md"
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto max-h-[500px] w-full px-4">
        {filteredUsers.length === 0 ? (
          <p className="text-white">Aucun utilisateur trouvé.</p>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.uid} className="bg-gray-800 shadow-lg p-4 rounded-lg flex flex-col items-center text-center text-white">
              <img
                src={user.photoURL || "/default-profile.png"}
                alt={`${user.displayName}'s profile`}
                className="w-20 h-20 rounded-full mb-2 object-cover"
              />
              <h3 className="text-lg font-semibold mb-2">{user.displayName}</h3>
              <button
                onClick={() => handleFollow(user.uid)}
                className={`mt-2 px-4 py-1 rounded-full font-medium transition duration-300 ${
                  followedUsers.includes(user.uid) ? "bg-blue-500" : "bg-gray-500"
                }`}
              >
                {followedUsers.includes(user.uid) ? "Suivi" : <FaUserPlus />}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
