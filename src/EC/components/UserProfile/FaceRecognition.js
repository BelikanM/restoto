
// FaceRecognition.js
import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

const FaceRecognition = ({ onVerified }) => {
  const [faceVerified, setFaceVerified] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const webcamRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        console.log("Models loaded successfully");
        setModelsLoaded(true); // Mettre à jour l'état une fois les modèles chargés
      } catch (error) {
        console.error("Error loading models", error);
      }
    };
    loadModels();
  }, []);

  const capture = async () => {
    if (!modelsLoaded) {
      alert('Models are still loading. Please wait.');
      return; // Ne pas procéder si les modèles ne sont pas chargés
    }

    const screenshot = webcamRef.current.getScreenshot();
    const img = new Image();
    img.src = screenshot;
    img.onload = async () => {
      const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions());
      if (detections.length > 0) {
        setFaceVerified(true);
        onVerified(screenshot);
      } else {
        alert('No face detected. Please try again.');
      }
    };
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Security Check</h2>
      {!faceVerified ? (
        <div>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={320}
            height={240}
            className="mb-4"
          />
          <button onClick={capture} className="bg-blue-500 text-white p-2 rounded">
            Capture Selfie
          </button>
          <p className="text-center">Please align your face with the camera.</p>
          {!modelsLoaded && <p>Loading models... Please wait.</p>} {/* Indiquer que les modèles se chargent */}
        </div>
      ) : (
        <p>Face verified. You can now proceed.</p>
      )}
    </div>
  );
};

export default FaceRecognition;
