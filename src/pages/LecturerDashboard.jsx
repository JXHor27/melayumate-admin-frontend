import React, { useEffect, useState } from 'react';
import QuestionTypeSelector from '../components/lesson/QuestionTypeSelector';
import SentenceBuildingForm from '../components/lesson/SentenceBuildingForm';
import ListeningForm from '../components/lesson/ListeningForm';
import MultipleChoice from '../components/lesson/MultipleChoice';
import CreateLessonForm from '../components/lesson/CreateLessonForm';
import QuestionList from '../components/lesson/QuestionList';
import QuestionAnalyticsModal from '../components/lesson/QuestionAnalyticsModal';
import SnackbarAlert from '../components/common/SnackbarAlert';
import ConfirmDialog from '../components/common/ConfirmDialog';
import GuideModal from '../components/guide/GuideModal';
import { useTheme } from '../context/ThemeContext.jsx';
import useLessonDetail from '../hooks/lesson/useLessonDetail';
import useQuestionDetail from '../hooks/question/useQuestionDetail';
import useLessonManipulation from '../hooks/lesson/useLessonManipulation';
import useQuestionManipulation from '../hooks/question/useQuestionManipulation';
import { FaTrash, FaEdit, FaEye, FaEyeSlash, FaPlus, FaChevronDown, FaChevronUp, FaQuestionCircle, FaSun, FaMoon  } from 'react-icons/fa';
const QUESTION_COMPONENTS = {
  SENTENCE_BUILDING: SentenceBuildingForm,
  LISTENING: ListeningForm,
  MULTIPLE_CHOICE: MultipleChoice
};

// --- Mock Data (Replace with API calls) ---
const mockLessons = [
  { id: 'les_01', title: 'Chapter 1: Greetings', description: 'Learn basic greetings like Selamat Pagi.' },
  { id: 'les_02', title: 'Chapter 2: At the Market', description: 'Practice vocabulary for buying items.' },
];

