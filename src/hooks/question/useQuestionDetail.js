import { useState, useEffect } from "react";
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from "../../api/apiConfig";

function useQuestionDetail(lessonId) {

    const { token } = useAuth();

    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
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
                setIsLoading(false);
            }
            catch(error) { 
                console.error("Failed to fetch questions:", error);
            }
        }
        fetchData();
    }, [lessonId]);
    return { questions, setQuestions, isLoading, setIsLoading };
}

export default useQuestionDetail;