import React from 'react';

const QUESTION_TYPES = [
  { id: 'SENTENCE_BUILDING', label: 'Sentence Building' },
  { id: 'LISTENING', label: 'Listening' },
  { id: 'MULTIPLE_CHOICE', label: 'Multiple Choices' }
  // { id: 'VOCABULARY', label: 'Vocabulary (Coming Soon)', disabled: true },
];

const QuestionTypeSelector = ({ selectedType, onTypeChange }) => {
  return (
    <div className="flex flex-wrap gap-4">
      {QUESTION_TYPES.map((type) => (
        <button
          key={type.id}
          onClick={() => !type.disabled && onTypeChange(type.id)}
          disabled={type.disabled}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200
            ${selectedType === type.id
              ? 'bg-purple-700 dark:bg-purple-600/50 text-white ring-2 ring-purple-400'
              : 'bg-slate-400/50 text-slate-900 hover:bg-slate-600/50 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 cursor-pointer'
            }
            ${type.disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
};

export default QuestionTypeSelector;