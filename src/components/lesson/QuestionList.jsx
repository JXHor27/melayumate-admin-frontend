import React from 'react';
import { FaTrash, FaChartPie  } from 'react-icons/fa';

function QuestionList({ questions, isLoading, onDeleteQuestion, onViewAnalytics }) {


  if (isLoading) {
    return <div className="p-4 text-slate-400">Loading questions...</div>;
  }


  return (
    <div className="mt-4 pt-4 border-t border-slate-600 space-y-3">
      {questions.length > 0 ? questions.map((q, index) => (
        <div key={q.questionId} className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-900/50 rounded-md">
          <div className="flex items-center gap-4">
            <span className="text-slate-900 dark:text-slate-500 font-mono">{index + 1}.</span>
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-300">{q.promptText || 'Speaking Prompt'}</p>
              <p className="text-xs text-purple-500 dark:text-purple-400 font-semibold uppercase">{q.questionType.replace('_', ' ')}</p>
            </div>
          </div>
          <div className='flex items-center justify-between gap-4'>
            <button 
                onClick={() => onViewAnalytics(q)} // Pass the whole question object
                className="text-gray-600 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 cursor-pointer" 
                title="View Analytics"
              >
                <FaChartPie size={18}/>
              </button>
            <button onClick={() => onDeleteQuestion(q.questionId)} className="text-gray-600 dark:text-gray-500 hover:text-red-500 cursor-pointer" title="Delete Question">
              <FaTrash size={18}/>
            </button>
          </div>
        </div>
      )) : (
        <p className="text-slate-900 dark:text-slate-400 text-center py-4">No questions have been added to this lesson yet.</p>
      )}
    </div>
  );
};

export default QuestionList;