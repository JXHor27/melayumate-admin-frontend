import React, { useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import SnackbarAlert from '../common/SnackbarAlert';
function SentenceBuildingForm({ onSubmit }) {
  const [inputError, setInputError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [sentence, setSentence] = useState('');
  const [words, setWords] = useState(['', '', '']); // Start with 3 empty inputs
  const [correctSentence, setCorrectSentence] = useState('');

  function handleWordChange(index, value) {
    const newWords = [...words];
    newWords[index] = value;
    setWords(newWords);
  };

  function addWordInput() {
    if (words.length < 8) { 
      setWords([...words, '']);
    }
    else {
      setInputError(true);
      setErrorMessage('Maximum of 8 words allowed.');
    }
  };

  function removeWordInput(index) {
    if (words.length > 2) { // Set a reasonable minimum
      const newWords = words.filter((_, i) => i !== index);
      setWords(newWords);
    }
    else {
      setInputError(true);
      setErrorMessage('At least two words are required.');
    }
  };

  function handleSubmit(e) {
    e.preventDefault();

    if  (correctSentence.trim() === '' || sentence.trim() === '') {
      setInputError(true);
      setErrorMessage('Please fill in both the sentence and the correct full sentence.');
      return;
    }

    if (words.some(word => word.trim() === '')) {
      setInputError(true);
      setErrorMessage('Please fill in all word fields or remove empty ones.');
      return;
    }

    // Filter out empty strings before submitting
    const finalWords = words.filter(word => word.trim() !== '');
    if (finalWords.length > 1 && correctSentence.trim() !== '' && sentence.trim() !== '') {
      onSubmit({ words: finalWords, correctSentence: correctSentence, promptText: sentence });
    } else {
      setInputError(true);
      setErrorMessage('Please provide at least two words, the correct sentence, and the sentence prompt.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-lg font-medium text-slate-900 dark:text-slate-300 mb-2">
          Sentence
        </label>
        <p className="text-sm text-slate-800 dark:text-slate-400 mb-4">
          Enter the sentence that the user need to form in English/Malay. 
        </p>
          <input
          id="sentence"
          type="text"
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
          placeholder="e.g., Saya suka makan nasi."
          className="w-full bg-slate-200 dark:bg-slate-900 border-2 border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
        />
        <label className="block text-lg font-medium text-slate-900 dark:text-slate-300 mb-2 mt-4">
          Component Words
        </label>
        <p className="text-sm text-slate-800 dark:text-slate-400 mb-4">
          Enter the individual words in opposite language the user will arrange. The order does not matter here. (Min 2 words, Max 8 words)
        </p>
        <div className="space-y-3">
          {words.map((word, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="text"
                value={word}
                onChange={(e) => handleWordChange(index, e.target.value)}
                placeholder={`Word #${index + 1}`}
                className="w-full bg-slate-200 dark:bg-slate-900 border-2 border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={() => removeWordInput(index)}
                className="p-3 text-red-500 hover:bg-red-600/10 dark:hover:bg-red-500/10 rounded-full cursor-pointer"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addWordInput}
          className="mt-4 flex items-center gap-2 px-4 py-2 text-sm bg-slate-400/50 hover:bg-slate-600/50 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg cursor-pointer"
        >
          <FaPlus /> Add Word
        </button>
      </div>

      <div>
        <label htmlFor="correctSentence" className="block text-lg font-medium text-slate-900 dark:text-slate-300 mb-2">
          Correct Full Sentence
        </label>
        <p className="text-sm text-slate-800 dark:text-slate-400 mb-4">
          Enter the correct sentence in opposite language. 
        </p>
        <input
          id="correctSentence"
          type="text"
          value={correctSentence}
          onChange={(e) => setCorrectSentence(e.target.value)}
          placeholder="e.g., I like to eat rice."
          className="w-full bg-slate-200 dark:bg-slate-900 border-2 border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="shadow-lg w-full px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 cursor-pointer"
        >
          Save Sentence Building Question
        </button>
      </div>

      {/* Input Alert */}
      <SnackbarAlert
        open={inputError}
        onClose={() => setInputError(false)}
        severity="error"
        message={errorMessage}
      />


    </form>
  );
};

export default SentenceBuildingForm;