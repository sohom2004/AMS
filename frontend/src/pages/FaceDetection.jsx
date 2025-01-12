import React, { useState, useRef } from "react";
import axios from "axios";
import Webcam from "react-webcam";

const FaceRecognition = () => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const webcamRef = useRef(null);

  const captureAndSend = async () => {
    setIsLoading(true); // Show loading while processing
    setResult(null); // Clear previous result

    // Capture image as base64 from webcam
    const imageSrc = webcamRef.current.getScreenshot();

    // Convert base64 image to blob
    const blob = await fetch(imageSrc).then((res) => res.blob());
    const file = new File([blob], "capture.jpg", { type: "image/jpeg" });

    const formData = new FormData();
    formData.append("image", file);
    console.log(formData);

    try {
      const res = await axios.post("http://localhost:5000/api/facerecognition/recognize", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data.message);
    } catch (err) {
      setResult("Error during recognition.");
      console.error(err);
    } finally {
      setIsLoading(false); // remove the loading state
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Face Recognition</h2>
      
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg" // Ensures the screenshot is in JPEG format
        width="100%"
        height="auto"
        videoConstraints={{
          facingMode: "user"
        }}
        className="border-2 border-gray-300 rounded-lg mb-6"
      />

      <button
        onClick={captureAndSend}
        disabled={isLoading}
        className={`px-6 py-3 text-white text-lg font-semibold rounded-lg transition duration-300 ease-in-out ${
          isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isLoading ? "Processing..." : "Capture and Recognize"}
      </button>

      {result && (
        <p className="mt-6 text-xl text-gray-700">{result}</p>
      )}
    </div>
  );
};

export default FaceRecognition;
