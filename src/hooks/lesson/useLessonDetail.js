import { useState, useEffect } from "react";
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from "../../api/apiConfig";

function useLessonDetail() {

    const { token } = useAuth();

    const [lessons, setLessons] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try{
                const response = await fetch(`${API_BASE_URL}/lessons/all`, {
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
                const lessons = await response.json();
                console.log("Lessons: ", lessons);
                setLessons(lessons);
            }
            catch(error) { 
                console.error("Failed to fetch lessons:", error);
            }
        }
        fetchData();
    }, []);
    return { lessons, setLessons };
}

export default useLessonDetail;