import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {InterviewContextProvider} from './context/InterviewContext'
import { SpeechRecognizationProvider } from './context/SpeechRecognizationContext';
ReactDOM.render(
  <React.StrictMode>

  <InterviewContextProvider>
  <SpeechRecognizationProvider>
    <App />
  </SpeechRecognizationProvider>
  </InterviewContextProvider>
   </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
