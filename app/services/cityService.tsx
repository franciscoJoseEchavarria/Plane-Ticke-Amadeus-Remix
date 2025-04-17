import { City } from '../interfaces/cityInterface';

const API_URL = 'http://localhost:5177/api/city';

const getCities = async (): Promise<City[]> => {
try {
        const response = await fetch(`${API_URL}`);
        if(!response.ok) {
            throw new Error('Error');
        }
        return await response.json();
    }
    catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
};

const getCityById = async (id: number): Promise<City> => {
try {
        const response = await fetch(`${API_URL}/${id}`);
        if(!response.ok) {
            throw new Error('Error');
        }
        return await response.json();
    }
    catch (error) {
        console.error('Error fetching city by ID:', error);
        throw error;
    }
};

const addCity = async (city: City): Promise<City> => {
try {
        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(city)
        });
        if(!response.ok) {
            throw new Error('Error');
        }
        return await response.json();
    }
    catch (error) {
        console.error('Error adding city:', error);
        throw error;
    }
}

const updateCity = async (city: City): Promise<City> => {
try {
        const response = await fetch(`${API_URL}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(city)
        });
        if(!response.ok) {
            throw new Error('Error');
        }
        return await response.json();
    }
    catch (error) {
        console.error('Error updating city:', error);
        throw error;
    }
};

const deleteCity = async (id: number): Promise<void> => {
try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if(!response.ok) {
            throw new Error('Error');
        }
    }
    catch (error) {
        console.error('Error deleting city:', error);
        throw error;
    }
}

export default {
    getCities,
    getCityById,
    addCity,
    updateCity,
    deleteCity,
}