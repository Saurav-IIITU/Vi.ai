import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useTexture,
  Loader,
  Environment,
  OrthographicCamera,
} from "@react-three/drei";

import ReactAudioPlayer from "react-audio-player";
import _ from "lodash";

import Avatar from "./components/Avatar";

import CameraCapture from "./components/WebCam";
import InterviewCheck from "./components/InterviewQueSec";
import { useInterviewStart } from "./context/InterviewContext";
import { useTranscriptionStatus } from "./context/SpeechRecognizationContext";




function App() {
  const audioPlayer = useRef(null);
  const [speak, setSpeak] = useState(false);
  const [text, setText] = useState(
    "My name is Arwen. I'm your virtual Interviewer. And I will be conducting your scheduled interview for today. Lets start with a brief Introduction of you. So tell me somthing about yourself.... you can start by pressing start interview whenever you are ready"
  );
 
  const {speechtext,setSpeechText} = useInterviewStart();
  const [audioSource, setAudioSource] = useState(null);
  const [playing, setPlaying] = useState(false);
 

  const { setInterviewOpen, interviewOpen } = useInterviewStart();
  const { stopRecording, startRecording } = useTranscriptionStatus();


 // save the transcription text---------
  const saveTranscript = () => {
    const dataStr = `data:speechtext/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify({ transcript: speechtext })
    )}`;
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "transcript.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };


  // This useeffect use to get access of camera and audio when component is mounted
  useEffect(() => {
    const requestAccess = async () => {
      // setIsRequesting(true); // Indicate request in progress

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true
        });

        if (stream) {
          // setHasAccess(true);
          // Use the stream (e.g., display video in a component)
        } else {
          // Handle stream not being available
        }
      } catch (error) {
        console.error('Error requesting media access:', error);
        // Handle access denial or other errors (optional)
      } finally {
        // setIsRequesting(false); // Reset request state
      }
    };

      requestAccess();
    // }
  }, []);





  return (
    <>
      {/* -------------------------------------- */}
      <div className="main_sec min-h-[60vh] h-full text-white m-auto px-2">
        <div className="main_sec_top bg-black flex flex-row justify-end items-center gap-x-4 py-2 px-2">
          <button
            onClick={startRecording}
            disabled={interviewOpen}
            className={`border-[1px] border-slate-700 hover:border-gray-300 bg-black text-white py-2 px-4 rounded inline-block font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-800'}`}
          >
            Start Interview
            
          </button>
        
          <button
            onClick={stopRecording}
            className="border-[1px] border-slate-700 hover:border-gray-300 bg-red-600 text-white py-2 px-4 rounded inline-block font-semibold"
          >
            Stop Interview
          </button>
          {/* <button onClick={saveTranscript} style={STYLES.speak}>
            Save Transcript
          </button> */}
        </div>
        <div className="main_sec_middle flex flex-col justify-start items-center w-full h-full m-auto ">
          <div className="main_sec_middle_top">
            {/* middle top 15/7 question  */}
            {/* this section use for future to show some content on top of middle section  */}
          </div>
          <div className="main_sec_middle_bottom flex flex-row justify-between items-start max-h-[60vh] h-full w-full m-auto overflow-hidden gap-x-2 pt-2 pb-3">
            <div className="faceCam_sec w-[30%] flex flex-row justify-center items-center shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] h-[58vh] my-auto bg-black rounded-md">
              {/* USER FACECAM COMPONENT  */}
              <CameraCapture className="h-full flex flex-1" />
            </div>
            <div className="avtarFace_sec w-[40%]  m-auto  h-full bg-black">
              {/* AVATAR FACE COMPONENT  */}
              <ReactAudioPlayer
                src={audioSource}
                ref={audioPlayer}
                onEnded={() => {
                  setSpeak(false);
                  setPlaying(false);
                  setAudioSource(null);
                }}
                onCanPlayThrough={() => {
                  audioPlayer.current.audioEl.current.play();
                  setPlaying(true);
                }}
              />
              <Canvas
                dpr={2}
                onCreated={({ gl }) => {
                  gl.physicallyCorrectLights = true;
                }}
              >
                <OrthographicCamera
                  makeDefault
                  zoom={1000}
                  position={[0, 1.65, 1]}
                />
                <Suspense fallback={null}>
                  <Environment
                    background={false}
                    files="/images/photo_studio_loft_hall_1k.hdr"
                  />
                  <Bg />
                  <Avatar
                    avatar_url="/model.glb"
                    speak={speak}
                    setSpeak={setSpeak}
                    text={text}
                    setAudioSource={setAudioSource}
                    playing={playing}
                  />
                </Suspense>
              </Canvas>
              <Loader dataInterpolation={(p) => `Loading... please wait`} />
            </div>
            <div className="question_sec w-[30%] my-auto  bg-black h-[58vh] rounded-md ">
              {/* ------------------QUESTION COMPONENT ------------- */}
              {/* <div className="bg-red-400">
                <textarea
                  className="bg-green-400"
                  rows={10}
                  style={STYLES.text}
                  value={text}
                  onChange={(e) => setText(e.target.value.substring(0, 200))}
                />
                <button onClick={() => setSpeak(true)} style={STYLES.speak}>
                  {speak ? "Running..." : "Speak"}
                </button>
              </div> */}

              <InterviewCheck />
            </div>
          </div>
        </div>
        <div className="main_sec_bottom flex flex-col justify-start items-center w-full bg-black ">
          {/* BOTTOM SECTION  */}
          <div className="user_transcribe_sec w-full overflow-y-auto">
            <div className="bg-black border-r-6 border-black px-3">
              <h2
                style={{
                  textAlign: "center",
                  color: "white",
                  fontSize: "22px",
                  padding:"2px 0"
                }}
              >
                User Transcription 
              </h2>
              <textarea
                className="w-full h-[192px] bg-[#182737] resize-none py-2 px-3 border-none outline-none "
                readOnly
                // cols="50"
                value={speechtext}
              
              />
            </div>
          </div>

          {/* <div className="navigating_buttons flex flex-row justify-between items-center w-full">
            <button className="px-6 py-2 bg-[red] text-center font-bold text-xl text-white border-white border-2 ">
              Previous
            </button>
            <button className="px-6 py-2 bg-[green] text-center font-bold text-xl text-white border-white border-2  ">
              Next
            </button>
          </div> */}
        </div>
      </div>
     
      {/* -------------------------------------- */}
    </>
  );
}

function Bg() {
  const texture = useTexture("/images/bg.webp");
  return (
    <mesh position={[0, 1.5, -2]} scale={[0.8, 0.8, 0.8]}>
      <planeBufferGeometry />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

export default App;
