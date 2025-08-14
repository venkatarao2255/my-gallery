import React, { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { storage, auth } from "./firebase";
import { v4 as uuidv4 } from "uuid";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "./HomePage.css";

function HomePage() {
  const [user, setUser] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [modalUrl, setModalUrl] = useState(null);

  const quotes = [
    "Photography is the story I fail to put into words.",
    "A picture is a poem without words.",
    "Photography takes an instant out of time, altering life by holding it still.",
    "A photograph is the pause button on life.",
    "Every picture tells a story, capture yours."
  ];

  // Watch authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Load images for the logged-in user
  useEffect(() => {
    if (!user) return;

    const userImagesRef = ref(storage, `users/${user.uid}/`);
    listAll(userImagesRef).then((response) => {
      const urls = response.items.map((item) =>
        getDownloadURL(item).then((url) => ({ url, ref: item }))
      );
      Promise.all(urls).then(setImageUrls);
    });
  }, [user]);

  // Upload image
  const uploadFile = () => {
    if (!imageUpload || !user) return;

    const imageRef = ref(storage, `users/${user.uid}/${imageUpload.name + uuidv4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, { url, ref: snapshot.ref }]);
        setImageUpload(null);
      });
    });
  };

  // Delete image permanently
  const deleteImage = (imageRef) => {
    deleteObject(imageRef).then(() => {
      setImageUrls((prev) => prev.filter((img) => img.ref.fullPath !== imageRef.fullPath));
    });
  };

  const openModal = (url) => setModalUrl(url);
  const closeModal = () => setModalUrl(null);

  if (!user) return <div>Please login to view your photos</div>;

  return (
    <div className="home-background">
      <div className="header">
        <h1>Galleri.O</h1>
        <div className="profile-info">
          <span>{user.email}</span>
          <button onClick={() => signOut(auth)}>Logout</button>
        </div>
      </div>

      <input
        type="file"
        style={{ display: "none" }}
        id="upload-input"
        onChange={(e) => setImageUpload(e.target.files[0])}
      />
      <label htmlFor="upload-input" className="upload-button">
        Upload Photo
      </label>
      <button
        className="upload-button"
        style={{ display: imageUpload ? "inline-block" : "none", marginTop: "10px" }}
        onClick={uploadFile}
      >
        Confirm Upload
      </button>

      {imageUrls.length === 0 && (
        <div className="no-photos-quote">{quotes[Math.floor(Math.random() * quotes.length)]}</div>
      )}

      <div className="gallery">
        {imageUrls.map((image, index) => (
          <div key={index} className="thumbnail">
            <img
              src={image.url}
              alt="uploaded"
              className="thumbnail-img"
              onClick={() => openModal(image.url)}
            />
            <button className="delete-button" onClick={() => deleteImage(image.ref)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      {modalUrl && (
        <div className="modal" onClick={closeModal}>
          <span className="close">&times;</span>
          <img className="modal-content" src={modalUrl} alt="Full View" />
        </div>
      )}
    </div>
  );
}

export default HomePage;
