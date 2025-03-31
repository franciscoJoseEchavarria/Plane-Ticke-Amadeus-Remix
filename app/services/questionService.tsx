const API_URL = 'http://localhost:5177/api/questions';

const getQuestions = async () => {
    try {
        const response = await fetch(API_URL);
        if(!response.ok) {
            throw new Error('Error');
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching questions:', error);
        throw error;
    }
};

export default {
    getQuestions
}