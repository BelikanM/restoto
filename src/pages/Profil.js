

  
      



          if (hasUnreadMessages && !document.hasFocus()) {
            try {
              await requestNotificationPermission();
              const subscription = await subscribeToPush();
              await sendPushNotification(subscription, {
                title: 'Nouveau message',
                body: `Vous avez un nouveau message de ${user.displayName}`,
                icon: user.profilePhotoUrl,
              });
            } catch (error) {
              console.error('Error sending push notification:', error);
            }
          }
        });

        return () => unsubscribe();
      });
    }
  }, [currentUser, users]);

  useEffect(() => {
    if (currentUser && selectedUser) {
      const chatId = [currentUser.uid, selectedUser.id].sort().join('_');
      const q = query(collection(db, `chats/${chatId}/messages`), orderBy('timestamp'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messageList = querySnapshot.docs.map(doc => {
          const messageData = { id: doc.id, ...doc.data() };
          if (messageData.senderId !== currentUser.uid && !messageData.read) {
            updateDoc(doc.ref, { read: true });
          }
          return messageData;
        });
        setMessages(messageList);
      });
      return () => unsubscribe();
    }
  }, [currentUser, selectedUser]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleSendMessage = async (audioBlob = null) => {
    if (selectedUser && (newMessage.trim() || newMedia || audioBlob)) {
      const chatId = [currentUser.uid, selectedUser.id].sort().join('_');
      let mediaUrl = '';
      let mediaType = null;

      if (newMedia) {
        const storageRef = ref(storage, `chatMedia/${chatId}/${Date.now()}_${newMedia.name}`);
        await uploadBytes(storageRef, newMedia);
        mediaUrl = await getDownloadURL(storageRef);
        mediaType = newMedia.type.split('/')[0];
      } else if (audioBlob) {
        const storageRef = ref(storage, `chatMedia/${chatId}/${Date.now()}_audio.wav`);
        await uploadBytes(storageRef, audioBlob);
        mediaUrl = await getDownloadURL(storageRef);
        mediaType = 'audio';
      }

      await addDoc(collection(db, `chats/${chatId}/messages`), {
        text: newMessage.trim(),
        mediaUrl,
        mediaType,
        senderId: currentUser.uid,
        timestamp: serverTimestamp(),
        read: false,
      });
      setNewMessage('');
      setNewMedia(null);
    }
  };

  const handleEditMessage = async (messageId, newText) => {
    const chatId = [currentUser.uid, selectedUser.id].sort().join('_');
    const messageRef = doc(db, `chats/${chatId}/messages`, messageId);
    await updateDoc(messageRef, { text: newText });
    setEditingMessage(null);
  };

  const handleDeleteMessage = async (messageId) => {
    const chatId = [currentUser.uid, selectedUser.id].sort().join('_');
    await deleteDoc(doc(db, `chats/${chatId}/messages`, messageId));
  };

  const handleAudioRecorded = (audioBlob) => {
    handleSendMessage(audioBlob);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <header className="py-6 px-4">
        <h1 className="text-3xl font-bold mb-4">Chat Privé</h1>
        {currentUser && (
          <div className="mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden">
                <img
                  src={currentUser.photoURL || 'https://via.placeholder.com/96x96.png?text=You'}
                  alt={currentUser.displayName}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-semibold">{currentUser.displayName}</span>
            </div>
          </div>
        )}
        <SuggestedProfiles users={users} onSelectUser={handleUserSelect} />

        <Chapi currentUser={currentUser} users={users} onSelectUser={handleUserSelect} />
      </header>

      <main className="p-4">
        {selectedUser ? (
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Chat avec {selectedUser.displayName}</h2>
            <div className="h-96 overflow-y-auto mb-4 bg-gray-700 rounded p-2">
              {messages.map(message => (
                <div key={message.id} className={`flex mb-4 ${message.senderId === currentUser.uid ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex ${message.senderId === currentUser.uid ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={(message.senderId === currentUser.uid ? currentUser.photoURL : selectedUser.profilePhotoUrl) || 'https://via.placeholder.com/32x32.png?text=User'}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl ${message.senderId === currentUser.uid ? 'mr-2' : 'ml-2'}`}>
                      <div className={`inline-block p-2 rounded-lg ${message.senderId === currentUser.uid ? 'bg-blue-600' : 'bg-gray-600'}`}>
                        {message.text && <p className="break-words">{message.text}</p>}
                        {message.mediaUrl && (
                          <div className="mt-2">
                            {message.mediaType === 'image' ? (
                              <img src={message.mediaUrl} alt="Media" className="max-w-full h-auto rounded" style={{ maxHeight: '200px' }} />
                            ) : message.mediaType === 'video' ? (
                              <video controls src={message.mediaUrl} className="max-w-full h-auto rounded" style={{ maxHeight: '200px' }} />
                            ) : message.mediaType === 'audio' ? (
                              <audio controls src={message.mediaUrl} className="max-w-full" />
                            ) : null}
                          </div>
                        )}
                        {message.senderId === currentUser.uid && (
                          <div className="mt-1">
                            <button onClick={() => setEditingMessage(message)} className="text-xs mr-2">✏️</button>
                            <button onClick={() => handleDeleteMessage(message.id)} className="text-xs">🗑️</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="flex flex-col space-y-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="bg-gray-700 text-white rounded p-2"
                placeholder="Tapez votre message..."
              />
              <div className="flex justify-end space-x-2">
                <input
                  type="file"
                  onChange={(e) => setNewMedia(e.target.files[0])}
                  className="hidden"
                  id="media-upload"
                  accept="image/*,video/*,audio/*"
                />
                <label htmlFor="media-upload" className="bg-gray-700 text-white rounded-full p-2 cursor-pointer">
                  <FaPaperclip />
                </label>
                <AudioRecorder onAudioRecorded={handleAudioRecorded} />
                <button onClick={() => handleSendMessage()} className="bg-blue-600 text-white rounded-full p-2">
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">Sélectionnez un utilisateur pour commencer à chatter</p>
        )}
      </main>
      {editingMessage && (
        <EditMessageModal
          message={editingMessage}
          onSave={(newText) => handleEditMessage(editingMessage.id, newText)}
          onCancel={() => setEditingMessage(null)}
        />
      )}
    </div>
  );
}

export default Chat;
