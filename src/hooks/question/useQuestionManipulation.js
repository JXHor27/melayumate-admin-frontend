import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from "../../api/apiConfig";

function useQuestionManipulation({ setQuestions }) {

    const { token } = useAuth();

    // Add Question
    async function addQuestion(questionPayload) {
        // questionPayload is an object with everything: { lessonId, type, words, correctSentence, audioFile, etc. }
        try {
        const formData = new FormData();

        // Separate audio file from the rest of the JSON data
        // The 'audioFile' key will be used for SpeakingForm
        const { audioFile, ...jsonData } = questionPayload;

        // backend @RequestPart("data") look for this key
        formData.append(
            "data",
            new Blob([JSON.stringify(jsonData)], { type: "application/json" })
        );

        // If an audio file exists in the payload, append it
        // backend @RequestPart("audioFile") look for this key
        if (audioFile) {
            formData.append("audioFile", audioFile);
        }

        const response = await fetch(`${API_BASE_URL}/questions/question`, { 
            method: "POST",
            headers: {
            "Authorization": `Bearer ${token}`
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
            const message = `An error occurred: ${errorData.message || response.statusText}`;
            console.error(message);
            throw new Error(message); 
        }

        console.log("Question added successfully!");
        return { success: true };

        } catch (error) {
        console.error("Failed to add question:", error);
        throw error; 
        }
    };


    // Delete Question
    async function deleteQuestion(questionId) {
        try{
            const response = await fetch(`${API_BASE_URL}/questions/${questionId}`, {
                method: "DELETE",
                headers: { 
                    "Content-Type": "application/json",
                     "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                const message = `An error occurred: ${errorData.message}`;
                console.error(message);
                return null;
            }
            console.log("Question deleted: ", response.status);
            return response.status;
        } catch (error) {
            console.error("Failed to delete question:", error);
        }
    };

    // Fetch all questions for a lesson, for collapsible view
    // after new question added, re-fetch all questions 
    // (avoid using initial useEffect as API calls are duplicated)
    async function fetchQuestions(lessonId) {
        try{
            const response = await fetch(`${API_BASE_URL}/questions/${lessonId}`, {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                const message = `An error occurred: ${errorData.message}`;
                console.error(message);
                return;
            }
            const questions = await response.json();
            console.log("Questions: ", questions);
            setQuestions(questions);
        }
        catch(error) { 
            console.error("Failed to fetch questions:", error);
        }
    }

    async function fetchQuestionAnalytics(questionId) {
        try{
            const response = await fetch(`${API_BASE_URL}/questions/${questionId}/analytics`, {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                const message = `An error occurred: ${errorData.message}`;
                console.error(message);
                return;
            }
            const questionAnalytics = await response.json();
            console.log("Question analytics: ", questionAnalytics);
            return questionAnalytics;
        }
        catch(error) { 
            console.error("Failed to fetch question analytics:", error);
        }
    }

    return { addQuestion, deleteQuestion, fetchQuestions, fetchQuestionAnalytics };
}

export default useQuestionManipulation;