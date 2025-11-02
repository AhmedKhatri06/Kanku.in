import React, { useRef, useState, useEffect } from 'react';
import './ARTryOn.css';

const ARTryOn = ({ product, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    initializeCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const simulateTryOn = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    // Add product name overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Trying: ${product.name}`, 320, 50);
  };

  return (
    <div className="ar-modal-overlay">
      <div className="ar-modal">
        <div className="ar-header">
          <h3>AR Try-On: {product.name}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="ar-content">
          {isCameraActive ? (
            <>
              <div className="video-container">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline
                  className="ar-video"
                />
                <canvas 
                  ref={canvasRef} 
                  width="640" 
                  height="480"
                  className="ar-canvas"
                />
              </div>
              
              <div className="ar-controls">
                <button onClick={simulateTryOn} className="try-on-btn">
                  👗 Try On
                </button>
              </div>
            </>
          ) : (
            <div className="camera-error">
              <p>Camera access required for AR Try-On</p>
              <button onClick={initializeCamera}>Enable Camera</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ARTryOn;