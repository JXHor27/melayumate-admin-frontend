import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from "../../api/apiConfig";

function useLessonManipulation({ setLessons }) {

    const { token } = useAuth();

    // Add Lesson
    async function addLesson(title, description) {
        try{
            const response = await fetch(`${API_BASE_URL}/lessons`, {
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: title,
                    description: description
                }),
            });
            if (!response.ok) { 
                const errorData = await response.json();
                const message = `An error occurred: ${errorData.message}`;
                console.error(message);
                return null;
            }
            const newLesson = await response.json();
            console.log("New lesson added: ", newLesson);
            setLessons((prevLessons) => [
                ...prevLessons,
                newLesson
            ]);
            return newLesson;
        } catch (error) {
            console.error("Failed to add lesson:", error);
            throw error;
        }
    };

    // Edit Lesson
    async function editLesson(lessonId, title, description) {
        try{
            const response = await fetch(`${API_BASE_URL}/lists/list/${lessonId}`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                     "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: userId,
                    title: title,
                    description: description,
                }),
            });
            if (!response.ok) { 
                const errorData = await response.json();
                const message = `An error occurred: ${errorData.message}`;
                console.error(message);
                return null;
            }
            const updatedList = await response.json();
            console.log("List updated: ", updatedList);
            return updatedList;
        } catch (error) {
            console.error("Failed to edit list:", error);
            throw error;
        }
    };

    // Delete Lesson
    async function deleteLesson(lessonId) {
        try{
            const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}`, {
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
            console.log("Lesson deleted: ", response.status);
            return response.status;
        } catch (error) {
            console.error("Failed to delete lesson:", error);
            throw error;
        }
    };

    // Fetch lessons
    // after new lesson added, re-fetch all lessons 
    // (avoid using initial useEffect as API calls are duplicated)
    async function fetchLessons() {
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
            throw error;
        }
    }

    async function toggleLessonVisibility(lessonId, currentVisibility) {
        try {
            // toggle 
            const newVisibility = !currentVisibility;
            
            const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}/available`, {
                method: 'PATCH', 
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isAvailable: newVisibility }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to update visibility.');
            }
            console.log(`Visibility for lesson ${lessonId} updated to ${newVisibility}`);
            return { success: true };

        } catch (error) {
            console.error("Failed to toggle lesson visibility:", error);
            throw error;
        }
    };

    return { addLesson, editLesson, deleteLesson, fetchLessons, toggleLessonVisibility };

}

export default useLessonManipulation;