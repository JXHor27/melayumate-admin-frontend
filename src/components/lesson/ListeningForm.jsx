import React, { useState, useRef } from 'react';
import { MediaRecorder } from 'extendable-media-recorder';
import SnackbarAlert from '../common/SnackbarAlert';
import { FaPlus, FaTrash } from 'react-icons/fa'; 

// Helper functions for generating ID for options array 
let nextId = 0;
const generateUniqueId = () => `option-${nextId++}`;

function ListeningForm({ onSubmit }) {
  const [inputError, setInputError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [promptText, setPromptText] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState('');

  const [options, setOptions] = useState([
    { id: generateUniqueId(), text: '' },
    { id: generateUniqueId(), text: '' },
    { id: generateUniqueId(), text: '' },
    { id: generateUniqueId(), text: '' },
  ]); // Start with four empty options
  const [correctAnswerId, setCorrectAnswerId] = useState(null);

  const MAX_RECORDING_SECONDS = 8;
  const [recordingStatus, setRecordingStatus] = useState('inactive'); // 'inactive', 'recording'

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  async function startRecording() {
    console.log("Starting recording...");
    resetRecording(); 
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/wav' });
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });

      mediaRecorder.addEventListener('stop', () => {
        // The library handles the encoding. The blob here is a real WAV blob.
        const wavBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(wavBlob); 
        setAudioBlob(wavBlob);
        setAudioURL(url);
        setRecordingStatus("inactive");
        // Stop all audio tracks to release the microphone
        stream.getTracks().forEach(track => track.stop()); 
      });

      audioChunksRef.current = [];
      mediaRecorder.start();
      setRecordingStatus("recording");
      setElapsedTime(0); 

      intervalRef.current = setInterval(() => {
          setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);

     timeoutRef.current = setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopRecording();
        }
      }, MAX_RECORDING_SECONDS * 1000);

    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  async function stopRecording() {
    console.log("Stopping recording...");
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      cleanupTimers();
    }
  };

  function resetRecording() {
    cleanupTimers();
    setRecordingStatus('inactive');
    setAudioURL('');
    setAudioBlob(null);
    setElapsedTime(0);
    audioChunksRef.current = [];
  };

  function cleanupTimers() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  function handleOptionChange(id, newText) {
    setOptions(
      options.map(option => (option.id === id ? { ...option, text: newText } : option))
    );
  };

  function addOption() {
    if (options.length < 4) { 
      setOptions([...options, { id: generateUniqueId(), text: '' }]);
     
    }
    else{
      setInputError(true);
      setErrorMessage('Maximum of 4 options allowed.');
    }
  };

  function removeOption(id) {
    if (options.length > 2) { 
      setOptions(options.filter(option => option.id !== id));
      // If the removed option was the correct one, reset the correct answer
      if (correctAnswerId === id) {
        setCorrectAnswerId(null);
      }
    }
    else{
      setInputError(true);
      setErrorMessage('At least 2 options are required.');
    }
  };
  
  function handleSubmit(e) {
    e.preventDefault();
    const filledOptions = options.filter(opt => opt.text.trim() !== '');
    
    if (!promptText.trim()) {
      setErrorMessage('Please provide a prompt text.');
      setInputError(true);
      return;
    }
    if (!audioBlob) {
      setErrorMessage('Please record a reference audio.');
      setInputError(true);
      return;
    }
    if (filledOptions.length < 2) {
      setErrorMessage('Please provide at least two answer options.');
      setInputError(true);
      return;
    }
    if (correctAnswerId === null) {
      setErrorMessage('Please select a correct answer.');
      setInputError(true);
      return;
    }

    if (options.some(opt => opt.text.trim() === '')) {
      setErrorMessage('Please fill in all option fields or remove empty ones.');
      setInputError(true);
      return;
    }

    // Find the index of the correct answer
    const correctIndex = options.findIndex(opt => opt.id === correctAnswerId);
    
    // Prepare the data payload
    const submissionData = {
      promptText: promptText,
      audioFile: audioBlob,
      options: options.map(opt => opt.text),
      correctAnswerIndex: correctIndex,
      // attributes: {
      //   options: options.map(opt => opt.text), // Submit an array of strings
      //   correct_answer_index: correctIndex,
      // },
    };
    
    console.log('Preparing to submit:', submissionData);
    onSubmit(submissionData);
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="promptText" className="block text-lg font-medium text-slate-900 dark:text-slate-300 mb-2">
          Question Prompt
        </label>
        <p className="text-sm text-slate-800 dark:text-slate-400 mb-4">
          Enter the instruction or context for the user.
        </p>
        <input
          id="promptText"
          type="text"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder="e.g., Listen to the audio and choose the correct English translation."
          className="w-full bg-slate-200 dark:bg-slate-900 border-2 border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
        />
      </div>

      <div>
        <label className="block text-lg font-medium text-slate-900 dark:text-slate-300 mb-2">
          Reference Audio
        </label>
        <p className="text-sm text-slate-800 dark:text-slate-400 mb-4">
          Record yourself saying something. This will be used as the listening audio for students.
        </p>
        <div className="p-1 text-center bg-gray-500/50 dark:bg-gray-700/50 rounded-lg justify-start items-center flex w-1/3">
            {recordingStatus === 'inactive' && (
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer font-semibold w-full" 
            onClick={startRecording}>Start Recording</button>
            )}
            {recordingStatus === 'recording' && (
            <div className="w-full">
              <button className="w-full px-4 py-2 font-semibold text-white bg-gradient-to-br from-green-300 to-emerald-500 rounded-lg cursor-pointer"
              onClick={stopRecording}>Stop Recording</button>
              <div className="mt-4 bg-gray-200 rounded-full h-2.5">
                {/* The moving part of the bar */}
                <div 
                  className="bg-red-600 h-2.5 rounded-full transition-all duration-1000 ease-linear" 
                  style={{ width: `${(elapsedTime / MAX_RECORDING_SECONDS) * 100}%` }}
                ></div>
              </div>
              <p className="text-center text-sm mt-2">
                {elapsedTime}s / {MAX_RECORDING_SECONDS}s
              </p>
            </div>
            )}
          </div>
        {audioURL && <audio src={audioURL} controls className="mt-4 w-full border-1 border-black rounded-4xl dark:border-none" />}
      </div>
         <div>
        <label className="block text-lg font-medium text-slate-900 dark:text-slate-300 mb-2">
          Answer Options
        </label>
        <p className="text-sm text-slate-800 dark:text-slate-400 mb-4">
          Provide the choices for the user. Select one as the correct answer. (Min 2 options, Max 4 options)
        </p>
        <div className="space-y-3">
          {options.map((option, index) => (
            <div key={option.id} className="flex items-center gap-3">
              {/* Radio button to select the correct answer */}
              <input
                type="radio"
                name="correct-answer"
                checked={correctAnswerId === option.id}
                onChange={() => setCorrectAnswerId(option.id)}
                className="w-5 h-5 accent-purple-500 bg-slate-900 border-slate-700 cursor-pointer"
              />
              {/* Text input for the option */}
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleOptionChange(option.id, e.target.value)}
                placeholder={`Option #${index + 1}`}
                className="w-full bg-slate-200 dark:bg-slate-900 border-2 border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
              />
              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeOption(option.id)}
                className="p-3 text-red-500 hover:bg-red-500/10 rounded-full cursor-pointer"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addOption}
          className="mt-4 flex items-center gap-2 px-4 py-2 text-sm bg-slate-400/50 hover:bg-slate-600/50 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg cursor-pointer"
        >
          <FaPlus /> Add Option
        </button>
      </div>
      
      <div className="pt-4">
        <button
          type="submit"
          className="shadow-lg w-full px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 cursor-pointer"
          onClick={handleSubmit}
        >
          Save Listening Question
        </button>
      </div>

      {/* Input Error Alert */}
      <SnackbarAlert
        open={inputError}
        onClose={() => setInputError(false)}
        severity="error"
        message={errorMessage}
      />
    </div>
  );
};

export default ListeningForm;