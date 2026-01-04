import React, { useState, useEffect } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import useQuestionManipulation from '../../hooks/question/useQuestionManipulation';
// Register the necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function QuestionAnalyticsModal({ isOpen, onClose, question, analyticsData }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && question && analyticsData) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    } 
  }, [isOpen, question, analyticsData]);

  if (!isOpen || !question) return null;
  
  const incorrectAttempts = analyticsData ? analyticsData.totalAttempts - analyticsData.correctAttempts : 0;

  // Data for the main Doughnut chart
  const doughnutData = {
    labels: ['Correct', 'Incorrect'],
    datasets: [{
      data: [analyticsData?.correctAttempts, incorrectAttempts],
      backgroundColor: ['#22c55e', '#ef4444'], // Green, Red
      borderColor: ['#1f2937'],
      borderWidth: 4,
    }],
  };
  
  // Data for the secondary Bar chart (if applicable)
  const barData = analyticsData?.answerDistribution ? {
    labels: analyticsData.answerDistribution.map(d => d.answerOption),
    datasets: [{
      label: 'Number of Selections',
      data: analyticsData.answerDistribution.map(d => d.count),
      backgroundColor: '#8b5cf6', // Purple
      borderColor: '#a78bfa',
      borderWidth: 1,
    }],
  } : null;

  return (
    // Backdrop
    <div className="fixed inset-0 bg-opacity-90 flex items-center justify-center z-50">
      {/* Modal Panel */}
      <div className="overflow-y-auto bg-slate-200 dark:bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl w-75 sm:w-full max-w-xl h-full max-h-[700px] text-gray-900 dark:text-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-normal">Question Analytics</h2>
            <p className="text-slate-700 dark:text-slate-400 break-words mt-1">"{question.promptText}"</p>
          </div>
          <button onClick={onClose} className="text-2xl text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white cursor-pointer">&times;</button>
        </div>

        {isLoading ? <p>Loading analytics...</p> : analyticsData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8 items-center">
            {/* Doughnut Chart */}
            <div className="relative">
              <Doughnut data={doughnutData} options={{ responsive: true, cutout: '60%' }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-bold">{analyticsData.totalAttempts}</span>
                <span className="text-slate-900 dark:text-slate-400">Total Attempts</span>
              </div>
            </div>
            {/* Stats Breakdown */}
            <div className="text-lg space-y-2">
              <p><span className="font-bold text-green-500">{analyticsData.correctAttempts}</span> Correct ({Math.round((analyticsData.correctAttempts / analyticsData.totalAttempts) * 100)}%)</p>
              <p><span className="font-bold text-red-500">{incorrectAttempts}</span> Incorrect</p>
            </div>
            
            {/* Secondary Bar Chart */}
            {barData && (
              <div className="md:col-span-2 mt-4 pt-4 border-t border-slate-700">
                <h3 className="font-semibold mb-4">Answer Distribution</h3>
                <Bar data={barData} options={{ indexAxis: 'y', responsive: true }} />
              </div>
            )}
          </div>
        ) : <p>No analytics data available for this question.</p>}
      </div>
    </div>
  );
};

export default QuestionAnalyticsModal;