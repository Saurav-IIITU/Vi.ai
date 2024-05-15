// import React, { useState, useRef, useEffect } from 'react';
// import Webcam from 'react-webcam';

// const CameraCapture = () => {
//   const webcamRef = useRef(null);
//   const [imageData, setImageData] = useState(null);
//   const [hasCameraPermission, setHasCameraPermission] = useState(false);

//   useEffect(() => {
//     const requestCameraPermission = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         setHasCameraPermission(true);
//         stream.getTracks().forEach((track) => track.stop()); // Release resources if permission is denied later
//       } catch (error) {
//         console.error('Error requesting camera permission:', error);
//       }
//     };

//     if (!hasCameraPermission) {
//       requestCameraPermission();
//     }
//   }, [hasCameraPermission]);

//   const capturePicture = () => {
//     if (webcamRef.current) {
//       const imageSrc = webcamRef.current.getScreenshot();
//       setImageData(imageSrc);
//     }
//   };

//   const stopCamera = () => {
//     if (webcamRef.current && webcamRef.current.video) {
//       const tracks = webcamRef.current.video.srcObject.getTracks();
//       tracks.forEach(track => track.stop());
//       setHasCameraPermission(false);
//       setImageData(null);
//     }
//   };
  

//   const handleError = (error) => {
//     console.error('Camera capture error:', error);
//   };

//   return (
//     <div>
//       {hasCameraPermission ? (
//         <div>
//           <Webcam
//             audio={false} // Disable audio for efficiency
//             ref={webcamRef}
//             screenshotFormat="image/jpeg" // Specify preferred format
//             width={640} // Adjust width and height as needed
//             height={480}
//             onError={handleError}
//           />
//           <div>
//             <button onClick={capturePicture}>Capture Picture</button>
//             <button onClick={stopCamera}>Stop Camera</button>
//           </div>
//         </div>
//       ) : (
//         <p>Waiting for camera permission...</p>
//       )}
//       {imageData && <img src={imageData} alt="Captured camera image" />}
//     </div>
//   );
// };

// export default CameraCapture;

// =========================================================================================

import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useInterviewStart } from '../context/InterviewContext';

const CameraCapture = () => {
  const webcamRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [imageData, setImageData] = useState(null);
  const { interviewOpen } = useInterviewStart();

  useEffect(() => {
    if (interviewOpen) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [interviewOpen]);

  const startCamera = () => {
    setIsCameraOn(true);
  };

  const stopCamera = () => {
    if (webcamRef.current && webcamRef.current.video) {
      const tracks = webcamRef.current.video.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsCameraOn(false);
    setImageData(null);
  };

  const capturePicture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImageData(imageSrc);
    }
  };

  const handleError = (error) => {
    console.error('Camera capture error:', error);
  };

  return (
    <div className='w-full h-full flex flex-col justify-center items-center'>
      {!isCameraOn ? (
        // <button onClick={startCamera}>Start Camera</button>
        <div className='flex flex-col justify-center items-center'>
        <img src='/staticImages/user.png' alt='user-icon'className='w-48 h-48'/>
        {/* <h2 className='text-lg font-semibold '>User FaceCam</h2> */}
        <h2 className='text-lg font-semibold '>Welcome you</h2>
        </div>
      ) : (
        <div>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={450}
            height={600}
            
            onError={handleError}
          />
          <div>
            {/* <button onClick={capturePicture}>Capture Picture</button>
            <button onClick={stopCamera}>Stop Camera</button> */}
          </div>
        </div>
      )}
      {imageData && <img src={imageData} alt="Captured camera image" />}
    </div>
  );
};

export default CameraCapture;

