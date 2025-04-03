import axios from 'axios';
import { User } from '~/interfaces/userInterface';

const API_URL = 'http://localhost:5177/api/user';

const getUsers = async () => {
    try {
        const response = await fetch(API_URL);
        if(!response.ok) {
            throw new Error('Error');
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

const getUserById = async (id: number) => {
    try {
        // La ruta debe coincidir exactamente con tu controlador C#: [HttpGet("GetById/{id}")]
        const response = await fetch(`${API_URL}/GetById/${id}`);
        
        // Añadir logs para depuración
        console.log(`🔍 Solicitando: ${API_URL}/GetById/${id}`);
        console.log(`📊 Status: ${response.status}`);
        
        if(!response.ok) {
            // Obtener información detallada del error
            const errorText = await response.text();
            console.error(`❌ Error ${response.status}: ${errorText}`);
            throw new Error(`Error al obtener usuario: ${response.status} ${errorText}`);
        }
        
        const data = await response.json();
        console.log("✅ Usuario obtenido:", data);
        return data;
    } catch (error) {
        console.error('❌ Error completo en getUserById:', error);
        throw error;
    }
};

const getUserByEmail = async (email: string) => {
    try {
        const response = await fetch(`${API_URL}/email/${email}`);
        if(!response.ok) {
            return null;
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching user by email:', error);
        throw error;
    }
}

const addUser = async (user: Omit<User, 'id'>): Promise<User> => {
    try {
        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
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

// Modificar updateUser para ser compatible con los campos del backend
const updateUser = async (id: number, user: any) => {
    try {
        const userData = {
            id,
            full_name: user.full_name || user.Full_name,  // Acepta ambos formatos
            email: user.email || user.Email  // Acepta ambos formatos
        };
        
        console.log("Enviando datos:", userData); // Para depuración
        
        const response = await axios.put(`${API_URL}/${id}`, userData);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

const deleteUser = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}

// Método para obtener usuarios paginados
const getPagedUsers = async (page: number, pageSize: number) => {
    try {
        const response = await fetch(`${API_URL}/paged?page=${page}&pageSize=${pageSize}`);
        if (!response.ok) {
            throw new Error('Error fetching paged users');
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching paged users:', error);
        throw error;
    }
};

export default {
    getUsers,
    getUserById,
    getUserByEmail,
    addUser,
    updateUser,
    deleteUser,
    getPagedUsers,
};