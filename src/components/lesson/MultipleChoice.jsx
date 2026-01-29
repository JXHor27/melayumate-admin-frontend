import React, { useState } from 'react';
import SnackbarAlert from '../common/SnackbarAlert';
import { FaPlus, FaTrash } from 'react-icons/fa'; 

// Helper functions for generating ID for options array 
let nextId = 0;
const generateUniqueId = () => `option-${nextId++}`;

function MultipleChoice({ onSubmit }) {
  const [inputError, setInputError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [promptText, setPromptText] = useState('');

  const [options, setOptions] = useState([
    { id: generateUniqueId(), text: '' },
    { id: generateUniqueId(), text: '' },
    { id: generateUniqueId(), text: '' },
    { id: generateUniqueId(), text: '' },
  ]); // Start with four empty options
  const [correctAnswerId, setCorrectAnswerId] = useState(null);

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
          Enter the instruction or question for the user.
        </p>
        <input
          id="promptText"
          type="text"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder="e.g., What is chicken in Malay?"
          className="w-full bg-slate-200 dark:bg-slate-900 border-2 border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
        />
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
          Save Multiple Choice Question
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

export default MultipleChoice;