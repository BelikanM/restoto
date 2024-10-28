import React, { useState, useEffect } from 'react';
import { db, auth } from './firebaseConfig'; // Assurez-vous que firebaseConfig exporte db et auth
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import './Signup.css'; // Ajoutez du CSS si nécessaire

const Signup = () => {
    const [user, setUser] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [image, setImage] = useState(null);
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [followedUsers, setFollowedUsers] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        const fetchPosts = async () => {
            const postsCollection = collection(db, 'posts');
            const postsSnapshot = await getDocs(postsCollection);
            const postsData = postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setPosts(postsData);
        };

        const fetchUsers = async () => {
            const usersCollection = collection(db, 'users');
            const usersSnapshot = await getDocs(usersCollection);
            const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setUsers(usersData);
        };

        fetchPosts();
        fetchUsers();

        return () => unsubscribe();
    }, []);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (user) {
            const newPost = {
                title,
                description,
                videoUrl,
                imageUrl: image ? URL.createObjectURL(image) : '',
                userId: user.uid,
            };
            const postsCollection = collection(db, 'posts');
            await addDoc(postsCollection, newPost);
            setPosts([...posts, newPost]);
            setTitle('');
            setDescription('');
            setVideoUrl('');
            setImage(null);
        }
    };

    const handleDeletePost = async (id) => {
        await deleteDoc(doc(db, 'posts', id));
        setPosts(posts.filter((post) => post.id !== id));
    };

    const handleFollowUser = async (userId) => {
        // Logique pour suivre un utilisateur
        if (user && !followedUsers.includes(userId)) {
            setFollowedUsers([...followedUsers, userId]);
            const userDoc = doc(db, 'users', userId);
            await updateDoc(userDoc, { followers: [...followedUsers, user.uid] });
        }
    };

    return (
        <div className="signup">
            <h1>Inscription</h1>
            <form onSubmit={handlePostSubmit}>
                <input
                    type="text"
                    placeholder="Titre"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <input
                    type="url"
                    placeholder="URL de la vidéo"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                <button type="submit">Publier</button>
            </form>

            <div className="posts">
                {posts.map((post) => (
                    <div key={post.id} className="post">
                        <h2>{post.title}</h2>
                        <p>{post.description}</p>
                        {post.videoUrl && <video src={post.videoUrl} controls />}
                        {post.imageUrl && <img src={post.imageUrl} alt="Post" />}
                        <button onClick={() => handleDeletePost(post.id)}>Supprimer</button>
                    </div>
                ))}
            </div>

            <h2>Utilisateurs</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.name}
                        <button onClick={() => handleFollowUser(user.id)}>Suivre</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Signup;
