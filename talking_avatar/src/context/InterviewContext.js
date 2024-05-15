import { createContext, useContext, useState } from "react";


const InterviewContext = createContext();

const InterviewContextProvider = ({ children }) => {
  const [interviewOpen, setInterviewOpen] = useState(false);
  const [questionNaviagte, setQuestionNavigate] = useState(false);
  const [speechtext, setSpeechText] = useState("");

  return (
    <InterviewContext.Provider value={{ interviewOpen, setInterviewOpen,questionNaviagte,setQuestionNavigate,speechtext,setSpeechText }}>
      {children}
    </InterviewContext.Provider>
  );
};

// Custom hook to consume the context
const useInterviewStart = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error("useInterviewStart must be used within an InterviewContextProvider");
  }
  return context;
};

export { InterviewContextProvider, useInterviewStart };
