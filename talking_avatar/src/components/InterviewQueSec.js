import React, { useState, useEffect, useRef } from 'react';
import { useInterviewStart } from '../context/InterviewContext';
import { div } from 'three/examples/jsm/nodes/Nodes.js';
import { useTranscriptionStatus } from '../context/SpeechRecognizationContext';


const InterviewCheck = () => {
  const questions = [
    { question: 'Tell me about yourself in simple way which give all essential information of your Tell me about yourself in simple way which give all essential information of your Tell me about yourself in simple way which give all essential information of your Tell me about yourself in simple way which give all essential information of your Tell me about yourself in simple way which give all essential information of your Tell me about yourself in simple way which give all essential information of your Tell me about yourself in simple way which give all essential information of your Tell me about yourself in simple way which give all essential information of your Tell me about yourself in simple way which give all essential information of your Tell me about yourself in simple way which give all essential information of your Tell me about yourself in simple way which give all essential information of yourTell me about yourself in simple way which give all essential information of your Tell me about yourself in simple way which give all essential information of your.', time: 8 },
    { question: 'What are your strengths and weaknesses related to technical and emotional both?', time: 10 },
    { question: 'Why do you want to work here?', time: 6 },
    { question: 'Where do you see yourself in 5 years?', time: 6 },
  ];

  // State to hold interview data for sending to server --------------------------------
const [interviewData, setInterviewData] = useState([]);
let [model, setModel] = useState(false);

// Function to save interview data for each question in a state
const saveInterviewData = (questionIndex, question, speechText) => {
  setInterviewData(prevData => [
    ...prevData,
    { questionIndex, question, speechText }
  ]);
};
    
  const { interviewOpen, setInterviewOpen ,speechtext,setSpeechText,questionNaviagte,setQuestionNavigate} = useInterviewStart();
  const { stopRecording, startRecording } = useTranscriptionStatus();


  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [remainingTime, setRemainingTime] = useState(questions[0]?.time || 0);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isInterviewFinished, setIsInterviewFinished] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Start the interview when interviewOpen becomes true from context
    if (interviewOpen) {
      setIsInterviewStarted(true);
      setIsTimerRunning(true);
    }
  }, [interviewOpen]);


  useEffect(() => {
    if (isTimerRunning) {
      intervalRef.current = setInterval(() => {
        if (remainingTime > 0) {
          setRemainingTime((prevTime) => prevTime - 1);
        } else {
          clearInterval(intervalRef.current);
          handleNextQuestion()
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current); // Cleanup on unmount
  }, [isTimerRunning, currentQuestion, remainingTime, questions, setInterviewOpen]);


  // const handleStartInterview = () => {
  //   setIsInterviewStarted(true);
  //   setIsTimerRunning(true);
  // };

  // const handleStopInterview = () => {
  //   setIsTimerRunning(false);
  // };


  const sendInterviewDataToServer =()=>{
    console.log("All interview data",interviewData)
  }

  // Effect to send interview data to server when interviewData changes
useEffect(() => {
  if (isInterviewFinished) {
    sendInterviewDataToServer();
  }
 
}, [isInterviewFinished]);

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {

     console.log( `${currentQuestion}=>${speechtext}`)
       // Prepare data to save to localStorage
    const dataToSave = {
      questionIndex: currentQuestion,
      question:questions[currentQuestion].question,
      speechText: speechtext
    };

    // Convert data to JSON string
    const jsonData = JSON.stringify(dataToSave);

    // Save JSON data to localStorage
    localStorage.setItem(`interviewData${currentQuestion}`, jsonData);
    setQuestionNavigate(!questionNaviagte);

    saveInterviewData(currentQuestion, questions[currentQuestion].question, speechtext);

    //  ==========================================
    setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    setRemainingTime(questions[currentQuestion + 1]?.time || 0);
   
    
    stopRecording();
    setSpeechText("");
    startRecording()
    } else {

       // Save the transcription for the last question
    const dataToSave = {
      questionIndex: currentQuestion,
      question: questions[currentQuestion].question,
      speechText: speechtext
    };
    const jsonData = JSON.stringify(dataToSave);
    localStorage.setItem(`interviewData${currentQuestion}`, jsonData);
    saveInterviewData(currentQuestion, questions[currentQuestion].question, speechtext);
      // Send interview data to server

        // sendInterviewDataToServer();
  
    
    // ==============================================

      setIsInterviewFinished(true);
      setIsTimerRunning(false);
      setInterviewOpen(false); // Interview is finished, so set interviewOpen to false
      stopRecording();
      setSpeechText("");
    }
  }
 

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className='h-full flex flex-col justify-start relative '>
      <div className='p-2 text-center flex flex-row justify-between items-center '>
        <h2 className='text-lg font-semibold text-white'>
          Question: {isInterviewStarted && !isInterviewFinished && (
            <span>{currentQuestion + 1}/{questions.length}</span>)}
        </h2>
        <h3 className='text-white'>
          Time Remaining:{(isInterviewStarted && !isInterviewFinished) ? ( <span className='px-2'>{formatTime(remainingTime)}</span>):<span className='px-1'>0:00</span>}
        </h3>
      </div>

      <div className='bg-[#182737] overflow-auto flex flex-col  p-2 flex-1 '>
        {!interviewOpen && !isInterviewFinished && (
          <div className='flex flex-col justify-center items-center h-full'>
        <h2 className='text-lg '>Waiting for your interview start!😊</h2>
        </div>        )}
       
      {isInterviewFinished ? (
        <div className='flex flex-col justify-center items-center h-full'>
        <h2 className='text-lg '>Thank you</h2>
        <h2 className='text-lg '>Your Interview Finished!😊</h2>
        </div>
      ) : (
        <>
          {isInterviewStarted && (
            <>
              <h2 className='text-white'><span className='text-lg'>Q: {currentQuestion + 1}:-</span> {questions[currentQuestion]?.question}</h2>
             
              <div className='flex flex-row gap-x-3 justify-start items-end h-full'>
  {isTimerRunning && (
    <div className='flex flex-row justify-end items-center w-full'>
    <button className=" bg-green-600 text-white py-2 px-4 rounded inline-block font-semibold hover:bg-green-500 transition-colors duration-75 " onClick={handleNextQuestion}>
      Next Question
    </button>
    </div>
  )}
                {/* {!isTimerRunning ? (
                  <button className="speak bg-black text-white py-2 px-4 rounded inline-block" onClick={handleStartInterview}>Start Interview</button>
                ) : (
                  <button className="speak bg-black text-white py-2 px-4 rounded inline-block" onClick={handleStopInterview}>Stop Interview</button>
                )} */}
              </div>
            </>
          )}
         
        </>
      )}
      </div>

  {/* 
      {
      isInterviewFinished && ( 
        <PopUp setModel={setModel} interviewData={interviewData} />
      )} */}
      
    </div>
    
  );
};


export default InterviewCheck;
