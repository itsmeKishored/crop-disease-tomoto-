import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import './MainHome.css';

const MainHome = () => {
  const [imageUploaded, setImageUploaded] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [diseaseName, setDiseaseName] = useState(null); // State to store disease name
  const [loading, setLoading] = useState(false); // State for loading spinner
  const webcamRef = useRef(null);

  // Handle the click event to open the camera
  const handleScanClick = () => {
    setIsCameraOpen(true); // Open the camera
  };

  // Capture the image from the webcam
  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setIsCameraOpen(false);
    setImageUploaded(true);
  };

  // Discard the captured image and reset states
  const handleDiscard = () => {
    setCapturedImage(null);
    setImageUploaded(false);
    setDiseaseName(null); // Clear the disease name
  };

  // Handle file input change for image upload
  const handleUploadChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result);
        setImageUploaded(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle the click event to find the disease
  const handleFindDiseaseClick = async () => {
    if (!capturedImage) {
      alert("Please capture or upload an image first.");
      return;
    }

    setLoading(true); // Start loading
    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: capturedImage }), // Send base64-encoded image
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();

      // Display the disease name or error message
      if (data.disease) {
        setDiseaseName(data.disease);
      } else {
        alert("No disease name returned.");
      }
    } catch (error) {
      console.error("Error predicting disease:", error);
      alert(`An error occurred while predicting disease: ${error.message}`);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="main-home-container">
      <h1>Crop Disease Prediction and Management System</h1>
      <p>
        Upload or scan an image of your crop, and we will help you detect any potential diseases.
      </p>
      <div className="button-container">
        <button className="scan-button" onClick={handleScanClick}>
          Scan Image
        </button>
        <input
          type="file"
          accept="image/*"
          className="upload-input"
          onChange={handleUploadChange}
        />
      </div>
      {isCameraOpen && (
        <div className="camera-container">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="webcam"
          />
          <button className="capture-button" onClick={handleCapture}>
            Capture
          </button>
        </div>
      )}
      {capturedImage && (
        <div className="captured-image-container">
          <h3>Captured Image:</h3>
          <img src={capturedImage} alt="Captured Crop" />
          <div className="image-action-buttons">
            <button className="find-disease-button" onClick={handleFindDiseaseClick} disabled={loading}>
              {loading ? 'Finding Disease...' : 'Find Disease'}
            </button>
            <button className="discard-button" onClick={handleDiscard}>
              Discard
            </button>
          </div>
        </div>
      )}
      {diseaseName && (
        <div className="disease-name-container">
          <h3>Disease Prediction:</h3>
          <p>{diseaseName}</p>
        </div>
      )}
    </div>
  );
};

export default MainHome;
