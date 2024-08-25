import "./App.css";
import { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "./firebase";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [hiddenUrls, setHiddenUrls] = useState([]);
  const [modalUrl, setModalUrl] = useState(null);

  const imagesListRef = ref(storage, "images/");

  const uploadFile = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + uuidv4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, { url, ref: imageRef }]);
      });
    });
  };

  useEffect(() => {
    listAll(imagesListRef).then((response) => {
      const urls = response.items.map((item) =>
        getDownloadURL(item).then((url) => ({ url, ref: item }))
      );
      Promise.all(urls).then((urlArray) => setImageUrls(urlArray));
    });
  }, []);

  const hideImage = (imageUrl) => {
    setHiddenUrls((prev) => [...prev, imageUrl]);
  };

  const openModal = (url) => {
    setModalUrl(url);
  };

  const closeModal = () => {
    setModalUrl(null);
  };

  const quotes = [
    "Photography is the story I fail to put into words.",
    "A picture is a poem without words.",
    "Photography takes an instant out of time, altering life by holding it still.",
    "A photograph is the pause button on life.",
  ];

  return (
    <div className="App">
      <h1 className="heading">Galleri.O</h1>
      <p className="quote">{quotes[Math.floor(Math.random() * quotes.length)]}</p>
      <input
        className="choosefile"
        type="file"
        onChange={(event) => {
          setImageUpload(event.target.files[0]);
        }}
      />
      <button className="uploadfilebutton" onClick={uploadFile}>
        Upload Image
      </button>

      <div className="gallery">
        {imageUrls.map((image, index) => (
          !hiddenUrls.includes(image.url) && (
            <div key={index} className="thumbnail">
              <img
                src={image.url}
                alt="uploaded"
                onClick={() => openModal(image.url)}
                className="thumbnail-img"
              />
              <button className="hide-button" onClick={() => hideImage(image.url)}>
                Hide
              </button>
            </div>
          )
        ))}
      </div>

      {modalUrl && (
        <div className="modal" onClick={closeModal}>
          <span className="close">&times;</span>
          <img className="modal-content" src={modalUrl} alt="large view" />
        </div>
      )}
    </div>
  );
}

export default App;
