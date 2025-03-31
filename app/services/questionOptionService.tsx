const API_URL = 'http://localhost:5177/api/questionoption';

const getQuestionOptions = async () => {
    try {
        const response = await fetch(API_URL);
        if(!response.ok) {
            throw new Error('Error');
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching question options:', error);
        throw error;
    }
};

const getQuestionOptionsById = async (id: number) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if(!response.ok) {
            throw new Error('Error');
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching question option by ID:', error);
        throw error;
    }
}

export default {
    getQuestionOptions,
    getQuestionOptionsById
}