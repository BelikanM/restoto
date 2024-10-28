// src/Home.js
import React, { useEffect, useState } from 'react';
import { auth, db, storage } from './firebaseConfig'; 
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes } from "firebase/storage"; 
import { addDoc, collection, query, where, onSnapshot } from "firebase/firestore"; 
import { FaCamera, FaPlus } from 'react-icons/fa';

const Home = () => {
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [text, setText] = useState('');
  const [media, setMedia] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState([]);

  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setCoverPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfilePhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Erreur lors de la connexion avec Google : ", error);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    let mediaUrl = null;
    if (media) {
      const mediaRef = ref(storage, `uploads/${media.name}`);
      await uploadBytes(mediaRef, media);
      mediaUrl = media.name;
    }
    try {
      await addDoc(collection(db, "posts"), {
        text,
        media: mediaUrl,
        coverPhoto,
        profilePhoto,
        uid: user.uid,
        createdAt: new Date(),
      });
      setText('');
      setMedia(null);
      setCoverPhoto(null);
      setProfilePhoto(null);
    } catch (error) {
      console.error("Erreur lors de la publication : ", error);
    }
  };

  useEffect(() => {
    if (user) {
      const q = query(collection(db, "posts"), where("uid", "==", user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const postsArray = [];
        querySnapshot.forEach((doc) => {
          postsArray.push({ id: doc.id, ...doc.data() });
        });
        setPosts(postsArray);
      });

      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const usersArray = [];
      querySnapshot.forEach((doc) => {
        usersArray.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersArray);
    });

    return () => unsubscribe();
  }, []);

  const handleFollow = async (followUser) => {
    if (followUser.id === user.uid) return; // Prevent following oneself
    if (following.includes(followUser.id)) {
      // Unfollow if already following
      setFollowing(following.filter(id => id !== followUser.id));
    } else {
      // Follow the user
      setFollowing([...following, followUser.id]);
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen">
      <div className="max-w-4xl mx-auto p-4">
        {isAuthenticated && user && (
          <>
            <div className="relative mb-4">
              <div className="bg-cover h-48 rounded-lg" style={{ backgroundImage: `url(${coverPhoto})` }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverPhotoChange}
                  className="absolute top-4 right-4 opacity-0 cursor-pointer"
                  id="coverPhotoInput"
                />
                <label htmlFor="coverPhotoInput" className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-200">
                  <FaCamera />
                </label>
              </div>
            </div>
            <div className="flex flex-col items-center mb-4">
              <img src={profilePhoto || "default-profile.png"} alt="Profile" className="w-24 h-24 rounded-full border-2 border-white shadow-lg" />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePhotoChange}
                className="opacity-0 cursor-pointer"
                id="profilePhotoInput"
              />
              <label htmlFor="profilePhotoInput" className="mt-2 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-200">
                <FaCamera />
              </label>
              <h2 className="mt-2 text-xl font-semibold text-center text-white">{user.displayName}</h2>
            </div>

            <form onSubmit={handlePublish} className="mb-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Quoi de neuf ?"
                className="w-full h-24 p-2 border border-gray-300 rounded-md resize-none"
                required
              />
              <div className="flex flex-col md:flex-row md:items-center md:space-x-2">
                <input
                  type="file"
                  accept="video/*, image/*"
                  onChange={(e) => setMedia(e.target.files[0])}
                  className="mb-2 md:mb-0"
                  id="mediaInput"
                />
                <label htmlFor="mediaInput" className="bg-blue-500 text-white rounded-md p-2 cursor-pointer flex items-center justify-center hover:bg-blue-600">
                  <FaPlus className="mr-1" />
                  Ajouter Média
                </label>
                <button type="submit" className="bg-green-500 text-white rounded-md p-2 mt-2 md:mt-0 hover:bg-green-600">Publier</button>
              </div>
            </form>

            <div className="border-t mt-4 pt-4">
              <h3 className="text-lg font-semibold text-white">Publications</h3>
              <div className="space-y-2 overflow-y-auto max-h-80">
                {posts.map((post) => (
                  <div key={post.id} className="bg-gray-700 p-4 rounded-lg shadow">
                    <p className="text-white">{post.text}</p>
                    {post.media && <img src={post.media} alt="Media" className="mt-2 w-full rounded-md" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t mt-4 pt-4">
              <h3 className="text-lg font-semibold text-white">Utilisateurs</h3>
              <div className="space-y-2 overflow-y-auto max-h-80">
                {users.map((followUser) => (
                  <div key={followUser.id} className="flex justify-between items-center bg-gray-700 p-2 rounded-lg shadow">
                    <div className="flex items-center">
                      <img src={followUser.profilePhoto || "default-profile.png"} alt="User Profile" className="w-10 h-10 rounded-full mr-2" />
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{followUser.displayName}</span>
                        <span className="text-sm text-gray-400">@{followUser.username}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFollow(followUser)}
                      className={`ml-4 p-2 rounded-md ${following.includes(followUser.id) 

? 'bg-blue-600' : 'bg-blue-400'} text-white hover:bg-blue-700`}
                    >
                      {following.includes(followUser.id) ? 'Se désabonner' : 'Suivre'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {!isAuthenticated && (
          <button onClick={handleGoogleSignIn} className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600">
            Se connecter avec Google
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;




