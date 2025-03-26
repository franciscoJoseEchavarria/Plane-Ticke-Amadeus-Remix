import { City } from '../interfaces/cityInterface';

const API_URL = 'http://localhost:5177/api/destination/hash';

const getCityByHash = async (selectedAnswerText: string[]): Promise<City[]> => {
    try {
        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(selectedAnswerText)
        });
        if(!response.ok) {
            throw new Error('Error');
        }
        return await response.json();
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
};

export default {
    getCityByHash,
}