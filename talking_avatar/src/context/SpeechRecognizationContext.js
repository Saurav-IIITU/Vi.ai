import { createContext, useState, useEffect, useContext, useRef } from 'react';
import { useInterviewStart } from './InterviewContext';

const transcriptionContext = createContext();

const SpeechRecognizationProvider = ({ children }) => {
    const recognition = useRef(null);
    const [transcriptionOn, setTranscriptionOn] = useState(false);
    const {setSpeechText,setInterviewOpen,interviewOpen}  = useInterviewStart();

    let initializeSpeechRecognition = () => {
        if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition.current = new SpeechRecognition();
            recognition.current.continuous = true;
            recognition.current.interimResults = true;
            recognition.current.lang = "en-US";

            recognition.current.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map((result) => result[0].transcript)
                    .join("");
                setSpeechText(transcript);
            };
        } else {
            alert("Speech recognition not available in this browser.");
        }
    };


    const startRecording = () => {
    
            initializeSpeechRecognition()
            recognition.current?.start();
            setTranscriptionOn(true);
            setInterviewOpen(true);   // it set the interviewOpen true every time when user startRecording it may not show any impact b/c it is already true every time........
        
      
    };

    const stopRecording = () => {
        recognition.current?.stop();
        setTranscriptionOn(false); // Set transcriptionOn state to false when recording stops
       
    };

    return (
        <transcriptionContext.Provider value={{ startRecording, stopRecording, setTranscriptionOn,transcriptionOn }}>
            {children}
        </transcriptionContext.Provider>
    );
};

// Custom hook to consume the context
const useTranscriptionStatus = () => {
    const context = useContext(transcriptionContext);
    if (!context) {
        throw new Error("useTranscriptionStatus must be used within an SpeechRecognizationContext");
    }
    return context;
};

export { SpeechRecognizationProvider, useTranscriptionStatus };
