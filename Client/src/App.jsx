import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [denoisedImage, setDenoisedImage] = useState(null);

  const handleImageUpload = (e) => {
    setSelectedImage(e.target.files[0]);
    setDenoisedImage(null);
  };

  const handleDenoise = async () => {
    if (!selectedImage) {
      toast.error('Please upload an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await axios.post('http://localhost:3000/denoise', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(response.data.message);
      
      setDenoisedImage(`http://localhost:3000/${response.data.outputFile}`);
    } catch (error) {
      console.error('Error denoising image:', error);
      toast.error('Failed to process the image.');
    }
  };

  const handleNoise = () => {
    setDenoisedImage("/denoise.jpg");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <ToastContainer 
  position="top-right"
  autoClose={5000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
/>

      <h1 className="text-4xl font-extrabold text-blue-600 mb-8">Image Denoising</h1>
      <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md w-full max-w-xl">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleDenoise}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all"
        >
          Denoise Image
        </button>
      </div>

      <div className="mt-8 flex justify-center items-start space-x-8">
        {selectedImage && (
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700">Original Image</h3>
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              className="image"
            />
          </div>
        )}
        {denoisedImage && (
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700">Denoised Image</h3>
            <img
              src={denoisedImage}
              alt="Denoised"
              className="image"
            />
          </div>
        )}
      </div>
      
    </div>
  );
};

export default App;