function LecturerDashboard() {
  const { theme, toggleTheme } = useTheme();
  const [generalError, setGeneralError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [titleEmptyError, setTitleEmptyError] = useState(false)
  const [lessonDeletedSuccess, setLessonDeletedSuccess] = useState(false)
  const [lessonCreatedSuccess, setLessonCreatedSuccess] = useState(false)
  const [questionCreatedSuccess, setQuestionCreatedSuccess] = useState(false)
  const [questionDeletedSuccess, setQuestionDeletedSuccess] = useState(false)

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [lessonToDeleteId, setLessonToDeleteId] = useState(null);

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [questionType, setQuestionType] = useState('SENTENCE_BUILDING');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [expandedLessonId, setExpandedLessonId] = useState(null);
  const [analyticsQuestion, setAnalyticsQuestion] = useState(null); 
  const [analyticsData, setAnalyticsData] = useState(null);


  const { lessons, setLessons } = useLessonDetail();
  const { questions, setQuestions, isLoading } = useQuestionDetail(expandedLessonId);
  const { addLesson, deleteLesson, fetchLessons, toggleLessonVisibility } = useLessonManipulation({ setLessons });
  const { addQuestion, deleteQuestion, fetchQuestions, fetchQuestionAnalytics } = useQuestionManipulation({ setQuestions });


  const ActiveFormComponent = QUESTION_COMPONENTS[questionType];

  function handleOpenForm() {
    setShowForm(true);
  }

  function handleOpenConfirmDialog(lessonId) {
    setLessonToDeleteId(lessonId); 
    setIsConfirmOpen(true);       
  };

  function handleCloseConfirmDialog() {
    setIsConfirmOpen(false);      
    setLessonToDeleteId(null);    
  };


  function handleToggleExpand(lessonId) {
    // If the clicked lesson is already expanded, collapse it. Otherwise, expand it.
    setExpandedLessonId(prevId => (prevId === lessonId ? null : lessonId));
  };

  async function handleOpenAnalytics(question) {
    console.log("Viewing analytics for question:", question);
    const analytics = await fetchQuestionAnalytics(question.questionId);
    setAnalyticsQuestion(question);
    setAnalyticsData(analytics);
  };
  
  function handleCloseAnalytics() {
    setAnalyticsQuestion(null);
  };

  async function handleToggleVisibility(lessonId, currentVisibility) {
    const result = await toggleLessonVisibility(lessonId, currentVisibility);
     if(!result) {
        setGeneralError(true);
        setErrorMessage('Toggle visibility failed. Please try again.');
        return;
      };
    setLessons(prevLessons => 
      prevLessons.map(lesson => 
        lesson.lessonId === lessonId 
          ? { ...lesson, available: !currentVisibility } 
          : lesson
      )
    );
  };
  
  async function handleDeleteQuestion(questionId) {
      const deletedStatus = await deleteQuestion(questionId);
      if(!deletedStatus) {
        setGeneralError(true);
        setErrorMessage('Question deletion failed. Please try again.');
        return;
      };
      setQuestionDeletedSuccess(true);
      console.log(expandedLessonId)
      await fetchQuestions(expandedLessonId);

  };

  async function handleCreateLesson() {
    if (!formData.title.trim()){
        setTitleEmptyError(true);
        return;
    }
    const newLesson = await addLesson(formData.title, formData.description);
    if(!newLesson) {
      setGeneralError(true);
      setErrorMessage('Lesson creation failed. Please try again.');
      return;
    };
    await fetchLessons();
    setFormData({ title: '', description: '' });
    setShowForm(false);
    setLessonCreatedSuccess(true);
  };

  async function handleDeleteLesson() {
    if(lessonToDeleteId){
      const deletedStatus = await deleteLesson(lessonToDeleteId);
      if(!deletedStatus) {
        setGeneralError(true);
        setErrorMessage('Lesson deletion failed. Please try again.');
        return;
      };
      setLessonDeletedSuccess(true);
      if (selectedLesson && selectedLesson.lessonId === lessonToDeleteId) {
        setSelectedLesson(null);
      }
      await fetchLessons();
      handleCloseConfirmDialog();
    }
  }

  async function handleFormSubmit(formDataFromChild) {
    // formDataFromChild will be { words: [...], correctSentence: '...' } OR { promptText: '...', audioFile: Blob }
    console.log("lessonid:", selectedLesson.lessonId);
    if (!selectedLesson) {
      alert('Please select a lesson before submitting a question.');
      return;
    }
    // Combine all data into a single payload object
    const finalPayload = {
      lessonId: selectedLesson.lessonId,
      type: questionType,
      ...formDataFromChild, // Spread the specific data from the child form
    };
    console.log("Final payload being sent to hook:", finalPayload);
    const result = await addQuestion(finalPayload);
    if (!result || !result.success) {
      setGeneralError(true);
      setErrorMessage('Question submission failed. Please try again.');
      return;
    }
    setQuestionCreatedSuccess(true);
    await fetchQuestions(expandedLessonId);
  };

  return (
    <div className="bg-slate-50 text-gray-900 dark:bg-slate-900 min-h-screen p-4 sm:p-8 dark:text-white">

      {/* Create Lesson Form Overlay */}
      {showForm && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowForm(false)}
            style={{ pointerEvents: "auto" }}
          />
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <div className='flex items-center gap-4'>
              <h1 className="text-4xl font-semibold">Lecturer Dashboard</h1>
              {/* The new trigger button */}
              <button 
                onClick={() => setIsGuideOpen(true)}
                className="text-slate-500 hover:text-purple-400 transition-colors cursor-pointer"
                title="Open User Guide"
              >
                <FaQuestionCircle size={28} />
              </button>
              <div className='ml-auto flex items-center gap-2'>
                  <FaSun className={theme !== "dark" ? 'text-yellow-400' : 'text-slate-500'} />
                  <button 
                    onClick={toggleTheme}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors cursor-pointer
                      ${theme === "dark" ? 'bg-purple-600' : 'bg-slate-600'}
                    `}
                  >
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform
                      ${theme === "dark" ? 'translate-x-6' : 'translate-x-1'}
                    `} />
                  </button>
                  <FaMoon className={theme === "dark" ? 'text-purple-400' : 'text-slate-500'} />
              </div>
            </div>
            <p className="text-slate-900 dark:text-slate-400 mt-2">Create and manage your lessons and questions.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
           {/* Lesson List */}
          <aside className="lg:col-span-1 bg-slate-200 dark:bg-slate-800 border border-slate-700 rounded-2xl p-2 sm:p-6 self-start flex flex-col h-[80vh]">
            {/* The h-[80vh] on the parent 'aside' is added to give the inner container a height to grow into.
                You can adjust this value to fit your overall page layout. 'flex' and 'flex-col' are crucial
                for the inner scrolling container to work correctly. */}
            
             {/* Lesson Header */}
            <div className="flex-shrink-0"> 
              {/* flex-shrink-0 prevents this header from shrinking */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Your Lessons</h2>
                <button onClick={handleOpenForm} className="p-2 bg-purple-400 hover:bg-purple-500 dark:bg-purple-600 rounded-full dark:hover:bg-purple-700 cursor-pointer" title="Create Lesson">
                  <FaPlus />
                </button>
              </div>
            </div>

            {/* Scrolling Container */}
            <div className="flex-grow overflow-y-auto pr-2">
              {/* Lesson List Content */}
              <div className="space-y-3">
                {lessons.map((lesson) => (
                  <div
                    key={lesson.lessonId}
                    onClick={() => setSelectedLesson(lesson)}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border-2
                       ${!lesson.available ? 'opacity-65' : ''}
                      ${selectedLesson?.lessonId === lesson.lessonId
                        ? 'bg-purple-800/20 dark:bg-purple-500/20 border-purple-500'
                        : 'bg-slate-400/50 dark:bg-slate-700/50 border-transparent hover:border-slate-600'
                      }
                    `}
                  >
                    <div className='flex justify-between items-center mb-2'>
                      <h3 className="w-2/3 font-semibold break-words">{lesson.title}</h3>

                       <button
                        onClick={() => handleToggleVisibility(lesson.lessonId, lesson.available)}
                        className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white cursor-pointer"
                        title={lesson.available ? 'Make Unavailable for Students' : 'Make Available for Students'}
                      >
                        {lesson.available ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
                      </button>

                      <button onClick={() => handleOpenConfirmDialog(lesson.lessonId)}
                       className="text-gray-600 dark:text-gray-400 hover:text-red-500 cursor-pointer"
                       title="Delete Lesson">
                        <FaTrash size={24}/>
                      </button>
                    </div>
  
                    <p className="text-sm text-gray-700 dark:text-slate-400 break-words">{lesson.description}</p>

                     <div className="mt-4">
                      <button
                        onClick={() => handleToggleExpand(lesson.lessonId)}
                        className="flex items-center justify-between w-full text-left text-sm font-semibold text-indigo-800 hover:text-indigo-950 dark:text-indigo-300 dark:hover:text-purple-200 cursor-pointer"
                      >
                        <span>View Questions</span>
                        {expandedLessonId === lesson.lessonId ? <FaChevronUp /> : <FaChevronDown />}
                      </button>

                      {/* Conditionally render the QuestionList */}
                      {expandedLessonId === lesson.lessonId && (
                        <QuestionList 
                          questions={questions}
                          isLoading={isLoading}
                          onDeleteQuestion={handleDeleteQuestion}
                          onViewAnalytics={handleOpenAnalytics} 
                        />
                      )}
                    </div>
                  </div>
                  
                  
                ))}
              </div>
            </div>
          </aside>
          
          {/* Confirm Delete Dialog */}
          <ConfirmDialog
            open={isConfirmOpen}
            onClose={handleCloseConfirmDialog}
            onConfirm={handleDeleteLesson}
            title="Confirm Lesson Deletion"
            message="Are you sure you want to delete this lesson?"
          />

           {/* Question Analytic Modal */}
          <QuestionAnalyticsModal 
            isOpen={!!analyticsQuestion} 
            onClose={handleCloseAnalytics} 
            question={analyticsQuestion} 
            analyticsData={analyticsData}
          />

           {/* It sits here at the end, waiting to be opened by the state change */}
          <GuideModal 
            isOpen={isGuideOpen}
            onClose={() => setIsGuideOpen(false)}
          />

          {/* Question Creator */}
          <main className="lg:col-span-2 bg-slate-200 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl p-6">
              {selectedLesson ? (
                <div>
                  <h2 className="text-2xl font-semibold mb-2">
                    Add Question to: <span className="text-yellow-500 dark:text-yellow-300">{selectedLesson.title}</span>
                  </h2>
                  <p className="text-slate-900 dark:text-slate-400 mb-6">
                    Select the type of question you would like to add to this lesson.
                  </p>

                  <QuestionTypeSelector
                    selectedType={questionType}
                    onTypeChange={setQuestionType}
                  />
                  
                  <div className="mt-8 border-t border-slate-700 pt-8">
                    {ActiveFormComponent && (
                      <ActiveFormComponent onSubmit={handleFormSubmit} />
                    )}
                  </div>

                </div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[300px]">
                  <p className="text-slate-400 text-lg">
                    Please select a lesson from the left to start adding questions.
                  </p>
                </div>
              )}
          </main>
        </div>
      </div>

      {/* Create Lesson Form */}
      <CreateLessonForm
          open={showForm}
          formData={formData}
          onFormDataChange={setFormData}
          onClose={() => {
            setShowForm(false);
          }}
          onSubmit={handleCreateLesson}
      />

      {/* Success Lesson Created Alert */}
      <SnackbarAlert
        open={lessonCreatedSuccess}
        onClose={() => setLessonCreatedSuccess(false)}
        severity="success"
        message="Lesson created."
      />
        
      {/* Lesson Title Empty Alert */}
      <SnackbarAlert
        open={titleEmptyError}
        onClose={() => setTitleEmptyError(false)}
        severity="error"
        message="Please fill in a title."
      />

      {/* Success Lesson Deleted Alert */}
      <SnackbarAlert
        open={lessonDeletedSuccess}
        onClose={() => setLessonDeletedSuccess(false)}
        severity="success"
        message="Lesson deleted."
      />


      {/* Success Question Created Alert */}      
      <SnackbarAlert
        open={questionCreatedSuccess}
        onClose={() => setQuestionCreatedSuccess(false)}
        severity="success"
        message="Question submitted successfully!"
      />

      {/* Success QUestion Deleted Alert */}
      <SnackbarAlert
        open={questionDeletedSuccess}
        onClose={() => setQuestionDeletedSuccess(false)}
        severity="success"
        message="Question deleted."
      />

      {/* General Error Alert */}
      <SnackbarAlert
        open={generalError}
        onClose={() => setGeneralError(false)}
        severity="error"
        message={errorMessage}
      />
    </div>
  );
};

export default LecturerDashboard;