import React, { useState } from 'react';
import AccordionItem from './AccordionItem';
import { BookOpenIcon, PlusCircleIcon, ChartPieIcon, EyeIcon } from '@heroicons/react/24/outline';

const GuideModal = ({ isOpen, onClose }) => {
  const [openSection, setOpenSection] = useState('lessons'); // Default open section

  const handleToggleSection = (sectionId) => {
    setOpenSection(prev => (prev === sectionId ? null : sectionId));
  };

  const guideData = [
    {
      id: 'lessons',
      title: 'Managing Your Lessons',
      icon: <BookOpenIcon className="h-6 w-6" />,
      content: (
        <ul className="list-disc space-y-2 pl-5">
          <li><b>Create a Lesson:</b> Click the '+' icon to create a new lesson.</li>
          <li><b>Select a Lesson:</b> Click anywhere on a lesson card to select it and add question.</li>
          <li><b>Lesson Availability:</b> Click the eye icon to make a lesson visible or hidden to students. This is for drafting purposes so that students only see complete lesson. Do note that making it available will send notifications to students.</li>
          <li><b>Delete a Lesson:</b> Click the trash icon to delete lesson and all its associated questions.</li>
        </ul>
      )
    },
    {
      id: 'questions',
      title: 'Adding Questions',
      icon: <PlusCircleIcon className="h-6 w-6" />,
      content: (
        <p>Once a lesson is selected, you can add questions to it. The form on the right will change based on the question type you select (e.g., Sentence Building, Listening, Multiple Choice). Fill out the required fields and click save to add question.</p>
      )
    },
    {
      id: 'analytics',
      title: 'Viewing Question Analytics',
      icon: <ChartPieIcon className="h-6 w-6" />,
      content: (
        <p>In the collapsible 'View Questions' area for each lesson, click the pie chart icon next to a question. This will open a modal showing detailed analytics of students' attempts, including the correct/incorrect ratio and, for multiple-choice questions, the distribution of student answers.</p>
      )
    },
  ];

  if (!isOpen) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 bg-opacity-10 flex items-center justify-center z-50">
      {/* Modal Panel */}
      <div className="bg-slate-200 dark:bg-slate-700 border border-slate-700 p-6 rounded-2xl shadow-xl w-full max-w-2xl text-gray-900 dark:text-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Lecturer Guide</h2>
          <button onClick={onClose} className="text-3xl text-slate-700 hover:text-black dark:text-slate-300 dark:hover:text-white cursor-pointer">&times;</button>
        </div>
        
        {/* Scrollable Content Area */}
        <div className="max-h-[70vh] overflow-y-auto pr-4 space-y-4">
          {guideData.map((item) => (
            <AccordionItem
              key={item.id}
              title={item.title}
              icon={item.icon}
              isOpen={openSection === item.id}
              onClick={() => handleToggleSection(item.id)}
            >
              {item.content}
            </AccordionItem>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuideModal;